---
name: Counseling Platform
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#747687'
  outline-variant: '#c4c5d8'
  surface-tint: '#1a4de7'
  primary: '#0042de'
  on-primary: '#ffffff'
  primary-container: '#335ef7'
  on-primary-container: '#f0f0ff'
  inverse-primary: '#b8c4ff'
  secondary: '#5e3bdb'
  on-secondary: '#ffffff'
  secondary-container: '#7858f5'
  on-secondary-container: '#fffbff'
  tertiary: '#4d5568'
  on-tertiary: '#ffffff'
  tertiary-container: '#666d82'
  on-tertiary-container: '#edf0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001354'
  on-primary-fixed-variant: '#0036bb'
  secondary-fixed: '#e6deff'
  secondary-fixed-dim: '#cabeff'
  on-secondary-fixed: '#1c0062'
  on-secondary-fixed-variant: '#481bc6'
  tertiary-fixed: '#dbe2fa'
  tertiary-fixed-dim: '#bfc6dd'
  on-tertiary-fixed: '#141b2c'
  on-tertiary-fixed-variant: '#3f4759'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  section-gap: 80px
---

## Brand & Style
The brand personality is rooted in the concept of *Pendampingan* (companionship). It is designed to feel like a steady, calm presence in a moment of crisis or reflection. The target audience includes individuals in Indonesia seeking mental health clarity, ranging from those needing a simple "mood check-in" to those in urgent need of professional intervention.

The visual style is a fusion of **Minimalism** and **Modern Corporate**. It prioritizes heavy whitespace to reduce cognitive load—essential for users who may be feeling overwhelmed or anxious. The aesthetic is clean and modern, using supportive, non-threatening illustrations to bridge the gap between clinical professionalism and human empathy.

## Colors
The palette is intentionally chosen to balance clinical trust with emotional warmth.
- **Primary Calm Blue:** Evokes reliability, safety, and the professional nature of the Indonesian medical and counseling landscape.
- **Secondary Soft Purple:** Represents empathy, the subconscious, and the journey from "confused" to "understood."
- **Backgrounds:** Use a "Clean White" or "Cool Gray" base to maintain a sense of airiness.
- **Semantic Colors:** Critical alerts (Crisis Mode) should utilize a soft red (#F87171) that is visible but not alarming, maintaining the "safe" atmosphere of the platform.

## Typography
This design system utilizes **Manrope** for its unique balance of geometric modernism and organic warmth. The font’s open counters and tall x-height ensure high legibility for users who may be experiencing visual fatigue or stress. 

Headlines should be bold and authoritative to provide a sense of structure, while body text uses a generous line-height (1.6) to prevent the "wall of text" effect. In the Indonesian context, clear hierarchy helps users navigate complex information like "Crisis Detection" protocols with ease.

## Layout & Spacing
The layout follows a **Fluid Grid** system based on an 8px rhythm. To foster a sense of "safety," components are never cramped. 

- **Vertical Rhythm:** Use large gaps (80px+) between major sections to allow the user's eyes to rest.
- **Content Width:** Reading panes for reflection content should be constrained to a max-width of 720px to ensure optimal line lengths.
- **Padding:** Internal card padding should be generous (minimum 24px) to ensure touch targets are accessible and the UI feels "breathable."

## Elevation & Depth
Depth is conveyed through **Ambient Shadows** and **Tonal Layers**. This avoids the harshness of flat design while remaining more modern than traditional skeuomorphism.

- **Surface 1 (Base):** Light gray (#F8FAFC) background.
- **Surface 2 (Cards):** Pure white (#FFFFFF) with a soft, ultra-diffused shadow (0px 10px 30px rgba(0, 0, 0, 0.04)).
- **Active State:** Elements should "lift" slightly on hover using a more pronounced shadow to indicate interactivity.
- **Gradients:** Subtle, high-stop-point gradients (Primary Blue to Secondary Purple) may be used on primary Call-to-Actions to signify a "transformation" or "pathway."

## Shapes
The shape language is defined by high-radius roundedness. Sharp corners are avoided to reduce the visual perception of "harshness" or "danger." 

- **Standard Elements:** 0.5rem (8px) for inputs and small cards.
- **Large Containers:** 1.5rem (24px) for hero sections and main modal containers.
- **Iconography:** Icons should be enclosed in circular or highly rounded containers (squirocles) to maintain the friendly, approachable visual metaphor.

## Components
Consistent styling across components reinforces the feeling of a controlled, safe environment.

- **Buttons:** Use pill-shaped or highly rounded corners. The Primary CTA should use a solid Calm Blue fill, while secondary actions should use ghost styles with a 1px border.
- **Reflection Cards:** These should feature a clear header, a supportive icon (left-aligned), and a short summary.
- **Input Fields:** Large, clearly labeled fields with 16px internal padding. Focus states should use a soft blue glow rather than a harsh black border.
- **Crisis Indicator:** A persistent, high-visibility but low-stress component that appears when the system detects risk, using a combination of the soft red and white to provide a "safety net."
- **Progress Steppers:** Use soft, connected circles to visualize the user flow from "Checking-in" to "Professional Help," emphasizing that the journey is a guided, step-by-step process.