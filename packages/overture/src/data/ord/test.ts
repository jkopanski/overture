import eq from "../eq/laws"
import arbOrdering from "./arbitrary"

describe("Data.Ordering", () => {
  eq(arbOrdering())
})
