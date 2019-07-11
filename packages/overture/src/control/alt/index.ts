import {
  Kind1,
  Of,
  TypeFamily
} from "tshkt"
import { Functor } from "../../data/functor"

/**
 * Alt interface provides associative binary oporation on generic type.
 * It is similar to [[Semigroup]] but unlike semigroup it works on generic
 * types like `Array<T>` and not concrete types like `string`.
 */
export interface Alt<F, A> extends Functor<F, A> {
  alt (this: Of<F, A>, fa: Of<F, A>): Of<F, A>
}

export interface IsAlt<F> extends TypeFamily<Kind1> {
  (): Alt<F, this[0]>
}
