import { Task } from "../types";

// Keys used for storing in localStorage
const TASKS_KEY = "productivity_tasks";

const LAST_SUMMARY_KEY = "last_summary_timestamp";

// Save tasks to localStorage
export function saveTasks(tasks: Task[]) {
  console.log("Saving to localStorage:", tasks);  // 👈 add this
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// load tasks from localStorage and convert date strings back into Date objects
export function loadTasks(): Task[] {
  const raw = localStorage.getItem(TASKS_KEY); // retrieve saved data
  console.log("Loaded from localStorage:", raw); //debugging log
  if (!raw) return []; //return empty list if nothing is saved
  try {
    return (JSON.parse(raw) as Task[]).map(task => ({
      ...task,
      date: new Date(task.date), // convert string to Date
    }));
  } catch {
    return [];  // fallback - return empty list on parse rror
  }
}

// save date when the last weekly summary was generated
export function saveLastSummaryDate(date: string) {
  localStorage.setItem(LAST_SUMMARY_KEY, date);
}

// load last summary date from localStorage
export function loadLastSummaryDate(): string | null {
  return localStorage.getItem(LAST_SUMMARY_KEY);
}

// save a weekly summary associated with a given week label
export function saveWeeklySummary(weekLabel: string, summary: string) {
  const existing = loadWeeklySummaries();
  existing[weekLabel] = summary;
  localStorage.setItem("weeklySummaries", JSON.stringify(existing));
}

// load all saved weekly summaries
export function loadWeeklySummaries(): Record<string, string> {
  const saved = localStorage.getItem("weeklySummaries");
  return saved ? JSON.parse(saved) : {};
}



