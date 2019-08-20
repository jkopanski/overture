import { Fun } from "@famisoft/overture/data/function"
import { Tuple, tuple } from "@famisoft/overture/data/tuple"
import { Unit } from "@famisoft/overture/data/unit"

import { SP, get, put } from "./proc"

// TODO: make this more general, e.g.:
// export function run<
//   A, B,
//   F extends IsMonoid<F>
// > (
//   sp: SP<A, B>,
//   input: Generator<A>
// ): Of<F, A>
// TODO: stacksafety
export function run<A, B> (
  sp: SP<A, B>,
  input: Array<A>
): Array<B> {
  return input.length === 0
    ? []
    : sp.fork({
      put: (b, cont) =>
        [b].concat(run(cont, input)),
      get: f => {
        const [a, ...tail] = input
        return run(f(a), tail)
      },
      nil: () => ([])
    })
}

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
