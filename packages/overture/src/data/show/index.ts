import { Void } from "../void"

/**
 * Interface of types that prvide nice way of
 * describing themselves.
 */
export interface Show<A> {
  toString (this: A): string
}

export type HasShow<A> = A extends Show<A> ? A : Void

/**
 * Get `string` description of parameter `a`.
 */
export function show<A extends Show<A>> (a: A) {
  return a.toString()
}
