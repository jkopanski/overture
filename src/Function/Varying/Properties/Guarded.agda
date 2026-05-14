{-# OPTIONS --guardedness #-}

module Function.Varying.Properties.Guarded where

open import Level using (Level)

open import Codata.Guarded.Stream using (Stream; lookup; tabulate)
open import Codata.Guarded.Stream.Properties using (lookup-tabulate)
open import Data.Product.Base using (_,_)
open import Data.Nat.Base using (suc)
open import Function.Base using (_∘′_)
open import Function.Bundles using (Func)
open import Function.Definitions
open import Function.Varying.Instances using (Discreteₛ)
open import Relation.Binary.Bundles using (Setoid)

import Codata.Guarded.Stream.Relation.Binary.Pointwise as Pointwise
import Function.Relation.Binary.Setoid.Equality as Eq
import Function.Varying.Domain.Instances as Domain
import Function.Varying.Domain as Domain
import Relation.Binary.PropositionalEquality.Core as ≡
import Relation.Binary.Reasoning.Setoid as SetoidReasoning

open Pointwise using (Pointwise; head; tail; lookup⁺; tabulate⁺)

private
  variable
    a c ℓ : Level

module Discrete↔Stream (S : Setoid c ℓ) where
  open Setoid S renaming (Carrier to A)
  open Eq (Domain.Bundle.setoid Domain.Discrete) S renaming (_≈_ to _≗_)

  to : Discreteₛ S → Stream A
  to d = tabulate (d .Func.to)

  to-cong : Congruent _≗_ (Pointwise _≈_) to
  to-cong = tabulate⁺

  from : Stream A → Discreteₛ S
  from s = record
    { to = lookup s
    ; cong = λ { ≡.refl → Setoid.refl S }
    }

  from-cong : Congruent (Pointwise _≈_) _≗_ from
  from-cong = lookup⁺

  inverseˡ : Inverseˡ _≗_ (Pointwise _≈_) to from
  inverseˡ {x} y≗lookup[x] .head = y≗lookup[x] 0
  inverseˡ {x} {y} y≗lookup[x] .tail = inverseˡ
    {y = record { to = y .Func.to ∘′ suc; cong = λ { ≡.refl → Setoid.refl S } }}
    λ i → y≗lookup[x] (suc i)

  inverseʳ : Inverseʳ _≗_ (Pointwise _≈_) to from
  inverseʳ {x} {y} y≈tabulate[x] i = begin
    lookup y i                      ≈⟨ from-cong y≈tabulate[x] i ⟩
    lookup (tabulate (Func.to x)) i ≡⟨ lookup-tabulate i (Func.to x) ⟩
    Func.to x i                     ∎ where open SetoidReasoning S

  inverse : Inverseᵇ _≗_ (Pointwise _≈_) to from
  inverse = (λ {x} {y} → inverseˡ {x} {y})
          ,  λ {x} {y} → inverseʳ {x} {y}
