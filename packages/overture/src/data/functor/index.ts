import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"
import { Fun, constant } from "../function"

export interface Functor<F, A> {
  map <B>(this: Of<F, A>, f: Fun<A, B>): Of<F, B>
}

export interface IsFunctor<F> extends TypeFamily<Kind1> {
  (): Functor<F, this[0]>
}

/**
 * Replace all locations in the input with the same value.
 *
 * @param a Value to put in functor.
 * @param fb Funcotr to replace values within.
 */
export function fconst <F extends IsFunctor<F>, A, B>(
  a: A,
  fb: Of<F, B>
): Of<F, A> {
  return fb.map(constant(a))
}
