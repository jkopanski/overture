import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"
import { Functor, fconst } from "../../data/functor"
import { Fun, Fun2, constant, id } from "../../data/function"

export interface Apply<F, A> extends Functor<F, A> {
  ap <B>(this: Of<F, A>, f: Of<F, Fun<A, B>>): Of<F, B>
}

export interface IsApply<F> extends TypeFamily<Kind1> {
  (): Apply<F, this[0]>
}

export function liftA <F extends IsApply<F>, A, B>(
  f: Fun<A, B>
): Fun<Of<F, A>, Of<F, B>> {
  return (
    (fa: Of<F, A>) =>
      fa.map(f)
  ) as Fun<Of<F, A>, Of<F, B>>
}

export function liftA2 <F extends IsApply<F>, A, B, C>(
  f: Fun2<A, B, C>
): Fun2<Of<F, A>, Of<F, B>, Of<F, C>> {
  return (
    (fa: Of<F, A>) =>
      (fb: Of<F, B>) => fb.ap(fa.map(f))
  ) as Fun2<Of<F, A>, Of<F, B>, Of<F, C>>
}

/**
 * Sequence two effecful actions and keep result of the second one.
 *
 * @param fa Computation with discarded result.
 * @param fb Computation to keep result.
 */
export function apSecond <F extends IsApply<F>, A, B>(
  fa: Of<F, A>,
  fb: Of<F, B>
): Of<F, B> {
  return fb.ap(fconst(id as Fun<B, B>, fb))
}

/**
 * Sequence two effecful actions and keep result of the first one.
 *
 * @param fa Computation to keep result.
 * @param fb Computation with discarded result.
 */
export function apFirst <F extends IsApply<F>, A, B>(
  fa: Of<F, A>,
  fb: Of<F, B>
): Of<F, A> {
  return fb.ap(fa.map(constant as Fun2<A, B, A>))
}
