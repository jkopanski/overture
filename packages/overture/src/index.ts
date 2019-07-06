import {
  Of,
  TypeFamily,
  Kind1
} from "tshkt"
import { IsFunctor } from "./control/functor";
import { Identity } from "./data/identity";

export interface Functor<F, A> {
  map<B>(this: Of<F, A>, f: (a: A) => B): Of<F, B>
}

export interface IsFunctor<F> extends TypeFamily<Kind1> {
  (): Functor<F, this[0]>
}

export function asVoid<F extends IsFunctor<F>, A>(
  fa: Of<F, A>
): Of<F, void> {
  return fa.map(() => void 0 as void)
}
