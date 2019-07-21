import { Arbitrary, assert, property } from "fast-check"
import { Of } from "tshkt"
import { isDeepStrictEqual as eq } from "util"

import { Fun, fun } from "../../data/function"
import { Pure } from "../applicative"

import { IsMonad } from "."

export default function laws<F extends IsMonad<F>, A, B> (
  A: Pure<F>,
  arbA: Arbitrary<A>,
  arbX: Arbitrary<Of<F, A>>,
  arbF: Arbitrary<Fun<A, Of<F, B>>>,
) {
  describe("Monad laws", () => {
    test("left identity", () => {
      assert(
        property(
          arbF, arbA, (f, a) => expect(eq(
            A.pure(a).bind(f),
            f(a)
          )).toBe(true)
        )
      )
    })

    test("right identity", () => {
      assert(
        property(
          arbX, x => expect(eq(
            x.bind(fun(A.pure)),
            x
          )).toBe(true)
        )
      )
    })
  })
}
