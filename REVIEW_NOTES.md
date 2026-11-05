# Foundation review — 5 November 2026

## Scope and verified state
Reviewed the existing Phase 0/1 documentation, routes, layout, page components, progress storage, and roadmap interactions. Production build passes. The implementation remains a foundation with previews, not a completed learning platform. The PDF inventory was not independently re-audited against the original PDF in this review.

## Fixed
- Incomplete CPU lesson and stage could be marked complete without any demonstrated understanding. Completion actions are now disabled pending real assessments.
- Playground returned fabricated execution traces regardless of edits. Execution is now explicitly unavailable; the editor remains usable as a scratchpad.
- CPU Play and speed had no scheduling effect; LOAD/STORE were missing and subtraction ignored its source register. Added deterministic serial execution, actual memory updates, bounded program halt, rewind, pause, reset, and timer cleanup.
- CPU demo explicitly distinguishes its serial five-phase model from a pipelined processor.
- Partial JSON imports could crash screens by replacing required progress fields. Both import and local-storage hydration validate the full schema before use.
- New learners no longer receive seeded bookmarks or started stages. Existing valid saved data is preserved.
- Added keyboard focus, skip link, reduced-motion support, touch target sizing, and brighter secondary text.
- Hidden mobile sidebar no longer remains keyboard-accessible. Added focus containment, Escape, scroll locking, route dismissal, and desktop breakpoint cleanup.
- Roadmap cards and checklist now support keyboard interaction. Drawer supports focus containment, Escape, backdrop dismissal, and focus return. Session-only checklist is labeled accordingly.
- Breadcrumbs no longer create invalid intermediate stage/lesson URLs. Added search shortcut and page scroll reset.
- Lesson TOC now links only to sections that exist. Increased lesson body text size. Draft status is prominent.
- Invalid stage, lesson, and page URLs show a recovery page instead of quietly displaying Stage 0 or the dashboard.
- Planned simulator catalog links lead to stage outlines rather than pretending an unimplemented simulator can launch.
- Search trims queries, announces results, labels input and filters, and includes useful initial suggestions.
- Notes form has labels, disabled empty save, and save feedback. Settings import has validation feedback and clearer local-data language.
- Replaced the no-op test command with executable regression checks.

## Verification
- `npm run build`: passed before and after changes.
- `npm test`: passed; regression assertions cover malformed backups, valid round trip, CPU memory/register transitions, rewind, reset and halt.
- Browser: keyboard drawer open and Escape close; CPU autoplay to cycle 20, pause/reset, speed selection; mobile menu open/close; search query with whitespace returned six CPU matches.
- Visual inspection: dashboard at original viewport, mobile simulator and search at 390×844, lesson at 1440×1000. Desktop lesson had no horizontal page overflow.
- These checks are targeted, not a full browser/accessibility or curriculum certification.

## Remaining priorities
1. **Phase 1 gap:** theme system is not implemented; settings only manages data. Add tested persistent light/dark/system preferences before claiming all Phase 1 requirements complete.
2. **Content availability:** introduce shared metadata for planned/preview/ready status across lessons, labs, projects and assessments. Some page descriptions still describe intended capabilities; availability should come from data rather than manual copy.
3. **Phase 2:** implement the reusable lesson engine, real content sections, math/code rendering, scroll-aware TOC and notes/bookmarks integration. Current lesson TOC active state updates on click, not scroll.
4. **Execution:** connect a real isolated runtime only when ready. Preserve each language's draft on tab switch and persist scratchpad edits before promoting playground use.
5. **Progress:** stage mastery needs a real rubric/assessment gate; historical completions were retained, not independently verified. Roadmap checklist is session-only. No cloud backup/sync.
6. **Assessments:** existing four-question sample is a preview, not a stage mastery certification. Technical claims and feedback still need primary-source review before publication.
7. **Curriculum:** independently compare all frontend topics and prerequisites with the PDF inventory. No curriculum data was modified in this review.
8. **Testing:** broaden browser coverage to all 15 modules, notes editing, backup download/restore, cross-browser behavior, keyboard traversal, contrast audit, and storage failures.
9. **Architecture:** add route-level loading/error boundaries and lazy-load modules as real lessons increase bundle size. Add useful page titles and persist directory filters in URL parameters.
10. **Visual polish:** consolidate repeated cards, buttons, status badges and empty states into shared components; reduce dense monospace metadata and truncation of stage titles. Add theme controls before a broader design pass.

## Changed files
`package.json`, `tailwind.config.js`, `src/App.tsx`, `src/index.css`, layout components, roadmap component, progress context, Dashboard, CurriculumBrowser, StageOverview, LessonViewer, Playground, SimulationLab, SearchPage, NotesBookmarks, Settings, VisualLab; new `src/hooks/useFocusScope.ts`, `src/utils/cpu.ts`, `src/utils/progress.ts`, `src/pages/NotFound.tsx`, `tests/core.test.mjs`, this review and `PROGRESS_TRACKER.md`.
