{-# OPTIONS --safe #-}

module Function.Varying.Domain.Instances where

open import Level using (0ℓ)

import Data.Nat as ℕ
import Data.Nat.Properties as ℕₚ
import Function.Varying.Domain as Domain
import Relation.Binary.PropositionalEquality as ≡
open import Relation.Binary.PropositionalEquality.Core using (_≡_)
open ℕ using (ℕ)

Discrete : Domain.Bundle 0ℓ 0ℓ
Discrete = record
  { Carrier = ℕ
  ; signature = record
    { _≈_ = _≡_
    ; _<_ = ℕ._<_
    ; _+_ = ℕ._+_
    ; 0# = ℕ.zero
    }
  ; structure = record
    { isEquivalence = ≡.isEquivalence
    ; isStrictTotalOrder = ℕₚ.<-isStrictTotalOrder
    ; isCommutativeMonoid = ℕₚ.+-0-isCommutativeMonoid
    }
  }
