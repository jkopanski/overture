import { Arbitrary, assert, property } from "fast-check"
import { Of } from "tshkt"
import { isDeepStrictEqual as eq } from "util"
import { IsApplicative, Pure } from "."
import { Fun, fun, id } from "../../data/function"

export default function laws<F extends IsApplicative<F>, A, B, V>(
  A: Pure<F>,
  arbV: Arbitrary<Of<F, V>>,
  arbU: Arbitrary<Of<F, Fun<A, B>>>,
  arbF: Arbitrary<Fun<A, B>>,
  arbA: Arbitrary<A>
) {
  describe("Applicative laws", () => {
    test("pure(id) <*> v = v", () => {
      assert(
        property(
          arbV, v => expect(eq(
            v.ap(A.pure(fun(id))),
            v
          )).toBe(true)
        )
      )
    })

    test("pure f <*> pure x = pure (f x)", () => {
      assert(
        property(
          arbF, arbA, (f, a) => expect(eq(
            A.pure(a).ap(A.pure(f)),
            A.pure(f(a))
          )).toBe(true)
        )
      )
    })

    test("u <*> pure y = pure ($ y) <*> u", () => {
      assert(
        property(
          arbU, arbA, (u, a) => expect(eq(
            A.pure(a).ap(u),
            u.ap(A.pure(fun(g => g(a))))
          )).toBe(true)
        )
      )
    })
  })
}