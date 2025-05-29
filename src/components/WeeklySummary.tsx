import React from "react";

// Define React component that takes 2 props: summary and onGenerate
// summary: current summary string or 'null' if  none yet
// onGenerate: function that runs when the button is clicked
type Props = { 
    summary: string | null; 
    onGenerate: () => void;
};

// Declare component using TypeScript and destructure the props in the parameter list
const WeeklySummary: React.FC<Props> = ({ summary, onGenerate }) => (

// add spacing; create button that triggers the summary generator function passed from the parent:
  <div style={{ marginTop: "2rem" }}>  
    <button onClick={onGenerate}>Generate Weekly Summary</button> 
    {summary && ( // if a summary exists, show it below the button; whitespace: "pre-wrap" keeps line breaks from the backend intact
      <p style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>{summary}</p>
    )}
  </div>
);


export default WeeklySummary; // end component and export for App.tsx