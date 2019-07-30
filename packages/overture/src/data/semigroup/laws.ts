import { Arbitrary, assert, property } from "fast-check"

import { Equivalence } from "../functor/contravariant/equivalence"
import { tuple } from "../tuple"

import { Semigroup, append } from "."

export default function laws<A extends Semigroup<A>> (
  arbA: Arbitrary<A>,
  equiv: (a: A) => Equivalence<A>
) {
  describe("Semigroup laws", () => {
    test("associativity", () => {
      assert(
        property(
          arbA, arbA, arbA, arbA, (x, y, z, a) => {
            const eq = equiv(a).get()
            expect(eq(tuple(
              append(append(x, y), z),
              append(x, append(y, z))
            ))).toBe(true)
          }
        )
      )
    })
  })
}
