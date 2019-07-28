import {
  Arbitrary,
  anything,
  integer,
  string
} from "fast-check"

// Data
import bifunctor from "../bifunctor/laws"
import functor from "../functor/laws"
import { Text } from "../text"

// Control
// import applicative from "../../control/applicative/laws"
import apply from "../../control/apply/laws"
import bind from "../../control/bind/laws"
// import monad from "../../control/monad/laws"

import { Fun } from "../function"
import arbFun from "../function/arbitrary"
import text from "../text/arbitrary"

import { Tuple } from "."
import arbTuple from "./arbitrary"

import "../text"

describe("Data.Tuple", () => {
  bifunctor(
    arbTuple(string(), integer()),
    arbFun<string, number>(integer()),
    arbFun<number, string>(string()),
    arbFun<number, string>(string()),
    arbFun<string, any>(anything())
  )
  functor(arbTuple(anything(), anything()), anything())
  apply(
    arbTuple(
      text(),
      arbFun<number, Text>(text()) as
        Arbitrary<Fun<number, Text>>
    ),
    arbTuple(text(), arbFun<any, number>(integer())),
    arbTuple(text(), anything())
  )
  // applicative(
  //   Tuple,
  //   arbTuple<Text, any>(text(), anything()),
  //   arbTuple(text(), arbFun<Text, Text>(text())),
  //   arbFun<Text, Text>(text()),
  //   integer()
  // )
  bind(
    arbTuple(text(), anything()),
    arbFun<number, Tuple<Text, string>>(arbTuple(text(), text())),
    arbFun<Text, Tuple<Text, number>>(arbTuple(text(), integer()))
  )
  // monad(
  //   Either,
  //   string(),
  //   arbEither(string(), string()),
  //   arbFun<string, Either<string, number>>(
  //     arbEither(string(), integer())
  //   )
  // )
})
