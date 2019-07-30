import {
  Generic,
  Generic1,
  Kind1,
  TypeFamily
} from "tshkt"

import { Eq } from "../../eq"
import { Fun } from "../../function"
import { Monoid } from "../../monoid"
import { Tuple, both } from "../../tuple"

import { Contravariant } from "."

/**
 * Wrapper over equality testing function of type:
 * `<A>(a: readonly [A, A]) => boolean`.
 * Wrapping is needed to define instances for some
 * common interfaces.
 */
export class Equivalence<A>
  implements Contravariant<EquivalenceF, A>,
    Monoid<Equivalence<A>> {
      [Generic.Type1]: Generic1<EquivalenceF, A>
      ["constructor"]: typeof Equivalence

      constructor (private value: Fun<Tuple<A, A>, boolean>) {}

      static mempty<B> (): Equivalence<B> {
        return new Equivalence(
          (_ => true) as Fun<Tuple<B, B>, boolean>
        )
      }

      get () {
        return this.value
      }

      cmap<B> (f: Fun<B, A>): Equivalence<B> {
        return new Equivalence((
          this.value.compose(both(f))
        ) as Fun<Tuple<B, B>, boolean>)
      }

      append (e: Equivalence<A>): Equivalence<A> {
        return new Equivalence((
          (a: Tuple<A, A>) => this.value(a) && e.get()(a)
        ) as Fun<Tuple<A, A>, boolean>)
      }
}

interface EquivalenceF extends TypeFamily<Kind1> {
  (): Equivalence<this[0]>
}

export function getDefaultEquivalence<A extends Eq<A>> () {
  return new Equivalence((
    (a: Tuple<A, A>) => a.fst.eq(a.snd)
  ) as Fun<Tuple<A, A>, boolean>)
}

// this infers `Equivalence<Eq<unknown>>`
// I wonder if this unknown will prove to be triublesome
// in the future.
// Yeah,
// Typescript is not able to infer properly from that formulation.
// export const defaultEquivalence = getDefaultEquivalence()
