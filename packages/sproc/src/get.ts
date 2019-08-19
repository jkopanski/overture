import { Fun } from "@famisoft/overture/data/function"

import { nil } from "./nil"
import { SP, Fork } from "./proc"

export class Get<A, B> extends SP<A, B> {
  constructor (private f: Fun<A, SP<A, B>>) {
    super()
  }

  fork<C> (f: Fork<A, B, C>): C {
    return f.get(this.f)
  }

  compose<C> (this: Get<A, B>, sp: SP<C, A>): SP<C, B> {
    return sp.fork({
      put: (out, cont) => this.f(out).compose(cont),
      get: g => new Get((
        (c: C) => this.compose(g(c))
      ) as Fun<C, SP<C, B>>),
      nil: nil as () => SP<C, B>
    })
  }

  // dimap<C, D> (f: Fun<C, A>, g: Fun<B, D>): SP<C, D> {
  //   return new Get(pipe(
  //     f,
  //     this.f
  //   ))
  // }

}

/**
 * It's better to use this function than `new Get`,
 * because the return type will be `SP<A, B>` and not `Get<A, B>`.
 */
export function get<A, B>(
  f: Fun<A, SP<A, B>>
): SP<A, B> {
  return new Get(f)
}
