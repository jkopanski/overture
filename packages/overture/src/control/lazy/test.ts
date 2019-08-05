import { Fun } from "../../data/function"
import { Unit } from "../../data/unit"
import { Lazy, fix } from "."

abstract class List<T>
  implements Lazy<List<T>> {
    ["constructor"]: typeof List

    static defer <A>(f: Fun<Unit, List<A>>): List<A> {
      let memoized: List<A> | undefined = undefined
      return new Proxy({} as List<A>, {
        get: function (_target: List<A>, prop: keyof List<A>) {
          if (!memoized) {
            memoized = f()
          }

          return Reflect.get(memoized, prop)
        }
      })
    }

    abstract fork<A> (f: Fork<T, A>): A
}

class Nil<T> extends List<T> {
  fork<A> (f: Fork<T, A>) {
    return f.nil()
  }
}

class Cons<T> extends List<T> {
  constructor (
    private head: T,
    private tail: List<T>
  ) {
    super()
  }

  fork <A>(f: Fork<T, A>) {
    return f.cons(this.head, this.tail)
  }
}

interface Fork<T, A> {
  nil: () => A,
  cons: (head: T, tail: List<T>) => A
}

const nil: List<unknown> = new Nil()
const cons = <T>(head: T, tail: List<T>): List<T> =>
  new Cons(head, tail)
const take = <T>(n: number, list: List<T>): Array<T> => {
  const acc: Array<T> = []
  let l = list
  for (let i = n; i > 0; i--) {
    l.fork({
      nil: () => { n = 0 },
      cons: (head, tail) => {
        acc.push(head)
        l = tail
      }
    })
  }

  return acc
}

// const naturals = fix(
//   ((l: List<number>) => l.fork({
//     nil: () => cons(0, l),
//     cons: (h, _) => cons(h + 1, l)
//   })) as Fun<List<number>, List<number>>,
//   List
// )

const nats = (start: number): List<number> => List.defer((
  _ => cons(start, nats(start + 1))
) as Fun<Unit, List<number>>)

describe("Control.Lazy", () => {
  test("Infinite lazy list example", () => {
    return expect(take(3, nats(0))).toEqual([0, 1, 2])
  })
})
