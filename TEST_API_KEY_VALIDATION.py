#!/usr/bin/env python3
"""
Test script to demonstrate the ANTHROPIC_API_KEY validation in main.py
This script simulates what happens during backend startup.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv('/Users/docdex2/.openclaw/workspace/D010/backend/.env.local')

print("=" * 60)
print("ANTHROPIC_API_KEY Validation Test")
print("=" * 60)

# Check what the current value is
api_key = os.getenv("ANTHROPIC_API_KEY")
print(f"\nCurrent ANTHROPIC_API_KEY: {api_key}")
print(f"API Key length: {len(api_key) if api_key else 0} characters")
print(f"Is placeholder: {api_key == 'your_api_key_here'}")

# Simulate the validation from main.py
print("\n" + "=" * 60)
print("Validation Logic from main.py:")
print("=" * 60)

if not api_key or api_key == "your_api_key_here" or api_key.strip() == "":
    print("❌ VALIDATION FAILED")
    print("\nWARNING: ANTHROPIC_API_KEY is not set or is a placeholder!")
    print("Set ANTHROPIC_API_KEY environment variable before deploying to production.")
    
    if os.getenv("ENVIRONMENT") == "production":
        print("\nCRITICAL: Running in PRODUCTION mode with missing API key!")
        print("Backend startup would FAIL with error:")
        print("  ValueError: ANTHROPIC_API_KEY must be set in production environment")
        sys.exit(1)
    else:
        print("\nRunning in development mode with missing API key.")
        print("API calls will fail at runtime when endpoint is accessed.")
else:
    print("✅ VALIDATION PASSED")
    print(f"API Key appears to be valid: {api_key[:20]}...{api_key[-10:]}")

print("\n" + "=" * 60)
print("Current Environment:")
print("=" * 60)
print(f"ENVIRONMENT: {os.getenv('ENVIRONMENT', 'not set')}")
print(f"PORT: {os.getenv('PORT', 'not set')}")

print("\n" + "=" * 60)
print("Summary:")
print("=" * 60)
print("""
The D010 backend has a MISSING or PLACEHOLDER ANTHROPIC_API_KEY.

To fix this issue:
1. Get your API key from https://console.anthropic.com
2. Set it in Railway dashboard: Variables > ANTHROPIC_API_KEY = sk-ant-xxx...
3. Redeploy the backend on Railway

For detailed instructions, see: RAILWAY_SETUP_FIX.md
""")
