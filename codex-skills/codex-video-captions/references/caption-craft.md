# Clean, expressive captions

Use the included ExpressiveSubtitles renderer for phrase layout and its font audit for width. Use the source-word helper for selected cues only. Start with a readable baseline on a phone: raw speech line 64–72 px at 1080×1920, strong points typically 88–112 px when they fit. The 60 px minimum applies to each spoken line, including lead and tail. Decorative, non-speech labels are separate. Keep fonts legible, properly registered and with full Vietnamese diacritics.

Set glyph stroke/border to zero. Avoid black rims from stacked or sharp shadows. A single diffuse shadow is optional. Put a local, feathered gradient behind the text, move the layout, or change the crop when contrast is poor. Avoid making the edge of each glyph do the work of contrast. Keep face, meaningful gestures and visible screen content clear.

Design each cue around meaning and speech. Keep semantic groups on one line, use upright and italic only where it fits the emotion, and give key and support parts separate source-time anchors. Keep the key steady when a second line arrives. Preserve stable x/y positions during token reveals. Use a soft rise, light sweep, brief spring or behind-person composition when the moment warrants it. Some cues should remain quiet. No universal bounce or fixed delay guessed from cue length. Keep readable hold time and avoid competing headline/graphic text.

If a line exceeds the safe width, reflow by whole phrase or move the block. If it needs more time, adjust the cue boundaries from the speech clock. Inspect before/onset/after and fully revealed frames of the normal subtitle, longest line, the key-plus-support cue, and any light-sweep or behind-person cue. Downscale to a real phone-size view and confirm clean edges, readable lead/tail, source-synced motion, no clipping and no face/screen overlap. Fix the issue before delivering an MP4 as finished. Legacy caption templates with heavy borders or tiny support text are unsuitable; a valid graphic render is only part of quality review.


## Make entrances feel authored

Give each line a reason, source onset, stable position and enough time to read after reveal. Use the steady entry for fast connective speech, a small eased glide for a natural phrase, and a directional wipe or a short shine for a meaningful point. The phrase renderer accepts optional block `entry: "glide" | "wipe" | "steady"`. Keep the base relaxed. Animate selected words only when the voice earns a stronger beat. Avoid revealing an entire lead/key/tail layout in one motion or making every cue slide alike. When one line arrives, the already visible line holds its position. Do not put whole phrases into motion just to increase effects.

For behind-person lettering, show the phrase clearly before the handoff, move it with easing, place the text between paired source RGB and the same-frame subject alpha, and keep speech clear. Match the retained frame clock and common transform. Check several adjacent frames at the handoff and the final result, including face/hair/ears/hands and safe margins. Replace with a different intentional effect if a clean matte is unavailable.


## Review the word clock, not just the cue start

For source dialogue, author a cue with `kind: "speech"` and token blocks with exact ordered words and source anchors. Each word or short speech unit arrives on its own actual onset. Use a reserved line box so revealed words remain steady. A full sentence faded or slid in at a single onset is a regression even if the letters look clean. Where ASR is unreliable, cross-check the recording and trim to a confirmed phrase; never invent timestamps. Use a few slow emphasis beats where needed and keep fast speech easy to read. Probe an encoded frame before a key word and one just after, as well as mid-sentence: future words should not already be visible. Editorial titles and diagram labels have their own design clocks.
