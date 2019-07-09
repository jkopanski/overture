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
