# Working with the AI agent (the company cares about this)

## Before every feature
1. **Plan first.** Ask the agent for a short plan (files to touch, steps). Read it. Fix it if wrong. Only then say "go".
2. **Give context.** Point it to `AGENTS.md` and the relevant doc (`@docs/DESIGN.md`, etc.). One feature per prompt.
3. **Small steps.** One screen/feature → run → commit.

## After every feature
- Read the diff. Do you understand every file changed? If not, ask the agent to explain.
- Run the app. Test the feature on emulator; Reader/RTL on a real device.
- Check it did not touch Quran data, add network calls, or add out-of-scope features.

## Spotting a loop (agent is stuck)
Signs: same error 3 times, same fix attempted repeatedly, files being rewritten back and forth, new dependencies being added to "fix" something.
What to do:
1. Stop the agent.
2. Read the actual error yourself (first lines, not the last).
3. Start a fresh prompt: describe the problem, what was tried, what you want. Ask for 2–3 possible causes before any code.
4. Try the smallest possible fix, or revert to last good commit (`git checkout .` / `git reset --hard`).
5. Still stuck after 30 min → ask the Technical Lead.

## Reusable skills (later)
Write down any task you repeat (e.g. "add a new screen with theme + route", "run data validation", "build and install APK") as a short step-by-step prompt/checklist in `docs/`. These become reusable skills/workflows.
