import {
  anything,
  integer,
  string
} from "fast-check"

// Data
import eq from "../eq/laws"
import functor from "../functor/laws"

// Control
import alt from "../../control/alt/laws"
import alternative from "../../control/alternative/laws"
import applicative from "../../control/applicative/laws"
import apply from "../../control/apply/laws"
import bind from "../../control/bind/laws"
import monad from "../../control/monad/laws"
import monadzero from "../../control/monadzero/laws"
import plus from "../../control/plus/laws"

import { Maybe } from "."
import arbFun from "../function/arbitrary"
import arbMaybe from "./arbitrary"

describe("Data.Maybe", () => {
  eq(arbMaybe(integer()))
  functor(arbMaybe(anything()), anything())
  apply(
    arbMaybe(arbFun<number, string>(string())),
    arbMaybe(arbFun<unknown, number>(integer())),
    arbMaybe(anything())
  )
  applicative(
    Maybe,
    arbMaybe(anything()),
    arbMaybe(arbFun<number, string>(string())),
    arbFun<number, string>(string()),
    integer()
  )
  bind(
    arbMaybe(anything()),
    arbFun<number, Maybe<string>>(arbMaybe(string())),
    arbFun<string, Maybe<number>>(arbMaybe(integer()))
  )
  monad(
    Maybe,
    string(),
    arbMaybe(string()),
    arbFun<string, Maybe<number>>(arbMaybe(integer()))
  )
  alt(
    arbFun<string, number>(integer()),
    arbMaybe<string>(string())
  )
  plus(
    Maybe,
    arbFun<string, number>(integer()),
    arbMaybe<string>(string())
  )
  alternative(
    Maybe,
    arbMaybe(arbFun<string, number>(integer())),
    arbMaybe(string())
  )
  monadzero(
    Maybe,
    arbFun<string, Maybe<number>>(arbMaybe(integer()))
  )
  // Take a look at the discussion here:
  // https://wiki.haskell.org/MonadPlus_reform_proposal#Instances_of_both
  // https://github.com/purescript/purescript-control/issues/51
  // monadplus(
  //   arbFun<number, Maybe<number>>(arbMaybe(integer())),
  //   arbMaybe(integer())
  // )
})
