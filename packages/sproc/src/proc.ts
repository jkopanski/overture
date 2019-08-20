import {
  Generic,
  Generic2,
  Kind2,
  TypeFamily
} from "tshkt"
import { Fun } from "@famisoft/overture/data/function"
import { Unit } from "@famisoft/overture/data/unit"
// import { Profunctor } from "@famisoft/overture/data/profunctor"
import { Category } from "@famisoft/overture/control/category"
import { Lazy } from "@famisoft/overture/control/lazy"
import { Semigroupoid } from "@famisoft/overture/control/semigroupoid"
// import { Category } from "@famisoft/overture/control/category"

import "@famisoft/overture/data/function"

export interface SPKind extends TypeFamily<Kind2> {
  (): SP<this[0], this[1]>
}

export interface Fork<A, B, C> {
  get: (f: (a: A) => SP<A, B>) => C,
  put: (b: B, cont: SP<A, B>) => C,
  nil: () => C
}

export abstract class SP<A, B>
  implements Lazy<SP<A, B>>,// Profunctor<SPKind, A, B>,
    Semigroupoid<SPKind, A, B>,
    Category<SPKind, A, B> {
      [Generic.Type2]: Generic2<SPKind, A, B>
      ["constructor"]: typeof SP

      static defer<I, J> (f: Fun<Unit, SP<I, J>>) {
        let memoized: SP<I, J> | undefined = undefined
        return new Proxy({} as SP<I, J>, {
          get: function (_target: SP<I, J>, prop: keyof SP<I, J>) {
            if (!memoized) {
              memoized = f()
            }

            return Reflect.get(memoized, prop)
          }
        })
      }

      static id<I> () {
        return get((
          (x: I) => put(
            x,
            SP.defer((_ => SP.id()) as Fun<Unit, SP<I, I>>)
          )
        ) as Fun<I, SP<I, I>>)
      }

      abstract fork<C> (f: Fork<A, B, C>): C

      // abstract dimap<C, D> (
      //   this: SP<A, B>,
      //   f: Fun<C, A>,
      //   g: Fun<B, D>
      // ): SP<C, D>

      abstract compose<C> (
        this: SP<A, B>,
        sp: SP<C, A>
      ): SP<C, B>
}

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

export class Nil<A, B> extends SP<A, B> {
  fork<C> (f: Fork<A, B, C>): C {
    return f.nil()
  }

  compose<C> (this: Nil<A, B>, _sp: SP<C, A>): SP<C, B> {
    return nil()
  }
}

const NIL = new Nil()

export const nil = <A, B>(): SP<A, B> => NIL as SP<A, B>
