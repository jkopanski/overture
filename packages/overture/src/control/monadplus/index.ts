import {
  Kind1,
  TypeFamily
} from "tshkt"
import { MonadZero } from "../monadzero"

/**
 * MonadPlus interface is just [[MonadZero]] that satisfies
 * additional `distributivity` law.
 *
 * ```
 * x.alt(y).bind(f) === x.bind(f).alt(y.bind(f))
 * ```
 */
export interface MonadPlus<F, A>
  extends MonadZero<F, A> {}

/**
 * Interface used to assert that Higher Kinded Type `F`
 * is implementing [[MonadPlus]] interface, for any type `A`.
 *
 * Use it like:
 * ```
 * function func <F extends IsMonadPlus<F>, A>(fa: Of<F, A>) {}
 * ```
 * to denote that fuction will take any `MonadPlus`.
 */
export interface IsMonadPlus<F> extends TypeFamily<Kind1> {
  /** @ignore */
  (): MonadPlus<F, this[0]>
}
