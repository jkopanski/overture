import { Arbitrary, assert, property } from "fast-check"
import { Of } from "tshkt"
import { isDeepStrictEqual as eq } from "util"
import { IsMonadZero } from "."
import { Empty } from "../plus"
import { Fun } from "../../data/function"

export default function laws<F extends IsMonadZero<F>, A, B>(
  A: Empty<F>,
  arbF: Arbitrary<Fun<A, Of<F, B>>>,
) {
  describe("MonadZero laws", () => {
    test("annihilation", () => {
      assert(
        property(
          arbF, f => expect(eq(
            A.empty().bind(f),
            A.empty()
          )).toBe(true)
        )
      )
    })
  })
}
