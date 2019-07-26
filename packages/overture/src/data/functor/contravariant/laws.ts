import { Arbitrary, assert, func, property } from "fast-check"
import { Of } from "tshkt"
import { isDeepStrictEqual as eq } from "util"
import { IsContravariant } from "."
import { Fun, fun } from "../../function"
import arbFun from "../../function/arbitrary"

export default function laws<F extends IsContravariant<F>, A> (
  arbFA: Arbitrary<Of<F, A>>,
  arbA: Arbitrary<A>
) {
  describe("Covariant laws", () => {
    test("identity", () => {
      assert(
        property(
          arbFA, fa => expect(eq(
            fa.cmap(fun(x => x) as Fun<A, A>),
            fa
          )).toBe(true)
        )
      )
    })

    test("composition", () => {
      const arbF = arbFun<A, A>(arbA)
      assert(
        property(
          arbFA, arbF, arbF, (fa, f, g) =>
            expect(eq(
              fa.cmap(f.compose(g)),
              fa.cmap(g).cmap(f)
            )).toBe(true)
        )
      )
    })
  })
}
