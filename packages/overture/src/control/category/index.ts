import {
  Kind2,
  TypeFamily
} from "tshkt"
import { Semigroupoid } from "../semigroupoid";

export interface Identity<F> {
  id<A, B> (): Category<F, A, B>
}

/**
 * Category is a [[Semigroupoid]] with `identity` element
 * for Semigroupoid `compose` method.
 */
export interface Category<F, A, B> extends Semigroupoid<F, A, B> {
  constructor: Identity<F>
}

export interface IsCategory<F> extends TypeFamily<Kind2> {
  (): Category<F, this[0], this[1]>
}
