import { Arbitrary, assert, pre, property } from "fast-check"
import { isDeepStrictEqual as eq } from "util"

import { Eq } from "."

export default function laws<A extends Eq<A>> (
  arbA: Arbitrary<A>
) {
  describe("Eq laws", () => {
    test("reflexivity", () => {
      assert(
        property(
          arbA, a => expect(
            a.eq(a)
          ).toBe(true)
        )
      )
    })

    test("symmetry", () => {
      assert(
        property(
          arbA, arbA, (a, b) =>
            expect(eq(
              a.eq(b),
              b.eq(a)
            )).toBe(true)
        )
      )
    })

    test("transitivity", () => {
      assert(
        property(
          arbA, arbA, arbA, (a, b, c) => {
            // this gonna be sloooow
            pre(a.eq(b))
            pre(b.eq(c))
            return expect(
              a.eq(c)
            ).toBe(true)
          }
        ),
        { maxSkipsPerRun: 10000 }
      )
    })
  })
}
