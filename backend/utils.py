from datetime import datetime, timedelta

def get_week_range(date: datetime):

    """
    Given a datetime object, returns the start and end of the week it belongs to.
    - The week starts on Monday and ends on Sunday.
    
    Args:
        date (datetime): A date within the desired week.
    
    Returns:
        (datetime, datetime): A tuple containing the start (Monday) and end (Sunday) dates of the week.
    """

    start = date - timedelta(days=date.weekday())  # Monday
    end = start + timedelta(days=6)                # Sunday
    return start, end

def format_range(start: datetime, end: datetime):

    """
    Formats a start and end datetime into a human-readable weekly range string.

    Args:
        start (datetime): Start of the range (usually Monday).
        end (datetime): End of the range (usually Sunday).

    Returns:
        str: A formatted string like 'Mon 27 May 2024 – Sun 02 Jun 2024'
    """
    
    return f"{start.strftime('%a %d %b %Y')} – {end.strftime('%a %d %b %Y')}"
