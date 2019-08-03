import { Arbitrary, assert, property } from "fast-check"
import { Of2 } from "tshkt"

import { Fun } from "../function"
import { Equivalence } from "../functor/contravariant/equivalence"
import { tuple } from "../tuple"
import { compose, pipe } from "../../control/semigroupoid"
import { IsProfunctor } from "."

export default function laws<
  P extends IsProfunctor<P>,
  A,
  B
> (
  arbP: Arbitrary<Of2<P, A, B>>,
  arbA: Arbitrary<A>,
  arbF: Arbitrary<Fun<A, A>>,
  arbG: Arbitrary<Fun<B, B>>,
  equiv: (a: A) => Equivalence<Of2<P, A, B>>
) {
  describe("Profunctor laws", () => {
    test("identity", () => {
      assert(
        property(
          arbP, arbA, (pa, a) => {
            const eq = equiv(a).get()
            return expect(eq(tuple(
              pa.dimap(
                (x => x) as Fun<A, A>,
                (x => x) as Fun<B, B>
              ),
              pa
            ))).toBe(true)
          }
        )
      )
    })

    test("composition", () => {
      assert(
        property(
          arbP, arbF, arbF, arbG, arbG, arbA,
          (pa, f1, f2, g1, g2, a) => {
            const eq = equiv(a).get()
            return expect(eq(tuple(
              pa.dimap(f1, g1).dimap(f2, g2),
              pa.dimap(pipe(f1, f2), compose(g1, g2))
            ))).toBe(true)
          }
        )
      )
    })
  })
}
