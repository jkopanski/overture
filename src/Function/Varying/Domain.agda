{-# OPTIONS --safe #-}

module Function.Varying.Domain where

open import Algebra.Core using (Op₂)
open import Algebra.Structures using (IsCommutativeMonoid)
open import Algebra.Bundles using (CommutativeMonoid)
open import Level using (_⊔_; suc)
open import Relation.Binary using (Rel)
open import Relation.Binary.Structures using (IsEquivalence; IsStrictTotalOrder; IsTotalOrder)
open import Relation.Binary.Bundles using (Setoid; StrictTotalOrder; TotalOrder)

import Algebra.Construct.NaturalChoice.Max as Max
import Algebra.Construct.NaturalChoice.Min as Min
import Relation.Binary.Construct.StrictToNonStrict as StrictToNonStrict

record Signature {t} (𝕋 : Set t) ℓ : Set (t ⊔ suc ℓ) where
  field
    _≈_ : Rel 𝕋 ℓ
    _<_ : Rel 𝕋 ℓ
    _+_ : Op₂ 𝕋
    0#  : 𝕋

  _≤_ : Rel 𝕋 ℓ
  _≤_ = StrictToNonStrict._≤_ _≈_ _<_

record Structure {t ℓ} {𝕋 : Set t} (s : Signature 𝕋 ℓ) : Set (t ⊔ ℓ) where
  open Signature s
  field
    isEquivalence : IsEquivalence _≈_
    isStrictTotalOrder : IsStrictTotalOrder _≈_ _<_
    isCommutativeMonoid : IsCommutativeMonoid _≈_ _+_ 0#

  isTotalOrder : IsTotalOrder _≈_ (StrictToNonStrict._≤_ _≈_ _<_)
  isTotalOrder = StrictToNonStrict.isTotalOrder _≈_ _<_ isStrictTotalOrder

record Bundle c ℓ : Set (suc (c ⊔ ℓ)) where
  field
    Carrier : Set c
    signature : Signature Carrier ℓ
    structure : Structure signature

  open Signature signature public
  open Structure structure public

  setoid : Setoid c ℓ
  setoid = record { isEquivalence = isEquivalence }

  commutativeMonoid : CommutativeMonoid c ℓ
  commutativeMonoid = record { isCommutativeMonoid = isCommutativeMonoid }

  strictTotalOrder : StrictTotalOrder c ℓ ℓ
  strictTotalOrder = record { isStrictTotalOrder = isStrictTotalOrder }

  totalOrder : TotalOrder c ℓ ℓ
  totalOrder = record { isTotalOrder = isTotalOrder }

  open Min totalOrder public
  open Max totalOrder public
