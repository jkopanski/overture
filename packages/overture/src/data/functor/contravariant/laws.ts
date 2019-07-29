import { Arbitrary, assert, func, property } from "fast-check"
import { Of } from "tshkt"

import { Fun } from "../../function"
import { tuple } from "../../tuple"
import arbFun from "../../function/arbitrary"

import { IsContravariant } from "."
import { Equivalence } from "./equivalence"

import "../../function"

export default function laws<F extends IsContravariant<F>, A> (
  arbFA: Arbitrary<Of<F, A>>,
  arbA: Arbitrary<A>,
  equiv: (a: A) => Equivalence<Of<F, A>>
) {
  describe("Covariant laws", () => {
    test("identity", () => {
      assert(
        property(
          arbFA, arbA, (fa, a) => {
            const eq = equiv(a).get()
            return expect(eq(tuple(
              fa.cmap((x => x) as Fun<A, A>),
              fa
            ))).toBe(true)
          }
        )
      )
    })

    test("composition", () => {
      const arbF = arbFun<A, A>(arbA)
      assert(
        property(
          arbFA, arbF, arbF, arbA, (fa, f, g, a) => {
            const eq = equiv(a).get()
            return expect(eq(tuple(
              fa.cmap(g.compose(f)),
              fa.cmap(g).cmap(f)
            ))).toBe(true)
          }
        )
      )
    })
  })
}
