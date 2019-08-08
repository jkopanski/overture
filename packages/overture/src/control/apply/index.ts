import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"

import { Fun, Fun2, constant, id } from "../../data/function"
import { Functor, voidRight } from "../../data/functor"

/**
 * Apply is an interface supporting `apply` operation,
 * which is used to apply a function in the context
 * to an orgument in a context
 */
export interface Apply<F, A> extends Functor<F, A> {
  apply<B> (this: Of<F, A>, f: Of<F, Fun<A, B>>): Of<F, B>
}

/**
 * Interface used to assert that Higher Kinded Type `F`
 * is implementing [[Apply]] interface, for any type `A`.
 *
 * Use it like:
 * ```
 * function func <F extends IsApply<F>, A>(fa: Of<F, A>) {}
 * ```
 * to denote that fuction will take any `Apply`.
 */
export interface IsApply<F> extends TypeFamily<Kind1> {
  /** @ignore */
  (): Apply<F, this[0]>
}

export function liftA<F extends IsApply<F>, A, B> (
  f: Fun<A, B>
): Fun<Of<F, A>, Of<F, B>> {
  return (
    (fa: Of<F, A>) =>
      fa.map(f)
  ) as Fun<Of<F, A>, Of<F, B>>
}

/**
 * Lift a function af 2 arguments to a function which accepts
 * thase orguments in a context.
 *
 * @param f Function to lift in context `F`.
 */
export function liftA2<F extends IsApply<F>, A, B, C> (
  f: Fun2<A, B, C>
): Fun2<Of<F, A>, Of<F, B>, Of<F, C>> {
  return (
    (fa: Of<F, A>) =>
      (fb: Of<F, B>) => fb.apply(fa.map(f))
  ) as Fun2<Of<F, A>, Of<F, B>, Of<F, C>>
}

/**
 * Sequence two effecful actions and keep result of the second one.
 *
 * @param fa Computation with discarded result.
 * @param fb Computation to keep result.
 */
export function apSecond<F extends IsApply<F>, A, B> (
  fa: Of<F, A>,
  fb: Of<F, B>
): Of<F, B> {
  return fb.apply(voidRight(id as Fun<B, B>, fa))
}

/**
 * Sequence two effecful actions and keep result of the first one.
 *
 * @param fa Computation to keep result.
 * @param fb Computation with discarded result.
 */
export function apFirst<F extends IsApply<F>, A, B> (
  fa: Of<F, A>,
  fb: Of<F, B>
): Of<F, A> {
  return fb.apply(fa.map(constant as Fun2<A, B, A>))
}
