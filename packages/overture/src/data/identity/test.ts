import { Arbitrary, anything } from "fast-check"
import test from "ava"
import laws from "../../control/functor/laws"
import { Identity } from "."

function arbIdentity <A>(arbA: Arbitrary<A>): Arbitrary<Identity<A>> {
  return arbA.map(_ => new Identity(_))
}

describe("Data.Identity", () => {
  laws(arbIdentity(anything()), anything())
})
