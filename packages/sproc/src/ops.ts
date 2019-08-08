import { Fun } from "@famisoft/overture/data/function"
import { Unit } from "@famisoft/overture/data/unit"

import { SP } from "./proc"
import { get } from "./get"
import { put } from "./put"

export function identity<A> (): SP<A, A> {
  return get((
    (x: A) => put(
      x,
      SP.defer((_ => identity()) as Fun<Unit, SP<A, A>>)
    )
  ) as Fun<A, SP<A, A>>)
}

export function map<A, B> (
  f: Fun<A, B>
): SP<A, B> {
  return get((
    (x: A) => put(f(x), SP.defer((_ => map(f)) as Fun<Unit, SP<A, B>>))
  ) as Fun<A, SP<A, B>>)
}
