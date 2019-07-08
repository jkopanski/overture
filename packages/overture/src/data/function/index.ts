import {
  Kind2,
  Generic,
  Generic2,
  TypeFamily
} from "tshkt"
import { Semigroupoid } from "../../control/semigroupoid"

export class Fun<B, C> implements Semigroupoid<FunF, B, C> {
  [Generic.Type]: Generic2<FunF, B, C>
  constructor (private f: (b: B) => C) {}
  apply(b: B) { return this.f(b) }
  compose <A>(g: Fun<A, B>): Fun<A, C> {
    return new Fun((a: A) => this.f(g.apply(a)))
  }

}

interface FunF extends TypeFamily<Kind2> {
  (): Fun<this[0], this[1]>
}

// Function.prototype["compose"] = function <A, B, C>(
//   this: Fun<B, C>,
//   f: FunA, B>
// ): Fun<A, C> {
//   return (a: A) => this.call(this, f(a))
// }

// declare global {
//   interface CallableFunction {
//     [Generic.Type]: Generic2<
//       FunF,
//       any,
//       ReturnType<typeof this.call>
//     >
//     compose: <A>(
//       this: Fun<B, C>,
//       f: Fun<A, B>
//     ) => Fun<A, C>;
//   }
// }
