import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"
import { Apply } from "../apply"

export interface Pure<F> {
  pure <A>(a: A): Of<F, A>
}

export interface Applicative<F, A> extends Apply<F, A> {
  constructor: Pure<F>
}

export interface IsApplicative<F> extends TypeFamily<Kind1> {
  (): Applicative<F, this[0]>
}

export function when (cond: boolean) {
  return <F extends IsApplicative<F>>(f: Of<F, void>) =>
    cond ? f : f.constructor.pure(undefined)
}

export function unless (cond: boolean) {
  return when(!cond)
}
