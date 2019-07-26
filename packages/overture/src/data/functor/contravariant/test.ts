import { string } from "fast-check"

import contravariant from "./laws"
// import semigroup from "../../semigroup/laws"
// import monoid from "../../monoid/laws"

// import { Predicate } from "./instances"

import { arbPredicate } from "./arbitrary"

describe("Data.Functor.Contravariant", () => {
  describe("Predicate", () => {
    contravariant(arbPredicate<string>(), string())

    // TODO: This involves function comparison which won't do
    // semigroup(arbPredicate())
    // monoid(Predicate, arbPredicate())
  })

})
