import {
  Arbitrary,
  constantFrom,
} from "fast-check"
import {
  Ordering,
  LT,
  EQ,
  GT
} from "."

export default function (): Arbitrary<Ordering> {
  return constantFrom(LT, EQ, GT)
}
