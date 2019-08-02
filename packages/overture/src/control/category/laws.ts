import { Arbitrary, assert, property } from "fast-check"
import { Of2 } from "tshkt"

import { compose } from "../semigroupoid"
import { Equivalence } from "../../data/functor/contravariant/equivalence"
import { tuple } from "../../data/tuple"

import { Identity, IsCategory } from "."

export default function laws <
  F extends IsCategory<F>,
  A,
  B
> (
  Id: Identity<F>,
  arbF: Arbitrary<Of2<F, A, B>>,
  arbA: Arbitrary<A>,
  equiv: (a: A) => Equivalence<Of2<F, A, B>>
) {
  describe("Category laws", () => {
    test("left identity", () => {
      assert(
        property(
          arbF, arbA, (f, a) => {
            const eq = equiv(a).get()
            return expect(eq(tuple(
              compose(Id.id(), f),
              f
            ))).toBe(true)
          }
        )
      )
    })

    test("right identity", () => {
      assert(
        property(
          arbF, arbA, (f, a) => {
            const eq = equiv(a).get()
            return expect(eq(tuple(
              compose(f, Id.id()),
              f
            ))).toBe(true)
          }
        )
      )
    })
  })
}
