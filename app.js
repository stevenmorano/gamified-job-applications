const defaultState = {
  isDemo: true,
  xp: 540,
  streak: 6,
  newApplications: 0,
  referrals: 2,
  customCategories: [],
  stats: {
    applications: 12,
    responses: 4,
    interviews: 2,
    followups: 9,
    weeklyActions: 8,
    roleMix: [
      { label: "Product design", value: 46 },
      { label: "UX research", value: 28 },
      { label: "Growth design", value: 16 },
      { label: "Other roles", value: 10 },
    ],
  },
  pipeline: [
    { key: "Saved", count: 4, color: "#a9b7b0" },
    { key: "Referral", count: 2, color: "#1d827b" },
    { key: "Applied", count: 7, color: "#7191ff" },
    { key: "Screen", count: 2, color: "#ff876f" },
    { key: "Interview", count: 1, color: "#eabf69" },
  ],
  jobs: [
    { id: "northstar", title: "Product Design Lead", company: "Northstar", category: "Product design", location: "New York / Hybrid", source: "Referral", stage: "Applied", initials: "NS", trackedDate: "Aug 18, 2026", url: "https://northstar.example/jobs/product-design-lead", nextAction: "Send referral message", dueDate: "2026-08-26", notes: "Ask Maya for an introduction to the design director." },
    { id: "loom", title: "Product Designer", company: "Loom", category: "Product design", location: "Remote", source: "LinkedIn", stage: "Screen", initials: "LO", trackedDate: "Aug 20, 2026", url: "https://loom.example/careers/product-designer", nextAction: "Follow up with recruiter", dueDate: "2026-08-26", notes: "Send a concise follow-up with the case study link." },
    { id: "airtable", title: "Growth Designer", company: "Airtable", category: "Growth design", location: "San Francisco / Hybrid", source: "Company site", stage: "Saved", initials: "AT", trackedDate: "Aug 22, 2026", url: "https://airtable.example/jobs/growth-designer", nextAction: "Tailor résumé", dueDate: "", notes: "Highlight activation and onboarding experiments." },
  ],
  tasks: [
    { id: "apply", kind: "Apply", title: "Product Designer", company: "Notion", category: "Product Design", location: "Remote", source: "Company site", stage: "Saved", time: "25 min", xp: 50, accent: "lime", status: "ready", jobId: null, note: "Your highest-fit role this morning." },
    { id: "network", kind: "Network", title: "Product Design Lead", company: "Northstar", category: "Product design", location: "New York / Hybrid", source: "Referral", stage: "Applied", time: "10 min", xp: 35, accent: "coral", status: "ready", jobId: "northstar", note: "A warm path is already open." },
    { id: "followup", kind: "Follow up", title: "Product Designer", company: "Loom", category: "Product design", location: "Remote", source: "LinkedIn", stage: "Screen", time: "8 min", xp: 40, accent: "blue", status: "ready", jobId: "loom", note: "Keep your screen conversation moving." },
  ],
  achievements: [
    { title: "First Application", detail: "Track your first real opportunity", symbol: "01", unlocked: true },
    { title: "Referral Builder", detail: "Build a referral into your search", symbol: "↗", unlocked: true },
    { title: "Five Strong Applications", detail: "Submit five focused applications", symbol: "05", unlocked: false },
    { title: "Follow-Up Finisher", detail: "Close the loop ten times", symbol: "↻", unlocked: false },
    { title: "Interview Ready", detail: "Reach three interview stages", symbol: "✦", unlocked: false },
    { title: "Role Explorer", detail: "Explore three role categories", symbol: "◎", unlocked: false },
  ],
};

const emptyState = {
  isDemo: false,
  xp: 0,
  streak: 0,
  newApplications: 0,
  referrals: 0,
  customCategories: [],
  stats: {
    applications: 0,
    responses: 0,
    interviews: 0,
    followups: 0,
    weeklyActions: 0,
    roleMix: [],
  },
  pipeline: defaultState.pipeline.map((stage) => ({ ...stage, count: 0 })),
  jobs: [],
  tasks: [
    { id: "apply", kind: "Apply", title: "Product Designer", company: "Your next company", category: "Product Design", location: "Remote", source: "Company site", stage: "Saved", time: "5 min", xp: 50, accent: "lime", status: "ready", jobId: null, note: "Capture a real opportunity to start your log." },
  ],
  achievements: defaultState.achievements.map((achievement) => ({ ...achievement, unlocked: false })),
};

