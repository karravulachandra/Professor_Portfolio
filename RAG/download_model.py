import os
import sys
import requests
from tqdm import tqdm

# Constants
MODEL_URL = "https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf"
MODEL_PATH = "backend/models/mistral-7b-instruct-v0.2.Q4_K_M.gguf"

def download_file(url, destination):
    """
    Download a file with progress bar
    """
    if os.path.exists(destination):
        print(f"Model already exists at {destination}")
        choice = input("Do you want to download it again? (y/n): ").lower()
        if choice != 'y':
            return
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(destination), exist_ok=True)
    
    print(f"Downloading model from {url}")
    print(f"This may take a while depending on your internet connection...")
    
    response = requests.get(url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    block_size = 1024  # 1 Kibibyte
    
    with open(destination, 'wb') as file, tqdm(
        desc=os.path.basename(destination),
        total=total_size,
        unit='iB',
        unit_scale=True,
        unit_divisor=1024,
    ) as bar:
        for data in response.iter_content(block_size):
            size = file.write(data)
            bar.update(size)
    
    print(f"Model downloaded to {destination}")

def main():
    print("=" * 80)
    print("Local RAG Assistant - Model Downloader")
    print("=" * 80)
    print("\nThis script will download the Mistral-7B-Instruct GGUF model (~4GB).")
    print("The model will be saved to:", MODEL_PATH)
    
    choice = input("\nDo you want to proceed with the download? (y/n): ").lower()
    
    if choice == 'y':
        try:
            download_file(MODEL_URL, MODEL_PATH)
            print("\nDownload complete! You can now run the RAG application.")
        except Exception as e:
            print(f"\nError downloading model: {e}")
            print("\nYou can manually download the model from:")
            print("https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/tree/main")
            print(f"and place it in the {os.path.dirname(MODEL_PATH)} directory.")
    else:
        print("\nDownload cancelled.")
        print("\nYou can manually download the model from:")
        print("https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/tree/main")
        print(f"and place it in the {os.path.dirname(MODEL_PATH)} directory.")

if __name__ == "__main__":
    main()
