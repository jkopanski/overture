import { Arbitrary, assert, func, property } from "fast-check"
import { Of } from "tshkt"
import { IsFunctor } from "."

export default function laws<F extends IsFunctor<F>, A>(
  arbFA: Arbitrary<Of<F, A>>,
  arbA: Arbitrary<A>
) {
  describe("Functor laws", () => {
    test("x.map(id) === x", () => {
      assert(
        property(
          arbFA, fa => expect(fa.map(x => x)).toEqual(fa).pass === true
        )
      )
    })

    test("x.map(g ∘ f) === x.map(f).map(g)", () => {
      const arbF = func<[A], A>(arbA)
      assert(
        property(
          arbFA, arbF, arbF, (fa, f, g) =>
            expect(fa.map(a => g(f(a)))).toEqual(fa.map(f).map(g))
        )
      )
    })
  })
}