const STORAGE_KEY = "jobquest-state-v2";

function cloneState(sourceState) {
  return JSON.parse(JSON.stringify(sourceState));
}

function loadState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!savedState) return cloneState(emptyState);
    const freshState = cloneState(emptyState);
    return {
      ...freshState,
      ...savedState,
      stats: { ...freshState.stats, ...savedState.stats },
    };
  } catch {
    return cloneState(emptyState);
  }
}

const state = loadState();

const elements = {
  missionGrid: document.querySelector("#mission-grid"),
  pipelineStages: document.querySelector("#pipeline-stages"),
  miniPipeline: document.querySelector("#mini-pipeline"),
  roleBars: document.querySelector("#role-bars"),
  achievementGrid: document.querySelector("#achievement-grid"),
  jobLog: document.querySelector("#job-log"),
  logSearch: document.querySelector("#log-search"),
  logFilter: document.querySelector("#log-filter"),
  logCount: document.querySelector("#log-count"),
  dialog: document.querySelector("#mission-dialog"),
  form: document.querySelector("#mission-form"),
  dueList: document.querySelector("#due-list"),
  dueCount: document.querySelector("#due-count"),
  editDialog: document.querySelector("#job-edit-dialog"),
  editForm: document.querySelector("#job-edit-form"),
  toast: document.querySelector("#toast"),
  roleCategory: document.querySelector("#role-category"),
  customCategoryWrap: document.querySelector("#custom-category-wrap"),
  customCategoryInput: document.querySelector("#custom-role-category"),
  categoryError: document.querySelector("#category-error"),
};

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#039;",
  '"': "&quot;",
}[character]));

const getTask = (taskId) => state.tasks.find((task) => task.id === taskId);
const getJob = (jobId) => state.jobs.find((job) => job.id === jobId);
const getIncompleteTask = () => state.tasks.find((task) => task.status !== "completed");
const responseRate = () => state.stats.applications ? Math.round((state.stats.responses / state.stats.applications) * 100) : 0;
const stageOptions = ["Saved", "Referral", "Applied", "Screen", "Interview", "Offer", "Closed"];
const presetRoleCategories = [
  "Product Design",
  "UX/UI Design",
  "UX Research",
  "Visual & Brand Design",
  "Graphic Design",
  "Content Design",
  "Motion Design",
  "Design Leadership",
  "Product Management",
  "Engineering & Development",
  "Marketing & Growth",
  "Sales & Business Development",
  "Customer Success",
  "Data & Analytics",
  "Operations",
  "Finance & Accounting",
  "People & Recruiting",
  "Other",
];

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function syncUserStats() {
  if (state.isDemo) return;
  const categoryCounts = state.jobs.reduce((counts, job) => {
    counts[job.category] = (counts[job.category] || 0) + 1;
    return counts;
  }, {});
  const trackedJobCount = state.jobs.length;
  state.stats.roleMix = Object.entries(categoryCounts)
    .sort(([, firstCount], [, secondCount]) => secondCount - firstCount)
    .map(([label, count]) => ({ label, value: Math.round((count / trackedJobCount) * 100) }));
  state.stats.applications = state.jobs.filter((job) => ["Applied", "Screen", "Interview", "Offer", "Closed"].includes(job.stage)).length;
  state.stats.responses = state.jobs.filter((job) => ["Screen", "Interview", "Offer"].includes(job.stage)).length;
  state.stats.interviews = state.jobs.filter((job) => ["Interview", "Offer"].includes(job.stage)).length;
}

function adjustPipelineStage(stageKey, amount) {
  const stage = state.pipeline.find((pipelineStage) => pipelineStage.key === stageKey);
  if (stage) stage.count = Math.max(0, stage.count + amount);
}

function moveJobStage(job, nextStage) {
  if (!job || job.stage === nextStage) return;
  adjustPipelineStage(job.stage, -1);
  if (["Saved", "Referral", "Applied", "Screen", "Interview"].includes(nextStage)) adjustPipelineStage(nextStage, 1);
  job.stage = nextStage;
}

