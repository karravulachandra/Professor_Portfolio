import os
from typing import List, Dict, Any
import numpy as np
import re
from pathlib import Path

from langchain.document_loaders import (
    PyPDFLoader,
    TextLoader,
    Docx2txtLoader,
    UnstructuredMarkdownLoader,
    UnstructuredHTMLLoader,
    CSVLoader,
    UnstructuredExcelLoader
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings

# Constants
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
DB_PATH = "db/faiss_index"

# Supported file types and their loaders
LOADER_MAPPING = {
    ".pdf": PyPDFLoader,
    ".txt": TextLoader,
    ".docx": Docx2txtLoader,
    ".doc": Docx2txtLoader,
    ".md": UnstructuredMarkdownLoader,
    ".html": UnstructuredHTMLLoader,
    ".htm": UnstructuredHTMLLoader,
    ".csv": CSVLoader,
    ".xlsx": UnstructuredExcelLoader,
    ".xls": UnstructuredExcelLoader,
}

def get_loader_class(file_path: str):
    """Get the appropriate loader class based on file extension"""
    file_extension = os.path.splitext(file_path)[1].lower()
    return LOADER_MAPPING.get(file_extension)

def extract_headings(text: str) -> List[str]:
    """Extract potential headings from text"""
    # Simple heuristic: lines with fewer than 10 words that end with a newline
    lines = text.split('\n')
    headings = []

    for line in lines:
        line = line.strip()
        if line and len(line.split()) < 10 and line[-1] not in '.,:;?!':
            headings.append(line)

    return headings[:3]  # Return up to 3 potential headings

def enhance_metadata(doc: Document) -> Document:
    """Enhance document metadata with additional context"""
    metadata = doc.metadata.copy()

    # Extract potential headings from the content
    headings = extract_headings(doc.page_content)
    if headings:
        metadata["headings"] = headings

    # Add paragraph number if not present
    if "paragraph" not in metadata:
        metadata["paragraph"] = 1

    # Add source filename if not present
    if "source" in metadata and os.path.isfile(metadata["source"]):
        metadata["filename"] = os.path.basename(metadata["source"])

    # Create a new document with enhanced metadata
    return Document(page_content=doc.page_content, metadata=metadata)

def load_documents(file_paths: List[str]) -> List[Document]:
    """
    Load documents from various file types
    """
    documents = []

    for path in file_paths:
        try:
            # Get the appropriate loader class
            loader_class = get_loader_class(path)

            if loader_class:
                loader = loader_class(path)
                docs = loader.load()

                # Enhance metadata for each document
                enhanced_docs = [enhance_metadata(doc) for doc in docs]
                documents.extend(enhanced_docs)
                print(f"Loaded {len(enhanced_docs)} pages/sections from {path}")
            else:
                print(f"Unsupported file type: {path}")
        except Exception as e:
            print(f"Error loading {path}: {e}")

    # Clean up temporary files
    for path in file_paths:
        if os.path.exists(path) and "temp_" in path:
            os.remove(path)

    return documents

def split_documents(documents: List[Document]) -> List[Document]:
    """
    Split documents into chunks while preserving metadata
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
        add_start_index=True,  # Add start index to track position in original text
    )

    chunks = text_splitter.split_documents(documents)

    # Enhance chunk metadata with position information
    enhanced_chunks = []
    for i, chunk in enumerate(chunks):
        metadata = chunk.metadata.copy()

        # Add chunk number for reference
        metadata["chunk_id"] = i + 1
        metadata["total_chunks"] = len(chunks)

        # If we have start_index, calculate approximate paragraph
        if "start_index" in metadata and "source" in metadata:
            # Rough estimate of paragraph based on start index
            # Assuming average paragraph is ~500 characters
            approx_paragraph = (metadata["start_index"] // 500) + 1
            metadata["paragraph"] = approx_paragraph

        enhanced_chunks.append(Document(page_content=chunk.page_content, metadata=metadata))

    print(f"Split {len(documents)} documents into {len(enhanced_chunks)} chunks")
    return enhanced_chunks

def create_or_update_vectorstore(chunks: List[Document]) -> None:
    """
    Create or update the FAISS vector store
    """
    # Initialize the embedding model
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

    # Check if the vector store already exists
    if os.path.exists(DB_PATH):
        # Load existing vector store
        vectorstore = FAISS.load_local(DB_PATH, embeddings)
        # Add new documents
        vectorstore.add_documents(chunks)
    else:
        # Create new vector store
        vectorstore = FAISS.from_documents(chunks, embeddings)

    # Save the updated vector store
    vectorstore.save_local(DB_PATH)
    print(f"Vector store saved to {DB_PATH}")

def process_documents(file_paths: List[str]) -> None:
    """
    Process documents: load, split, embed, and store
    """
    print(f"Processing {len(file_paths)} documents...")

    # Load documents
    documents = load_documents(file_paths)
    if not documents:
        print("No documents loaded")
        return

    # Split documents into chunks
    chunks = split_documents(documents)

    # Create or update vector store
    create_or_update_vectorstore(chunks)

    print("Document processing complete")

if __name__ == "__main__":
    # For testing
    test_files = ["sample.pdf"]
    process_documents(test_files)
