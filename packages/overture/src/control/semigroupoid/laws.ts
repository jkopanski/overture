import { Arbitrary, assert, property } from "fast-check"
import { Of2 } from "tshkt"
import { isDeepStrictEqual as eq } from "util"
import { IsSemigroupoid, compose, pipe } from "."

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
) {
  describe("Semigroupoid laws", () => {
    test("a.compose(b).compose(c) === a.compose(b.compose(c))", () => {
      assert(
        property(
          arbF, arbG, arbH, (f, g, h) =>
            expect(
              eq(
                compose(f, g, h),
                pipe(h, g, f)
              )
            ).toBe(true)
        )
      )
    })
  })
}
