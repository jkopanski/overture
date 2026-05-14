{-# OPTIONS --safe #-}

import Function.Varying.Domain as Domain

module Function.Varying.Base {t ℓ} (Dom : Domain.Bundle t ℓ) where

import Level as 𝕃

open import Relation.Binary.Bundles using (Setoid)
open import Function.Bundles using (Func)

open import Relation.Binary.PropositionalEquality.Core as ≡ using (_≡_)
import Relation.Binary.PropositionalEquality.Properties as ≡

private module Dom = Domain.Bundle Dom
open Dom renaming (Carrier to 𝕋)
open 𝕃 using (Level)

private
  variable
    a c ℓ′ : Level

Varyingₛ : Setoid c ℓ′ → Set (t 𝕃.⊔ ℓ 𝕃.⊔ c 𝕃.⊔ ℓ′)
Varyingₛ = Func Dom.setoid

Varying : Set a → Set (t 𝕃.⊔ a)
Varying A = 𝕋 → A