function renderTasks() {
  const availableXp = state.tasks.reduce((total, task) => total + (task.status === "completed" ? 0 : task.xp), 0);
  const isFirstRun = state.jobs.length === 0;
  document.querySelector("#mission-action-count").textContent = state.tasks.length;
  document.querySelector("#mission-action-plural").textContent = state.tasks.length === 1 ? "" : "s";
  document.querySelector("#mission-xp-label").textContent = `${availableXp} XP available`;
  elements.missionGrid.innerHTML = state.tasks.map((task, index) => {
    const isComplete = task.status === "completed";
    const isActive = task.status === "active";
    const job = task.jobId ? getJob(task.jobId) : task;
    const isFirstApply = isFirstRun && task.kind === "Apply";
    const mark = task.kind === "Apply" ? "↗" : task.kind === "Network" ? "⊙" : "↻";
    const actionLabel = isComplete ? "Completed" : isActive ? "Mark complete" : "Start mission";
    const companyInitials = isFirstApply ? "JQ" : job?.initials || task.company.slice(0, 2).toUpperCase();
    const cardTitle = isFirstApply ? "Track your first job" : `${escapeHtml(job.title)} <span>at ${escapeHtml(job.company)}</span>`;
    const cardContext = isFirstApply ? "Paste a real job post to start your log" : `${escapeHtml(job.category)} · ${escapeHtml(job.location)}`;

    return `<article class="mission-card ${isComplete ? "is-complete" : ""} ${isActive ? "is-active" : ""}" data-accent="${task.accent}" style="animation-delay:${index * 50}ms">
      <div class="mission-topline"><span class="mission-type"><span class="mission-type-mark">${mark}</span>${escapeHtml(task.kind)} mission</span><span class="mission-xp">+${task.xp} XP</span></div>
      <h3>${cardTitle}</h3>
      <div class="mission-context"><span class="company-dot">${escapeHtml(companyInitials)}</span><span>${cardContext}</span></div>
      <div class="mission-bottom"><span class="mission-time">◷ <strong>${escapeHtml(task.time)}</strong> ${isComplete ? "logged" : "to complete"}</span><button class="mission-action" type="button" data-open-next="${task.id}" ${isComplete ? "disabled" : ""}>${actionLabel}</button></div>
    </article>`;
  }).join("");
}

function renderQuest() {
  const completeCount = state.tasks.filter((task) => task.status === "completed").length;
  const taskTotal = state.tasks.length;
  const totalXp = state.tasks.reduce((total, task) => total + task.xp, 0);
  const progress = (completeCount / state.tasks.length) * 100;
  const isComplete = completeCount === state.tasks.length;
  const isFirstRun = state.jobs.length === 0;
  document.querySelector("#welcome-title").innerHTML = isFirstRun ? "Start your <em>search</em> here." : "Make one <em>strong</em> move.";
  document.querySelector("#quest-count").textContent = completeCount;
  document.querySelector("#quest-total").textContent = taskTotal;
  document.querySelector("#orbit-count").textContent = String(completeCount).padStart(2, "0");
  document.querySelector("#orbit-total").textContent = String(taskTotal).padStart(2, "0");
  document.querySelector("#quest-progress-bar").style.width = `${progress}%`;
  document.querySelector("#quest-orbit").style.setProperty("--quest-progress", `${progress}%`);
  document.querySelector("#quest-status").textContent = isComplete ? "QUEST COMPLETE" : isFirstRun ? "READY TO BEGIN" : "IN PROGRESS";
  document.querySelector("#quest-message").textContent = isComplete ? "You kept the search moving today." : isFirstRun ? "Track one real opportunity to unlock your next moves." : "Three actions to keep the search moving.";
  document.querySelector("#quest-reward").innerHTML = isComplete ? "Quest reward claimed" : isFirstRun ? `Track your first job for <strong>+${totalXp} XP</strong>` : `Complete all ${taskTotal} for <strong>+${totalXp} XP</strong>`;
  document.querySelectorAll('[data-open-next=""]').forEach((button) => {
    button.innerHTML = isComplete ? "Review your progress <span>↗</span>" : "Open next mission <span>↗</span>";
  });
  document.querySelectorAll("[data-orbit-node]").forEach((node, index) => { node.dataset.complete = String(index < completeCount); });
}

