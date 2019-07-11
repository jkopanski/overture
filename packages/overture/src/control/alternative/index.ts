import {
  Kind1,
  TypeFamily
} from "tshkt"
import { Applicative, Pure } from "../applicative"
import { Plus, Empty } from "../plus"

/**
 * Alternative interface provides no methods on its own.
 * It just marks class os both [[Applicative]] and [[Plus]].
 */
export interface Alternative<F, A>
  extends Applicative<F, A>, Plus<F, A> {
    constructor: Pure<F> & Empty<F>
}

export interface IsAlternative<F> extends TypeFamily<Kind1> {
  (): Alternative<F, this[0]>
}
