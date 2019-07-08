import {
  Kind2,
  Generic2,
  TypeFamily
} from "tshkt"

interface Fun extends TypeFamily<Kind2> {
  <A extends this[0], B extends this[1]>(): [A, B]
}

Function.prototype["compose"] = function <A, B, C>(
  this: (b: B) => C,
  f: (a: A) => B
): (a: A) => C {
  return (a: A) => this.call(this, f(a))
}

declare global {
  interface Function {
    compose: <A, B, C>(
      this: (b: B) => C,
      f: (a: A) => B
    ) => (a: A) => C;
  }
}
