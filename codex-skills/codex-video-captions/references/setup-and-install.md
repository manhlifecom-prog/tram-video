# Install and check local prerequisites

This is the public beta **codex-video-captions 0.3.0-beta.3**, one entry and one complete workflow. The plan/runtime contract may still identify `0.3.0-working.1`; that is not a second skill. Installation copies verified managed instructions/code; it does not transcribe, edit or render a video. It does not install packages/models or grant generation/publication permission. No customer media, voice, music or profile belongs in this generic package.

## Verified archive and explicit target

Compare the separately supplied ZIP SHA256, safely extract to staging, then inspect `MANIFEST.json`. Every payload file must be listed and match its hash; symlinks, unsafe paths and extra files fail before destination writes. An unfinished source tree without its final manifest is not an installable release.

```sh
python3 scripts/install.py --target-dir /absolute/skills/codex-video-captions --check-only
python3 scripts/install.py --target-dir /absolute/skills/codex-video-captions
```

Alternatively supply `--skills-dir /absolute/skills`; the same canonical folder is selected. Use an explicit real path, not a symlink. `--check-only` creates no destination or backup. Repeating installation of identical verified managed content reports `up-to-date` without changes. Existing unmanaged skills, locally changed managed code and unmanaged path collisions stop for review instead of being overwritten.

For a reviewed managed upgrade:

```sh
python3 scripts/install.py --skills-dir /absolute/skills --upgrade --backup-dir /absolute/skill-backups --check-only
python3 scripts/install.py --skills-dir /absolute/skills --upgrade --backup-dir /absolute/skill-backups
```

Backups must sit **outside** skills discovery and package source. They contain only affected managed files and the previous manifest/receipt, never a second active skill. Custom DNA/profiles/config/media, environment files, outputs, projects and caches are protected; incoming reserved payload paths, including `project-plan.json`, are not installed. Keep customer working projects separate. Backup receipt describes managed rollback: restore backed-up managed files/manifest and remove only newly introduced files whose hashes still match that upgrade; preserve user data. Do not replace whole folders or edit global Codex configuration. The installer does not create another weak/strong product or modify other installed skill names.

## Project-local environment

Make a separate private working copy and load this skill when the user sends a video link or asks for a video. Supply the customer's source, source-bound transcript/EDL, explicit profile and rights-cleared resources. `examples/neutral-plan.json` is synthetic and must fail media preflight until replaced with real inputs.

```sh
node scripts/check-environment.mjs --project /absolute/working-project
node scripts/check-environment.mjs --project /absolute/working-project --ffmpeg /absolute/bin/ffmpeg --browser /absolute/browser-executable
```

Node must satisfy `^20.19.0 || ^22.13.0 || >=24`. The project needs seven exact pins: Remotion/bundler/renderer4.0.537, React/ReactDOM19.2.3, TypeScript5.9.3 and `@types/react`19.2.7. The check reads actual project-local package directories; it refuses missing packages, ancestor inheritance, linked `node_modules`/package directories and wrong versions. It does not run npm or import the renderer. A successful metadata check is not a render or clean-machine proof. A separately authorized dependency installation may be performed from that project; no dependencies were installed by this package-preparation step.

Explicit executable checks only run version probes; no browser download or media render. Rendering also needs a writable private cache, localhost permission and adequate disk/RAM for the actual source/frames/output. Inspect resource state before expensive work. Windows/clean-machine behavior remains unverified; Apple Vision/MLX routes here require macOS, and MLX requires Apple Silicon. Missing optional capabilities must be reported and their routes stopped, not replaced by fake masks, guessed timestamps or a basic-caption fallback.

## Optional existing offline ASR

Prefer an existing verified transcript bound to the exact source hash. Otherwise select a suitable already-cached model and separately authorize one local ASR pass. No model weights ship here. `weights.npz` and `weights.safetensors` are supported with local `config.json`, installed tokenizer/mel assets and reviewed `mlx-whisper0.4.3`/`MLX0.32.4`. Tested host Python was3.12.14; this is not a claim of every Python/platform combination.

```sh
python3 scripts/asr-offline.py --source /absolute/raw.mov --model-dir /absolute/existing-model --ffmpeg /absolute/bin/ffmpeg --check-only
```

Check-only fingerprints source/model/config/runtime/tokenizer files without importing the model or running inference. It fails clearly when platform, runtime, weights, tokenizer or FFmpeg is missing. After reviewing printed fingerprints and resource needs, a separately authorized run adds `--language vi --expected-source-sha256 SOURCE_SHA --expected-model-sha256 MODEL_SHA --output /absolute/private-data/source-clock.json`.

The adapter denies Python socket calls, forces Hugging Face offline and decodes FFmpeg with only local `file,pipe` protocols. These are adapter controls, not an OS sandbox against arbitrary native code. A local model path and packaged tokenizer assets prevent download fallback. One output reservation prevents automatic repeat/retry; failure retains its attempt receipt. Preserve raw output read-only. Word timestamps/probabilities are estimates, not hearing or clean-phoneme evidence; follow source listening/EDL review before editing. No provider keys are needed or requested.

## Run the workflow, then review the actual result

Read `WORKFLOW.md`, `CAPABILITIES.md` and [audio-recipe.md](audio-recipe.md). Validate the plan, inspect representative stills/motion, then render if the user asked for a finished video. Installation/setup checks do not complete those stages. Load real source/profile/reference; retain approved clause meaning and original voice. Stop unsupported requests rather than silently rendering a weaker starter. Actual encoded playback and fullmix listening are required for creative acceptance; static checks and successful installation cannot promise reference-level taste.
