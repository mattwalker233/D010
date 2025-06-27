import requests
import sys

def test_backend():
    try:
        print("Testing backend connection...")
        response = requests.get('http://localhost:8000/api/dashboard')
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
    except requests.exceptions.ConnectionError as e:
        print(f"Error connecting to backend: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_backend() 