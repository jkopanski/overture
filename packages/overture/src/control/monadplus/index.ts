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

export interface IsMonadPlus<F> extends TypeFamily<Kind1> {
  (): MonadPlus<F, this[0]>
}
