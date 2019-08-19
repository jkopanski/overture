import { SP, Fork } from "./proc"

export class Nil<A, B> extends SP<A, B> {
  fork<C> (f: Fork<A, B, C>): C {
    return f.nil()
  }

  compose<C> (this: Nil<A, B>, _sp: SP<C, A>): SP<C, B> {
    return nil()
  }
}

const NIL = new Nil()

export const nil = <A, B>(): SP<A, B> => NIL as SP<A, B>
