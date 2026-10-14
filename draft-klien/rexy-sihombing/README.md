# Rexy Sihombing — Modern Batak / draft v1

Local preview: `/draft-klien/rexy-sihombing/?to=Keluarga%20Sihombing`.
Skip opening for review: append `&preview=1`. No production deployment made.

Built from the approved `outputs/rexy-cover-concepts/home-slider-v2.png` direction:
full-bleed 3-photo slideshow; fixed editorial names; understated gorga-inspired
linework and ulos bands. The initial cover uses the approved carved-gate artwork,
not a cloth overlay. Only after tapping open, ulos panels fade in (~0.42 seconds)
then open (~1.7 seconds) to reveal the homepage. Reduced motion/preview skips this.
Only the homepage uses the modern full-bleed slider. All subsequent pages follow
the approved heritage board: red-black-gold gorga bands, four carved corners,
framed rectangular solo portraits, side-by-side event cards, ivory story/gallery,
gift/RSVP cards and maroon closing. `heritage.css` holds these scoped overrides.

Working preview interactions: guest personalization, curtain opening, hero autoplay,
manual photo selection/swipe/pause, scroll reveals, section navigation, native modal
gallery (keyboard arrows/Escape/focus return), gift disclosure, RSVP form and
fixed-height auto/manual wishes carousel. Reduced motion disables automatic motion.
No WhatsApp submission. Copy-account, calendar and Maps enable only with approved
config data. Countdown waits for an actual date rather than inventing one.

## Not final / do not send as final client invitation

- Clara, family data, photos, story, event plan and all other unconfirmed information
  are placeholders. `config.js` is the single data source for these.
- RSVP currently is an in-memory preview, explicitly labelled on the form and after
  submit. Reload discards it. No Supabase/customer table or external storage is used.
  Shared online RSVP requires a dedicated secured backend before publication.
- Music is a very quiet original Web Audio ambient sample, NOT a client-selected song.
  Set `config.music` to an approved audio URL to replace it. Browser errors are shown.
- Bank number, Maps and calendar are disabled while their real data is absent.
- Scripture reference/text awaits client choice; none is invented.

## Visual assets

`assets/venue-diptych-v1.png`: built-in imagegen, photorealistic-natural.
Final prompt: equal square photographic diptych, fictional North Sumatra Christian
church left (cream walls, pitched roof, red cross, tropical trees) and Batak Toba
rumah bolon right (upswept saddle roof, carved red-black facade), warm daylight,
whole buildings visible, no people, text, borders or signage. Not final venues.
`assets/heritage-corner.svg` extends the code-native ornament vocabulary; the
temporary simple chapel SVG was replaced by the photographic venue asset.

Active photo cover: `assets/cover-foto-clean-v1.png`, built-in imagegen,
precise-object-edit of the user-approved photo cover. Prompt: remove all text,
divider lines and button plaque; preserve couple faces/pose/clothes, house at
sunset, red-black-gold gorga perimeter and maroon base. Live HTML supplies copy.
The initial cover has no curtain overlay; ulos remains click-triggered only.

`assets/cover-gerbang-clean-v1.png`: built-in imagegen precise-object-edit of
`outputs/rexy-cover-concepts/cover-gerbang-v1.png`. Prompt: remove all typography,
central divider lines and button plaque; preserve the carved gorga-inspired
perimeter, roof and oxblood wooden doors. All names and buttons remain live HTML.

Built-in imagegen, photorealistic-natural: `assets/hero-triptych.png` is a fictional
Indonesian couple in black formal clothing with red ulos, terrace/lake backdrop,
three equal portrait panels: standing, seated, walking. `assets/solo-diptych.png`
is the same fictional identities, groom alone left and bride alone right.
Images are used as CSS panel sprites, not screenshots of the mockup. Existing
`assets/batak/gorga-border.png` supplies small ornamental woven bands. No actual
Sihombing crest or verified specific ritual symbol is claimed.

This draft touches no existing customer invitations, production RSVP data, or storefront.
