import { Arbitrary, assert, property } from "fast-check"
import { Of2 } from "tshkt"

import { Equivalence } from "../../data/functor/contravariant/equivalence"
import { tuple } from "../../data/tuple"

import { IsSemigroupoid, compose, pipe } from "."

/**
 * Each [[Semigroupoid]] has to satisfy the associativity law,
 * regarding it's `compose` operation.
 *
 * - Associativity:
 * ```typescript
 * a.compose(b).compose(c) === a.compose(b.compose(c))
 * ```
 */
export default function laws <
  F extends IsSemigroupoid<F>,
  A,
  B,
  C,
  D
> (
  arbF: Arbitrary<Of2<F, C, D>>,
  arbG: Arbitrary<Of2<F, B, C>>,
  arbH: Arbitrary<Of2<F, A, B>>,
  arbA: Arbitrary<A>,
  equiv: (a: A) => Equivalence<Of2<F, A, D>>
) {
  describe("Semigroupoid laws", () => {
    test("associativity", () => {
      assert(
        property(
          arbF, arbG, arbH, arbA, (f, g, h, a) => {
            const eq = equiv(a).get()
            return expect(
              eq(tuple(
                compose(f, g, h),
                pipe(h, g, f)
              ))
            ).toBe(true)
          }
        )
      )
    })
  })
}
