import {
  Generic,
  Generic1,
  Kind1,
  TypeFamily
} from "tshkt"

// Data
import { Eq, HasEq } from "../eq"
import { Fun, id } from "../function"
import { HasShow, Show } from "../show"

// Control
import { MonadZero } from "../../control/monadzero"

interface MaybeF extends TypeFamily<Kind1> {
  (): Maybe<this[0]>
}

/**
 * `Maybe` represents optional value.
 * If value of type `A` is available it is represented by class
 * `Just<A>`. Lack of value is represented by class `Nothing<A>`.
 *
 * @typeparam A Type of possible value.
 */
export abstract class Maybe<A>
  implements Eq<Maybe<HasEq<A>>>,
    Show<Maybe<HasShow<A>>>,
    MonadZero<MaybeF, A> {
      [Generic.Type1]: Generic1<MaybeF, A>
      ["constructor"]: typeof Maybe

      static pure<B> (b: B): Maybe<B> {
        return new Just(b)
      }

      static empty<B> (): Maybe<B> {
        return nothing
      }

      abstract fork<B> (f: Fork<A, B>): B
      abstract map<B> (f: Fun<A, B>): Maybe<B>
      abstract apply<B> (f: Maybe<Fun<A, B>>): Maybe<B>
      abstract bind<B> (f: Fun<A, Maybe<B>>): Maybe<B>
      abstract alt (fa: Maybe<A>): Maybe<A>
      abstract eq (fa: Maybe<HasEq<A>>): boolean
      abstract toString (this: Maybe<HasShow<A>>): string
}

export class Just<A> extends Maybe<A> {
  constructor (private value: A) {
    super()
  }

  get () {
    return this.value
  }

  fork<B> (f: Fork<A, B>): B {
    return f.just(this.value)
  }
  map<B> (f: Fun<A, B>): Maybe<B> {
    return new Just(f(this.value))
  }
  apply<B> (f: Maybe<Fun<A, B>>): Maybe<B> {
    return f.fork({
      nothing: () => nothing,
      just: g => new Just(g(this.value))
    })
  }
  bind<B> (f: Fun<A, Maybe<B>>): Maybe<B> {
    return f(this.value)
  }
  alt (_fa: Maybe<A>): Maybe<A> {
    return this
  }
  eq (fa: Maybe<HasEq<A>>): boolean {
    return fa.fork({
      nothing: () => false,
      just: a => a === this.value
    })
  }
  toString (this: Just<HasShow<A>>): string {
    return `Just ${this.value.toString()}`
  }
}

export class Nothing<A> extends Maybe<A> {
  constructor () {
    super()
  }

  fork<B> (f: Fork<A, B>) {
    return f.nothing()
  }
  map<B> (_f: Fun<A, B>): Maybe<B> {
    return nothing
  }
  apply<B> (_f: Maybe<Fun<A, B>>): Maybe<B> {
    return nothing
  }
  bind<B> (_f: Fun<A, Maybe<B>>): Maybe<B> {
    return nothing
  }
  alt (fa: Maybe<A>): Maybe<A> {
    return fa
  }
  eq (fa: Maybe<HasEq<A>>): boolean {
    return fa.fork({
      nothing: () => true,
      just: _ => false
    })
  }
  toString (): string {
    return "Nothing"
  }
}

export const nothing: Maybe<any> = new Nothing()
export const just = <A>(a: A) => new Just(a)

export interface Fork<A, B> {
  nothing: () => B,
  just: (a: A) => B
}

/**
 * Apply a function on a value held in [[Just]].
 * If the [[Maybe]] is [[Nothing]] use default value.
 *
 * @param def Default value.
 * @param f Function to apply if there is a value.
 * @param m Maybe value.
 */
export function maybe<A, B> (
  def: B,
  f: Fun<A, B>,
  m: Maybe<A>
): B {
  return m.fork({
    nothing: () => def,
    just: f
  })
}

/**
 * Extract value from [[Just]] or use a default value
 * in case of [[Nothung]].
 *
 * @param a Default value.
 * @param m Maybe to extract value from.
 */
export function fromMaybe<A> (
  a: A,
  m: Maybe<A>
): A {
  return maybe(a, id as Fun<A, A>, m)
}

/**
 * Asserts that [[Maybe]] is a [[Just]].
 *
 * @param m Maybe to check.
 */
export function isJust<A> (
  m: Maybe<A>
): m is Just<A> {
  return m instanceof Just
}

/**
 * Asserts that [[Maybe]] is a [[Nothing]].
 *
 * @param m Maybe to check.
 */
export function isNothing<A> (
  m: Maybe<A>
): m is Nothing<A> {
  return m instanceof Nothing
}

/**
 * Extracts value from [[Just]].
 */
export function fromJust<A> (
  justa: Just<A>
): A {
  return justa.get()
}

/**
 * Takes an array of [[Maybe]] values and
 * returns array of values held by [[Just]]
 *
 * @param marr Array of Maybe's.
 */
export function catMaybes<A> (
  marr: Array<Maybe<A>>
): Array<A> {
  return marr.reduce(
    (acc: Array<A>, m: Maybe<A>) =>
      isJust(m)
      ? acc.concat([fromJust(m)])
      : acc,
    []
  )
}

/**
 * Similar to [[map]] but will only add element to the
 * resulting array if `f` returns [[Just]].
 *
 * @param f Mapping function.
 * @param as Array of input values.
 */
export function mapMaybe<A, B> (
  f: Fun<A, Maybe<B>>,
  as: Array<A>
): Array<B> {
  return as.reduce(
    (acc: Array<B>, a: A) => {
      const mb = f(a)
      return isJust(mb)
        ? acc.concat([fromJust(mb)])
        : acc
    },
    []
  )
}
