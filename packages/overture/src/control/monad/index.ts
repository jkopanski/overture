import {
  Kind1,
  TypeFamily
} from "tshkt"
import { Applicative } from "../applicative"
import { Bind } from "../bind"

export interface Monad<F, A> extends Applicative<F, A>, Bind<F, A> {}

/**
 * Interface used to assert that Higher Kinded Type `F`
 * is implementing [[Monad]] interface, for any type `A`.
 *
 * Use it like:
 * ```
 * function func <F extends IsMonad<F>, A>(fa: Of<F, A>) {}
 * ```
 * to denote that fuction will take any `Monad`.
 */
export interface IsMonad<F> extends TypeFamily<Kind1> {
  /** @ignore */
  (): Monad<F, this[0]>
}
