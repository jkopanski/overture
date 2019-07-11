import { Arbitrary, assert, property } from "fast-check"
import { Of } from "tshkt"
import { isDeepStrictEqual as eq } from "util"
import { IsApply } from "."
import { Fun, fun } from "../../data/function"

export default function laws<F extends IsApply<F>, W, V, U>(
  arbU: Arbitrary<Of<F, Fun<V, U>>>,
  arbV: Arbitrary<Of<F, Fun<W, V>>>,
  arbW: Arbitrary<Of<F, W>>
) {
  describe("Apply laws", () => {
    test("composition", () => {
      assert(
        property(
          arbU, arbV, arbW, (u, v, w) => expect(eq(
            w.apply(v.apply(u.map(fun((f => fun(g => f.compose(g))))))),
            w.apply(v).apply(u)
          )).toBe(true)
        )
      )
    })
  })
}
