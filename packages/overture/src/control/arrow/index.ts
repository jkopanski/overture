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

export interface IsArrow<F> extends TypeFamily<Kind2> {
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
