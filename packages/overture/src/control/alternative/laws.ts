import { Arbitrary, assert, property } from "fast-check"
import { Of } from "tshkt"
import { isDeepStrictEqual as eq } from "util"

import { Fun } from "../../data/function"
import { Empty } from "../plus"

import { IsAlternative } from "."

export default function laws<F extends IsAlternative<F>, A, B> (
  A: Empty<F>,
  arbF: Arbitrary<Of<F, Fun<A, B>>>,
  arbX: Arbitrary<Of<F, A>>
) {
  describe("Alternative laws", () => {
    test("distributivity", () => {
      assert(
        property(
          arbF, arbF, arbX, (f, g, x) => expect(eq(
            x.apply(f.alt(g)),
            x.apply(f).alt(x.apply(g))
          )).toBe(true)
        )
      )
    })

    test("annihilation", () => {
      assert(
        property(
          arbF, f => expect(eq(
            A.empty().apply(f),
            A.empty()
          )).toBe(true)
        )
      )
    })
  })
}
