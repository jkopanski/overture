------------------------------------------------------------------------
-- The Agda standard library
--
-- An equational reasoning library for propositional equality over
-- recursive vectors of different indices using cast.
--
-- See README.Data.Vec.Relation.Binary.Equality.Cast for
-- documentation and examples.
------------------------------------------------------------------------

{-# OPTIONS --without-K --safe #-}

module Data.Vec.Recursive.Relation.Binary.Equality.Cast where

open import Level using (Level)
open import Function.Base using (_∘_)
open import Data.Nat.Base using (ℕ; zero; suc; 2+)
open import Data.Nat.Properties using (suc-injective)
open import Data.Product.Base using (_,_; proj₂)
open import Data.Product.Relation.Binary.Pointwise.NonDependent using (≡×≡⇒≡; ≡⇒≡×≡)
open import Data.Vec.Recursive
open import Relation.Binary.Core using (REL; _⇒_)
open import Relation.Binary.Definitions using (Sym; Trans)
open import Relation.Binary.PropositionalEquality.Core
  using (_≡_; refl; trans; sym; cong; subst)
open import Relation.Binary.PropositionalEquality.Properties
  using (module ≡-Reasoning)

private
  variable
    a : Level
    A B : Set a
    l m n o : ℕ

cast : ∀ {m n} → .(eq : m ≡ n) → A ^ m → A ^ n
cast {m = 0}     {0}     eq x        = []
cast {m = suc 0} {suc 0} eq x        = x
cast {m = 2+ _}  {2+ _}  eq (x , xs) = x , cast (suc-injective eq) xs

cast-is-id : ∀ {m} → .(eq : m ≡ m) (xs : A ^ m) → cast eq xs ≡ xs
cast-is-id {m = 0}     eq xs       = refl
cast-is-id {m = suc 0} eq xs       = refl
cast-is-id {m = 2+ _}  eq (_ , xs) = ≡×≡⇒≡ (refl , cast-is-id (suc-injective eq) xs)

cast-trans : ∀ {m n o} → .(eq₁ : m ≡ n) .(eq₂ : n ≡ o) (xs : A ^ m) →
             cast eq₂ (cast eq₁ xs) ≡ cast (trans eq₁ eq₂) xs
cast-trans {m = 0}     {0}     {0}     eq₁ eq₂ xs       = refl
cast-trans {m = suc 0} {suc 0} {suc 0} eq₁ eq₂ xs       = refl
cast-trans {m = 2+ _}  {2+ _}  {2+ _}  eq₁ eq₂ (_ , xs) = ≡×≡⇒≡
  (refl , cast-trans (suc-injective eq₁) (suc-injective eq₂) xs)

cast-sym : ∀ {m n} → .(eq : m ≡ n) {xs : A ^ m} {ys : A ^ n} →
           cast eq xs ≡ ys → cast (sym eq) ys ≡ xs
cast-sym {m = 0}     {0}     eq xs≡[eq]ys = xs≡[eq]ys
cast-sym {m = suc 0} {suc 0} eq xs≡[eq]ys = sym xs≡[eq]ys
cast-sym {m = 2+ m}  {2+ n}  eq xs≡[eq]ys =
  let (x≡y , xs≡ys) = ≡⇒≡×≡ xs≡[eq]ys
  in ≡×≡⇒≡ (sym x≡y , cast-sym (suc-injective eq) xs≡ys)

subst-is-cast : ∀ {m n} → (eq : m ≡ n) (xs : A ^ m) → subst (A ^_) eq xs ≡ cast eq xs
subst-is-cast refl xs = sym (cast-is-id refl xs)

infix 3 _≈[_]_

_≈[_]_ : ∀ {A : Set a} {n m} → A ^ n → .(eq : n ≡ m) → A ^ m → Set _
xs ≈[ eq ] ys = cast eq xs ≡ ys

------------------------------------------------------------------------
-- _≈[_]_ is ‘reflexive’, ‘symmetric’ and ‘transitive’

≈-reflexive : ∀ {n} → _≡_ ⇒ (λ xs ys → _≈[_]_ {A = A} {n} xs refl ys)
≈-reflexive {x = x} eq = trans (cast-is-id refl x) eq

≈-sym : ∀ {A : Set a} .{m≡n : m ≡ n} → Sym {A = A ^ m} _≈[ m≡n ]_ _≈[ sym m≡n ]_
≈-sym {m≡n = m≡n} {xs} {ys} xs≈ys = begin
  cast (sym m≡n) ys             ≡⟨ cong (cast (sym m≡n)) xs≈ys ⟨
  cast (sym m≡n) (cast m≡n xs)  ≡⟨ cast-trans m≡n (sym m≡n) xs ⟩
  cast (trans m≡n (sym m≡n)) xs ≡⟨ cast-is-id (trans m≡n (sym m≡n)) xs ⟩
  xs                            ∎
  where open ≡-Reasoning

≈-trans : ∀ {A : Set a} .{m≡n : m ≡ n} .{n≡o : n ≡ o} →
          Trans {A = A ^ m} _≈[ m≡n ]_ _≈[ n≡o ]_ _≈[ trans m≡n n≡o ]_
≈-trans {m≡n = m≡n} {n≡o} {xs} {ys} {zs} xs≈ys ys≈zs = begin
  cast (trans m≡n n≡o) xs ≡⟨ cast-trans m≡n n≡o xs ⟨
  cast n≡o (cast m≡n xs)  ≡⟨ cong (cast n≡o) xs≈ys ⟩
  cast n≡o ys             ≡⟨ ys≈zs ⟩
  zs                      ∎
  where open ≡-Reasoning

≈-cong′ : ∀ {A : Set a} {f-len : ℕ → ℕ} (f : ∀ {n} → A ^ n → B ^ (f-len n))
          {m n} {xs : A ^ m} {ys : A ^ n} .{eq} → xs ≈[ eq ] ys →
          f xs ≈[ cong f-len eq ] f ys
≈-cong′                 f {m = 0}     {0}              refl = cast-is-id refl (f [])
≈-cong′                 f {m = suc 0} {suc 0} {x}      refl = cast-is-id refl (f x)
≈-cong′ {f-len = f-len} f {m = 2+ m}  {2+ n}  {x , xs} refl =
  ≈-cong′ {f-len = f-len ∘ suc} (f ∘ cons _ x) refl

------------------------------------------------------------------------
-- Reasoning combinators

module CastReasoning where

  open ≡-Reasoning public
    renaming (begin_ to begin-≡_; _∎ to _≡-∎)

  begin_ : ∀ {A : Set a} .{m≡n : m ≡ n} {xs : A ^ m} {ys} → xs ≈[ m≡n ] ys → cast m≡n xs ≡ ys
  begin xs≈ys = xs≈ys

  _∎ : {A : Set a} (xs : A ^ n) → cast {A = A} refl xs ≡ xs
  _∎ xs = ≈-reflexive refl

  _≈⟨⟩_ : ∀ {A : Set a} .{m≡n : m ≡ n} (xs : A ^ m) {ys} → xs ≈[ m≡n ] ys → xs ≈[ m≡n ] ys
  xs ≈⟨⟩ xs≈ys = xs≈ys

  -- composition of _≈[_]_
  step-≈-⟩ : ∀ {A : Set a} .{m≡n : m ≡ n} .{m≡o : m ≡ o} (xs : A ^ m) {ys : A ^ n} {zs : A ^ o} →
           ys ≈[ trans (sym m≡n) m≡o ] zs → xs ≈[ m≡n ] ys → xs ≈[ m≡o ] zs
  step-≈-⟩ {m≡n = m≡n} xs ys≈zs xs≈ys = ≈-trans {m≡n = m≡n} xs≈ys ys≈zs

  step-≈-⟨ : ∀ {A : Set a} .{n≡m : n ≡ m}.{m≡o : m ≡ o} (xs : A ^ m) {ys : A ^ n} {zs : A ^ o} →
           ys ≈[ trans n≡m m≡o ] zs → ys ≈[ n≡m ] xs → xs ≈[ m≡o ] zs
  step-≈-⟨ {n≡m = n≡m} {m≡o} xs ys≈zs ys≈xs = step-≈-⟩ {m≡n = sym n≡m} xs ys≈zs (≈-sym ys≈xs)

  -- composition of the equality type on the right-hand side of _≈[_]_,
  -- or escaping to ordinary _≡_
  step-≃-⟩ : ∀ {A : Set a} .{m≡n : m ≡ n} (xs : A ^ m) {ys zs} → ys ≡ zs → xs ≈[ m≡n ] ys → xs ≈[ m≡n ] zs
  step-≃-⟩ {m≡n = m≡n} xs ys≡zs xs≈ys = ≈-trans {m≡n = m≡n} xs≈ys (≈-reflexive ys≡zs)

  step-≃-⟨ : ∀ {A : Set a} .{m≡n : m ≡ n} (xs : A ^ m) {ys zs} → ys ≡ zs → ys ≈[ sym m≡n ] xs → xs ≈[ m≡n ] zs
  step-≃-⟨ {m≡n = m≡n} xs ys≡zs ys≈xs = step-≃-⟩ {m≡n = m≡n} xs ys≡zs (≈-sym ys≈xs)

  -- composition of the equality type on the left-hand side of _≈[_]_
  step-≂-⟩ : ∀ {A : Set a} .{m≡n : m ≡ n} (xs : A ^ m) {ys zs} → ys ≈[ m≡n ] zs → xs ≡ ys → xs ≈[ m≡n ] zs
  step-≂-⟩ {m≡n = m≡n} xs ys≈zs xs≡ys = ≈-trans {m≡n = refl} (≈-reflexive xs≡ys) ys≈zs

  step-≂-⟨ : ∀ {A : Set a} .{m≡n : m ≡ n} (xs : A ^ m) {ys zs} → ys ≈[ m≡n ] zs → ys ≡ xs → xs ≈[ m≡n ] zs
  step-≂-⟨ xs ys≈zs ys≡xs = step-≂-⟩ xs ys≈zs (sym ys≡xs)

  -- `cong` after a `_≈[_]_` step that exposes the `cast` to the `cong`
  -- operation
  ≈-cong : ∀ {A : Set a} .{l≡o : l ≡ o} .{m≡n : m ≡ n} {xs : A ^ m} {ys zs} (f : A ^ o → A ^ n) →
           xs ≈[ m≡n ] f (cast l≡o ys) → ys ≈[ l≡o ] zs → xs ≈[ m≡n ] f zs
  ≈-cong f xs≈fys ys≈zs = trans xs≈fys (cong f ys≈zs)

  ------------------------------------------------------------------------
  -- convenient syntax for ‘equational’ reasoning

  infix 1 begin_
  infixr 2 step-≃-⟩ step-≃-⟨ step-≂-⟩ step-≂-⟨ step-≈-⟩ step-≈-⟨ _≈⟨⟩_ ≈-cong
  infix 3 _∎

  syntax step-≃-⟩ xs ys≡zs xs≈ys  = xs ≃⟨ xs≈ys ⟩ ys≡zs
  syntax step-≃-⟨ xs ys≡zs xs≈ys  = xs ≃⟨ xs≈ys ⟨ ys≡zs
  syntax step-≂-⟩ xs ys≈zs xs≡ys  = xs ≂⟨ xs≡ys ⟩ ys≈zs
  syntax step-≂-⟨ xs ys≈zs ys≡xs  = xs ≂⟨ ys≡xs ⟨ ys≈zs
  syntax step-≈-⟩ xs ys≈zs xs≈ys  = xs ≈⟨ xs≈ys ⟩ ys≈zs
  syntax step-≈-⟨ xs ys≈zs ys≈xs  = xs ≈⟨ ys≈xs ⟨ ys≈zs
