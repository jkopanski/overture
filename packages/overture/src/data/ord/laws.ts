import { Arbitrary, assert, pre, property } from "fast-check"
import { Ord, lessEq, max, min, moreEq } from "."

export default function laws<A extends Ord<A>> (
  arbA: Arbitrary<A>
) {
  describe("Ord laws", () => {
    test("reflexivity", () => {
      assert(
        property(
          arbA, a => expect(
            lessEq(a, a)
          ).toBe(true)
        )
      )
    })

    test("antisymmetry", () => {
      assert(
        property(
          arbA, arbA, (x, y) => expect(
            (lessEq(x, y) && lessEq(y, x)).eq(x.eq(y))
          ).toBe(true)
        )
      )
    })

    test("transitivity", () => {
      assert(
        property(
          arbA, arbA, arbA, (x, y, z) => {
            pre(lessEq(x, y))
            pre(lessEq(y, z))
            return expect(
              lessEq(x, z)
            ).toBe(true)
          }
        ),
        { maxSkipsPerRun: 10000 }
      )
    })

    test("max", () => {
      assert(
        property(
          arbA, arbA, (x, y) => expect(
            max(x, y).eq(moreEq(x, y) ? x : y)
          ).toBe(true)
        )
      )
    })

    test("min", () => {
      assert(
        property(
          arbA, arbA, (x, y) => expect(
            min(x, y).eq(lessEq(x, y) ? x : y)
          ).toBe(true)
        )
      )
    })
  })
}
