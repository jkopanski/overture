import {
  Generic,
  Generic1,
  Kind1,
  TypeFamily
} from "tshkt"
import { Fun } from "../../data/function"
import { Functor } from "../../control/functor"
import { Apply } from "../../control/apply"

export class Identity<A>
  implements Functor<IdentityF, A>, Apply<IdentityF, A> {
    [Generic.Type]!: Generic1<IdentityF, A>
    constructor (private value: A) {}

    map <B>(f: Fun<A, B>): Identity<B> {
      return new Identity(f(this.value))
    }

    ap <B>(ff: Identity<Fun<A, B>>): Identity<B> {
      return new Identity(ff.value(this.value))
    }
}

interface IdentityF extends TypeFamily<Kind1> {
  (): Identity<this[0]>
}
