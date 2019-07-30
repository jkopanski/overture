import eq from "../eq/laws"
import monoid from "../monoid/laws"
import ord from "../ord/laws"
import semigroup from "../semigroup/laws"

import arbText from "./arbitrary"

import { Fun } from "../function"
import { getDefaultEquivalence } from "../functor/contravariant/equivalence"
import { Tuple } from "../tuple"

import "."
import "../eq"

describe("Data.Text", () => {
  eq(arbText())
  ord(arbText())
  semigroup(
    arbText(),
    () => getDefaultEquivalence()
  )
  monoid("".constructor, arbText())
})
