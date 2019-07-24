import { Arbitrary, assert, property } from "fast-check"

import { Eq } from "../eq"

import { MEmpty, Monoid } from "."

interface ComparableMonoid<A> extends Monoid<A>, Eq<A> {}

export default function laws<A extends ComparableMonoid<A>> (
  m: MEmpty<A>,
  arbA: Arbitrary<A>
) {
  describe("Monoid laws", () => {
    test("left identity", () => {
      assert(
        property(
          arbA, x => expect(
            m.mempty().append(x).eq(x)
          ).toBe(true)
        )
      )
    })

    test("right identity", () => {
      assert(
        property(
          arbA, x => expect(
            x.append(m.mempty()).eq(x)
          ).toBe(true)
        )
      )
    })
  })
}
