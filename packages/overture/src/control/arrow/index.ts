import {
  Kind2,
  Of2,
  TypeFamily
} from "tshkt"

import { Category, Identity } from "../category"
import { Fun } from "../../data/function"
import { Profunctor, rmap } from "../../data/profunctor"

/**
 * Arrow captures requirement that `F` is a [[Profunctor]]
 * and a [[Category]].
 */
export interface Arrow<F, A, B>
  extends Category<F, A, B>,
    Profunctor<F, A, B> {}

/**
 * Interface used to assert that Higher Kinded Type `F`
 * is implementing [[Arrow]] interface, for any type `A`.
 *
 * Use it like:
 * ```
 * function func <F extends IsArrom<F>, A>(fa: Of<F, A>) {}
 * ```
 * to denote that fuction will take any `Arrow`.
 */
export interface IsArrow<F> extends TypeFamily<Kind2> {
  /** @ignore */
  (): Arrow<F, this[0], this[1]>
}

/**
 * Lift a pure function `f` into [[Profunctor]]
 * which is also a [[Category]].
 * Due to the limits of TypeScript type system,
 * one has to pass desired [[Category]]'s
 * identity constructor.
 */
export function arr<F extends IsArrow<F>, A, B> (
  f: Fun<A, B>,
  id: Identity<F>
): Of2<F, A, B> {
  return rmap(f, id.id())
}
