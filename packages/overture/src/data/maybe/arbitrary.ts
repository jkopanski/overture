import {
  Arbitrary,
  option
} from "fast-check"
import {
  Maybe,
  just,
  nothing
} from "."

export default function <A>(
  arbA: Arbitrary<A>
): Arbitrary<Maybe<A>> {
  return option(arbA).map(
    val => val === null
      ? nothing
      : just(val)
  )
}
