import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"
import { Alt } from "../alt"

export interface Empty<F> {
  empty <A>(): Of<F, A>
}

/**
 * Plus interface extends [[Alt]] with `empty` element,
 * which is left and right identity of `alt` operation.
 */
export interface Plus<F, A> extends Alt<F, A> {
  constructor: Empty<F>
}

export interface IsPlus<F> extends TypeFamily<Kind1> {
  (): Plus<F, this[0]>
}
