# JobQuest — Product Design

## Understanding summary

- JobQuest is a daily-use web dashboard for individual job seekers who struggle with procrastination and accountability.
- It is an execution and tracking layer around the job search, not a job board or job-discovery engine.
- The first screen starts the user on a focused job-search quest.
- Daily actions are meaningful job-search behaviors: applying, networking, and following up.
- The product combines a calm, encouraging coach with light RPG energy: XP, streaks, quests, milestones, and achievements.
- The first build is a polished front-end prototype with a usable first-run state, optional realistic sample data, and interactive states.
- Success means a reviewer can start a quest, complete missions, earn XP, see progress update, and understand the job-search context immediately.

## Assumptions and constraints

- The app lives at the repository root so local development and static hosting can use the default directory.
- V1 has no authentication, backend, cloud storage, real URL scraping, or external API calls.
- Job data can be captured through a pasted URL and a short form; the prototype can simulate metadata for realistic sample opportunities.
- User-entered state persists locally in the browser under the `jobquest-state-v2` localStorage key; optional sample content can be loaded with a Load demo data control.
- The experience should be fast-loading, responsive, and maintainable at prototype scale.
- No personal job-seeker data is required; all visible records are fictional sample data.
- The working product name is **JobQuest** with the tagline **Turn the job search into your next win.**

## Product direction

### Recommended approach: Quest-first cockpit

JobQuest is organized around one clear next action instead of a generic task list. The main dashboard has a strong “Today’s Job Search Quest” card, three job-search mission cards, visible XP/streak progress, and a compact pipeline summary. The game layer supports the workflow rather than replacing it.

The main screen uses a three-part layout:

- **Top bar:** JobQuest brand, streak, XP/level, and profile control.
- **Main quest area:** daily quest card with progress plus Apply, Network, and Follow up mission cards.
- **Progress sidebar:** weekly momentum, pipeline summary, next milestone, and stats.

On smaller screens, the sidebar moves below the quest cards and the top bar becomes a compact status row.

### Job-search-specific language

Generic productivity terms are avoided. The interface uses “Today’s Job Search Quest,” “Applications in motion,” “Pipeline health,” “Response rate,” “Role mix,” and “Momentum streak.” A mission is tied to a real-looking job opportunity, for example:

> Product Designer at Notion — Apply by Friday · Remote · Product Design · +50 XP

The pipeline stages are:

`Saved → Referral → Applied → Screen → Interview → Offer / Closed`

## Mission and tracking flow

The primary flow is:

`Open dashboard → choose mission → capture or select job → start mission → complete mission → earn XP → update quest → reveal next move`

For an Apply mission, the user pastes the job-post URL into a capture panel. The form records:

- Job title
- Company
- Role category from a broad preset list, with custom categories saved for reuse
- Location or remote status
- Source: company careers page, job boards, referrals, recruiter outreach, or other
- Current stage

Existing tracked jobs can be selected for Network and Follow-up missions so the same opportunity is not repeatedly re-entered.

Mission states:

- **Not started:** action context, opportunity details, time estimate, and clear CTA.
- **Active:** focused card, lightweight timer, and “Mark complete” CTA.
- **Completed:** job-specific completion message, XP earned, and subdued styling.
- **Quest complete:** XP summary, streak update, and an optional next move.
- **Empty:** “You’re done for today” state when no missions remain.

## Progress, statistics, and achievements

The prototype tracks:

- Total applications
- Response rate
- Most-applied role categories
- Applications by source
- Current pipeline count
- Follow-ups completed
- Weekly job-search activity

Achievements reward meaningful patterns rather than arbitrary clicks:

- **First Application**
- **Five Strong Applications**
- **Referral Builder**
- **Follow-Up Finisher**
- **Interview Ready**
- **Design Role Explorer**

XP and streaks are compact signals around the workflow; they should not dominate the dashboard.

## Application Log

The Application Log is the durable home for tracked opportunities. It supports searching by role, company, next action, or notes; filtering by pipeline stage; viewing the source and tracked date; opening the saved job post; changing the current stage; and editing job details. Each job can carry a next action, due date, and personal notes. Stage and detail changes update the dashboard and persist locally so the tracker reflects the user’s real search history.

The Due today view surfaces tracked jobs whose next action is scheduled for the current date, giving the user a short list to act on instead of another passive report.

## First-run experience

