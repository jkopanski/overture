import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"

import { Void } from "../void"

export interface Eq<A> {
  eq (this: A, a: A): boolean
}

export interface Eq1<F, A> {
  eq (this: Of<F, A>, fa: Of<F, A>): boolean
}

export type HasEq<A> = A extends Eq<A> ? A : Void

export interface IsEq<F> extends TypeFamily<Kind1> {
  (): Eq1<F, HasEq<this[0]>>
}

Number.prototype.eq = function (n: number) {
  return this.valueOf() === n
}

String.prototype.eq = function (s: string) {
  return this.valueOf() === s
}

Boolean.prototype.eq = function (b: boolean) {
  return this.valueOf() === b
}

declare global {
  interface Number {
    eq (n: number): boolean
  }

  interface String {
    eq (s: string): boolean
  }

  interface Boolean {
    eq (b: boolean): boolean
  }
}
