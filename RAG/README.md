# Local RAG Assistant

A fully local Retrieval-Augmented Generation (RAG) application using only free and open-source tools. This application allows users to upload various document types and ask questions, using local embeddings and a local LLM to generate answers with detailed source references.

## Features

- 100% offline operation - no external APIs required
- Local LLM using `llama-cpp-python` and Mistral-7B-Instruct (GGUF format)
- Local embeddings using `sentence-transformers/all-MiniLM-L6-v2`
- Vector storage with FAISS
- Multi-format document processing with LangChain
  - PDF, DOCX, TXT, MD, HTML, CSV, XLSX and more
- Detailed source attribution in answers
  - Page numbers, paragraphs, headings, and document names
- React frontend with streaming responses
- FastAPI backend

## Prerequisites

- Python 3.9+ with pip
- Node.js 16+ with npm
- At least 8GB RAM (16GB+ recommended for larger models)
- GPU acceleration recommended but not required

## Setup Instructions

### 1. Download the LLM Model

Download a GGUF format model like Mistral-7B-Instruct. You can find models on Hugging Face:

```
https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/tree/main
```

Download the `mistral-7b-instruct-v0.2.Q4_K_M.gguf` file (or another quantization level based on your hardware) and place it in the `backend/models/` directory.

### 2. Set Up the Backend

```bash
# Navigate to the project directory
cd rag-assistant

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
cd backend
python main.py
```

The backend server will start at http://localhost:8000

### 3. Set Up the Frontend

```bash
# In a new terminal, navigate to the frontend directory
cd rag-assistant/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at http://localhost:3000

## Usage

1. Open the application in your browser at http://localhost:3000
2. Upload documents using the file upload area (supports PDF, DOCX, TXT, MD, HTML, CSV, XLSX, etc.)
3. Wait for the documents to be processed (chunked, embedded, and stored)
4. Ask questions about your documents in the chat interface
5. View answers with detailed source references from your documents
   - Answers include specific source attributions (page numbers, document names, sections)
   - Source snippets show exactly where information was found
   - Metadata helps you locate information in the original documents

## Advanced Configuration

### Using a Different LLM

You can use any GGUF format model. Update the `MODEL_PATH` in `backend/qa.py` to point to your model file.

### Adjusting Chunking Parameters

You can modify the chunking parameters in `backend/ingest.py`:

```python
CHUNK_SIZE = 1000  # Adjust based on your needs
CHUNK_OVERLAP = 200  # Adjust based on your needs
```

### GPU Acceleration

For GPU acceleration with CUDA, install the CUDA-enabled version of llama-cpp-python:

```bash
pip uninstall llama-cpp-python
CMAKE_ARGS="-DLLAMA_CUBLAS=on" pip install llama-cpp-python --no-cache-dir
```

## Troubleshooting

- **Memory Issues**: If you encounter memory issues, try using a smaller model or a more aggressively quantized version (e.g., Q4_0 instead of Q5_K_M)
- **Slow Responses**: Enable GPU acceleration if available, or adjust the context window size in `backend/qa.py`
- **PDF Loading Errors**: Make sure your PDFs are not password-protected and are valid PDF files

## License

This project is open source and available under the MIT License.
