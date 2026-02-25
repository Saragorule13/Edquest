"""
FastAPI backend for the Oral Viva Voice Agent.
Provides REST API for topic management and WebSocket for real-time viva sessions.
"""
import json
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

from supabase import create_client
import os

from agent import create_viva_agent, get_opening_question
from stt import transcribe_audio

# --- Supabase client ---
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(supabase_url, supabase_key)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🎤 Voice Agent backend starting...")
    yield
    print("🎤 Voice Agent backend shutting down...")


app = FastAPI(title="EdQuest Voice Agent", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydantic Models ---
class TopicCreate(BaseModel):
    title: str
    subject: Optional[str] = None
    description: Optional[str] = None
    system_prompt: Optional[str] = None
    difficulty: Optional[str] = "medium"


class TopicResponse(BaseModel):
    id: str
    title: str
    subject: Optional[str]
    description: Optional[str]
    system_prompt: Optional[str]
    difficulty: Optional[str]
    created_at: Optional[str]


# --- REST Endpoints for Topic CRUD ---

@app.get("/api/topics")
async def list_topics():
    """List all viva topics."""
    result = supabase.table("viva_topics").select("*").order("created_at", desc=True).execute()
    return result.data


@app.post("/api/topics")
async def create_topic(topic: TopicCreate):
    """Create a new viva topic."""
    result = supabase.table("viva_topics").insert(topic.model_dump(exclude_none=True)).execute()
    return result.data[0] if result.data else {}


@app.delete("/api/topics/{topic_id}")
async def delete_topic(topic_id: str):
    """Delete a viva topic."""
    result = supabase.table("viva_topics").delete().eq("id", topic_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"message": "Topic deleted"}


@app.get("/api/topics/{topic_id}")
async def get_topic(topic_id: str):
    """Get a single viva topic."""
    result = supabase.table("viva_topics").select("*").eq("id", topic_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Topic not found")
    return result.data


# --- WebSocket for Viva Sessions ---

@app.websocket("/ws/viva/{topic_id}")
async def viva_session(websocket: WebSocket, topic_id: str):
    """WebSocket endpoint for real-time viva sessions.
    
    Protocol:
    1. Client connects
    2. Server sends opening question as JSON: {"type": "response", "text": "..."}
    3. Client sends audio as binary WebSocket messages
    4. Server transcribes, processes, and responds with JSON: {"type": "response", "text": "..."}
    5. Server also sends transcription: {"type": "transcription", "text": "..."}
    """
    await websocket.accept()
    
    # Fetch the topic from Supabase
    topic_result = supabase.table("viva_topics").select("*").eq("id", topic_id).single().execute()
    if not topic_result.data:
        await websocket.send_json({"type": "error", "text": "Topic not found"})
        await websocket.close()
        return
    
    topic = topic_result.data
    transcript_log = []
    
    # Create the LangChain agent
    chain = create_viva_agent(
        topic=topic["title"],
        custom_instructions=topic.get("system_prompt", "")
    )
    
    # Send opening question
    try:
        opening = get_opening_question(chain)
        transcript_log.append({"role": "examiner", "text": opening})
        await websocket.send_json({"type": "response", "text": opening})
    except Exception as e:
        await websocket.send_json({"type": "error", "text": f"Agent error: {str(e)}"})
        await websocket.close()
        return
    
    # Main conversation loop
    try:
        while True:
            # Receive audio data from client
            data = await websocket.receive_bytes()
            
            # Send "processing" status
            await websocket.send_json({"type": "status", "text": "transcribing"})
            
            # Transcribe audio
            student_text = await transcribe_audio(data)
            
            if not student_text:
                await websocket.send_json({"type": "status", "text": "no_speech"})
                continue
            
            # Send transcription back to client
            transcript_log.append({"role": "student", "text": student_text})
            await websocket.send_json({"type": "transcription", "text": student_text})
            
            # Get agent response
            await websocket.send_json({"type": "status", "text": "thinking"})
            
            try:
                response = chain.predict(input=student_text)
                transcript_log.append({"role": "examiner", "text": response})
                await websocket.send_json({"type": "response", "text": response})
            except Exception as e:
                await websocket.send_json({"type": "error", "text": f"Agent error: {str(e)}"})
                
    except WebSocketDisconnect:
        print(f"Viva session disconnected for topic: {topic['title']}")
        
        # Save transcript to Supabase
        try:
            supabase.table("viva_sessions").insert({
                "topic_id": topic_id,
                "transcript": json.dumps(transcript_log),
                "status": "completed"
            }).execute()
        except Exception as e:
            print(f"Error saving transcript: {e}")


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "voice-agent"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
