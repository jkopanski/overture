import {
  Arbitrary,
  boolean
} from "fast-check"

import arbFun from "../../function/arbitrary"

import { Predicate } from "./instances"

export function arbPredicate<A> (): Arbitrary<Predicate<A>> {
  return arbFun<A, boolean>(boolean()).map(f => new Predicate(f))
}
