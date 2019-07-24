import { Semigroup } from "../semigroup"
import { Void } from "../void"

export interface MEmpty<M> {
  mempty (): M
}

/**
 * Monoid is a [[Semigroup]] equipped with a `mempty` object which
 * is identity to [[Semigroup]] append operation.
 */
export interface Monoid<A> extends Semigroup<A> {
  constructor: MEmpty<A>
}

export type HasMonoid<A> = A extends Monoid<A> ? A : Void

/**
 * Bosed on condition, truncate [[Monoid]] `m` to `mempty`.
 */
export function guard<M extends Monoid<M>> (cond: boolean) {
  return (m: M) => cond ? m : m.constructor.mempty()
}