function renderHeaderAndStats() {
  const level = Math.floor(state.xp / 200) + 2;
  document.querySelector("#level-number").textContent = String(level).padStart(2, "0");
  document.querySelector("#header-xp").textContent = `${state.xp} XP`;
  document.querySelector("#streak-count").textContent = String(state.streak).padStart(2, "0");
  document.querySelector("#response-rate").textContent = `${responseRate()}%`;
  document.querySelector("#application-count").textContent = state.stats.applications;
  document.querySelector("#interview-count").textContent = String(state.stats.interviews).padStart(2, "0");
  document.querySelector("#followup-count").textContent = String(state.stats.followups).padStart(2, "0");
  document.querySelector("#pipeline-total").textContent = state.pipeline.reduce((total, stage) => total + stage.count, 0);
  document.querySelector("#pipeline-label").textContent = state.jobs.length === 1 ? "active opportunity" : "active opportunities";
}

function renderPipelines() {
  const maxCount = Math.max(1, ...state.pipeline.map((stage) => stage.count));
  elements.miniPipeline.innerHTML = state.pipeline.map((stage) => `<span title="${escapeHtml(stage.key)}: ${stage.count}"></span>`).join("");
  elements.pipelineStages.innerHTML = state.pipeline.map((stage) => `<div class="stage-column"><div class="stage-bar"><span style="--bar-height:${Math.max(14, (stage.count / maxCount) * 100)}%;--stage-color:${stage.color}"></span></div><span class="stage-label">${escapeHtml(stage.key)}</span><strong class="stage-count">${stage.count}</strong></div>`).join("");
  const isFirstRun = state.jobs.length === 0;
  document.querySelector("#pipeline-note-title").textContent = isFirstRun ? "Start with one real opportunity." : "One follow-up is due today.";
  document.querySelector("#pipeline-note-copy").textContent = isFirstRun ? "Paste a job post and JobQuest will build your pipeline from there." : "Small nudge, big difference in response rate.";
  document.querySelector("#pipeline-note-mark").textContent = isFirstRun ? "↗" : "!";
  const pipelineAction = document.querySelector("#pipeline-note-action");
  if (isFirstRun) {
    pipelineAction.removeAttribute("data-open-next");
    pipelineAction.dataset.startTracking = "";
  } else {
    const nextTask = state.tasks.find((task) => task.status !== "completed");
    pipelineAction.removeAttribute("data-start-tracking");
    pipelineAction.dataset.openNext = getTask("followup")?.status === "completed" ? nextTask?.id || "" : "followup";
  }
}

function renderRoleMix() {
  elements.roleBars.innerHTML = state.stats.roleMix.length ? state.stats.roleMix.map((role) => `<div class="role-row"><label>${escapeHtml(role.label)}</label><div class="role-track"><span style="--role-width:${role.value}%"></span></div><output>${role.value}%</output></div>`).join("") : `<p class="role-empty">Your role mix will appear after you track a job.</p>`;
}

