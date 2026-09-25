# DESIGN.md

## Design Direction & Identity

**Design Read**: Personal developer portfolio for tech and creative peers, in a cinematic comic-editorial Spider-Man (Peter Parker / Arachne) visual language.  
**Dials**: ENERGY 2 / RHYTHM 3 / MOTION 2

---

### 1. Identity & Personality
- **Concept**: The duality of a student developer (Peter Parker) and digital creator (Spider-Man). Building experiments, learning in public, crafting interfaces.
- **Tone**: Grounded, earnest, energetic, personal. No corporate tech jargon, no generic AI template tropes.
- **Visual Motif**: Comic book halftone textures, dynamic action angles, cautionary tape ribbons, clean editorial typographic contrast.

---

### 2. Palette System (Max 3 Cores + 1 Accent)
- **Base Navy**: `#1b1f31` to `#262b41` (Deep comic night palette)
- **Cream / Editorial Paper**: `#f6f2e6` (Primary text & clean paper highlights)
- **Muted Slate**: `#9ea4bd` and `#d9d4c6` (Secondary telemetry & metadata)
- **Primary Accent**: `#ff3b30` / `#d81f2c` (Spider Red, used with restraint for active states, CTA, and key focal marks)
- **Secondary Accent**: `#86dfd2` (Subtle web teal for accents, strictly capped)

---

### 3. Typography
- **Display (Headings)**: `Anton` (Ultra-bold condensed comic title impact)
- **Script Accent**: `Pacifico` (Deliberate hand-drawn editorial feel)
- **Body & Interface**: `Inter` (Optimized for crystal-clear readability)
- **Telemetry / Meta**: `JetBrains Mono` (Terminal timestamps and field logs)

---

### 4. Layout & Spacing Rhythm
- **Rhythm**: Varied compositions (RHYTHM 3)
  - Hero: Dynamic split with interactive Peter/Spider character toggle
  - Prologue: Editorial callout with comic quote card
  - Archive: Interactive comic panels (Git, Figma, Node.js, Python)
  - Manifesto: Philosophy statement and field notes
  - TechStack: Telemetry list with glitch ticker
  - Contact: High-impact minimal transmission card
- **Mobile First-Class Reflow**:
  - Full mobile navigation drawer with touch targets >= 48px
  - Clean stacking that prevents character illustration from washing out or colliding with body text
  - Dedicated touch-friendly layout for archive cards
  - Zero horizontal overflow
  - High-contrast text on all screens

---

### 5. Motion & Accessibility
- **Motion**: Purposeful transitions and entrance animations. Respects `prefers-reduced-motion`.
- **Keyboard Navigation**: Full visible focus ring (`:focus-visible`), logical tab sequence.
- **Touch**: Mobile cursor removed on touch screens, tap targets >= 44x44px.
