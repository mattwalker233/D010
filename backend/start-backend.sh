#!/bin/bash
# D010 Backend Auto-Start Script

export PATH="/Users/docdex2/Library/Python/3.9/bin:$PATH"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to backend directory
cd "$SCRIPT_DIR"

# Start the backend with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
