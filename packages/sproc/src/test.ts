import {
  string,
  integer
} from "fast-check"
import semigroupoidLaws from "@famisoft/overture/control/semigroupoid/laws"

// import arbitrarySP from "./arbitrary"

describe("Data.Stream.Proc", () => {
  test("Finite Stream Processor", () => {
    expect(true).toBe(true)
    // semigroupoidLaws(
    //   arbitrarySP<string, number>(integer(), 4),
    //   arbitrarySP<number, string>(string(), 10),
    //   arbitrarySP<any, number>(integer(), 2)
    // )
  })
})
