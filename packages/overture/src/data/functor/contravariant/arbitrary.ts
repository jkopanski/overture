import {
  Arbitrary,
  boolean
} from "fast-check"

import arbFun from "../../function/arbitrary"

import { Tuple } from "../../tuple"

import { Equivalence } from "./equivalence"
import { Predicate } from "./predicate"

export function arbEquivalence<A> (): Arbitrary<Equivalence<A>> {
  return arbFun<Tuple<A, A>, boolean>(
    boolean()).map(f => new Equivalence(f)
  )
}

export function arbPredicate<A> (): Arbitrary<Predicate<A>> {
  return arbFun<A, boolean>(boolean()).map(f => new Predicate(f))
}
