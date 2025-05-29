// Calculates the start (Monday) and end (Sunday) of the week for a given date.
export function getWeekRange(date: Date = new Date()) {
  const day = date.getDay(); // 0 = Sunday
  
  // Calculate how many days to subtract to get to Monday
  // If today is Sunday (0), we need to subtract 6 days to get to previous Monday
  // Otherwise, subtract (day - 1) to get to Monday of the current week
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday); // move to monday
  monday.setHours(0, 0, 0, 0); //set to start of the day

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6); //add 6 says to get to sunday
  sunday.setHours(23, 59, 59, 999); //set to end of day

  return { start: monday, end: sunday };
}

// Determines if a new week has started compared to the last summary generation date; returns true if a new week has started, false otherwise
export function isNewWeek(lastGenerated: string | null): boolean {
  if (!lastGenerated) return true; // If no record exists, treat it as a new week
  const lastDate = new Date(lastGenerated); // parse the last generation date
  const now = new Date(); // curent date
  const thisWeek = getWeekRange(now).start; // get the start of this week (monday)
  return lastDate < thisWeek; //if last summary was before this week, it's a new week
}
