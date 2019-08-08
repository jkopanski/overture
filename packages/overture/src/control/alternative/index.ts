import {
  Kind1,
  TypeFamily
} from "tshkt"

import { Applicative, Pure } from "../applicative"
import { Empty, Plus } from "../plus"

/**
 * Alternative interface provides no methods on its own.
 * It just marks class os both [[Applicative]] and [[Plus]].
 */
export interface Alternative<F, A>
  extends Applicative<F, A>, Plus<F, A> {
    constructor: Pure<F> & Empty<F>
}

/**
 * Interface used to assert that Higher Kinded Type `F`
 * is implementing [[Alternative]] interface, for any type `A`.
 *
 * Use it like:
 * ```
 * function func <F extends IsAlternative<F>, A>(fa: Of<F, A>) {}
 * ```
 * to denote that fuction will take any `Alternative`.
 */

export interface IsAlternative<F> extends TypeFamily<Kind1> {
  /** @ignore */
  (): Alternative<F, this[0]>
}
