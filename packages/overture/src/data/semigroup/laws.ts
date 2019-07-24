import { Arbitrary, assert, property } from "fast-check"

import { Eq } from "../eq"

import { Semigroup, append } from "."

interface ComparableSemigroup<A> extends Semigroup<A>, Eq<A> {}

export default function laws<A extends ComparableSemigroup<A>> (
  arbA: Arbitrary<A>
) {
  describe("Semigroup laws", () => {
    test("associativity", () => {
      assert(
        property(
          arbA, arbA, arbA, (x, y, z) => expect(
            append(append(x, y), z).eq(
              append(x, append(y, z))
            )
          ).toBe(true)
        )
      )
    })
  })
}
