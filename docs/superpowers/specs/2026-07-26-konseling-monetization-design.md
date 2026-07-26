# Konseling.org — Monetization Design Spec
**Date:** 2026-07-26  
**Status:** Proposed — recommended target design, not yet implemented  
**Scope:** freemium model, premium tier, and first monetization path for the Konseling.org app

---

## 1. Executive recommendation

**Do not monetize the core companion chat first.**

The recommended sequence is:

1. keep the core AI companion free and safety-first
2. monetize via psychologist bookings / referrals first
3. add a light premium tier later for continuity and reflection features

This preserves trust, keeps crisis help free, and avoids paywalling support in a mental-health context.

---

## 2. Product principle

Konseling.org is a **supportive AI companion**, not a medical service and not a psychologist replacement.

That means the monetization model must obey one hard rule:

> **Never put crisis support, crisis detection, or core emotional support behind a paywall.**

The product may charge for *depth* and *convenience*, but not for *help in the moment*.

---

## 3. Recommended business sequence

### Phase 1 — prove trust and retention
- Ship the free companion fully usable without payment.
- Let users chat anonymously by default.
- Measure whether they return, how often they use the app, and whether they opt into saving history.

### Phase 2 — monetize mission-aligned handoff
- Add psychologist directory / booking flows.
- Take a referral fee or booking commission when users book a professional.
- This monetizes successful escalation to care, not user distress.

### Phase 3 — add premium subscription
- Introduce a light premium tier for users who want continuity and reflection features.
- Keep the free tier genuinely useful.
- Make premium about *depth*, not access to basic support.

---

## 4. Tier design

### Free tier
The free tier should stay usable, anonymous, and helpful.

Included:
- anonymous companion chat
- crisis detection and escalation
- hotline / crisis resources
- mood check-in
- short-lived or session-local history
- basic reflective replies

Not gated:
- starting a conversation
- being heard in distress
- crisis takeover / hotline path
- referral to a psychologist when risk appears

### Premium tier
Premium should unlock continuity, not emergency access.

Included:
- cross-device sync
- longer conversation memory
- mood trends and weekly/monthly insights
- guided journaling / reflection programs
- export / download of reflections
- optional member perks or booking benefits

Excluded:
- crisis support
- 119 SEJIWA / Kemenkes RI escalation
- the core chat itself
- any rate limit that would block a distressed user from talking

---

## 5. Recommended pricing model

### Subscription pricing
If subscription is launched, start low-friction for Indonesia:

- **IDR 25k–39k / month**
- annual plan under **IDR 300k / year**
- payment methods should be **e-wallet / QRIS first** if possible

### Why this range
- low enough to feel approachable
- high enough to support product operations
- far below the cost of formal care, so it reads as a convenience / continuity product

### Avoid
- per-message or per-token pricing
- consumption-based emotional support
- pricing that makes users ration help

The product should not make users choose between money and conversation when they are already vulnerable.

---

## 6. Feature matrix

| Capability | Free | Premium |
|---|---:|---:|
| Anonymous companion chat | ✅ | ✅ |
| Crisis detection | ✅ | ✅ |
| Crisis takeover / hotline route | ✅ | ✅ |
| Mood check-in | ✅ | ✅ |
| Short session memory | ✅ | ✅ |
| Cross-device sync | ❌ | ✅ |
| Longer memory / continuity | ❌ | ✅ |
| Mood trends / insights | ❌ | ✅ |
| Guided journaling / reflection library | Limited | Full |
| Export / download reflections | ❌ | ✅ |
| Psychologist booking access | ✅ | ✅ |
| Booking perks / discount | ❌ | Optional |
| Supporter badge / membership identity | ❌ | ✅ |

---

## 7. What premium should never do

Premium must **not**:

- hide crisis support
- gate the normal companion chat
- turn urgent emotional support into a paid feature
- imply that free users are less worthy of care
- encourage dependency or longer sessions as a business goal

If a feature feels like a barrier to help, it should not be premium.

---

## 8. Launch strategy for the first 90 days

### Days 0–30: instrument first
- ship without paywall pressure
- measure retention and returning users
- keep account creation optional
- watch whether users want to save history

### Days 31–60: add the mission-aligned revenue rail
- launch psychologist booking / directory flows
- test referral economics
- optionally add a soft supporter CTA such as “dukung kami”

### Days 61–90: only then evaluate premium
- if retention is real, ship premium continuity features
- launch with a low-friction trial or founding-member offer
- keep the free tier clearly valuable

If retention is weak, do not launch premium yet. Fix the product first.

---

## 9. Monetization risks

1. **Withholding-help backlash**
   - Any paywall near distress can trigger severe trust damage.

2. **Loss of anonymity**
   - Premium accounts introduce payment and identity data.

3. **Medical-service perception**
   - Paid features can make the product feel like treatment if copy is careless.

4. **Dependency incentives**
   - Monetizing time-in-app can push the product in the wrong direction.

5. **Sensitive-data misuse**
   - Never monetize chat content with ads or targeting.

---

## 10. Copy / positioning guidance

Recommended framing:
- “Chat dan bantuan darurat selalu gratis.”
- “Premium untuk menyimpan refleksi, melihat progres, dan melanjutkan perjalananmu.”
- “Kami bantu kamu mulai — dan menghubungkan ke bantuan profesional saat perlu.”

Avoid framing premium as:
- “unlock support”
- “get help now”
- “stop the crisis wall”
- “better emotional care”

Premium should sound like **continuity tools**, not a better class of compassion.

---

## 11. Open questions

- Which psychologist booking model is easiest to launch first: referral fee, flat commission, or partner packages?
- Should premium start with individual subscription only, or also offer team / caregiver plans later?
- What user actions best predict willingness to pay: saved history, repeated use, or insight features?
- Should the product offer a supporter / donation tier before premium subscription?

---

## 12. Bottom line

**Recommended model:** freemium + mission-aligned marketplace first + light premium later.

**Not recommended:** subscription-first on the core companion chat.

The app should remain safe and useful for free users, while charging only for depth, continuity, and convenience.
