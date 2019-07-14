import {
  Arbitrary,
  func
} from "fast-check"
import { Fun } from "."

export default function <A, B>(
  arbB: Arbitrary<B>
): Arbitrary<Fun<A, B>> {
  return func<[A], B>(arbB) as Arbitrary<Fun<A, B>>
}
