import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Task } from "../types";

type Props = {
  tasks: Task[];
};

// Color mapping for each focus level
const focusColors: Record<"Low" | "Medium" | "High", string> = {
  Low: "#FF6961",     // red
  Medium: "#FBD148",  // yellow
  High: "#77DD77",    // green
};

const LineChartByDate: React.FC<Props> = ({ tasks }) => {
  // Map to hold total minutes spent by focus level for each date
  const dateMap: Record<string, { Low: number; Medium: number; High: number; Total: number }> = {};

  tasks.forEach((t) => {
    const date = new Date(t.date); // ensure it's a Date object
    const dateKey = date.toISOString().split("T")[0]; // convert to string: "YYYY-MM-DD"

    if (!dateMap[dateKey]) {
      // Initialize focus levels and total for the date
        dateMap[dateKey] = { Low: 0, Medium: 0, High: 0, Total: 0 };
    }
    // Add time to appropriate focus level and to total
    dateMap[dateKey][t.focus] += t.timeSpent;
    dateMap[dateKey].Total += t.timeSpent;
  });

  // Convert the dateMap to an array format suitable for Recharts
  const data = Object.entries(dateMap).map(([date, focusData]) => ({
    date,
    ...focusData,
  }));

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h3>Productivity Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis
            label={{
              value: "Minutes",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Low"
            stroke={focusColors.Low}
            strokeWidth={2}
            name="Low Focus"
          />
          <Line
            type="monotone"
            dataKey="Medium"
            stroke={focusColors.Medium}
            strokeWidth={2}
            name="Medium Focus"
          />
          <Line
            type="monotone"
            dataKey="High"
            stroke={focusColors.High}
            strokeWidth={2}
            name="High Focus"
          />
          <Line
            type="monotone"
            dataKey="Total"
            stroke="#000000"
            strokeWidth={2}
            strokeDasharray="4 2"
            name="Total Minutes"
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
        <strong>Focus Level Key:</strong>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li><span style={{ color: focusColors.Low }}>■</span> Low Focus (Red)</li>
          <li><span style={{ color: focusColors.Medium }}>■</span> Medium Focus (Yellow)</li>
          <li><span style={{ color: focusColors.High }}>■</span> High Focus (Green)</li>
          <li><span style={{ color: "#000" }}>■</span> Total Minutes (Black, dashed)</li>
        </ul>
      </div>
    </div>
  );
};

export default LineChartByDate;
