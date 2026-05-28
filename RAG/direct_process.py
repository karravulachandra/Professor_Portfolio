import os
import sys
from pathlib import Path

# Add the backend directory to the path so we can import from it
backend_dir = os.path.join(os.getcwd(), 'backend')
sys.path.append(backend_dir)

# Import the processing function from ingest.py
from ingest import process_documents

def main():
    # Path to the sample document
    sample_path = os.path.join(os.getcwd(), 'sample.txt')
    
    if not os.path.exists(sample_path):
        print(f"Sample document not found at {sample_path}")
        return
    
    print(f"Processing document: {sample_path}")
    
    # Process the document directly
    process_documents([sample_path])
    
    # Check if the vector store was created
    db_path = os.path.join(os.getcwd(), 'db', 'faiss_index')
    if os.path.exists(db_path):
        print(f"Vector store created successfully at {db_path}")
        print(f"Contents: {os.listdir(db_path)}")
    else:
        print(f"Vector store not created at {db_path}")
        # Check if the db directory exists
        db_dir = os.path.join(os.getcwd(), 'db')
        if os.path.exists(db_dir):
            print(f"db directory exists, contents: {os.listdir(db_dir)}")
        else:
            print(f"db directory does not exist")

if __name__ == "__main__":
    main()
