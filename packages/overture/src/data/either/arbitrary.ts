import {
  Arbitrary,
  anything,
  option
} from "fast-check"
import {
  Either,
  left,
  right
} from "."

export default function <L, R>(
  arbL: Arbitrary<L>,
  arbR: Arbitrary<R>
): Arbitrary<Either<L, R>> {
  return option(anything()).chain(
    val =>
      val === null
      ? arbL.map(l => left<L, R>(l))
      : arbR.map(r => right<L, R>(r))
  )
}
