import { Void } from "../void"

/**
 * Interface for types that supprot associative operation.
 */
export interface Semigroup<A> {
  append (this: A, other: A): A
}

export type HasSemigroup<A> = A extends Semigroup<A> ? A : Void

/**
 * Append a to b using [[Semigroup]] instance
 */
export function append<A extends Semigroup<A>> (a: A, b: A): A {
  return a.append(b)
}
