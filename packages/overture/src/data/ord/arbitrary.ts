import {
  Arbitrary,
  constantFrom,
} from "fast-check"
import {
  EQ,
  GT,
  LT,
  Ordering,
} from "."

export default function (): Arbitrary<Ordering> {
  return constantFrom(LT, EQ, GT)
}
