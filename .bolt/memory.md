# Project memory

## Product intent & audience

- Vite + React web app.
- SEO and social-sharing optimization is in progress (meta tags in `index.html`).

## Brand personality & voice

- Not yet inferred from project context.

## Visual design & UX direction

- Not yet inferred from project context.

## Decisions, constraints & rationale

- `index.html` head should contain each meta tag only once; avoid duplicates.
- Platform (Bolt) auto-injects a `twitter:card` tag (`content="summary_large_image"`) and a default `twitter:image`; do not duplicate `twitter:card`.
- Four manually-added tags retained: `canonical`, `og:url`, `twitter:title`, `twitter:description`.
- `twitter:title` and `twitter:description` are paired with the platform's `twitter:card` + default `twitter:image`.
- Social-share preview image is currently Bolt's default; a custom `twitter:image` may be added later.
- Build must continue to pass after any change.

## Open questions & assumptions

- Whether a custom `twitter:image` / `og:image` will be provided later is unresolved.
- No explicit `.bolt/prompt` exists; global instructions may be added in future turns.