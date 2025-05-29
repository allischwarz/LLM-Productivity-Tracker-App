import React, { useState } from "react";
import { Task } from "../types";

// Props type: expects a callback `onAddTask` to be passed from parent
type Props = {
  onAddTask: (task: Task) => void;
};

// React component for inputting a single task
const TaskInput: React.FC<Props> = ({ onAddTask }) => {
  // Local state to hold form input values
  const [name, setName] = useState("");  // Task name
  const [timeSpent, setTimeSpent] = useState(0);  // Time spent in minutes
  const [focus, setFocus] = useState<"Low" | "Medium" | "High">("Medium");  //Focus level

  // Default to today's date (YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  // Handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    
    // Validation: require name and positive time
    if (!name || timeSpent <= 0) return;

    // Fallback to today's date if empty
    const finalDate = date.trim() === "" ? today : date;

    // Call parent function to add task
    onAddTask({ name, timeSpent, focus, date: finalDate });

    // Reset form values
    setName("");
    setTimeSpent(0);
    setFocus("Medium");
    setDate(today);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
      <input
        type="text"
        placeholder="Task name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Time (min)"
        value={timeSpent}
        onChange={(e) => setTimeSpent(Number(e.target.value))}
        required
        min={1}
      />
      <select value={focus} onChange={(e) => setFocus(e.target.value as any)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskInput;

