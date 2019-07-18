import {
  Generic,
  Generic1,
  Generic2,
  Kind1,
  Kind2,
  TypeFamily,
} from "tshkt"
import { Fun } from "../function"
import { Monad } from "../../control/monad"
import { Bifunctor } from "../bifunctor"

interface EitherKind extends TypeFamily<Kind2> {
  (): Either<this[0], this[1]>
}

interface EitherF<L> extends TypeFamily<Kind1> {
  (): Either<L, this[0]>
}

/**
 * `Either` represent one of two possible values:
 * [[Left]] holding value of type `L`, or
 * [[Right]] which contains value of type `R`.
 *
 * `Either` is often used to represent result of an computation,
 * where, by convention, [[Right]] represents *the right* result
 * and [[Left]] has some error information.
 */
export abstract class Either<L, R>
  implements Monad<EitherF<L>, R>, Bifunctor<EitherKind, L, R> {
    [Generic.Type1]: Generic1<EitherF<L>, R>
    [Generic.Type2]: Generic2<EitherKind, L, R>

    ["constructor"]: typeof Either

    static pure <A>(a: A): Either<any, A> {
      return new Right(a)
    }

    abstract fork <A>(f: Fork<L, R, A>): A
    abstract map <B>(f: Fun<R, B>): Either<L, B>
    abstract apply <B>(f: Either<L, Fun<R, B>>): Either<L, B>
    abstract bind <B>(f: Fun<R, Either<L, B>>): Either<L, B>
    abstract bimap <A, B>(
      f: Fun<L, A>,
      g: Fun<R, B>
    ): Either<A, B>
}

export class Left<L, R> extends Either<L, R> {
  constructor (private value: L) {
    super()
  }

  get () {
    return this.value
  }

  fork <A>(f: Fork<L, R, A>): A {
    return f.left(this.value)
  }

  map <B>(
    //this: Of<EitherF<L>, R>,
    _f: Fun<R, B>
  ): Either<L, B> {
    // return new Left(this.value)
    // Technically it should be as above,
    // but the only thing that changes here
    // is type of `Right` which is not the case
    // here, so we should be safe to cast as long
    // as we assume immutability
    return this as unknown as Left<L, B>
  }

  apply <B>(_f: Either<L, Fun<R, B>>): Either<L, B> {
    // return new Left(this.value)
    return this as unknown as Left<L, B>
  }

  bind <B>(_f: Fun<R, Either<L, B>>): Either<L, B> {
    // return new Left(this.value)
    return this as unknown as Left<L, B>
  }

  bimap <A, B>(
    f: Fun<L, A>,
    _g: Fun<R, B>
  ): Either<A, B> {
    return new Left(f(this.value))
  }
}

export class Right<L, R> extends Either<L, R> {
  constructor (private value: R) {
    super()
  }

  get () {
    return this.value
  }

  fork <A>(f: Fork<L, R, A>): A {
    return f.right(this.value)
  }

  map <B>(f: Fun<R, B>): Either<L, B> {
    return new Right(f(this.value))
  }

  apply <B>(f: Either<L, Fun<R, B>>): Either<L, B> {
    return f.bind((
      g => right(g(this.value))
    ) as Fun<Fun<R, B>, Either<L, B>>)
  }

  bind <B>(f: Fun<R, Either<L, B>>) {
    return f(this.value)
  }

  bimap <A, B>(
    _f: Fun<L, A>,
    g: Fun<R, B>
  ): Either<A, B> {
    return new Right(g(this.value))
  }
}

export interface Fork<L, R, A> {
  left: (l: L) => A,
  right: (r: R) => A
}

/**
 * Shorthand utility for creating a [[Left]] value.
 */
export function left <L, R>(l: L): Either<L, R> {
  return new Left<L, R>(l)
}

/**
 * Shorthand utility for creating a [[Right]] value.
 * *Watch out* for reversed order of type parameters.
 */
export function right <L, R>(r: R): Either<L, R> {
  return new Right<L, R>(r)
}

/**
 * Case analysis for [[Either]].
 * If [[Either]] is [[Left]] apply first function to its value.
 * In case of [[Right]] apply second funtion to its value.
 *
 * @param f Function to apply if [[Either]] is [[Left]].
 * @param g Function to apply if [[Either]] is [[Right]].
 * @param e Either to analyse.
 */
export function either <L, R, A>(
  f: Fun<L, A>,
  g: Fun<R, A>,
  e: Either<L, R>
): A {
  return e.fork({
    left: f,
    right: g
  })
}

/**
 * Asserts that [[Either]] is [[Left]].
 *
 * @param e Either to check.
 */
export function isLeft <L, R>(
  e: Either<L, R>
): e is Left<L, R> {
  return e instanceof Left
}

/**
 * Asserts that [[Either]] is [[Right]].
 *
 * @param e Either to check.
 */
export function isRight <L, R>(
  e: Either<L, R>
): e is Right<L, R> {
  return e instanceof Right
}

/**
 * Extract value held by [[Left]].
 */
export function fromLeft <L, R>(
  e: Left<L, R>
): L {
  return e.get()
}

/**
 * Extract value held by [[Right].
 */
export function fromRight <L, R>(
  e: Right<L, R>
): R {
  return e.get()
}
