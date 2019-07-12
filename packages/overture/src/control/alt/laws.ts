import { Arbitrary, assert, property } from "fast-check"
import { Of } from "tshkt"
import { isDeepStrictEqual as eq } from "util"
import { IsAlt } from "."
import { Fun } from "../../data/function"

export default function laws<F extends IsAlt<F>, A, B>(
  arbF: Arbitrary<Fun<A, B>>,
  arbX: Arbitrary<Of<F, A>>,
) {
  describe("Alt laws", () => {
    test("associativity", () => {
      assert(
        property(
          arbX, arbX, arbX, (x, y, z) => expect(eq(
            x.alt(y).alt(z),
            x.alt(y.alt(z))
          )).toBe(true)
        )
      )
    })

    test("distributivity", () => {
      assert(
        property(
          arbF, arbX, arbX, (f, x, y) => expect(eq(
            x.alt(y).map(f),
            x.map(f).alt(y.map(f))
          )).toBe(true)
        )
      )
    })
  })
}
