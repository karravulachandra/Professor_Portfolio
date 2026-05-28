import requests

def test_connection():
    try:
        response = requests.get('http://localhost:8000/')
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

def register_user(username, email, password):
    try:
        response = requests.post(
            'http://localhost:8000/register',
            json={
                'username': username,
                'email': email,
                'password': password
            }
        )
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def login_user(username, password):
    try:
        response = requests.post(
            'http://localhost:8000/token',
            data={
                'username': username,
                'password': password
            }
        )
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            return response.json().get('access_token')
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    print("Testing backend connection...")
    if not test_connection():
        print("Failed to connect to backend. Make sure it's running.")
        return
    
    print("\nRegistering test user...")
    if register_user('testuser', 'test@example.com', 'password123'):
        print("User registered successfully.")
    else:
        print("Failed to register user.")
    
    print("\nLogging in...")
    token = login_user('testuser', 'password123')
    if token:
        print(f"Login successful. Token: {token}")
    else:
        print("Login failed.")

if __name__ == "__main__":
    main()
