export interface Function<A, B> {
  (a: A): B
}

/**
 * Identity function.
 */
const id: F<A, A> = <A>(a: A): A => a

/**
 * Constant function which evaluates to `x` for all inputs.
 */
export function constant <A>(x: A) {
  return function <B>(_: B): A {
    return x
  }
}

/**
 * Left to right function composition.
 * @param f Function to apply first.
 * @param g Function to apply to the result of first application.
 */
export function pipe <A, B, C>(
  f: Function<A, B>,
  g: Function<B, C>
): Function<A, C>;

/**
 * Right to left function composition.
 * @param f Function to apply first.
 * @param g Function to apply to the result of first application.
 */
export function compose <A, B, C>(
  g: Function<B, C>,
  f: Function<A, B>
): Function<A, C>;
