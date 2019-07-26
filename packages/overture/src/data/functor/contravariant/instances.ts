import {
  Generic,
  Generic1,
  Kind1,
  TypeFamily
} from "tshkt"

import { Fun } from "../../function"
import { Monoid } from "../../monoid"
import { Semigroup } from "../../semigroup"

import { Contravariant } from "."

/**
 * Wrapper over functions of type `<A>(a: A) => boolean`.
 * It is done to define some instances of common interfeces.
 */
export class Predicate<A>
  implements Contravariant<PredicateF, A>,
    Semigroup<Predicate<A>>,
    Monoid<Predicate<A>> {
      [Generic.Type1]: Generic1<PredicateF, A>
      ["constructor"]: typeof Predicate
      constructor (private value: Fun<A, boolean>) {}

      static mempty<B> (): Predicate<B> {
        return new Predicate((_ => true) as Fun<B, boolean>)
      }

      get (): Fun<A, boolean> {
        return this.value
      }

      cmap<B> (this: Predicate<A>, f: Fun<B, A>): Predicate<B> {
        return new Predicate(this.value.compose(f))
      }

      append (p: Predicate<A>): Predicate<A> {
        return new Predicate(
          ((a: A) => this.value(a) && p.get()(a)) as Fun<A, boolean>
        )
      }
}

interface PredicateF extends TypeFamily<Kind1> {
  (): Predicate<this[0]>
}
