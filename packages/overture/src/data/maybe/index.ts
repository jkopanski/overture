import {
  Generic,
  Generic1,
  Kind1,
  TypeFamily
} from "tshkt"
import { Fun, id } from "../function"
import { MonadPlus } from "../../control/monadplus"

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
  implements MonadPlus<MaybeF, A> {
    [Generic.Type]: Generic1<MaybeF, A>
    ["constructor"]: typeof Maybe

    constructor () {}

    static pure <B>(b: B): Maybe<B> {
      return new Just(b)
    }

    static empty <B>(): Maybe<B> {
      return nothing
    }

    abstract fork <B>(f: Fork<A, B>): B
    abstract map <B>(f: Fun<A, B>): Maybe<B>
    abstract apply <B>(f: Maybe<Fun<A, B>>): Maybe<B>
    abstract bind <B>(f: Fun<A, Maybe<B>>): Maybe<B>
    abstract alt (fa: Maybe<A>): Maybe<A>
}

export class Just<A> extends Maybe<A> {
  constructor (private value: A) {
    super()
  }

  get () {
    return this.value
  }

  fork <B>(f: Fork<A, B>): B {
    return f.just(this.value)
  }
  map <B>(f: Fun<A, B>): Maybe<B> {
    return new Just(f(this.value))
  }
  apply <B>(f: Maybe<Fun<A, B>>): Maybe<B> {
    return f.fork({
      nothing: () => nothing,
      just: g => new Just(g(this.value))
    })
  }
  bind <B>(f: Fun<A, Maybe<B>>): Maybe<B> {
    return f(this.value)
  }
  alt (_fa: Maybe<A>): Maybe<A> {
    return this
  }
}

export class Nothing<A> extends Maybe<A> {
  constructor () {
    super()
  }

  fork <B> (f: Fork<A, B>) {
    return f.nothing()
  }
  map <B>(_f: Fun<A, B>): Maybe<B> {
    return nothing
  }
  apply <B>(_f: Maybe<Fun<A, B>>): Maybe<B> {
    return nothing
  }
  bind <B>(_f: Fun<A, Maybe<B>>): Maybe<B> {
    return nothing
  }
  alt (fa: Maybe<A>): Maybe<A> {
    return fa
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
export function maybe <A, B>(
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
export function fromMaybe <A>(
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
export function isJust <A>(
  m: Maybe<A>
): m is Just<A> {
  return m instanceof Just
}

/**
 * Asserts that [[Maybe]] is a [[Nothing]].
 *
 * @param m Maybe to check.
 */
export function isNothing <A>(
  m: Maybe<A>
): m is Nothing<A> {
  return m instanceof Nothing
}

/**
 * Extracts value from [[Just]].
 */
export function fromJust <A>(
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
export function catMaybes <A>(
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
export function mapMaybe <A, B>(
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
