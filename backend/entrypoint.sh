#!/bin/bash
PORT=${PORT:-8000}
exec gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
