import {
  Arbitrary,
  anything,
  assert,
  boolean,
  func,
  integer,
  string,
  property
} from "fast-check"
import {
  compose,
  pipe
} from "../../control/semigroupoid"
import laws from "../../control/semigroupoid/laws"
// for side effects
//import "."
import { Fun } from "."

function arbFun<A, B>(arbB: Arbitrary<B>): Arbitrary<Fun<A, B>> {
  return func<[A], B>(arbB).map(_ => new Fun(_))
}

// While this typechecks niceley,
// we cannot use `isDeepStrictEqual` to compare functions.
// Therefore custom properties are needed to test functions.
// describe("Data.Function", () => {
//   laws(
//     arbFun<string, boolean>(boolean()),
//     arbFun<number, string>(string()),
//     arbFun<unknown, number>(integer())
//   )
// })

describe("Data.Function", () => {
  describe("Semigroupoid laws", () => {

    test("f.compose(g).compose(h) === f.compose(g.compose(h))", () => {
      const arbF =
        func<[boolean], string>(string()).map(_ => new Fun(_))
      const arbG =
        func<[number], boolean>(boolean()).map(_ => new Fun(_))
      const arbH =
        func<[unknown], number>(integer()).map(_ => new Fun(_))

      assert(
        property(
          arbF, arbG, arbH, anything(), (
            f: Fun<boolean, string>,
            g: Fun<number, boolean>,
            h: Fun<unknown, number>,
            start
          ) =>
            expect(
              compose(f, g, h).apply(start) ===
                pipe(h, g, f).apply(start)
            ).toBe(true)
        )
      )
    })
  })
})
