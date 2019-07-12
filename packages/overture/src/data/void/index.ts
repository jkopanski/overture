/**
 * Type with no inhabitants.
 * Alios to TypeScript `never`.
 */
export type Void = never

/**
 * Impossible function, because you cannot acquire data of type [[Void]].
 * This is useful to cover some branches that are impossible
 * due to being marked as [[Void]].
 */
export function absurd <A>(_v: Void): A {
  throw new Error("Impossible happend!")
}
