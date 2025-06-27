import requests

def test_server():
    try:
        response = requests.get('http://localhost:8000/api/dashboard')
        print(f"Server response status: {response.status_code}")
        print(f"Server response: {response.text}")
    except requests.exceptions.ConnectionError:
        print("Could not connect to server. Make sure it's running on port 8000.")

if __name__ == "__main__":
    test_server() 