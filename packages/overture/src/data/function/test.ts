import {
  anything,
  assert,
  boolean,
  integer,
  property,
  string
} from "fast-check"

import {
  compose,
  pipe
} from "../../control/semigroupoid"
// for side effects

import "."
import { Fun } from "."
import arbFun from "./arbitrary"

describe("Data.Function", () => {
  describe("Semigroupoid laws", () => {

    test("f.compose(g).compose(h) === f.compose(g.compose(h))", () => {
      const arbF = arbFun<boolean, string>(string())
      const arbG = arbFun<number, boolean>(boolean())
      const arbH = arbFun<unknown, number>(integer())

      assert(
        property(
          arbF, arbG, arbH, anything(), (
            f: Fun<boolean, string>,
            g: Fun<number, boolean>,
            h: Fun<unknown, number>,
            start
          ) =>
            expect(
              compose(f, g, h)(start) ===
                pipe(h, g, f)(start)
            ).toBe(true)
        )
      )
    })
  })
})
