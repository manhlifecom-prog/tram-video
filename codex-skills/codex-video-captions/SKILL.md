---
name: codex-video-captions
description: In Codex, start full video editing when the user sends only a Google Drive video link or folder link, attaches a video, or says “làm video này”. Automatically check the newest published version, then deliver an edited MP4 with rich motion, timed captions and sound.
---

# One video workflow

Version 0.3.0-beta.3. Sending a Drive video or folder URL by itself in Codex is a request to edit and deliver the video, unless the conversation clearly asks for another action. No special command, skill mention, repeated brief or quality prompt is needed. Start work in the same turn.

1. Check the [release channel](https://raw.githubusercontent.com/manhlifecom-prog/tram-video/main/codex-skills/latest.json) before starting each new job. Read [link intake and upgrades](references/link-intake.md) for the exact input and update rules. Reuse any active job for the same request.
2. Resolve and probe the source, infer a brief from the current person's preferences and the video, and carry out [the full workflow](references/WORKFLOW.md) through an MP4. Ask only about a concrete access blocker or a choice that changes the output. Defaults do not need approval.
3. Default to **maximum purposeful production** until the user asks to reduce effects. Cover the whole retained narration with a deliberate mix of hook, framing and cuts, animated illustration, selected B-roll, expressive type and sound. Use the best available capabilities. Protect reading rhythm and clarity. Never silently substitute a caption-only starter.

Use the customer's own brief, face, voice, palette, approved reference and approved music choices. Keep stable semantic phrases as the base when that is the preferred cadence; select word/key motion per meaning, never all-word/all-spring or preset rotation. Optional word motion must visibly move and settle, not just fade. Use each real source-word anchor; keep whole keys on fixed lines. Do not hide first/last words with compound fades.

Map source time through one integer-frame EDL, preserve complete clauses and all necessary negation/conditions. Proposed cuts need actual listening; ASR is an estimate. Build representative stills and motion states for review before a full render. Review the actual encoded MP4 continuously with sound before creative acceptance. Technical hashes/stills/ASR/LUFS are not creative approval.

**Background music is user-selected or absent.** Use only an audio file or a TikTok/Facebook music link explicitly supplied or selected by the requester for this edit, with usable access and rights. When absent, edit without background music and mention that the requester can supply a link or audio file. If specifically asked for music but no selection is supplied, ask for their choice. Never pick, generate or substitute a background track. A sample music library may only enter the skill after its owner approves it. You may select or create rights-cleared SFX that fit the actions and leave speech clear.

**Quality is a delivery requirement.** Repair failed checks before delivery. If missing prerequisites or unresolved defects prevent the intended quality, report the concrete blocker and label any review artifact as a draft. Never describe a low-quality or unverified result as finished.

See references/CAPABILITIES.md for dependencies/limits, references/setup-and-install.md for install, references/MEDIA-RECIPES.md for optional local ASR/matte/audio/image requirements. No provider, paid model, download or publication is authorized by this skill itself.
