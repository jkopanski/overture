import {
  Arbitrary,
  anything,
  string,
  integer
} from "fast-check"
import functor from "../../control/functor/laws"
import apply from "../../control/apply/laws"
import { Identity } from "."
import { arbFun } from "../../data/function/test"

function arbIdentity <A>(arbA: Arbitrary<A>): Arbitrary<Identity<A>> {
  return arbA.map(_ => new Identity(_))
}

describe("Data.Identity", () => {
  functor(arbIdentity(anything()), anything())
  apply(
    arbIdentity(arbFun<number, string>(string())),
    arbIdentity(arbFun<unknown, number>(integer())),
    arbIdentity(anything())
  )
})
