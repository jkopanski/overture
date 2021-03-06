import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"

import { Fun, Fun2, id } from "../../data/function"

import { Apply } from "../apply"

export interface Bind<F, A> extends Apply<F, A> {
  bind<B> (this: Of<F, A>, f: Fun<A, Of<F, B>>): Of<F, B>
}

/**
 * Interface used to assert that Higher Kinded Type `F`
 * is implementing [[Bind]] interface, for any type `A`.
 *
 * Use it like:
 * ```
 * function func <F extends IsBind<F>, A>(fa: Of<F, A>) {}
 * ```
 * to denote that fuction will take any `Bind`.
 */
export interface IsBind<F> extends TypeFamily<Kind1> {
  /** @ignore */
  (): Bind<F, this[0]>
}

export function join<F extends IsBind<F>, A> (
  ffa: Of<F, Of<F, A>>
): Of<F, A> {
  return ffa.bind(id as Fun<Of<F, A>, Of<F, A>>)
}

function composeK_<F extends IsBind<F>, A, B, C> (
  g: Fun<B, Of<F, C>>,
  f: Fun<A, Of<F, B>>
): Fun<A, Of<F, C>> {
  return (
    (a: A) => f(a).bind(g)
  ) as Fun<A, Of<F, C>>
}

export function composeK<F extends IsBind<F>, A, B, C> (
  g2: Fun<B, Of<F, C>>,
  g1: Fun<A, Of<F, B>>
): Fun<A, Of<F, C>>
export function composeK<F extends IsBind<F>, A, B, C, D> (
  g3: Fun<C, Of<F, D>>,
  g2: Fun<B, Of<F, C>>,
  g1: Fun<A, Of<F, B>>
): Fun<A, Of<F, C>>
export function composeK<F extends IsBind<F>, A, B, C, D, E> (
  g4: Fun<D, Of<F, E>>,
  g3: Fun<C, Of<F, D>>,
  g2: Fun<B, Of<F, C>>,
  g1: Fun<A, Of<F, B>>
): Fun<A, Of<F, C>>
export function composeK<F extends IsBind<F>, A, B> (
  g: Fun<A, Of<F, B>>,
  ...gs: Array<Fun<A, Of<F, A>>>
): Fun<A, Of<F, B>> {
  return gs.reduce(
    (acc, f) => composeK_(acc, f),
    g
  )
}

export function pipeK<F extends IsBind<F>, A, B, C> (
  g1: Fun<A, Of<F, B>>,
  g2: Fun<B, Of<F, C>>
): Fun<A, Of<F, C>>
export function pipeK<F extends IsBind<F>, A, B, C, D> (
  g1: Fun<A, Of<F, B>>,
  g2: Fun<B, Of<F, C>>,
  g3: Fun<C, Of<F, D>>
): Fun<A, Of<F, D>>
export function pipeK<F extends IsBind<F>, A, B, C, D, E> (
  g1: Fun<A, Of<F, B>>,
  g2: Fun<B, Of<F, C>>,
  g3: Fun<C, Of<F, D>>,
  g4: Fun<D, Of<F, E>>
): Fun<A, Of<F, E>>
export function pipeK<F extends IsBind<F>, A, B> (
  g: Fun<A, Of<F, B>>,
  ...gs: Array<Fun<B, Of<F, B>>>
): Fun<A, Of<F, B>> {
  return gs.reduce(
    (acc, f) => composeK_(f, acc),
    g
  )
}

/**
 * Monadic conditional check.
 *
 * @param mc Monadic action that will result in canditional flag.
 */
export function ifM<F extends IsBind<F>, A> (
  mc: Of<F, boolean>
): Fun2<Of<F, A>, Of<F, A>, Of<F, A>> {
  return (
    (ft: Of<F, A>) => (
      (ff: Of<F, A>) => (
        mc.bind((cond => cond ? ft : ff) as Fun<boolean, Of<F, A>>)
      ) as Fun<Of<F, A>, Of<F, A>>
    )
  ) as Fun2<Of<F, A>, Of<F, A>, Of<F, A>>
}
