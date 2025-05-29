export type Task = {
  name: string;
  timeSpent: number;
  focus: "Low" | "Medium" | "High";
  date: string | Date; 
};
