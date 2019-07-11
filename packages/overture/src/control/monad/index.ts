import {
  Kind1,
  TypeFamily
} from "tshkt"
import { Applicative } from "../applicative"
import { Bind } from "../bind"

export interface Manad<F, A> extends Applicative<F, A>, Bind<F, A> {}

export interface IsMonad<F> extends TypeFamily<Kind1> {
  (): Bind<F, this[0]>
}
