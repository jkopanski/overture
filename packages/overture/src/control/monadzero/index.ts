import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"

import { Unit, unit } from "../../data/unit"

import { Alternative } from "../alternative"
import { Pure } from "../applicative"
import { Monad } from "../monad"
import { Empty } from "../plus"

/**
 * MonadZero interface provides no methods on its own.
 * It just marks class os both [[Alternative]] and [[Monad]].
 */
export interface MonadZero<F, A>
  extends Alternative<F, A>, Monad<F, A> {
    constructor: Pure<F> & Empty<F>
}

/**
 * Interface used to assert that Higher Kinded Type `F`
 * is implementing [[MonadZero]] interface, for any type `A`.
 *
 * Use it like:
 * ```
 * function func <F extends IsMonadZero<F>, A>(fa: Of<F, A>) {}
 * ```
 * to denote that fuction will take any `MonadZero`.
 */
export interface IsMonadZero<F> extends TypeFamily<Kind1> {
  /** @ignore */
  (): MonadZero<F, this[0]>
}

/**
 * If condition is false, fail using [[empty]] from [[Plus]].
 * Otherwise return monadic [[Unit]].
 * Useful to short-circuit monadic chains.
 *
 * @param A Due to TypeScript type system, we need to pass
 *          which monad are we talking about.
 * @param cond Condition.
 */
export function guard<F extends IsMonadZero<F>> (
  A: Pure<F> & Empty<F>,
  cond: boolean,
): Of<F, Unit> {
  return cond ? A.pure(unit) : A.empty()
}
