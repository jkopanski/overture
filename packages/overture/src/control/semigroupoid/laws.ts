import { Arbitrary, assert, property } from "fast-check"
import { Of2 } from "tshkt"
import { isDeepStrictEqual as eq } from "util"
import { IsSemigroupoid } from "."

export default function laws <
  F extends IsSemigroupoid<F>,
  G extends IsSemigroupoid<G>,
  H extends IsSemigroupoid<H>,
  A,
  B,
  C,
  D
> (
  arbF: Arbitrary<Of2<F, A, B>>,
  arbH: Arbitrary<Of2<G, B, C>>,
  arbG: Arbitrary<Of2<H, C, D>>,
) {
  describe("Semigroupoid laws", () => {
    test("a.compose(b).compose(c) === a.compose(b.compose(c))", () => {
      assert(
        property(
          arbF, arbG, arbH, (f, g, h) =>
            expect(
              eq(
                f.compose(g).compose(h),
                f.compose(g.compose(h))
              )
            ).toBe(true)
        )
      )
    })
  })
}