function renderJobLog() {
  const query = elements.logSearch.value.trim().toLowerCase();
  const filter = elements.logFilter.value;
  const filteredJobs = [...state.jobs].reverse().filter((job) => {
    const searchableText = `${job.title} ${job.company} ${job.category} ${job.nextAction || ""} ${job.notes || ""}`.toLowerCase();
    const matchesQuery = !query || searchableText.includes(query);
    const matchesFilter = filter === "all" || (filter === "active" ? !["Offer", "Closed"].includes(job.stage) : job.stage === filter);
    return matchesQuery && matchesFilter;
  });
  elements.logCount.textContent = filteredJobs.length;
  if (!filteredJobs.length) {
    elements.jobLog.innerHTML = !state.jobs.length && !query && filter === "all" ? `<div class="empty-log"><span class="empty-log-mark">JQ</span><div><strong>No jobs tracked yet.</strong><p>Paste one real job post to make your search visible and actionable.</p></div><button class="primary-button" type="button" data-start-tracking>Track your first job <span>↗</span></button></div>` : `<p class="log-empty">No tracked opportunities match that search yet.</p>`;
    return;
  }
  elements.jobLog.innerHTML = filteredJobs.map((job) => {
    const options = stageOptions.map((stage) => `<option value="${stage}" ${job.stage === stage ? "selected" : ""}>${stage}</option>`).join("");
    const postLink = isValidHttpUrl(job.url) ? `<a class="log-link" href="${escapeHtml(job.url)}" target="_blank" rel="noreferrer">View post ↗</a>` : `<span class="log-link">No URL</span>`;
    const sourceLabel = job.source === "Company site" ? "Company careers page" : job.source || "Other";
    const nextAction = job.nextAction || "No next action";
    const dueLabel = job.dueDate ? `Due ${formatDateLabel(job.dueDate)}` : "No due date";
    return `<div class="log-row"><div class="log-role"><span class="log-company-mark">${escapeHtml(job.initials || job.company.slice(0, 2).toUpperCase())}</span><div class="log-role-copy"><strong>${escapeHtml(job.title)}</strong><span>${escapeHtml(job.company)} · ${escapeHtml(job.category)}</span><span class="log-next-action">Next: ${escapeHtml(nextAction)} · ${escapeHtml(dueLabel)}</span></div></div><div class="log-cell"><span>PIPELINE STAGE</span><select class="stage-select" data-stage-job="${escapeHtml(job.id)}" aria-label="Update stage for ${escapeHtml(job.title)} at ${escapeHtml(job.company)}">${options}</select></div><div class="log-cell"><span>SOURCE</span><strong>${escapeHtml(sourceLabel)}</strong></div><div class="log-cell"><span>TRACKED</span><strong>${escapeHtml(job.trackedDate || "Today")}</strong></div><div class="log-actions">${postLink}<button class="log-edit" type="button" data-edit-job="${escapeHtml(job.id)}">Edit</button></div></div>`;
  }).join("");
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(value) {
  if (!value) return "No due date";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? "No due date" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function renderDueToday() {
  const dueJobs = state.jobs.filter((job) => job.dueDate === getLocalDateKey() && job.stage !== "Closed");
  elements.dueCount.textContent = dueJobs.length;
  if (!dueJobs.length) {
    const emptyCopy = state.jobs.length ? "Add a due date to a tracked job and it will appear here." : "Once you track a job, due actions will appear here.";
    elements.dueList.innerHTML = `<div class="due-empty"><span class="due-empty-mark">→</span><div><strong>No actions due today.</strong><p>${emptyCopy}</p></div></div>`;
    return;
  }
  elements.dueList.innerHTML = dueJobs.map((job) => `<div class="due-row"><div class="due-job"><span class="due-mark">${escapeHtml(job.initials || job.company.slice(0, 2).toUpperCase())}</span><div><strong>${escapeHtml(job.title)}</strong><span>${escapeHtml(job.company)} · ${escapeHtml(job.nextAction || "Choose your next action")}</span></div></div><span class="due-badge">TODAY</span><button class="log-edit" type="button" data-edit-job="${escapeHtml(job.id)}">Edit</button></div>`).join("");
}

function renderAchievements() {
  const unlockedCount = state.achievements.filter((achievement) => achievement.unlocked).length;
  document.querySelector("#achievement-count").textContent = unlockedCount;
  elements.achievementGrid.innerHTML = state.achievements.map((achievement) => `<article class="achievement-card ${achievement.unlocked ? "" : "is-locked"}"><div class="achievement-symbol">${escapeHtml(achievement.symbol)}</div><div><h3>${escapeHtml(achievement.title)}</h3><p>${escapeHtml(achievement.detail)}</p><div class="achievement-state">${achievement.unlocked ? "Unlocked" : "Locked"}</div></div></article>`).join("");
}

function renderAll() {
  renderTasks();
  renderQuest();
  renderHeaderAndStats();
  renderPipelines();
  renderRoleMix();
  renderDueToday();
  renderJobLog();
  renderAchievements();
}

function setFieldValue(id, value) {
  const field = document.querySelector(`#${id}`);
  if (field) field.value = value || "";
}

function addFollowOnTasks(job) {
  state.tasks.push(
    { id: "network", kind: "Network", title: job.title, company: job.company, category: job.category, location: job.location, source: job.source, stage: job.stage, time: "10 min", xp: 35, accent: "coral", status: "ready", jobId: job.id, note: "Look for a warm path into this opportunity." },
    { id: "followup", kind: "Follow up", title: job.title, company: job.company, category: job.category, location: job.location, source: job.source, stage: job.stage, time: "8 min", xp: 40, accent: "blue", status: "ready", jobId: job.id, note: "Keep the conversation moving." },
  );
}

function populateRoleCategories(selectedCategory = "") {
  const customCategories = (state.customCategories || []).filter((category, index, categories) => category && categories.findIndex((item) => item.toLowerCase() === category.toLowerCase()) === index);
  const categories = [...presetRoleCategories, ...customCategories.filter((category) => !presetRoleCategories.some((preset) => preset.toLowerCase() === category.toLowerCase()))];
  elements.roleCategory.innerHTML = `${categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")}<option value="custom">+ Add custom category…</option>`;
  const isCustomCategory = selectedCategory && !categories.some((category) => category.toLowerCase() === selectedCategory.toLowerCase());
  elements.roleCategory.value = isCustomCategory ? "custom" : selectedCategory || presetRoleCategories[0];
  elements.customCategoryWrap.hidden = elements.roleCategory.value !== "custom";
  elements.customCategoryInput.value = isCustomCategory ? selectedCategory : "";
  elements.categoryError.textContent = "";
}

function toggleCustomCategory() {
  const isCustom = elements.roleCategory.value === "custom";
  elements.customCategoryWrap.hidden = !isCustom;
  elements.categoryError.textContent = "";
  if (isCustom) elements.customCategoryInput.focus();
}

function getSelectedRoleCategory() {
  return elements.roleCategory.value === "custom" ? elements.customCategoryInput.value.trim() : elements.roleCategory.value;
}

function rememberCustomCategory(category) {
  if (!category || presetRoleCategories.some((preset) => preset.toLowerCase() === category.toLowerCase())) return;
  state.customCategories ||= [];
  if (!state.customCategories.some((savedCategory) => savedCategory.toLowerCase() === category.toLowerCase())) state.customCategories.push(category);
}

function openMission(taskId) {
  const task = getTask(taskId);
  if (!task || task.status === "completed") return;
  elements.dialog.dataset.taskId = task.id;
  document.querySelector("#dialog-kicker").textContent = `${task.kind.toUpperCase()} MISSION`;
  document.querySelector("#dialog-title").textContent = task.kind === "Apply" ? "Track this job" : `${task.kind} ${task.kind === "Network" ? "this contact" : "this opportunity"}`;
  document.querySelector("#dialog-intro").textContent = task.kind === "Apply" ? "Paste the job post you’re applying for. JobQuest will keep the opportunity connected to your progress." : `Keep ${task.company} moving through your job-search pipeline. Choose the opportunity you want to update.`;
  document.querySelector("#capture-fields").hidden = task.kind !== "Apply";
  document.querySelector("#select-fields").hidden = task.kind === "Apply";
  document.querySelector("#dialog-submit").innerHTML = "Start mission <span>↗</span>";
  document.querySelector("#url-error").textContent = "";
  if (task.kind === "Apply") {
    populateRoleCategories(task.category);
    setFieldValue("job-url", "");
    setFieldValue("job-title", task.title);
    setFieldValue("company-name", task.company);
    setFieldValue("job-location", task.location);
    setFieldValue("job-source", task.source);
    setFieldValue("job-next-action", task.nextAction || "Apply");
    setFieldValue("job-due-date", task.dueDate);
    setFieldValue("job-notes", task.notes);
  } else {
    const jobSelect = document.querySelector("#existing-job");
    jobSelect.innerHTML = state.jobs.map((job) => `<option value="${escapeHtml(job.id)}" ${job.id === task.jobId ? "selected" : ""}>${escapeHtml(job.title)} at ${escapeHtml(job.company)} · ${escapeHtml(job.stage)}</option>`).join("");
    updateSelectedJobPreview();
  }
  elements.dialog.showModal();
}

function openJobEditor(jobId) {
  const job = getJob(jobId);
  if (!job) return;
  elements.editDialog.dataset.jobId = job.id;
  setFieldValue("edit-job-url", job.url);
  setFieldValue("edit-job-title", job.title);
  setFieldValue("edit-company-name", job.company);
  setFieldValue("edit-role-category", job.category);
  setFieldValue("edit-job-location", job.location);
  setFieldValue("edit-job-next-action", job.nextAction || "Apply");
  setFieldValue("edit-job-due-date", job.dueDate);
  setFieldValue("edit-job-source", job.source || "Other");
  setFieldValue("edit-job-stage", job.stage);
  setFieldValue("edit-job-notes", job.notes);
  document.querySelector("#edit-url-error").textContent = "";
  elements.editDialog.showModal();
}

function updateSelectedJobPreview() {
  const job = getJob(document.querySelector("#existing-job").value);
  document.querySelector("#selected-job-preview").innerHTML = job ? `<strong>${escapeHtml(job.title)} at ${escapeHtml(job.company)}</strong><br>${escapeHtml(job.category)} · ${escapeHtml(job.location)} · Currently ${escapeHtml(job.stage)}` : "No tracked opportunity selected.";
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function startMission(event) {
  event.preventDefault();
  const task = getTask(elements.dialog.dataset.taskId);
  if (!task) return;
  if (task.kind === "Apply") {
    const url = document.querySelector("#job-url").value.trim();
    if (!isValidHttpUrl(url)) {
      document.querySelector("#url-error").textContent = "Paste a valid http:// or https:// job post URL.";
      document.querySelector("#job-url").focus();
      return;
    }
    const category = getSelectedRoleCategory();
    if (!category) {
      elements.categoryError.textContent = "Add a category so you can reuse it later.";
      elements.customCategoryInput.focus();
      return;
    }
    const newJob = {
      id: `tracked-${Date.now()}`,
      title: document.querySelector("#job-title").value.trim() || "Product Designer",
      company: document.querySelector("#company-name").value.trim() || "New company",
      category,
      location: document.querySelector("#job-location").value.trim() || "Location to confirm",
      source: document.querySelector("#job-source").value,
      nextAction: document.querySelector("#job-next-action").value,
      dueDate: document.querySelector("#job-due-date").value,
      notes: document.querySelector("#job-notes").value.trim(),
      stage: "Saved",
      initials: (document.querySelector("#company-name").value.trim() || "NC").slice(0, 2).toUpperCase(),
      trackedDate: "Aug 25, 2026",
      url,
    };
    state.isDemo = false;
    rememberCustomCategory(category);
    state.jobs.push(newJob);
    adjustPipelineStage("Saved", 1);
    task.jobId = newJob.id;
    task.title = newJob.title;
    task.company = newJob.company;
    task.category = newJob.category;
    task.location = newJob.location;
    task.source = newJob.source;
    task.nextAction = newJob.nextAction;
    task.dueDate = newJob.dueDate;
    task.notes = newJob.notes;
    if (state.tasks.length === 1) addFollowOnTasks(newJob);
  } else {
    state.isDemo = false;
    task.jobId = document.querySelector("#existing-job").value;
  }
  task.status = "active";
  syncUserStats();
  updateAchievements();
  persistState();
  elements.dialog.close();
  renderAll();
  showToast(`${task.kind} mission started — make the next move.`);
}

function saveJobEdits(event) {
  event.preventDefault();
  const job = getJob(elements.editDialog.dataset.jobId);
  if (!job) return;
  const url = document.querySelector("#edit-job-url").value.trim();
  if (!isValidHttpUrl(url)) {
    document.querySelector("#edit-url-error").textContent = "Paste a valid http:// or https:// job post URL.";
    document.querySelector("#edit-job-url").focus();
    return;
  }
  state.isDemo = false;
  job.url = url;
  job.title = document.querySelector("#edit-job-title").value.trim() || "Untitled role";
  job.company = document.querySelector("#edit-company-name").value.trim() || "New company";
  job.category = document.querySelector("#edit-role-category").value.trim() || "Other";
  job.location = document.querySelector("#edit-job-location").value.trim() || "Location to confirm";
  job.nextAction = document.querySelector("#edit-job-next-action").value || "Other";
  job.dueDate = document.querySelector("#edit-job-due-date").value;
  job.source = document.querySelector("#edit-job-source").value || "Other";
  job.notes = document.querySelector("#edit-job-notes").value.trim();
  job.initials = job.company.slice(0, 2).toUpperCase();
  moveJobStage(job, document.querySelector("#edit-job-stage").value);
  syncUserStats();
  updateAchievements();
  persistState();
  elements.editDialog.close();
  renderAll();
  showToast(`${job.company} updated.`);
}

function completeTask(taskId) {
  const task = getTask(taskId);
  if (!task || task.status !== "active") return;
  state.isDemo = false;
  task.status = "completed";
  state.xp += task.xp;
  state.stats.weeklyActions += 1;
  const job = getJob(task.jobId);
  if (task.kind === "Apply") {
    state.stats.applications += 1;
    state.newApplications += 1;
    moveJobStage(job, "Applied");
  } else if (task.kind === "Network") {
    state.referrals += 1;
    moveJobStage(job, "Referral");
  } else {
    state.stats.followups += 1;
    state.stats.responses += 1;
  }
  syncUserStats();
  updateAchievements();
  persistState();
  renderAll();
  showToast(`${task.kind} complete — +${task.xp} XP earned.`);
}

function updateAchievements() {
  const achievementMap = {
    "First Application": state.jobs.length >= 1,
    "Five Strong Applications": state.newApplications >= 5,
    "Follow-Up Finisher": state.stats.followups >= 10,
    "Interview Ready": state.stats.interviews >= 3,
    "Role Explorer": new Set(state.jobs.map((job) => job.category)).size >= 3,
  };
  state.achievements.forEach((achievement) => {
    if (Object.hasOwn(achievementMap, achievement.title)) achievement.unlocked = achievementMap[achievement.title];
    if (achievement.title === "Referral Builder") achievement.unlocked = state.referrals >= 2;
  });
}

function showToast(message) {
  document.querySelector("#toast-message").textContent = message;
  elements.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 3200);
}

function updateJobStage(jobId, nextStage) {
  const job = getJob(jobId);
  if (!job || !stageOptions.includes(nextStage)) return;
  state.isDemo = false;
  moveJobStage(job, nextStage);
  syncUserStats();
  persistState();
  renderAll();
  showToast(`${job.company} moved to ${nextStage}.`);
}

function loadDemoState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cloneState(defaultState)));
  window.location.reload();
}

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-start-tracking]")) {
    openMission("apply");
    return;
  }
  const editButton = event.target.closest("[data-edit-job]");
  if (editButton) {
    openJobEditor(editButton.dataset.editJob);
    return;
  }
  const nextButton = event.target.closest("[data-open-next]");
  if (nextButton) {
    const requestedTask = nextButton.dataset.openNext ? getTask(nextButton.dataset.openNext) : getIncompleteTask();
    if (nextButton.dataset.openNext && requestedTask?.status === "active") completeTask(requestedTask.id);
    else if (requestedTask) openMission(requestedTask.id);
    else document.querySelector("#tracker").scrollIntoView({ behavior: "smooth" });
  }
  if (event.target.closest("[data-close-dialog]")) elements.dialog.close();
  if (event.target.closest("[data-close-edit-dialog]")) elements.editDialog.close();
});

