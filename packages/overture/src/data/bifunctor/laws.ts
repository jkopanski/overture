import { Arbitrary, assert, property } from "fast-check"
import { Of2 } from "tshkt";
import { isDeepStrictEqual as eq } from "util"
import { Bifunctor, IsBifunctor } from "."
import { Fun, fun, id } from "../function"

export default function laws<A, B, L, R, L1, R1, F extends IsBifunctor<F>>(
  arbBi: Arbitrary<Of2<F, A, B>>,
  arbF1: Arbitrary<Fun<A, L>>,
  arbF2: Arbitrary<Fun<L, L1>>,
  arbG1: Arbitrary<Fun<B, R>>,
  arbG2: Arbitrary<Fun<R, R1>>
) {
  describe("Bifunctor laws", () => {
    test("identity", () => {
      assert(
        property(
          arbBi, fa => expect(eq(
            fa.bimap(fun(id), fun(id)),
            fa
          )).toBe(true)
        )
      )
    })

    test("composition", () => {
      assert(
        property(
          arbBi, arbF1, arbF2, arbG1, arbG2, (fa, f1, f2, g1, g2) =>
            expect(eq(
              fa.bimap(f1, g1).bimap(f2, g2),
              fa.bimap(f2.compose(f1), g2.compose(g1))
            )).toBe(true)
        )
      )
    })
  })
}
