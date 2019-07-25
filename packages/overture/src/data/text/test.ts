import eq from "../eq/laws"
import ord from "../ord/laws"
import semigroup from "../semigroup/laws"
import monoid from "../monoid/laws"
import arbText from "./arbitrary"

import "../eq"
import "."

describe("Data.Text", () => {
  eq(arbText())
  ord(arbText())
  semigroup(arbText())
  monoid("".constructor, arbText())
})
