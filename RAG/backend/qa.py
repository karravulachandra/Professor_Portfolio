import os
import json
import asyncio
from typing import Dict, List, Any, Generator, AsyncGenerator
import numpy as np

from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import LlamaCpp
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

# Constants
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
DB_PATH = "db/faiss_index"
MODEL_PATH = "models/mistral-7b-instruct-v0.2.Q4_K_M.gguf"  # User needs to download this
RETRIEVAL_K = 4  # Number of chunks to retrieve

# Prompt template for RAG
RAG_PROMPT_TEMPLATE = """
You are a helpful assistant that answers questions based on the provided context.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

When answering, follow these rules:
1. Base your answer ONLY on the provided context
2. Include specific source references in your answer (page numbers, document names, headings)
3. Use phrases like "According to [source]..." or "On page X of [document]..."
4. If multiple sources support your answer, mention all of them
5. Be concise but comprehensive

Context:
{context}

Question: {question}

Answer (with source attribution):
"""

def load_llm(streaming=False):
    """
    Load the local LLM using llama-cpp-python
    """
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model file not found at {MODEL_PATH}. Please download a GGUF model like Mistral-7B-Instruct."
        )

    callbacks = [StreamingStdOutCallbackHandler()] if streaming else []

    llm = LlamaCpp(
        model_path=MODEL_PATH,
        temperature=0.1,
        max_tokens=2000,
        top_p=0.95,
        n_ctx=4096,  # Context window
        callbacks=callbacks,
        verbose=False,  # Set to True for debugging
    )

    return llm

def load_retriever():
    """
    Load the FAISS retriever
    """
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(
            f"Vector store not found at {DB_PATH}. Please upload documents first."
        )

    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    vectorstore = FAISS.load_local(DB_PATH, embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": RETRIEVAL_K})

    return retriever

def format_sources(source_documents):
    """
    Format source documents for the response with enhanced metadata
    """
    sources = []
    for i, doc in enumerate(source_documents):
        metadata = doc.metadata.copy()

        # Create a human-readable source reference
        source_ref = ""

        # Add document name if available
        if "filename" in metadata:
            source_ref += f"Document: {metadata['filename']} "
        elif "source" in metadata:
            source_ref += f"Document: {os.path.basename(metadata['source'])} "

        # Add page number if available
        if "page" in metadata:
            source_ref += f"(Page {metadata['page']}) "

        # Add paragraph information if available
        if "paragraph" in metadata:
            source_ref += f"Paragraph {metadata['paragraph']} "

        # Add headings if available
        if "headings" in metadata and metadata["headings"]:
            source_ref += f"Section: {' > '.join(metadata['headings'])} "

        # Add chunk information
        if "chunk_id" in metadata and "total_chunks" in metadata:
            source_ref += f"(Chunk {metadata['chunk_id']}/{metadata['total_chunks']})"

        # Add the source reference to metadata
        metadata["source_reference"] = source_ref.strip()

        source = {
            "content": doc.page_content,
            "metadata": metadata
        }
        sources.append(source)

    return sources

def get_answer(question: str) -> Dict[str, Any]:
    """
    Get answer for a question using RAG
    """
    try:
        # Load retriever and LLM
        retriever = load_retriever()
        llm = load_llm()

        # Create prompt
        prompt = PromptTemplate(
            template=RAG_PROMPT_TEMPLATE,
            input_variables=["context", "question"]
        )

        # Create chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True,
            chain_type_kwargs={"prompt": prompt}
        )

        # Get answer
        result = qa_chain({"query": question})

        # Format response
        response = {
            "answer": result["result"],
            "sources": format_sources(result["source_documents"])
        }

        return response

    except Exception as e:
        print(f"Error in get_answer: {e}")
        raise

async def get_streaming_answer(question: str) -> AsyncGenerator[str, None]:
    """
    Get streaming answer for a question
    """
    try:
        # Load retriever
        retriever = load_retriever()

        # Get relevant documents
        docs = retriever.get_relevant_documents(question)

        # Format context
        context = "\n\n".join([doc.page_content for doc in docs])

        # Load streaming LLM
        llm = load_llm(streaming=True)

        # Format prompt
        prompt = RAG_PROMPT_TEMPLATE.format(
            context=context,
            question=question
        )

        # Initial response with sources
        sources_json = json.dumps(format_sources(docs))
        yield f"data: {sources_json}\n\n"

        # Stream the answer
        response = ""
        for chunk in llm.stream(prompt):
            response += chunk
            yield f"data: {json.dumps({'answer_chunk': chunk})}\n\n"
            await asyncio.sleep(0.01)  # Small delay to avoid overwhelming the client

        # End of stream
        yield f"data: [DONE]\n\n"

    except Exception as e:
        error_msg = f"Error in streaming: {str(e)}"
        yield f"data: {json.dumps({'error': error_msg})}\n\n"
        yield f"data: [DONE]\n\n"
