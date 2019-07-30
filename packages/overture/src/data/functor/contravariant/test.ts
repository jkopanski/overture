import {
  assert,
  integer,
  property,
  string
} from "fast-check"
import { Fun } from "../../function"
import { Tuple, tuple } from "../../tuple"

import contravariant from "./laws"
import semigroup from "../../semigroup/laws"
// import monoid from "../../monoid/laws"

import { append } from "../../semigroup"
import { Predicate } from "./predicate"

import {
  arbEquivalence,
  arbPredicate
} from "./arbitrary"
import arbFun from "../../function/arbitrary"
import { Equivalence } from "./equivalence";

import "../../eq"

const eqPred = <A>(a: A) => new Equivalence<Predicate<A>>((
  t => t.fst.get()(a) === t.snd.get()(a)
) as Fun<Tuple<Predicate<A>, Predicate<A>>, boolean>)

describe("Data.Functor.Contravariant", () => {
  // predefined laws are using equivalence so lets paste
  // it in here so we can test it without relying on it
  describe("Equivalence", () => {
    describe("Covariant laws", () => {
      test("identity", () => {
        assert(
          property(
            arbEquivalence<string>(), string(), string(),
            (fa, a, b) => {
              const arg = tuple(a, b)
              const x = fa.cmap(
                (x => x) as Fun<string, string>
              ).get()(arg)
              const y = fa.get()(arg)

              return expect(
                x.eq(y)
              ).toBe(true)
            }
          )
        )
      })

      test("composition", () => {
        const arbF = arbFun<string, string>(string())
        assert(
          property(
            arbEquivalence<string>(), arbF, arbF, string(),
            (fa, f, g, a) => {
              const arg = tuple(a, a)
              const x = fa.cmap(g.compose(f)).get()(arg)
              const y = fa.cmap(g).cmap(f).get()(arg)

              return expect(
                x.eq(y)
              ).toBe(true)
            }
          )
        )
      })
    })

    describe("Semigroup laws", () => {
      test("associativity", () => {
        assert(
          property(
            arbEquivalence<number>(),
            arbEquivalence<number>(),
            arbEquivalence<number>(),
            integer(),
            (x, y, z, i) => {
              const arg = tuple(i, i)
              const a = append(append(x, y), z).get()
              const b = append(x, append(y, z)).get()
              expect(
                a(arg).eq(b(arg))
              ).toBe(true)
            }
          )
        )
      })
    })

    describe("Monoid laws", () => {
      test("left identity", () => {
        assert(
          property(
            arbEquivalence<string>(), string(), (x, s) => {
              const a = Equivalence.mempty<string>().append(x).get()
              const b = x.get()
              const arg = tuple(s, s)
              return expect(
                a(arg).eq(b(arg))
              ).toBe(true)
            }
          )
        )
      })

      test("right identity", () => {
        assert(
          property(
            arbEquivalence<string>(), string(), (x, s) => {
              const a = x.append(Equivalence.mempty<string>()).get()
              const b = x.get()
              const arg = tuple(s, s)

              return expect(
                a(arg).eq(b(arg))
              ).toBe(true)
            }
          )
        )
      })
    })
  })

  describe("Predicate", () => {
    contravariant(
      arbPredicate(),
      string(),
      eqPred
    )
  })
})
