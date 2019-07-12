import {
  Kind1,
  TypeFamily
} from "tshkt"
import { Applicative } from "../applicative"
import { Bind } from "../bind"

export interface Monad<F, A> extends Applicative<F, A>, Bind<F, A> {}

export interface IsMonad<F> extends TypeFamily<Kind1> {
  (): Monad<F, this[0]>
}
