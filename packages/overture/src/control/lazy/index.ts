import { Fun } from "../../data/function"
import { Unit } from "../../data/unit"

export interface Defer<A> {
  defer (f: Fun<Unit, A>): A
}

/**
 * Represetns type which allaws evaluation of values to be deffered.
 */
export interface Lazy<A> {
  constructor: Defer<A>
}

// export function fix<L extends Lazy<L>> (
//   f: Fun<L, L>,
//   l: Defer<L>
// ): L {
//   return (function
//     return l.defer(
//       _ => go(f(i))
//     ) as Fun<Unit, L>)
//   })(init?)
// }
