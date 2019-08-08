import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"
import { Alt } from "../alt"

export interface Empty<F> {
  empty (): Of<F, any>
}

/**
 * Plus interface extends [[Alt]] with `empty` element,
 * which is left and right identity of `alt` operation.
 */
export interface Plus<F, A> extends Alt<F, A> {
  constructor: Empty<F>
}

/**
 * Interface used to assert that Higher Kinded Type `F`
 * is implementing [[Plus]] interface, for any type `A`.
 *
 * Use it like:
 * ```
 * function func <F extends IsPlus<F>, A>(fa: Of<F, A>) {}
 * ```
 * to denote that fuction will take any `Plus`.
 */
export interface IsPlus<F> extends TypeFamily<Kind1> {
  /** @ignore */
  (): Plus<F, this[0]>
}
