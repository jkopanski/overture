module Function.Varying.Instances where

open import Level using (Level; _⊔_)
open import Function.Bundles using (Func)
open import Function.Varying.Base using (Varying; Varyingₛ)
open import Relation.Binary.Bundles using (Setoid)
import Relation.Binary.PropositionalEquality.Properties as ≡
import Function.Varying.Domain.Instances as Domain

open import Data.Nat using (ℕ)

private
  variable
    a c ℓ : Level

Discreteₛ : Setoid c ℓ → Set (c ⊔ ℓ)
Discreteₛ = Varyingₛ Domain.Discrete

Discrete : Set a → Set a
Discrete A = Varying Domain.Discrete A
