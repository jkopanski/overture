import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"

import { Fun } from "../../function"

/**
 * Contravariant functor can be thought of as consumer of values,
 * as opposed to regular [[Functor]] who is often thought of as
 * the one containing a value.
 */
export interface Contravariant<F, B> {
  cmap<A> (this: Of<F, B>, f: Fun<A, B>): Of<F, A>
}

export interface IsContravariant<F> extends TypeFamily<Kind1> {
  (): Contravariant<F, this[0]>
}
