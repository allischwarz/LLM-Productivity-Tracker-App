import React, { useState } from "react";

// Type definition for each search result
type SearchResult = {
  summary: string; // Summary text returned by the backend
  similarity: number; // Similarity score (0-1) with the user's query
  label: string; // Week label (e.g., "Mon 20 May 2025 – Sun 26 May 2025")
};

type Props = {}; // No props passed into this component

// Functional component for searching past summaries
const SearchSummary: React.FC<Props> = () => {
  // State to hold user input query
  const [query, setQuery] = useState("");

  // State to hold array of search results
  const [results, setResults] = useState<SearchResult[]>([]);

  // Function to send the search query to the backend and update results
  const handleSearch = async () => {
    const res = await fetch("http://localhost:8000/search-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }), // send query string in request body
    });
    const data = await res.json(); // parse the JSON response
    setResults(data.results);  // update the results state
  };

  return (
    <div style={{ marginTop: "3rem" }}>
      <h2>Search Past Summaries</h2>
      <input
        type="text"
        placeholder="e.g., low focus, lots of meetings..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "60%", padding: "0.5rem", marginRight: "0.5rem" }}
      />
      <button onClick={handleSearch}>Search</button>

      <ul style={{ marginTop: "1rem" }}>
        {results.map((r, idx) => (
          <li key={idx}>
            <h3 style={{ marginBottom: "0.25rem" }}>{r.label}</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{r.summary}</p>

            <p style={{ fontSize: "0.9rem", color: "#888" }}>
              Similarity: {Math.round(r.similarity * 100)}%
            </p>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSummary;
