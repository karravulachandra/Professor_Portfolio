import requests
import os
import time

def register_and_login():
    """Register a test user and login to get a token"""
    # Register user
    try:
        register_response = requests.post(
            'http://localhost:8000/register',
            json={
                'username': 'testuser',
                'email': 'test@example.com',
                'password': 'password123'
            }
        )
        print(f"Registration response: {register_response.status_code}")
    except Exception as e:
        print(f"Registration error (might be already registered): {e}")

    # Login
    try:
        login_response = requests.post(
            'http://localhost:8000/token',
            data={
                'username': 'testuser',
                'password': 'password123'
            }
        )

        if login_response.status_code == 200:
            token = login_response.json().get('access_token')
            print(f"Login successful, token: {token}")
            return token
        else:
            print(f"Login failed: {login_response.text}")
            return None
    except Exception as e:
        print(f"Login error: {e}")
        return None

def upload_file(file_path, token):
    """Upload a file to the backend"""
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return False

    try:
        # For this example, we'll create a simple PDF-like file
        # In a real scenario, you would use a library like reportlab or fpdf to create a proper PDF
        pdf_path = file_path.replace('.txt', '.pdf')

        # Just copy the content for now - the backend will handle it as a text file
        with open(file_path, 'rb') as src:
            content = src.read()

            with open(pdf_path, 'wb') as dst:
                dst.write(content)

        print(f"Created PDF version: {pdf_path}")

        # Prepare the file for upload
        with open(pdf_path, 'rb') as f:
            files = {'files': (os.path.basename(pdf_path), f, 'application/pdf')}
            headers = {'Authorization': f'Bearer {token}'}

            # Upload the file
            response = requests.post(
                'http://localhost:8000/upload',
                files=files,
                headers=headers
            )

            print(f"Upload response: {response.status_code}")
            print(f"Response text: {response.text}")

            return response.status_code == 200
    except Exception as e:
        print(f"Upload error: {e}")
        return False

def ask_question(question, token):
    """Ask a question to the RAG system"""
    try:
        headers = {'Authorization': f'Bearer {token}'}
        data = {'question': question}

        response = requests.post(
            'http://localhost:8000/ask',
            data=data,
            headers=headers
        )

        print(f"Question response: {response.status_code}")
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.text}")
            return None
    except Exception as e:
        print(f"Question error: {e}")
        return None

def main():
    # Get authentication token
    token = register_and_login()
    if not token:
        print("Failed to authenticate")
        return

    # Upload sample document
    sample_path = os.path.join(os.getcwd(), 'sample.txt')
    print(f"Uploading file: {sample_path}")

    if upload_file(sample_path, token):
        print("File uploaded successfully")

        # Wait for processing to complete
        print("Waiting for document processing...")
        print("This may take a while as the document is being processed, chunked, embedded, and stored...")
        time.sleep(20)  # Wait longer for processing to complete

        # Ask a test question
        print("\nAsking test question...")
        question = "What are the benefits of RAG?"
        answer = ask_question(question, token)

        if answer:
            print("\nQuestion:", question)
            print("\nAnswer:", answer.get('answer'))
            print("\nSources:")
            for i, source in enumerate(answer.get('sources', [])):
                print(f"\nSource {i+1}:")
                print(f"Content: {source['content'][:100]}...")
                print(f"Metadata: {source['metadata']}")
    else:
        print("Failed to upload file")

if __name__ == "__main__":
    main()
