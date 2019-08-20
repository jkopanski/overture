import {
  anything,
  string,
  integer
} from "fast-check"
import { isDeepStrictEqual as eq } from "util"
import { Equivalence } from "@famisoft/overture/data/functor/contravariant/equivalence"
import { Fun } from "@famisoft/overture/data/function"
import { Tuple } from "@famisoft/overture/data/tuple"

import categoryLaws from "@famisoft/overture/control/category/laws"
import semigroupoidLaws from "@famisoft/overture/control/semigroupoid/laws"
import profunctorLaws from "@famisoft/overture/data/profunctor/laws"

import arbFun from "@famisoft/overture/data/function/arbitrary"

import arbitrarySP from "./arbitrary"
import { SP } from "./proc"
import { run } from "./ops"

const eqSP = <A, B>(a: A) => {
  // TODO: make length random as well?
  const len = 5
  const input = new Array(len)
  input.fill(a)

  return new Equivalence<SP<A, B>>((sps => eq(
    run(sps.fst, input),
    run(sps.snd, input)
  )) as Fun<Tuple<SP<A, B>, SP<A, B>>, boolean>)
}

describe("Data.Stream.Proc", () => {
  describe("Finite Stream Processor", () => {
    semigroupoidLaws(
      arbitrarySP<string, number>(integer(), 4),
      arbitrarySP<number, string>(string(), 10),
      arbitrarySP<any, number>(integer(), 8),
      anything(),
      eqSP
    )
    categoryLaws(
      SP,
      arbitrarySP<any, number>(integer(), 8),
      anything(),
      eqSP
    )
    profunctorLaws(
      arbitrarySP<number, string>(string(), 10),
      integer(),
      arbFun(integer()),
      arbFun(string()),
      eqSP
    )
  })
})
