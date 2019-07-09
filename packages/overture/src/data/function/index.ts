/**
 * This module defines shortcut function type as HKT.
 * Here we also define several instances for functions.
 * Due to the fact that standard Typescript [[Function]]
 * isn't parametrized by argument and return type,
 * we'll have to cast standard functions as [[Fun]]
 * for type inference to work properly.
 *
 * This module has to imported with side-effects as I am
 * modyfing `Function.prototype`.
 */
import {
  Kind2,
  Generic,
  Generic2,
  TypeFamily
} from "tshkt"

export interface Fun<A, B> extends Function {
  [Generic.Type]: Generic2<FunF, A, B>
  (a: A): B
}

interface FunF extends TypeFamily<Kind2> {
  (): Fun<this[0], this[1]>
}

export const id = <A>(a: A) => a

export function fun <A, B>(g: (a: A) => B): Fun<A, B> {
  return g as Fun<A, B>
}

export type Fun2<A, B, C> = Fun<A, Fun<B, C>>
export type Fun3<A, B, C, D> = Fun<A, Fun<B, Fun<C, D>>>

declare global {
  interface Function {
    compose: <A, B, C>(
      this: Fun<B, C>,
      f: Fun<A, B>
    ) => Fun<A, C>;
  }
}

Function.prototype["compose"] = function <A, B, C>(
  this: Fun<B, C>,
  f: Fun<A, B>
): Fun<A, C> {
  return ((a: A) => this.call(this, f(a))) as Fun<A, C>
}
