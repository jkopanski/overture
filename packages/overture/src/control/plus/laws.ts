import { Arbitrary, assert, property } from "fast-check"
import { Of } from "tshkt"
import { isDeepStrictEqual as eq } from "util"
import { IsPlus, Empty } from "."
import { Fun } from "../../data/function"

export default function laws<F extends IsPlus<F>, A, B>(
  A: Empty<F>,
  arbF: Arbitrary<Fun<A, B>>,
  arbX: Arbitrary<Of<F, A>>
) {
  describe("Plus laws", () => {
    test("right identity", () => {
      assert(
        property(
          arbX, x => expect(eq(
            A.empty().alt(x),
            x
          )).toBe(true)
        )
      )
    })

    test("left identity", () => {
      assert(
        property(
          arbX, x => expect(eq(
            x.alt(A.empty()),
            x
          )).toBe(true)
        )
      )
    })

    test("annihilation", () => {
      assert(
        property(
          arbF, f => expect(eq(
            A.empty().map(f),
            A.empty()
          )).toBe(true)
        )
      )
    })
  })
}
