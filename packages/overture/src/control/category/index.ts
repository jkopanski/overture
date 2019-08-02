import {
  Kind2,
  Of2,
  TypeFamily
} from "tshkt"
import { Semigroupoid } from "../semigroupoid";

export interface Identity<F> {
  id<A, B> (): Of2<F, A, B>
}

/**
 * Category is a [[Semigroupoid]] with `identity` element
 * for Semigroupoid `compose` method.
 */
export interface Category<F, A, B> extends Semigroupoid<F, A, B> {
  constructor: Identity<F>
}

export interface IsCategory<F> extends TypeFamily<Kind2> {
  (): Category<F, this[0], this[1]>
}
