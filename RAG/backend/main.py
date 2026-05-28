from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Form, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Optional, Dict, Any
import os
import uvicorn
import asyncio
import json
import secrets
from datetime import datetime, timedelta
from pydantic import BaseModel

from ingest import process_documents
from qa import get_answer, get_streaming_answer

# Authentication models
class User(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None

# Simple in-memory user database (replace with a real database in production)
fake_users_db = {}

app = FastAPI(title="Local RAG System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    expose_headers=["Content-Type", "Authorization"]
)

# Ensure directories exist
os.makedirs("db", exist_ok=True)
os.makedirs("models", exist_ok=True)

# Authentication setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# In a real app, use a secure method like bcrypt
def get_password_hash(password: str) -> str:
    return "fakehashed_" + password

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hashed_password == "fakehashed_" + plain_password

def get_user(db, username: str) -> Optional[UserInDB]:
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)
    return None

def authenticate_user(db, username: str, password: str) -> Optional[User]:
    user = get_user(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def create_access_token(data: dict) -> str:
    # In a real app, use JWT with proper expiration
    token = secrets.token_urlsafe(32)
    # Store token with user data (in a real app, this would be encoded in the JWT)
    app.state.tokens = getattr(app.state, "tokens", {})
    app.state.tokens[token] = data
    return token

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # In a real app, decode and verify JWT
    tokens = getattr(app.state, "tokens", {})
    if token not in tokens:
        raise credentials_exception

    username = tokens[token].get("sub")
    if username is None:
        raise credentials_exception

    user = get_user(fake_users_db, username)
    if user is None:
        raise credentials_exception

    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@app.get("/")
async def root():
    return {"message": "Local RAG API is running"}

@app.post("/register", response_model=User)
async def register_user(user_data: UserCreate):
    """
    Register a new user
    """
    if user_data.username in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict()
    del user_dict["password"]  # Remove password from dict
    user_dict["hashed_password"] = hashed_password
    user_dict["disabled"] = False

    # Store user in our fake db
    fake_users_db[user_data.username] = user_dict

    return user_dict

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.username})

    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """
    Get current user information
    """
    return current_user

@app.post("/upload")
async def upload_files(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_active_user),
):
    """
    Upload document files to be processed and indexed (requires authentication)
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    # Import supported file extensions from ingest module
    from ingest import LOADER_MAPPING
    supported_extensions = list(LOADER_MAPPING.keys())

    # Save files temporarily
    temp_paths = []
    unsupported_files = []

    for file in files:
        file_ext = os.path.splitext(file.filename.lower())[1]

        if file_ext not in supported_extensions:
            unsupported_files.append(file.filename)
            continue

        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)
        temp_paths.append(temp_path)

    if not temp_paths:
        raise HTTPException(
            status_code=400,
            detail=f"No supported files found. Supported formats: {', '.join(supported_extensions)}"
        )

    # Process documents in background
    background_tasks.add_task(process_documents, temp_paths)

    response = {"message": f"Processing {len(temp_paths)} files in the background"}

    if unsupported_files:
        response["warning"] = f"Skipped {len(unsupported_files)} unsupported files: {', '.join(unsupported_files)}"
        response["supported_formats"] = supported_extensions

    return response

@app.post("/ask")
async def ask_question(
    question: str = Form(...),
    current_user: User = Depends(get_current_active_user)
):
    """
    Ask a question to the RAG system (requires authentication)
    """
    if not question or question.strip() == "":
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        answer = get_answer(question)
        return answer
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask/stream")
async def ask_question_stream(
    question: str = Form(...),
    current_user: User = Depends(get_current_active_user)
):
    """
    Ask a question to the RAG system with streaming response (requires authentication)
    """
    if not question or question.strip() == "":
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    return StreamingResponse(
        get_streaming_answer(question),
        media_type="text/event-stream"
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
