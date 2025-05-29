import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Task } from "../types";

// Define props type: expects an array of Task objects
type Props = {
  tasks: Task[];
};

// Define colors for each focus level
const focusColors: Record<Task["focus"], string> = {
  Low: "#FF6961",     // red
  Medium: "#FBD148",  // yellow
  High: "#77DD77",    // green
};

// Functional component to render a stacked bar chart of task time by focus level
const TaskChart: React.FC<Props> = ({ tasks }) => {
  // Group tasks by name and accumulate time spent at each focus level
  const grouped: Record<string, { name: string; Low: number; Medium: number; High: number }> = {};

  tasks.forEach((task) => {
    const name = task.name; // Task name is used as a unique key
    if (!grouped[name]) {
      // Initialize if not already grouped
      grouped[name] = { name, Low: 0, Medium: 0, High: 0 };
    }
    // Add time spent to the correct focus level
    grouped[name][task.focus] += task.timeSpent;
  });

  // Convert grouped object into array format for Recharts
  const data = Object.values(grouped);


  return (
    <div style={{textAlign: "center", marginTop: "2rem" }}>
      <h3>Time Spent by Task</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            label={{ value: "Task", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            label={{ value: "Time (min)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Bar dataKey="Low" stackId="a" fill={focusColors.Low} />
          <Bar dataKey="Medium" stackId="a" fill={focusColors.Medium} />
          <Bar dataKey="High" stackId="a" fill={focusColors.High} />
        </BarChart>
      </ResponsiveContainer>


      <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        <strong>Focus Level Key:</strong>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li><span style={{ color: focusColors.Low }}>■</span> Low Focus (red)</li>
          <li><span style={{ color: focusColors.Medium }}>■</span> Medium Focus (yellow)</li>
          <li><span style={{ color: focusColors.High }}>■</span> High Focus (green)</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskChart;

