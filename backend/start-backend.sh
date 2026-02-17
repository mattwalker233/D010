#!/bin/bash
# D010 Backend Auto-Start Script

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Activate virtual environment if it exists
if [ -f "$SCRIPT_DIR/venv/bin/activate" ]; then
    source "$SCRIPT_DIR/venv/bin/activate"
fi

# Change to backend directory
cd "$SCRIPT_DIR"

# Start the backend with uvicorn
/usr/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
