# Agent instructions (Codex, Claude, and any other AI assistant)

This project is worked on by more than one AI assistant. To avoid conflicting edits:

1. Read `handoff/HANDOFF.md` first. Its "Change log" section records every change made by each assistant, newest first.
2. Only one assistant edits the project at a time. Before handing over: commit your work, then add a dated entry to the change log saying who you are, what changed, why, how it was verified, and what is left.
3. Never change lesson content (text, formulas, data, images, `public/prototypes/**`, `topic-design-previews/**`, `public/topic-design-previews/**`) unless the user explicitly asks for that specific content change. Visual/style work stays in `app/globals.css` and the site chrome components.
4. Files listed under "Local-only work, do not commit" in `handoff/HANDOFF.md` must stay out of commits until the user says otherwise.
5. Push feature work to a branch for a Vercel preview; merge into `main` (production) only after the user has checked the preview.
