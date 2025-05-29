# models.py
from pydantic import BaseModel  #BaseModel is the base class from which all Pydantic models inherit
from typing import List, Literal  #List: a list of items (e.g., multiple tasks); #Literal: used to restrict focus values to "Low", "Med", "High"

class Task(BaseModel):  # Represents a single task with associated time, focus, and date
    name: str # Name or description of the task
    timeSpent: int # Time spent on the task in minutes
    focus: Literal["Low", "Medium", "High"] # Allowed focus levels to ensure consistency
    date: str # ISO format date string when the task was done

class TaskBatch(BaseModel):  #Defines container object that wraps a list of tasks; frontend will use this to send POST request for the weekly summary
    tasks: List[Task] # List of Task objects
    label: str # Weekly label used to categorize or tag the batch (e.g., "May 1–7, 2025")
