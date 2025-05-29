import React, { useState } from "react";
import { Task } from "../types";

// Props expected: a list of tasks, and handlers for deleting/editing tasks
type Props = {
  tasks: Task[];
  onDelete: (index: number) => void;
  onEdit: (index: number, updated: Task) => void;
};

const TaskList: React.FC<Props> = ({ tasks, onDelete, onEdit }) => {
  // Index of the task currently being edited (null if none)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

   // Holds temporary state of the task being edited
  const [editedTask, setEditedTask] = useState<Task>({
    name: "",
    timeSpent: 0,
    focus: "Medium",
    date: new Date().toISOString().slice(0, 10), // default to today
  });

  // Begin editing the task at the given index
  const startEdit = (index: number) => {
    setEditingIndex(index);  // set the editing index
    setEditedTask(tasks[index]);  // populate the form with task data
  };

  // Submit the updated task
  const submitEdit = () => {
    if (editingIndex !== null) {
      onEdit(editingIndex, editedTask); // call parent handler to update task
      setEditingIndex(null);  // exit edit mode
    }
  };

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks.map((task, idx) => (
        <li key={idx} style={{ marginBottom: "0.5rem" }}>
          {editingIndex === idx ? (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <input
                value={editedTask.name}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, name: e.target.value })
                }
                placeholder="Task name"
              />
              <input
                type="number"
                value={editedTask.timeSpent}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    timeSpent: Number(e.target.value),
                  })
                }
              />
              <select
                value={editedTask.focus}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    focus: e.target.value as Task["focus"],
                  })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <input
                type="date"
                value={
                    typeof editedTask.date === "string"
                        ? editedTask.date
                        : new Date(editedTask.date).toISOString().split("T")[0]
                }
                onChange={(e) =>
                  setEditedTask({ ...editedTask, date: e.target.value })
                }
              />
              <button onClick={submitEdit}>Save</button>
              <button onClick={() => setEditingIndex(null)}>Cancel</button>
            </div>
          ) : (
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    backgroundColor:
                    task.focus === "High"
                        ? "#e0ffe0"  //green
                        : task.focus === "Medium"
                        ? "#fff5cc"  //yellow
                        : "#ffe0e0",  //red
                    border: "1px solid #ccc",
                }}
                >
                <span>
                    <strong>{task.name}</strong>{` — ${task.timeSpent} min — Focus: ${task.focus} — ${task.date}`}
                </span>

                <div>
                    <button onClick={() => startEdit(idx)}>Edit</button>{" "}
                    <button onClick={() => onDelete(idx)}>Delete</button>
                </div>
                </div>

          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
