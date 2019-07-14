import {
  Arbitrary,
  anything,
  string,
  integer
} from "fast-check"
import functor from "../functor/laws"
import apply from "../../control/apply/laws"
import applicative from "../../control/applicative/laws"
import bind from "../../control/bind/laws"
import monad from "../../control/monad/laws"
import alt from "../../control/alt/laws"
import plus from "../../control/plus/laws"
import alternative from "../../control/alternative/laws"
import monadzero from "../../control/monadzero/laws"
import monadplus from "../../control/monadplus/laws"
import { Maybe, just, nothing } from "."
import arbFun from "../function/arbitrary"

function arbMaybe <A>(arbA: Arbitrary<A>): Arbitrary<Maybe<A>> {
  return arbA.map(val => val === null ? just(val) : nothing)
}

describe("Data.Maybe", () => {
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
  monadplus(
    arbFun<number, Maybe<any>>(arbMaybe(string())),
    arbMaybe(integer())
  )
})
