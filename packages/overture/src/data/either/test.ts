import {
  Arbitrary,
  anything,
  string,
  integer
} from "fast-check"
import functor from "../functor/laws"
import bifunctor from "../bifunctor/laws"
import apply from "../../control/apply/laws"
import applicative from "../../control/applicative/laws"
import bind from "../../control/bind/laws"
import monad from "../../control/monad/laws"
import arbFun from "../function/arbitrary"
import { Fun } from "../function"
import { Either } from "."
import arbEither from "./arbitrary"

describe("Data.Either", () => {
  bifunctor(
    arbEither(string(), integer()),
    arbFun<string, number>(integer()),
    arbFun<number, string>(string()),
    arbFun<number, string>(string()),
    arbFun<string, any>(anything())
  )
  functor(arbEither(anything(), anything()), anything())
  apply(
    arbEither(string(), arbFun<number, string>(string()) as Arbitrary<Fun<number, string>>),
    arbEither(string(), arbFun<any, number>(integer())),
    arbEither(string(), anything())
  )
  applicative(
    Either,
    arbEither(integer(), anything()),
    arbEither(integer(), arbFun<number, string>(string())),
    arbFun<number, string>(string()),
    integer()
  )
  bind(
    arbEither(string(), anything()),
    arbFun<number, Either<string, string>>(arbEither(string(), string())),
    arbFun<string, Either<string, number>>(arbEither(string(), integer()))
  )
  monad(
    Either,
    string(),
    arbEither(string(), string()),
    arbFun<string, Either<string, number>>(
      arbEither(string(), integer())
    )
  )
})
