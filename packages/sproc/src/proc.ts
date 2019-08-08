import {
  Generic,
  Generic2,
  Kind2,
  TypeFamily
} from "tshkt"
import { Fun } from "@famisoft/overture/data/function"
import { Unit } from "@famisoft/overture/data/unit"
// import { Profunctor } from "@famisoft/overture/data/profunctor"
import { Lazy } from "@famisoft/overture/control/lazy"
import { Semigroupoid } from "@famisoft/overture/control/semigroupoid"
// import { Category } from "@famisoft/overture/control/category"

import "@famisoft/overture/data/function"

export interface SPKind extends TypeFamily<Kind2> {
  (): SP<this[0], this[1]>
}

export interface Fork<A, B, C> {
  get: (f: (a: A) => SP<A, B>) => C,
  put: (b: B, cont: SP<A, B>) => C
}

export abstract class SP<A, B>
  implements Lazy<SP<A, B>>,// Profunctor<SPKind, A, B>,
    Semigroupoid<SPKind, A, B> { //,
    //Category<SPKind, A, B> {
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

      abstract fork<C> (f: Fork<A, B, C>): C
      // abstract run (
      //   stream: IterableIterator<A>
      // ): IterableIterator<B>

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
