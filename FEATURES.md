# JobQuest Feature Checklist

Last reviewed: September 18, 2026

This is the canonical record of what JobQuest currently does and what remains to be built. Update this file whenever a feature is added, removed, or materially changed.

- `[x]` Implemented in the current prototype
- `[ ]` Not implemented yet

## Implemented

### First-run and local data

- [x] Fresh first-run state with an empty application log and one clear starting mission.
- [x] Optional fictional demo data for walkthroughs.
- [x] Start fresh control that clears JobQuest data from the current browser.
- [x] Browser-local persistence using the `jobquest-state-v2` localStorage key.
- [x] Recovery to a clean first-run state when saved data cannot be parsed.
- [x] Export the complete current state as a dated JSON backup.
- [x] Import a validated JSON backup after confirmation, without replacing current data when validation or confirmation fails.

### Opportunity tracking

- [x] Track a job from a required HTTP or HTTPS job-post URL.
- [x] Capture job title, company, location, source, role category, next action, due date, application date, current stage, and notes.
- [x] Backfill an existing application by choosing Applied or a later stage and entering the actual application date, including a prior date.
- [x] Historical application entries complete the logging step without awarding retroactive XP.
- [x] Broad preset role-category list.
- [x] Reusable custom role categories.
- [x] Source presets for company sites, major job boards, referrals, recruiter outreach, and other sources.
- [x] Application Log with tracked opportunities in one place.
- [x] Search by title, company, category, next action, or notes.
- [x] Filter the log by active pipeline or selected pipeline stages.
- [x] Update a job through Saved, Referral, Applied, Screen, Interview, Offer, and Closed stages.
- [x] Edit all primary job details after capture, including the application date and pipeline stage.
- [x] Open the original saved job-post URL.
- [x] Due today view for open opportunities with an action due on the current date.
- [x] Application Log shows the application date separately from the date the opportunity was first tracked.

### Missions and accountability

- [x] Apply, Network, and Follow up mission types.
- [x] Automatic Network and Follow up missions after the first job is captured.
- [x] Ready, active, and completed mission states.
- [x] Mission time estimates.
- [x] Quest progress and completion feedback.
- [x] XP rewards, derived levels, and momentum streak display.
- [x] Six achievements: First Application, Referral Builder, Five Strong Applications, Follow-Up Finisher, Interview Ready, and Role Explorer.
- [x] Toast feedback after important actions.

### Reporting and interface

- [x] Pipeline counts and stage visualization.
- [x] Application, response-rate, interview, and follow-up statistics.
- [x] Role-mix visualization derived from tracked jobs.
- [x] Responsive desktop and narrow-screen layouts.
- [x] Reduced-motion support.
- [x] Inline validation for job URLs and custom categories.
- [x] Escaping of user-entered text before rendering it into HTML.
- [x] Dependency-free static deployment from the repository root.

## Needed next

### Priority 0 — safer personal use

- [ ] Export the Application Log to CSV.
- [ ] Delete a tracked opportunity with a confirmation step.
- [ ] Show overdue and upcoming actions in addition to actions due today.
- [ ] Replace the hard-coded demo dashboard date and demo tracked dates with a live date source everywhere.
- [ ] Replace the demo profile name and role with editable user settings.
- [ ] Require or clearly flag missing job title and company instead of silently inserting placeholders.

### Priority 1 — reliability and release readiness

- [ ] Add automated tests for first run, tracking, editing, stage changes, persistence, and reset/demo flows.
- [ ] Add continuous integration that runs validation on pushes and pull requests.
- [ ] Perform a keyboard-navigation and screen-reader accessibility audit.
- [ ] Test the production build across current desktop and mobile browsers.
- [ ] Add explicit localStorage schema migrations for future state changes.
- [ ] Add a clear recovery path for corrupt or incompatible saved data before discarding it.
- [ ] Verify and document the production deployment URL.

### Priority 2 — accounts and cloud sync

- [ ] User authentication.
- [ ] Per-user cloud database and authorization rules.
- [ ] Cross-device synchronization.
- [ ] Automated backups and account-level data export/deletion.
- [ ] Privacy policy, terms, and production security review.
- [ ] Error monitoring and privacy-conscious product analytics.

### Product expansion

- [ ] Browser or email reminders for due and overdue actions.
- [ ] Optional job-post metadata extraction from a pasted URL.
- [ ] Job triage with fit or effort priority such as A/B/C.
- [ ] Focus timer and an overthinking limit for application work.
- [ ] Contact and referral relationship tracking.
- [ ] Interview mode with reusable stories, practice prompts, and follow-up preparation.
- [ ] Configurable daily and weekly job-search goals.
- [ ] Weekly progress summaries and source-performance reporting.
- [ ] Résumé-version and application-material tracking per opportunity.

## Intentionally out of scope

These are not part of the current product direction unless that strategy changes:

- [ ] Searching or aggregating job listings.
- [ ] Automatically submitting job applications.
- [ ] Competing primarily as an AI résumé-writing tool.

## Recommended build order

1. CSV export and job deletion.
2. Real dates plus overdue and upcoming actions.
3. Automated tests and accessibility verification.
4. Authentication, cloud persistence, and synchronization.
5. Reminders, metadata extraction, and the higher-value coaching features.
