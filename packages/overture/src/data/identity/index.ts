import {
  Generic,
  Generic1,
  HasGeneric,
  Kind1,
  TypeFamily
} from "tshkt"
import { Functor } from "../../control/functor"

export class Identity<A> implements Functor<IdentityF, A> {
  [Generic.Type]!: Generic1<IdentityF, A>
  constructor (private value: A) {}

  map <B>(f: (a: A) => B): Identity<B> {
    return new Identity(f(this.value))
  }
}

interface IdentityF extends TypeFamily<Kind1> {
  (): Identity<this[0]>
}
