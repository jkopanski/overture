import { Eq } from "../eq"
import { Show } from "../show"

/**
 * Type that is a result of comparison from [[Ord]] interface.
 * Since it is usod only as marker, only single instance of its
 * subclass will ever exist.
 */
export interface Ordering
  extends Eq<Ordering>,
    Ord<Ordering>,
    Show<Ordering> {
      eq (this: Ordering, o: Ordering): boolean
      compare (this: Ordering, o: Ordering): Ordering
      toString (): string
}

class LessThan implements Ordering {
  eq (o: Ordering) {
    return o === LT
    // Since there will be single item representing
    // return o instanceof LessThan
  }

  compare (other: Ordering): Ordering {
    return other === LT ? EQ : GT
  }

  toString () {
    return "LT"
  }
}

class Equal implements Ordering {
  eq (o: Ordering) {
    return o === EQ
    // Since there will be single item representing
    // return o instanceof Equal
  }

  compare (other: Ordering): Ordering {
    return other === EQ
      ? EQ
      : other === GT
        ? LT
        : GT
  }

  toString () {
    return "EQ"
  }
}

class GreaterThan implements Ordering {
  eq (o: Ordering) {
    return o === GT
    // Since there will be single item representing
    // return o instanceof GreaterThan
  }

  compare (other: Ordering): Ordering {
    return other === GT ? EQ : GT
  }

  toString () {
    return "GT"
  }
}

export const LT: Ordering = new LessThan()
export const EQ: Ordering = new Equal()
export const GT: Ordering = new GreaterThan()

/**
 * Interface which provides a method
 * to `compare` items of type `A`.
 */
export interface Ord<A> extends Eq<A> {
  compare (this: A, other: A): Ordering
}

/**
 * Test if `a` is less than `b`.
 */
export function less<A extends Ord<A>> (a: A, b: A): boolean {
  return a.compare(b).eq(LT)
}

/**
 * Test if `a` is less or equal than `b`.
 */
export function lessEq<A extends Ord<A>> (a: A, b: A): boolean {
  const ord = a.compare(b)
  return ord.eq(LT) || ord.eq(EQ)
}

/**
 * Test if `a` is greater than `b`.
 */
export function more<A extends Ord<A>> (a: A, b: A): boolean {
  return a.compare(b).eq(GT)
}

/**
 * Test if `a` is greater or equal than `b`.
 */
export function moreEq<A extends Ord<A>> (a: A, b: A): boolean {
  const ord = a.compare(b)
  return ord.eq(GT) || ord.eq(EQ)
}

/**
 * Get bigger of two items.
 * Prefer left one in case of equality.
 */
export function max<A extends Ord<A>> (a: A, b: A): A {
  return a.compare(b).eq(LT) ? b : a
}

/**
 * Get smallor of two items.
 * Prefer left one in case of equality.
 */
export function min<A extends Ord<A>> (a: A, b: A): A {
  return b.compare(a).eq(LT) ? b : a
}

export function toOrdering (n: number): Ordering {
  return n === 0
    ? EQ
    : n < 0 ? LT : GT
}
