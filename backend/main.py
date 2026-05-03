from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bob import analyze_pr, extract_decision, ask_ghost
from memory import get_all_memories, save_memory
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="MR-GHOST API",
    description="AI-powered PR review system with institutional memory",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

class AnalyzeReq(BaseModel):
    diff: str

class ExtractReq(BaseModel):
    diff: str
    comments: str

class AskReq(BaseModel):
    question: str

@app.post("/analyze")
async def analyze(req: AnalyzeReq):
    """Analyze PR diff against memory bank for conflicts"""
    try:
        logger.info("Analyzing PR diff...")
        memories = get_all_memories()
        result = await analyze_pr(req.diff, memories)
        logger.info(f"Analysis complete. Found {len(result)} conflicts.")
        return {"conflicts": result, "success": True}
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/extract")
async def extract(req: ExtractReq):
    """Extract decision from merged PR and save to memory bank"""
    try:
        logger.info("Extracting decision from PR...")
        decision = await extract_decision(req.diff, req.comments)
        if not decision or not decision.get("decision"):
            raise HTTPException(status_code=400, detail="Could not extract valid decision from PR")
        saved = save_memory(decision)
        logger.info(f"Memory {saved['id']} created successfully")
        return {"success": True, "memory": saved}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Extraction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

@app.post("/ask")
async def ask(req: AskReq):
    """Ask Bob a question about past decisions"""
    try:
        logger.info(f"Processing question: {req.question[:50]}...")
        memories = get_all_memories()
        result = await ask_ghost(req.question, memories)
        return {"success": True, **result}
    except Exception as e:
        logger.error(f"Ask error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Question processing failed: {str(e)}")

@app.get("/memories")
async def memories():
    """Get all memories from the memory bank"""
    try:
        memories_list = get_all_memories()
        return {"success": True, "memories": memories_list, "count": len(memories_list)}
    except Exception as e:
        logger.error(f"Memory retrieval error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve memories: {str(e)}")

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "service": "MR-GHOST API"}
