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
// for side effects
import "."

// function arbFun <A, B>(
//   arbB: Arbitrary<B>
// ): Arbitrary<Fun<A, B>> {
//   return func<[A], B>(arbB)
// }

// While this typechecks niceley,
// we cannot use `isDeepStrictEqual` to comparw functions.
// Therefore custom properties are needed to test functions.
// describe("Data.Function", () => {
//   laws(arbFun(boolean()), arbFun(integer()), arbFun(string()))
// })

describe("Data.Function", () => {
  describe("Semigroupoid laws", () => {

    test("f.compose(g).compose(h) === f.compose(g.compose(h))", () => {
      const arbF =
        func<[boolean], string>(string())
      const arbG =
        func<[number], boolean>(boolean())
      const arbH =
        func<[unknown], number>(integer())

      assert(
        property(
          arbF, arbG, arbH, anything(), (
            f: (x: boolean) => string,
            g: (x: number) => boolean,
            h: (x: unknown) => number,
            start
          ) =>
            expect(
              (compose(f, g, h) as (x: unknown) => string)(start) ===
                (pipe(h, g, f) as (x:unknown) => string)(start)
            ).toBe(true)
        )
      )
    })
  })
})