New users start with an empty application log, zeroed stats, locked achievements, and one focused mission: track a first real job. The dashboard explains what to do next and offers a prominent Track a job action. After the first opportunity is captured, networking and follow-up missions are created around that same job. Sample data remains available separately for walkthroughs and visual review.

## Current implementation status

The current prototype supports the complete local interaction loop:

- Track an opportunity from a pasted URL.
- Choose a preset role category or save a custom category for reuse.
- Record the source, next action, due date, and notes.
- Create connected Network and Follow up missions around the tracked job.
- Complete missions to update XP, streak, pipeline, and achievements.
- Search and filter the Application Log, change a pipeline stage, edit job details, and open the saved post.
- Review jobs due today and inspect role mix and search statistics.
- Reload the page and continue from the saved browser-local state.

This remains a front-end-only prototype. Authentication, cloud sync, notifications, real URL metadata extraction, job-board search, and application submission are intentionally out of scope for this version.

## Visual direction

The interface should feel like a motivating job-search tool, not a cartoon game or a generic AI dashboard. The visual stance is **sleek editorial utility**: graphite structure, cool porcelain workspace, precise rules, and high-signal color.

- Graphite black for the application shell
- Cool porcelain for the workspace
- Electric aqua for progress and completed milestones
- Signal orange for follow-ups and time-sensitive actions
- Cobalt for applied and interview-stage pipeline items
- Mineral gray for saved or closed roles

Typography uses Archivo for strong display moments and IBM Plex Sans / IBM Plex Mono for interface text and utility labels. The style stays crisp and spacious while using cooler contrast and sharper type to distinguish JobQuest from common warm cream/lime dashboard patterns.

## Prototype architecture

The central job record connects the experience:

`job → mission → pipeline stage → XP/achievement → statistics`

Suggested front-end state:

- `quest`: date, title, progress, completion status
- `tasks`: mission type, job reference, label, time estimate, XP value, completed state
- `user`: level, XP, streak, weekly completion count
- `jobs`: tracked job records and pipeline stages
- `achievements`: definitions plus unlocked state

Suggested reusable components:

- App shell and top bar
- Quest hero card
- Mission card
- Job capture panel
- Pipeline summary
- Stats panel
- Achievement card
- Quest-complete state

## Error handling and edge cases

- Apply missions validate that a job URL is present.
- Incomplete metadata receives inline feedback instead of a disruptive error screen.
- Buttons provide immediate pressed, active, or completed feedback.
- No screen depends on network loading or external assets.
- The footer provides separate Load demo data and Start fresh controls.
- Reload behavior preserves the current state in the browser; clearing site data or choosing Start fresh returns to the empty first-run state.

## Validation checklist

- Start fresh with an empty application log.
- Load the optional demo data set.
- Start a job-search mission.
- Capture a job URL and job details.
- Complete Apply, Network, and Follow-up missions.
- Update XP, streak, pipeline, and response statistics.
- Unlock an achievement.
- Show the completed-quest state.
- Search and filter the Application Log.
- Change a tracked role’s pipeline stage.
- Refresh and confirm local progress persists.
- Return to the fresh state.
- Verify desktop and narrow-screen layouts.

## Decision log

1. **Target user:** individual job seekers who struggle with procrastination and accountability. Chosen over a narrower ADHD-only audience to keep the product broadly useful while preserving the original insight.
2. **Primary surface:** daily-use dashboard. Chosen over a marketing landing page because the product’s value is in repeated behavior change.
3. **Primary entry point:** today’s focused job-search quest. Chosen over job triage or pipeline review to make starting the work immediate.
4. **Gamification tone:** balanced coach plus RPG energy. Chosen over pure coaching or competitive scoring to keep motivation supportive and meaningful.
5. **Mission scope:** applications, networking, and follow-ups. Chosen because the product should encourage a complete job-search loop rather than only application volume.
6. **Prototype scope:** front-end-only with sample data. Chosen to validate the interaction and visual concept before introducing auth, persistence, or integrations.
7. **Product name:** JobQuest. Chosen because it makes the job-search context clear while retaining the quest metaphor.
8. **Job tracking:** capture a pasted job-post URL and connect missions to a tracked opportunity. Chosen to make the app job-specific without becoming a job-search engine.
9. **Stats and achievements:** track applications, response rate, role mix, sources, pipeline, and follow-ups; reward meaningful patterns. Chosen to make progress visible without rewarding empty activity.
