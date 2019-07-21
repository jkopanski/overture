import {
  Kind2,
  Of2,
  TypeFamily
} from "tshkt"

export interface Semigroupoid<F, J, K> {
  compose<I> (this: Of2<F, J, K>, f: Of2<F, I, J>): Of2<F, I, K>
}

export interface IsSemigroupoid<F> extends TypeFamily<Kind2> {
  (): Semigroupoid<F, this[0], this[1]>
}

export function compose<G extends IsSemigroupoid<G>, A, B, C> (
  g2: Of2<G, B, C>,
  g1: Of2<G, A, B>
): Of2<G, A, C>
export function compose<G extends IsSemigroupoid<G>, A, B, C, D> (
  g3: Of2<G, C, D>,
  g2: Of2<G, B, C>,
  g1: Of2<G, A, B>
): Of2<G, A, D>
export function compose<G extends IsSemigroupoid<G>, A, B> (
  g: Of2<G, A, B>,
  ...gs: Array<Of2<G, A, A>>
): Of2<G, A, B> {
  return gs.reduce((acc, f) => acc.compose(f), g)
}

export function pipe<G extends IsSemigroupoid<G>, A, B, C> (
  g1: Of2<G, A, B>,
  g2: Of2<G, B, C>
): Of2<G, A, C>
export function pipe<G extends IsSemigroupoid<G>, A, B, C, D> (
  g1: Of2<G, A, B>,
  g2: Of2<G, B, C>,
  g3: Of2<G, C, D>
): Of2<G, A, D>
export function pipe<G extends IsSemigroupoid<G>, A, B> (
  g: Of2<G, A, B>,
  ...gs: Array<Of2<G, B, B>>
): Of2<G, A, B> {
  return gs.reduce((acc, f) => f.compose(acc), g)
}
