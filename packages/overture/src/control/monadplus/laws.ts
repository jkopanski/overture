import { Arbitrary, assert, property } from "fast-check"
import { Kind1, Of, TypeFamily } from "tshkt"

import { Eq, Eq1, HasEq } from "../../data/eq"
import { Fun } from "../../data/function"

import { MonadPlus } from "."

interface ComparableMonadPlus<F, A extends Eq<A>>
  extends MonadPlus<F, A>,
    Eq1<F, A> {}

interface IsComparableMonadPlus<F> extends TypeFamily<Kind1> {
  (): ComparableMonadPlus<F, HasEq<this[0]>>
}

export default function laws<
  A,
  B,
  F extends IsComparableMonadPlus<F>
> (
  arbF: Arbitrary<Fun<HasEq<A>, Of<F, HasEq<B>>>>,
  arbX: Arbitrary<Of<F, HasEq<A>>>
) {
  describe("MonadPlus laws", () => {
    test("distributivity", () => {
      assert(
        property(
          arbF, arbX, arbX, (f, x, y) => expect(
            x.alt(y).bind(f).eq(
              x.bind(f).alt(y.bind(f))
            )
          ).toBe(true)
        ),
        { verbose: true }
      )
    })
  })
}
