import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"

import { Apply } from "../apply"

import { Unit, unit } from "../../data/unit"

export interface Pure<F> {
  pure<A> (a: A): Of<F, A>
}

/**
 * Applicative interface extends on [[Apply]] by providing
 * a static method `pure` that can lift value of type `A`
 * into context `F` (essentialy making `F<A>`).
 */
export interface Applicative<F, A> extends Apply<F, A> {
  constructor: Pure<F>
}

/**
 * Interface used to assert that type `F` is
 * implementing [[Applicative]] interface.
 *
 * Use it like:
 * ```
 * function func <F extends IsApplicative<F>, A>(fa: Of<F, A>) {}
 * ```
 * to denote that fuction will take any `Applicative`.
 */
export interface IsApplicative<F> extends TypeFamily<Kind1> {
  /** @ignore */
  (): Applicative<F, this[0]>
}

/**
 * If `cond` holds run provided computation `f`.
 */
export function when (cond: boolean) {
  return <F extends IsApplicative<F>>(f: Of<F, Unit>) =>
    cond ? f : f.constructor.pure(unit)
}

/**
 * [[when]] with negated condition.
 */
export function unless (cond: boolean) {
  return when(!cond)
}
