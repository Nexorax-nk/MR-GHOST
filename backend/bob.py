import os
import json
import logging
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()
logger = logging.getLogger(__name__)

# Initialize OpenAI Client (IBM Bob Integration)
api_key = os.getenv("OPENAI_API_KEY", "")
demo_mode = os.getenv("DEMO_MODE", "false").lower() == "true"

client = AsyncOpenAI(
    api_key=api_key if api_key else "dummy-key"
)

def is_mock_mode():
    """Check if we should use mock data instead of real API calls"""
    if demo_mode:
        logger.info("Demo mode is enabled")
        return True
    
    key = os.getenv("OPENAI_API_KEY", "")
    is_mock = not key or key == "dummy-key" or key == "your_openai_api_key_here"
    
    if is_mock:
        logger.warning("No valid OpenAI API key found. Using mock mode.")
    
    return is_mock

async def analyze_pr(diff: str, memories: list) -> list:
    """
    Code Mode: IBM Bob analyzes the PR diff semantically and detects conflicts
    based on past architectural decisions in the memory bank.
    """
    if is_mock_mode():
        print("WARNING: No valid OPENAI_API_KEY found. Falling back to mock implementation.")
        conflicts = []
        if "token_cache" in diff or "{}" in diff:
            for mem in memories:
                if mem.get("id") == "MEM-001":
                    conflicts.append({
                        "memory_id": mem["id"],
                        "conflict_reasoning": "I detected a semantic violation: The PR introduces in-memory dictionary caching (`token_cache = {}`) for authentication tokens. This violates the past decision to NEVER cache auth token responses in any storage layer due to the critical incident where revoked tokens were served.",
                        "severity": mem["severity"],
                        "who": mem["who"],
                        "when": mem["created_at"],
                        "original_decision": mem["decision"]
                    })
        return conflicts

    system_prompt = """You are IBM Bob, an AI development partner and expert software architect.
Analyze this PR diff. Compare with past decisions. Detect conflicts semantically. Explain clearly.
Return your response ONLY as a JSON object containing a "conflicts" array. If there are no conflicts, return {"conflicts": []}.

Each conflict object should have EXACTLY these keys:
- memory_id: The ID of the memory that was violated.
- conflict_reasoning: A clear explanation of why this code violates the decision semantically (e.g. dictionary vs Redis caching).
- severity: "critical", "high", or "medium"
- who: The original author of the decision.
- when: The created_at date of the decision.
- original_decision: The exact text of the decision that was violated.
"""

    user_prompt = f"""Memory Bank Decisions:
{json.dumps(memories, indent=2)}

Pull Request Diff:
{diff}
"""

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        if not content:
            logger.error("Empty response from OpenAI")
            return []
        data = json.loads(content)
        return data.get("conflicts", [])
    except Exception as e:
        logger.error(f"LLM Analyze Error: {e}")
        return []

async def extract_decision(diff: str, comments: str) -> dict:
    if is_mock_mode():
        return {
            "decision": "All external API calls must include a timeout parameter. No infinite waiting allowed.",
            "reason": "Production outage in Mar 2026 caused by infinite hanging on third-party API.",
            "module": "networking",
            "severity": "medium",
            "who": "jane-dev",
            "pr": "#210",
            "tags": ["networking", "timeout", "reliability"]
        }

    system_prompt = """You are IBM Bob. Read the merged PR diff and PR comments. 
Extract the key architectural or codebase decision that was made.
Return your response ONLY as a JSON object with EXACTLY these keys:
- decision: The core rule or constraint established.
- reason: Why this was decided (from comments/context).
- module: The main module or domain (e.g., auth, database).
- severity: "critical", "high", or "medium".
- who: The username of the person who drove the decision.
- pr: The PR number (e.g., "#210").
- tags: Array of 3 string tags.
"""

    user_prompt = f"PR Diff:\n{diff}\n\nPR Comments:\n{comments}"

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        if not content:
            logger.error("Empty response from OpenAI")
            return {}
        return json.loads(content)
    except Exception as e:
        logger.error(f"LLM Extract Error: {e}")
        return {}

async def ask_ghost(question: str, memories: list) -> dict:
    if is_mock_mode():
        return {
            "answer": "Based on our history, there are two major decisions governing the auth module: First, we never cache auth token responses in any storage layer. Second, we must use server-side sessions rather than stateless JWTs.",
            "citations": ["MEM-001", "MEM-002"]
        }

    system_prompt = """You are IBM Bob. Answer the user's question by explaining past architectural decisions based purely on the provided memory bank.
Answer like a senior teammate who was there when the decisions were made.
Return ONLY a JSON object with two keys:
- answer: Your detailed string response.
- citations: An array of memory IDs (e.g., ["MEM-001"]) that you used to form the answer.
"""

    user_prompt = f"Memory Bank:\n{json.dumps(memories, indent=2)}\n\nQuestion:\n{question}"

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        if not content:
            logger.error("Empty response from OpenAI")
            return {"answer": "I had trouble processing that question.", "citations": []}
        return json.loads(content)
    except Exception as e:
        logger.error(f"LLM Ask Error: {e}")
        return {"answer": "I had trouble processing that question.", "citations": []}
