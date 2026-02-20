#!/bin/bash
set -e
PORT=${PORT:-8000}
echo "Starting gunicorn on port $PORT"
exec gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --access-logfile - --error-logfile -
