import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"
import { Fun } from "../../data/function"

export interface Functor<F, A> {
  map <B>(this: Of<F, A>, f: Fun<A, B>): Of<F, B>
}

export interface IsFunctor<F> extends TypeFamily<Kind1> {
  (): Functor<F, this[0]>
}
