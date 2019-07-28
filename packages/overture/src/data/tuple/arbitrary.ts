import { Arbitrary } from "fast-check"
import { Tuple } from "."

export default function <A, B>(
  arbA: Arbitrary<A>,
  arbB: Arbitrary<B>
): Arbitrary<Tuple<A, B>> {
  return arbA.chain(
    a => arbB.map(
      b => new Tuple(a, b)
    )
  )
}
