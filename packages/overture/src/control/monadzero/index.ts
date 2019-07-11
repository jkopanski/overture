import {
  Kind1,
  TypeFamily
} from "tshkt"
import { Alternative } from "../alternative"
import { Monad } from "../monad"

/**
 * MonadZero interface provides no methods on its own.
 * It just marks class os both [[Alternative]] and [[Monad]].
 */
export interface MonadZero<F, A>
  extends Alternative<F, A>, Monad<F, A> {}

export interface IsMonadZero<F> extends TypeFamily<Kind1> {
  (): MonadZero<F, this[0]>
}
