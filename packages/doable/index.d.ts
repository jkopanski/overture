import { Of } from "tshkt"
import { IsMonad } from "@famisoft/overture/control/monad"

declare function doable<F extends IsMonad<F>, A> (ma: Of<F, A>): A
