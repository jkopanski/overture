import {
  Kind1,
  TypeFamily
} from "tshkt"
import { Alternative } from "../alternative"
import { Pure } from "../applicative"
import { Monad } from "../monad"
import { Empty } from "../plus"
// import { Unit, unit } from "../../data/unit"

/**
 * MonadZero interface provides no methods on its own.
 * It just marks class os both [[Alternative]] and [[Monad]].
 */
export interface MonadZero<F, A>
  extends Alternative<F, A>, Monad<F, A> {
    constructor: Pure<F> & Empty<F>
}

export interface IsMonadZero<F> extends TypeFamily<Kind1> {
  (): MonadZero<F, this[0]>
}

// Is there a way to infer A here?
// export function guard <F extends IsMonadZero<F>>(
//   cond: boolean
// ) {
//   return cond ? A.pure(unit) : A.empty()
// }
