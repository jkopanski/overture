module Overture where

module 𝕃 where
  open import Level renaming (Level to t) public

module 𝟘 where
  open import Data.Empty.Polymorphic renaming (⊥ to t) public

module 𝟘* where
  open import Data.Empty renaming (⊥ to t) public

module 𝟙 where
  open import Data.Unit.Polymorphic renaming (⊤ to t; tt to tt-lift) public
  open import Data.Unit renaming (tt to tt*)
  pattern tt = 𝕃.lift tt*
  open import Data.Unit.Polymorphic.Properties public

module 𝟙* where
  open import Data.Unit renaming (⊤ to t) public

module Rel₀ where
  open import Relation.Nullary public
  open import Relation.Nullary.Decidable public

module Rel₁ where
  open import Relation.Unary hiding (∅; U) public
  open import Relation.Unary.Polymorphic public

module Rel₂ where
  open import Relation.Binary public
  open import Relation.Binary.PropositionalEquality public
  open import Relation.Binary.PropositionalEquality.Properties public

open Rel₀ using (¬_; ¬?) public
open Rel₁ using (Universal; IUniversal) public
open Rel₂ using (_≡_; _≢_; Rel; cong; refl; trans; sym) public

module 𝟚 where open import Data.Bool renaming (Bool to t) public

module × where
  open import Data.Product            public
  open import Data.Product.Properties public

module ⊎ where
  open import Data.Sum            public
  open import Data.Sum.Properties public

module ℕ where
  open import Data.Nat renaming (ℕ to t) public
  open import Data.Nat.Properties        public
  open import Data.Nat.Divisibility      public
  open import Data.Nat.DivMod            public
  open import Data.Nat.Literals          public
  open import Data.Nat.Show              public
  open import Data.Irrelevant
  open ≤-Reasoning

  m⊔n∸m⊓n≡∣m-n∣ : ∀ m n → m ⊔ n ∸ m ⊓ n ≡ ∣ m - n ∣
  m⊔n∸m⊓n≡∣m-n∣ m n = sym (∣m-n∣≡m⊔n∸m⊓n m n)

  m⊔n∸∣m-n∣≡m⊓n : ∀ m n → m ⊔ n ∸ ∣ m - n ∣ ≡ m ⊓ n
  m⊔n∸∣m-n∣≡m⊓n m n = begin-equality
    m ⊔ n ∸ ∣ m - n ∣       ≡⟨ cong (m ⊔ n ∸_) (∣m-n∣≡m⊔n∸m⊓n m n) ⟩
    m ⊔ n ∸ (m ⊔ n ∸ m ⊓ n) ≡⟨ m∸[m∸n]≡n (m⊓n≤m⊔n m n) ⟩
    m ⊓ n                   ∎

  ∣m-n∣+m⊓n≡m⊔n : ∀ m n → ∣ m - n ∣ + m ⊓ n ≡ m ⊔ n
  ∣m-n∣+m⊓n≡m⊔n m n = begin-equality
    ∣ m - n ∣ + m ⊓ n     ≡⟨ cong (_+ m ⊓ n) (∣m-n∣≡m⊔n∸m⊓n m n) ⟩
    m ⊔ n ∸ m ⊓ n + m ⊓ n ≡⟨ m∸n+n≡m (m⊓n≤m⊔n m n) ⟩
    m ⊔ n                 ∎

  m⊔n≡n∸m+m : ∀ m n → m ⊔ n ≡ n ∸ m + m
  m⊔n≡n∸m+m m n = trans (⊔-comm m n) (m⊔n≡m∸n+n n m)

module Fin where
  open import Data.Fin renaming (Fin to t)               public
  open import Data.Fin.Properties renaming (1↔⊤ to 1↔⊤*) public
  open import Data.Fin.Patterns
  open import Function                       using (_↔_; mk↔ₛ′)
  open import Function.Construct.Composition using (_↔-∘_)
  open import Function.Construct.Symmetry    using (↔-sym)
  1↔⊤ : ∀ {ℓ} → t 1 ↔ 𝟙.t {ℓ}
  1↔⊤ = ↔-sym 𝟙.⊤↔⊤* ↔-∘ 1↔⊤*

module ℤ where
  open import Data.Integer renaming (ℤ to t) public
  open import Data.Integer.Properties        public

module Char where
  open import Data.Char renaming (Char to t) public
  open import Data.Char.Properties           public

module String where
  open import Data.String renaming (String to t) public
  open import Data.String.Properties public
  open import Data.String.Literals public

module Maybe where
  open import Data.Maybe renaming (Maybe to t) public

module List where
  open import Data.List renaming (List to t) public
  open import Data.List.Properties           public
  module Fresh where
    open import Data.List.Fresh renaming (List# to t) public

module NonEmpty where
  open import Data.List.NonEmpty renaming (List⁺ to t) public
  open import Data.List.NonEmpty.Properties            public

module Vec where
  open import Data.Vec renaming (Vec to t) public

module Function where
  open import Function public

open × using (Σ; ∃; ∃-syntax; _,_; proj₁; proj₂) public
open ⊎ using (_⊎_; inj₁; inj₂) public
open Function using (_$_; _on_; case_of_; case_returning_of_) public

module Setoid where
  open import Relation.Binary.Bundles using () renaming (Setoid to t) public
  import Relation.Binary.Reasoning.Setoid as SetoidR
  module Reasoning {s₁ s₂} (S : t s₁ s₂) = SetoidR S

  lift : ∀ {c ℓ} (o r : 𝕃.t) → t c ℓ → t (o 𝕃.⊔ c) (r 𝕃.⊔ ℓ)
  lift o r S = record
    { Carrier = 𝕃.Lift o Carrier
    ; _≈_ = λ where
      (𝕃.lift x) (𝕃.lift y) → 𝕃.Lift r (x ≈ y)
    ; isEquivalence = record
      { refl = 𝕃.lift (Rel₂.IsEquivalence.refl (t.isEquivalence S))
      ; sym = λ where
        (𝕃.lift eq) → 𝕃.lift (Rel₂.IsEquivalence.sym (t.isEquivalence S) eq)
      ; trans = λ where
        (𝕃.lift eq) (𝕃.lift eq′) → 𝕃.lift (Rel₂.IsEquivalence.trans (t.isEquivalence S) eq eq′)
      }
    } where open t S

module Func where
  open import Function.Bundles renaming (Func to t) public
  open import Function.Relation.Binary.Setoid.Equality public

open Func using (_⟨$⟩_; _⟶ₛ_; _⇨_) public

module Varying where
  open import Function.Varying.Base renaming (Varying to t; Varyingₛ to tₛ) public
  import Function.Varying.Domain as Dom renaming (Bundle to t)
  module Domain = Dom
