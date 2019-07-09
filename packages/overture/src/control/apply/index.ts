import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"
import { Functor } from "../functor"
import { Fun } from "../../data/function"

export interface Apply<F, A> extends Functor<F, A> {
  ap <B>(this: Of<F, A>, f: Of<F, Fun<A, B>>): Of<F, B>
}

export interface IsApply<F> extends TypeFamily<Kind1> {
  (): Apply<F, this[0]>
}
