import { Arbitrary, assert, property } from "fast-check"
import { Of } from "tshkt"
import { isDeepStrictEqual as eq } from "util"
import { IsBind } from "."
import { Fun, fun } from "../../data/function"

export default function laws<F extends IsBind<F>, A, B, C>(
  arbX: Arbitrary<Of<F, A>>,
  arbF: Arbitrary<Fun<A, Of<F, B>>>,
  arbG: Arbitrary<Fun<B, Of<F, C>>>
) {
  describe("Bind laws", () => {
    test("associativity", () => {
      assert(
        property(
          arbX, arbF, arbG, (x, f, g) => expect(eq(
            x.bind(f).bind(g),
            x.bind(fun(k => f(k).bind(g)))
          )).toBe(true)
        )
      )
    })
  })
}
