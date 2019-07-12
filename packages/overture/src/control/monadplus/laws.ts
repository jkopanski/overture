import { Arbitrary, assert, property } from "fast-check"
import { Of } from "tshkt"
import { isDeepStrictEqual as eq } from "util"
import { IsMonadPlus } from "."
import { Fun } from "../../data/function"

export default function laws<F extends IsMonadPlus<F>, A, B>(
  arbF: Arbitrary<Fun<A, Of<F, B>>>,
  arbX: Arbitrary<Of<F, A>>
) {
  describe("MonadPlus laws", () => {
    test("distributivity", () => {
      assert(
        property(
          arbF, arbX, arbX, (f, x, y) => expect(eq(
            x.alt(y).bind(f),
            x.bind(f).alt(y.bind(f))
          )).toBe(true)
        )
      )
    })
  })
}
