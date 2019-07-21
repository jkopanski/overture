import {
  Kind2,
  Of2,
  TypeFamily
} from "tshkt"

import { Fun, id } from "../function"

/**
 * Bifunctor is a class that work on *pair* of types (`L` and `R`)
 * and is a [[Functor]] for both of them.
 * Classes that extend [[Bifunctor]] need to implement `bimap`
 * and get 2 utilis: [[lmap]] and [[rmap]] for free.
 */
export interface Bifunctor<F, L, R> {
  /**
   * Transform both arguments simultaneously
   *
   * @param f Function that maps over first Bifunctor argument.
   * @param g Function that maps over second Bifunctor argument.
   */
  bimap<A, B> (
    this: Of2<F, L, R>,
    f: Fun<L, A>,
    g: Fun<R, B>
  ): Of2<F, A, B>

}

export interface IsBifunctor<F> extends TypeFamily<Kind2> {
  (): Bifunctor<F, this[0], this[1]>
}

/**
 * Map over first Bifunctor parameter,
 * leaving second one as it is.
 *
 * @param f Function that maps over first parameter.
 */
export function lmap<A, L, R, F extends IsBifunctor<F>> (
  f: Fun<L, A>,
  b: Of2<F, L, R>
): Of2<F, A, R> {
  return b.bimap(f, id as Fun<R, R>)
}

/**
 * Map over second Bifunctor parameter,
 * leaving first one as it is.
 *
 * @param f Function that maps over second parameter.
 */
export function rmap<B, L, R, F extends IsBifunctor<F>> (
  f: Fun<R, B>,
  b: Of2<F, L, R>
): Of2<F, L, B> {
  return b.bimap(id as Fun<L, L>, f)
}
