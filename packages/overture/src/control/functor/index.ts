import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"

export interface Functor<F, A> {
  map <B>(this: Of<F, A>, f: (a: A) => B): Of<F, B>
}

export interface IsFunctor<F> extends TypeFamily<Kind1> {
  (): Functor<F, this[0]>
}
