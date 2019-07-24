import { Of } from "tshkt"
import { IsMonad } from "@famisoft/overture/dist/control/monad"

declare function monadic<F extends IsMonad<F>> (): Of<F, string>
  declare function ret<F extends IsMonad<F>> (n: number): Of<F, number>

export async function ex01<F extends IsMonad<F>> (
) {
  await monadic
  return ret(2)
}
