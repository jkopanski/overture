import {
  Generic,
  Generic1,
  Generic2,
  Kind1,
  Kind2,
  TypeFamily
} from "tshkt"

// Data
import { Bifunctor } from "../bifunctor"
import { Functor } from "../functor"
// import { HasMonoid } from "../monoid"
import { HasSemigroup } from "../semigroup"

// Control
// import { Applicative } from "../../control/applicative"
// import { Apply } from "../../control/apply"
// import { Bind } from "../../control/bind"

import { Fun } from "../function"

interface TupleKind extends TypeFamily<Kind2> {
  (): Tuple<this[0], this[1]>
}

interface TupleF<A> extends TypeFamily<Kind1> {
  (): Tuple<A, this[0]>
}

/**
 * Custom pair type, as using builtin `readonly [A, A]`
 * won't let us define any useful instances.
 *
 * TODO: Not sure how to implement `Applicative` as
 * that requires `Monoid` instance for type parameter `A`.
 * That also requires to define static method `pure`
 * which has to call provided `mempty` but have no
 * constructor reference available to do so.
 */
export class Tuple<A, B> {
  // implements Functor<TupleF<A>, B>,
  //   Bifunctor<TupleKind, A, B> {
  // Those are commented out because I have to
  // put additional constraints on Apply and Applicative.
  // That would prevent this from type checking
  // but I'll just let structural typing do its work.
  // Apply<TupleF<HasSemigroup<A>>, B>,
  // Applicative<TupleF<Monoid<A>>, B> {

  [Generic.Type1]: Generic1<TupleF<A>, B>
  [Generic.Type2]: Generic2<TupleKind, A, B>
  ["constructor"]: typeof Tuple

  constructor (readonly fst: A, readonly snd: B) {}

  map<C> (f: Fun<B, C>): Tuple<A, C> {
    return new Tuple(this.fst, f(this.snd))
  }

  bimap<C, D> (f: Fun<A, C>, g: Fun<B, D>): Tuple<C, D> {
    return new Tuple(f(this.fst), g(this.snd))
  }

  apply<C> (
    this: Tuple<HasSemigroup<A>, B>,
    f: Tuple<HasSemigroup<A>, Fun<B, C>>
  ): Tuple<A, C> {
    return new Tuple(this.fst.append(f.fst), f.snd(this.snd))
  }

  bind<C> (
    this: Tuple<HasSemigroup<A>, B>,
    f: Fun<B, Tuple<HasSemigroup<A>, C>>
  ): Tuple<A, C> {
    const t = f(this.snd)
    return new Tuple(
      this.fst.append(t.fst), t.snd
    )
  }
}

/**
 * Shorthand for `new Tuple(a, b)`
 */
export const tuple = <A, B>(a: A, b: B) => new Tuple(a, b)

/**
 * Make [[Tuple]] out of TypeScript pair (`readonly [A, B]`).
 */
export const pair = <A, B>([a, b]: readonly [A, B]) => new Tuple(a, b)

/**
 * Apply function to both tuple arguments.
 */
export function both<A, B> (
  f: Fun<A, B>
): Fun<Tuple<A, A>, Tuple<B, B>> {
  return (
    (t: Tuple<A, A>) => t.bimap(f, f)
  ) as Fun<Tuple<A, A>, Tuple<B, B>>
}
