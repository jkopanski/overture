import {
  Generic,
  Generic2,
  Kind1,
  Kind2,
  Of,
  TypeFamily,
} from "tshkt"
import { Fun } from "../function"
import { Monad } from "../../control/monad"
import { Bifunctor } from "../bifunctor"

interface EitherKind extends TypeFamily<Kind2> {
  (): Either<this[0], this[1]>
}

interface EitherF<L = unknown> extends TypeFamily<Kind1> {
  (): Either<L, this[0]>
}

export abstract class Either<L, R>
  extends Bifunctor<L, R>
  implements Monad<EitherF<L>, R> {
    [Generic.Type]: Generic2<EitherKind, L, R>
    ["constructor"]: typeof Either

    static pure <B>(b: B): Either<any, B> {
      return right(b)
    }

    abstract fork <A>(f: Fork<L, R, A>): A
    abstract map <B>(f: Fun<R, B>): Either<L, B>
    abstract apply <B>(f: Either<L, Fun<R, B>>): Either<L, B>
    abstract bind <B>(f: Fun<R, Of<EitherF<L>, B>>): Either<L, B>
    abstract bimap <A, B>(
      f: Fun<L, A>,
      g: Fun<R, B>
    ): Either<A, B>
}

export class Left<L> extends Either<L, any> {
  constructor (private value: L) {
    super()
  }

  get () {
    return this.value
  }

  fork <R, A>(f: Fork<L, R, A>): A {
    return f.left(this.value)
  }

  map <R, B>(_f: Fun<R, B>): Either<L, B> {
    return this
  }

  apply <R, B>(_f: Either<L, Fun<R, B>>) {
    return this
  }

  bind <R, B>(_f: Fun<R, Either<L, B>>) {
    return this
  }

  bimap <R, A, B>(
    f: Fun<L, A>,
    _g: Fun<R, B>
  ): Either<A, B> {
    return new Left(f(this.value))
  }
}

export class Right<R> extends Either<any, R> {
  constructor (private value: R) {
    super()
  }

  get () {
    return this.value
  }

  fork <L, A>(f: Fork<L, R, A>): A {
    return f.right(this.value)
  }

  map <B>(f: Fun<R, B>): Either<any, B> {
    return new Right(f(this.value))
  }

  apply <L, B>(f: Either<L, Fun<R, B>>): Either<L, B> {
    return f.fork({
      left: (l: L) => left(l),
      right: g => right(g(this.value))
    })
  }

  bind <L, B>(f: Fun<R, Either<L, B>>) {
    return f(this.value)
  }

  bimap <L, A, B>(
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

export function left <L>(l: L): Either<L, any> {
  return new Left(l)
}

export function right <R>(r: R): Either<any, R> {
  return new Right(r)
}
