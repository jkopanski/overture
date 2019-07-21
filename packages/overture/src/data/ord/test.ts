import eq from "../eq/laws"
import arbOrdering from "./arbitrary"

import "../eq"

describe("Data.Ordering", () => {
  eq(arbOrdering())
})
