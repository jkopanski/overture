import {
  Kind2,
  Of2,
  TypeFamily
} from "tshkt"

import { Fun } from "../function"

/**
 * Profunctor is a Bifunctor that is contravariant in the
 * first argument and covariant in the second one.
 */
export interface Profunctor<F, B, C> {
  /**
   * Contramap `f` over first argument and
   * map `g` over second one.
   */
  dimap<A, D> (
    this: Of2<F, B, C>,
    f: Fun<A, B>,
    g: Fun<C, D>
  ): Of2<F, A, D>
}

export interface IsProfunctor<F> extends TypeFamily<Kind2> {
  (): Profunctor<F, this[0], this[1]>
}

/**
 * Contramap function over first argument.
 */
export function lcmap<P extends IsProfunctor<P>, A, B, C> (
  f: Fun<A, B>,
  p: Of2<P, B, C>
): Of2<P, A, C> {
  return p.dimap(f, (x => x) as Fun<C, C>)
}

/**
 * Map function over second argument.
 */
export function rmap<P extends IsProfunctor<P>, A, B, C> (
  g: Fun<B, C>,
  p: Of2<P, A, B>
): Of2<P, A, C> {
  return p.dimap((x => x) as Fun<A, A>, g)
}
