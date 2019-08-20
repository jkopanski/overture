# Overture

> Functional porgramming prelude and libs for TypeScript

[![builds.sr.ht status](https://builds.sr.ht/~madnat/overture.svg)](https://builds.sr.ht/~madnat/overture?)

## Contents

Development happens over at [Source hut](https://git.sr.ht/~madnat/overture).
Automatically generated documentation is hosted at GitHub pages.
Right now only prelude is documented.
Check it out at: https://jkopanski.github.io/overture/overture/

### Overture

> In progress

Pretty standard functional programming prelude,
but repetition free thanks to use of [Higher-Kinded Types](https://github.com/strax/tshkt).
Additionally each interface/typeclass comes with already defined properties,
so if you can test easily your instances.
Take a look how it is done for [Maybe](https://git.sr.ht/~madnat/overture/tree/master/packages/overture/src/data/maybe/test.ts).

For detailed progress/roadmap take a look at [TODO](https://git.sr.ht/~madnat/overture/tree/master/TODO.org).

### Doable

> TODO

Do notation for monads implemented as TypeScript transformer.

### Waterworks

> In progress

Stream processor library.
Instead of working with `Stream`s this library primitive is
`Stream Processor` which can be thought of as type:
```typescript
type SP<A, B> = (a$: Stream<A>) => Stream<B>
```

### Scope

> TODO

Profunctor based optics.
