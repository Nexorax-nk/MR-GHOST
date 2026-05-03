import json
import uuid
from datetime import datetime

PATH = "team_decisions.json"

def get_all_memories():
    try:
        with open(PATH) as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_memory(decision: dict):
    memories = get_all_memories()
    decision["id"] = f"MEM-{str(len(memories)+1).zfill(3)}"
    decision["created_at"] = datetime.now().isoformat()
    memories.append(decision)
    with open(PATH, "w") as f:
        json.dump(memories, f, indent=2)
    return decision
