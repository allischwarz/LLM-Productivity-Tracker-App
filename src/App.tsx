import React, { useState, useEffect } from "react";
import TaskInput from "./components/TaskInput";
import { Task } from "./types";
import { saveTasks, loadTasks, saveLastSummaryDate, loadLastSummaryDate, saveWeeklySummary, loadWeeklySummaries } from "./services/storage";
import WeeklySummary from "./components/WeeklySummary";
import SearchSummary from "./components/SearchSummary";
import TaskChart from "./components/TaskChart";
import TaskList from "./components/TaskList";
import LineChartByDate from "./components/LineChartByDate";
import { getWeekRange, isNewWeek } from "./utils/weekUtils";
import Modal from "react-modal";

// Helper function to format weekly date ranges like "3 May 2025 – 9 May 2025"
const formatRange = (start: Date, end: Date) =>
  `${start.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} – ${end.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}`;


function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks());
  const [summary, setSummary] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [lastSummaryRange, setLastSummaryRange] = useState<{ start: Date; end: Date } | null>(null);
  const [weeklySummaries, setWeeklySummaries] = useState<Record<string, string>>(loadWeeklySummaries());

  // Auto-generate weekly summaries when tasks are added
  useEffect(() => {
  
  // Save tasks to localStorage on any update
  saveTasks(tasks);

  // Group tasks by week
  const weeksMap: Record<string, Task[]> = {};
  for (const task of tasks) {
    const taskDate = new Date(task.date);
    const { start, end } = getWeekRange(taskDate);
    const label = formatRange(start, end);

    if (!weeksMap[label]) {
      weeksMap[label] = [];
    }
    weeksMap[label].push(task);
  }

  // Generate summaries for weeks with tasks
  const generateAllSummaries = async () => {
    for (const [label, weekTasks] of Object.entries(weeksMap)) {
      // 🧠 Remove the check that prevents regeneration
      const res = await fetch("http://localhost:8000/weekly-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: weekTasks, label }),
      });

      const data = await res.json();
      console.log(`✅ Generated summary for ${label}:`, data.summary);

      saveWeeklySummary(label, data.summary);
      setWeeklySummaries(prev => ({ ...prev, [label]: data.summary }));
    }
  };


  if (tasks.length > 0) {
    generateAllSummaries();
  }
}, [tasks]);




  // On app load, check for missing summaries from prior weeks
  useEffect(() => {
    const lastDateStr = loadLastSummaryDate();
    const lastDate = lastDateStr ? new Date(lastDateStr) : null;
    const now = new Date();

    let dateCursor = lastDate ?? new Date(tasks[0]?.date || now.toISOString());
    dateCursor.setDate(dateCursor.getDate() + 1); // move to next day after last summary

    const summariesToGenerate: { start: Date; end: Date }[] = [];

    // Identify all missing summary weeks
    while (getWeekRange(dateCursor).end < now) {
      const range = getWeekRange(dateCursor);
      console.log("Checking week:", range.start.toDateString(), "-", range.end.toDateString());

      const label = formatRange(range.start, range.end);
      if (!weeklySummaries[label]) summariesToGenerate.push(range);
      dateCursor = new Date(range.end);
      dateCursor.setDate(dateCursor.getDate() + 1); // next week
    }

    // Generate missing summaries
    const generateAll = async () => {
      for (const range of summariesToGenerate) {
        const weekTasks = tasks.filter(t => {
          const taskDate = new Date(t.date);
          return taskDate >= range.start && taskDate <= range.end;
        });

        const label = formatRange(range.start, range.end); 

        console.log(`🗂️ Week: ${label}`);
        console.log("📌 Tasks this week:", weekTasks);

        if (weekTasks.length === 0) {
          console.log(`⚠️ Skipping week ${label} — no tasks`);
          continue;
        }

        const res = await fetch("http://localhost:8000/weekly-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasks: weekTasks }),
        });
        const data = await res.json();

        console.log(`✅ Generated summary for ${label}:`, data.summary);

        saveWeeklySummary(label, data.summary);

        const updatedSummaries = { ...weeklySummaries, [label]: data.summary };
        setWeeklySummaries(updatedSummaries);

        // Only update last summary date and modal on final iteration
        if (range === summariesToGenerate[summariesToGenerate.length - 1]) {
          setLastSummaryRange(range);
          saveLastSummaryDate(range.end.toISOString());
          setSummary(data.summary);
          setShowModal(true);
        }


      }
    };


    console.log("📆 Now:", now.toISOString());
    console.log("🕓 Last summary date:", lastDate?.toISOString() || "null");
    console.log("📋 First task date:", tasks[0]?.date || "No tasks");
    console.log("📅 Summaries to generate:", summariesToGenerate);



    if (summariesToGenerate.length > 0) generateAll();
  }, []);

  // Add a new task to the list
  const handleAddTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  // Remove a task
  const handleDeleteTask = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  // Edit an existing task
  const handleEditTask = (index: number, updated: Task) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = updated;
    setTasks(updatedTasks);
  };

  // Clear all tasks 
  const handleClearAll = () => {
    if (window.confirm("Clear all tasks?")) {
      setTasks([]);
    }
  };
  
  // Manual summary generation for a week (optional override)
  const generateSummary = async (targetDate: Date = new Date(), silent = false) => {
    const range = getWeekRange(new Date(targetDate));

    const weekTasks = tasks.filter(t => {
      const taskDate = new Date(t.date);
      return taskDate >= range.start && taskDate <= range.end;
    });

    if (weekTasks.length === 0) {
      alert("No tasks found for this week.");
      return;
    }

    const label = formatRange(range.start, range.end);

    // Avoid regenerating if already exists
    if (weeklySummaries[label]) {
      alert(`Summary for ${label} already exists.`);
      return;
    }

    const res = await fetch("http://localhost:8000/weekly-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks: weekTasks }),
    });

    const data = await res.json();
    saveWeeklySummary(label, data.summary);
    setWeeklySummaries(loadWeeklySummaries());
    setSummary(data.summary);
    setLastSummaryRange(range);

    saveLastSummaryDate(range.end.toISOString());

    if (!silent) setShowModal(true);
  };


  // UI formatting
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{textAlign: "center"}}>Productivity Tracker</h1>

      <h2 style = {{marginTop: "0.5rem"}}>Task List</h2>

      <TaskInput onAddTask={handleAddTask} />
      <button onClick={handleClearAll} style={{ marginBottom: "1rem" }}>
        Clear All Tasks
      </button>

      <TaskList tasks={tasks} onDelete={handleDeleteTask} onEdit={handleEditTask} />

    

      <h2 style={{ marginTop: "2rem" }}>Weekly Summary History</h2>
        <ul style={{ paddingLeft: "1rem" }}>
          {Object.entries(weeklySummaries)
            .filter(([range, text]) => text)
            .sort(([a], [b]) => {
              const parseDate = (label: string) => {
                const [day, month, year] = label.split(" – ")[0].split(" ");
                return new Date(`${day} ${month} ${year}`);
              };
              return parseDate(a).getTime() - parseDate(b).getTime();
            })

            .map(([range, text]) => (
              <li key={range} style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ marginBottom: "0.5rem" }}>{range}</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{text}</p>
              </li>
            ))}
        </ul>


      <SearchSummary />



      <h2 style = {{marginTop: "2rem", marginBottom: "0.5rem"}}>Productivity Visualizations</h2>
      <TaskChart tasks={tasks} />

      <LineChartByDate tasks={tasks} />

      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} ariaHideApp={false}>
        <h2>It's a new week! Here's your summary from last week:</h2>
        {lastSummaryRange && (
          <p>
            <strong>
              {formatRange(lastSummaryRange.start, lastSummaryRange.end)}
            </strong>
          </p>
        )}
        <p style={{ whiteSpace: "pre-wrap" }}>{summary}</p>
        <button onClick={() => setShowModal(false)}>Close</button>
      </Modal>
    </div>

    
  );
}



export default App;

