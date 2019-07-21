import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"

import { Fun, constant } from "../function"

/**
 * Functor is an interfece which can be mapped over.
 * `map` can be used to apply function under the context `F`.
 */
export interface Functor<F, A> {
  map<B> (this: Of<F, A>, f: Fun<A, B>): Of<F, B>
}

export interface IsFunctor<F> extends TypeFamily<Kind1> {
  (): Functor<F, this[0]>
}

/**
 * Ignore computation result and use provided value instead.
 *
 * @param a Value to put instead of computation result.
 * @param fb Functor which result will be ignored.
 */
export function voidRight<F extends IsFunctor<F>, A, B> (
  a: A,
  fb: Of<F, B>
): Of<F, A> {
  return fb.map(constant(a))
}

/**
 * Ignore computation result and use provided value instead.
 *
 * @param a Value to put instead of computation result.
 * @param fb Functor which result will be ignored.
 */
export function voidLeft<F extends IsFunctor<F>, A, B> (
  fb: Of<F, B>,
  a: A
): Of<F, A> {
  return fb.map(constant(a))
}

/**
 * Apply a funtior in a context to a value in no context.
 *
 * @param f Function in context `F`.
 * @param a Pure value.
 */
export function flap<F extends IsFunctor<F>, A, B> (
  f: Of<F, Fun<A, B>>,
  a: A
): Of<F, B> {
  return f.map((g => g(a)) as Fun<Fun<A, B>, B>)
}
