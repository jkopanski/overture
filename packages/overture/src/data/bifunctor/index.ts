import {
  Generic,
  Generic2,
  Kind2,
  TypeFamily
} from "tshkt"
import { Fun, id } from "../function"

/**
 * Bifunctor is a class that work on *pair* of types (`L` and `R`)
 * and is a [[Functor]] for both of them.
 * Classes that extend [[Bifunctor]] need to implement `bimap`
 * and get 2 utilis: [[lmap]] and [[rmap]] for free.
 */
export abstract class Bifunctor<L, R> {
  [Generic.Type]: Generic2<IsBifunctor, L, R>

  /**
   * Transform both arguments simultaneously
   *
   * @param f Function that maps over first Bifunctor argument.
   * @param g Function that maps over second Bifunctor argument.
   */
  abstract bimap <A, B>(
    f: Fun<L, A>,
    g: Fun<R, B>
  ): Bifunctor<A, B>

  /**
   * Map over first Bifunctor parameter,
   * leaving second one as it is.
   *
   * @param f Function that maps over first parameter.
   */
  lmap <A>(
    f: Fun<L, A>
  ) {
    return this.bimap(f, id as Fun<R, R>)
  }

  /**
   * Map over second Bifunctor parameter,
   * leaving first one as it is.
   *
   * @param f Function that maps over second parameter.
   */
  rmap <B>(
    this: Bifunctor<L, R>,
    f: Fun<R, B>
  ): Bifunctor<L, B> {
    return this.bimap(id as Fun<L, L>, f)
  }
}

export interface IsBifunctor extends TypeFamily<Kind2> {
  (): Bifunctor<this[0], this[1]>
}
