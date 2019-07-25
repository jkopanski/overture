/**
 * This module defines a type alias for builtin string
 * as well modifies `String` prototye so it supports
 * some of the abstractions provided by this library.
 */

import { MEmpty } from "../monoid"
import { Ordering, toOrdering } from "../ord"

export type Text = string

declare global {
  interface String {
    constructor: MEmpty<string>

    eq (s: string): boolean
    append (s: string): string
    compare (s: string): Ordering
  }
}

String.prototype.eq = function (s: string) {
  return this.valueOf() === s
}

String.prototype.append = function (s: string) {
  return this.valueOf() + s
}

String.prototype.compare = function (s: string) {
  return toOrdering(this.localeCompare(
    s
  ))
}

String.prototype.constructor.mempty = () => ""