elements.form.addEventListener("submit", startMission);
elements.editForm.addEventListener("submit", saveJobEdits);
document.querySelector("#existing-job").addEventListener("change", updateSelectedJobPreview);
document.querySelector("#job-url").addEventListener("input", () => { document.querySelector("#url-error").textContent = ""; });
document.querySelector("#edit-job-url").addEventListener("input", () => { document.querySelector("#edit-url-error").textContent = ""; });
elements.roleCategory.addEventListener("change", toggleCustomCategory);
elements.customCategoryInput.addEventListener("input", () => { elements.categoryError.textContent = ""; });
elements.dialog.addEventListener("click", (event) => { if (event.target === elements.dialog) elements.dialog.close(); });
elements.editDialog.addEventListener("click", (event) => { if (event.target === elements.editDialog) elements.editDialog.close(); });
document.addEventListener("change", (event) => {
  const stageSelect = event.target.closest("[data-stage-job]");
  if (stageSelect) updateJobStage(stageSelect.dataset.stageJob, stageSelect.value);
  if (event.target === elements.logFilter) renderJobLog();
});
elements.logSearch.addEventListener("input", renderJobLog);
document.querySelector("#load-demo").addEventListener("click", loadDemoState);
document.querySelector("#reset-demo").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
});

syncUserStats();
populateRoleCategories();
renderAll();
