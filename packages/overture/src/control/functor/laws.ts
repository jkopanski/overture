import { Arbitrary, assert, func, property } from "fast-check"
import { Of } from "tshkt"
import { isDeepStrictEqual as eq } from "util"
import { IsFunctor } from "."

export default function laws<F extends IsFunctor<F>, A>(
  arbFA: Arbitrary<Of<F, A>>,
  arbA: Arbitrary<A>
) {
  describe("Functor laws", () => {
    test("x.map(id) === x", () => {
      assert(
        property(
          arbFA, fa => expect(eq(fa.map(x => x), fa)).toBe(true)
        )
      )
    })

    test("x.map(g ∘ f) === x.map(f).map(g)", () => {
      const arbF = func<[A], A>(arbA)
      assert(
        property(
          arbFA, arbF, arbF, (fa, f, g) =>
            expect(eq(fa.map(a => g(f(a))), fa.map(f).map(g))).toBe(true)
        )
      )
    })
  })
}
