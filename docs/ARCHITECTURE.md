# ARCHITECTURE

## Shape

```
src/
  core/        state: schema, validation, migration, persistence
  engine/      the measurement method — pure functions, no DOM, no I/O
  adapters/    optional outbound integrations (BYOK LLM)
  ui/          rendering, views, event dispatch
  i18n/        Hebrew source copy + English translation
  data/        bundled demo material
tests/         vitest, mirroring src/
docs/          TELOS, METHOD, UX, ARCHITECTURE
```

## Decisions, and why

### No framework
The product is a measurement engine with a form on top. Every score, layer,
diagnosis and next move is a pure function of state — framework-independent by
construction, and directly testable without a renderer. Adding React would put
a build-time dependency and a component lifecycle between the tests and the
thing being tested, in exchange for conveniences this UI does not need. The
whole runtime is zero-dependency; the only production asset is one JS bundle
under 40 kB gzipped.

The cost is honest: the view layer is a hand-rolled `innerHTML` renderer with
focus restoration. That is acceptable at this size and would not be at ten
times this size. If the UI grows past roughly a dozen views or gains real
client-side routing, this decision should be revisited rather than defended.

### Escape-by-default templating
`ui/html.js` escapes every interpolation unless it is a nested template or an
explicit `raw()`. The user pastes CVs, client emails and third-party quotes
into this app; the safe path has to be the default one, not a discipline the
author has to remember at each call site.

### Engine purity, with an injected clock
Nothing in `engine/` reads the DOM, `localStorage`, or `Date.now()` implicitly.
Every time-dependent function takes `now` as an argument, which is what makes
decay, trailing windows and staleness testable without freezing global time.

### Local-only data, deliberately
No server, no account, no telemetry. This is a product decision before it is an
architectural one: the user is being asked to paste their salary-relevant
outcomes and client correspondence into this tool *while they are unemployed*.
A backend would be more capable and would also mean holding that material.

The consequence is stated plainly in Settings: clearing browser data deletes
everything, so export exists and is one click.

### Deterministic core, optional model
Every number this product shows comes from deterministic code. The LLM adapter
is off by default, never scores anything, and can only rewrite text the user
already owns — and its output is rejected unless it passes the same grounding
validator that template drafts pass. A model outage or an absent key removes a
convenience, never a capability.

The browser-held API key is a real, documented tradeoff, not an oversight; see
the header of `src/adapters/llm.js`.

### Versioned, self-healing state
`normalizeState()` coerces arbitrary parsed JSON into a valid state field by
field and never throws. A truncated or hand-edited `localStorage` entry
degrades to defaults rather than wiping an evidence base that took the user
hours to build. The pre-rewrite MVP's state is migrated: sources and
positioning carry forward, old scores do not, because they were produced by a
different method and importing them would be a false claim about continuity.

### Weights are data, not code paths
Dimension weights live in one table with declared priors and a `calibratable`
flag. Calibration replaces the table; nothing else in the engine changes. That
is what makes "the priors are a starting point, not the answer" implementable
rather than aspirational.

## Testing

Unit tests across eight files, covering the engine's actual claims rather
than its surface:

- **text** — Hebrew normalisation, prefix ambiguity, similarity symmetry,
  sentence splitting
- **scoring** — signal extraction in both languages, dimension bounds, decay
  ordering by kind, dedupe, mining, re-ranking on positioning change
- **authority** — layer locking, the Liebig gate (including *"six times the
  output, identical standing"*), all four diagnoses, next-move ordering, gap
  ranking, positioning issues
- **feedback** — calibration shrinkage, the fixed-dimension guarantee,
  compounding thresholds and idempotence
- **drafts** — the grounding validator across every angle × CTA × locale
- **store** — corrupt input, legacy migration, storage failure, immutability
- **ui** — escaping including attribute context, i18n bundle alignment, and the
  banned-vocabulary check from `docs/UX.md`
- **regression** — one test per defect found by adversarial review: engine
  determinism, spelled-out magnitudes, decay-clock preservation, curation
  surviving truncation, dedupe cost, the L4 monotonicity and lock properties,
  numeric safety, and the stored-XSS entry point through imported ids

CI runs lint, tests and a production build on every pull request and push to
`main`.

## Deployment

GitHub is the source of truth; Vercel deploys from it. Feature branches and
pull requests get Preview deployments, `main` deploys to Production, and
`vercel.json` holds the configuration. Nothing about the app is server-side, so
a deploy is a static asset upload.
