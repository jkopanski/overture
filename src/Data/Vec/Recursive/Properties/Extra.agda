{-# OPTIONS --without-K --safe #-}

module Data.Vec.Recursive.Properties.Extra where

open import Level using (Level)
open import Data.Nat.Base hiding (_^_)
open import Data.Nat.Properties using (+-assoc; +-identityʳ)
open import Data.Product.Base
open import Data.Product.Relation.Binary.Pointwise.NonDependent using (≡×≡⇒≡; ≡⇒≡×≡)
open import Data.Vec.Recursive
open import Data.Vec.Recursive.Properties
import Data.Vec.Recursive.Relation.Binary.Pointwise as Pointwise
open import Data.Vec.Recursive.Relation.Binary.Equality.Cast
  using (cast; cast-is-id; _≈[_]_; ≈-sym; ≈-cong′; module CastReasoning)
open import Function.Bundles using (_↔_; mk↔ₛ′)
open import Relation.Binary.PropositionalEquality.Core
  using (_≡_; refl; cong; cong₂)
open import Relation.Binary.PropositionalEquality.Properties
  using (module ≡-Reasoning)
open Pointwise using (Pointwise-≡⇒≡; ≡⇒Pointwise-≡)

private
  variable
    a : Level
    A : Set a

cons-injectiveˡ : ∀ m {x : A} {xs : A ^ m} {y : A} {ys : A ^ m} → cons m x xs ≡ cons m y ys → x ≡ y
cons-injectiveˡ zero    eq   = eq
cons-injectiveˡ (suc 0) refl = refl
cons-injectiveˡ (2+ m)  refl = refl

cons-injectiveʳ : ∀ m {x : A} {xs : A ^ m} {y : A} {ys : A ^ m} → cons m x xs ≡ cons m y ys → xs ≡ ys
cons-injectiveʳ zero    _    = refl
cons-injectiveʳ (suc 0) refl = refl
cons-injectiveʳ (2+ m)  refl = refl

cons-injective  : ∀ m {x : A} {xs : A ^ m} {y : A} {ys : A ^ m} → cons m x xs ≡ cons m y ys → x ≡ y × xs ≡ ys
cons-injective m eq = cons-injectiveˡ m eq , cons-injectiveʳ m eq

------------------------------------------------------------------------
-- append

append-injectiveˡ : ∀ m n (ws xs : A ^ m) {ys zs : A ^ n} → append m n ws ys ≡ append m n xs zs → ws ≡ xs
append-injectiveˡ zero    _ _        _        _  = refl
append-injectiveˡ (suc 0) n _        _        eq = cons-injectiveˡ n eq
append-injectiveˡ (2+ m)  n (w , ws) (x , xs) eq =
  let (w≡x , ws++ys≡xs++zs) = ≡⇒≡×≡ eq
  in ≡×≡⇒≡ (w≡x , append-injectiveˡ (suc m) n ws xs ws++ys≡xs++zs)

append-injectiveʳ : ∀ m n (ws xs : A ^ m) {ys zs : A ^ n} → append m n ws ys ≡ append m n xs zs → ys ≡ zs
append-injectiveʳ zero    _ _        _        eq = eq
append-injectiveʳ (suc 0) n _        _        eq = cons-injectiveʳ n eq
append-injectiveʳ (2+ m)  n (w , ws) (x , xs) eq =
  let (_ , ws++ys≡xs++zs) = ≡⇒≡×≡ eq
  in append-injectiveʳ (suc m) n ws xs ws++ys≡xs++zs

append-injective  : ∀ m n (ws xs : A ^ m) {ys zs : A ^ n} →
                append m n ws ys ≡ append m n xs zs → ws ≡ xs × ys ≡ zs
append-injective m n ws xs eq = append-injectiveˡ m n ws xs eq , append-injectiveʳ m n ws xs eq

append-identityʳ-eqFree : ∀ n (xs : A ^ n) → cast (+-identityʳ n) (append n 0 xs []) ≡ xs
append-identityʳ-eqFree zero    _ = refl
append-identityʳ-eqFree (suc 0) _ = refl
append-identityʳ-eqFree (2+ n)  (x , xs) = ≡×≡⇒≡ (refl , append-identityʳ-eqFree (suc n) xs)

cast-appendˡ : ∀ {m} n {o} .(eq : m ≡ o) (xs : A ^ m) {ys : A ^ n} →
               cast (cong (_+ n) eq) (append m n xs ys) ≡ append o n (cast eq xs) ys
cast-appendˡ n eq _ {ys} = ≈-cong′ {f-len = _+ n} (λ {n′} as → append n′ n as ys) {eq = eq} refl

cast-appendʳ : ∀ m {n o} .(eq : n ≡ o) (xs : A ^ m) {ys : A ^ n} →
               cast (cong (m +_) eq) (append m n xs ys) ≡ append m o xs (cast eq ys)
cast-appendʳ m eq xs = ≈-cong′ {f-len = m +_} (λ {n′} as → append m n′ xs as) refl

append-assoc-eqFree :
  ∀ m n o (xs : A ^ m) (ys : A ^ n) (zs : A ^ o) → let eq = +-assoc m n o in
  cast eq (append (m + n) o (append m n xs ys) zs) ≡ append m (n + o) xs (append n o ys zs)
append-assoc-eqFree zero    n o [] ys zs = cast-is-id refl (append 0 (n + o) [] (append n o ys zs))
append-assoc-eqFree (suc 0) n o x  ys zs = begin-≡
  -- append (1 + n) o (append 1 n x ys) zs
  --   ≈⟨ append-cons n o x ys zs ⟩
  -- append 1 (n + o) x (append n o ys zs)
  --   ∎
  cast (+-assoc 1 n o) (append (1 + n) o (append 1 n x ys) zs)
    ≡⟨ cast-is-id refl (append (1 + n) o (append 1 n x ys) zs) ⟩
  append (1 + n) o (cons n x ys) zs
    ≡⟨ append-cons n o x ys zs ⟩
  cons (n + o) x (append n o ys zs)
    ≡-∎
  where open CastReasoning
append-assoc-eqFree (2+ m) n o (_ , xs) ys zs = ≡×≡⇒≡ (refl , append-assoc-eqFree (suc m) n o xs ys zs)

splitAt-append-identity :
  ∀ m n (as : A ^ m) (bs : A ^ n) →
  splitAt m n (append m n as bs) ≡ (as , bs)
splitAt-append-identity 0       n [] bs = refl
splitAt-append-identity (suc 0) n a  bs = ≡×≡⇒≡
  ( head-cons-identity n a bs
  , tail-cons-identity n a bs
  )
splitAt-append-identity (2+ m)  n (a , as) bs =
  let (x , y) = ≡⇒≡×≡ (splitAt-append-identity (suc m) n as bs)
  in ≡×≡⇒≡ (≡×≡⇒≡ (refl , x) , y)
