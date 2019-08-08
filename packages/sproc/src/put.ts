import { SP, Fork } from "./proc"

export class Put<A, B> extends SP<A, B> {
  constructor (private value: B, private cont: SP<A, B>) {
    super()
  }

  fork<C> (f: Fork<A, B, C>): C {
    return f.put(this.value, this.cont)
  }

  compose<C> (this: Put<A, B>, sp: SP<C, A>): SP<C, B> {
    return new Put(this.value, this.cont.compose(sp))
  }

  // dimap<C, D> (f: Fun<C, A>, g: Fun<B, D>): SP<C, D> {
  //   return
  // }
}

/**
 * It's better to use this function than `new Put`,
 * because the return type will be `SP<A, B>` and not `Put<A, B>`.
 */
export function put<A, B>(
  value: B,
  cont: SP<A, B>
): SP<A, B> {
  return new Put(value, cont)
}
