#!/usr/bin/env python3
"""
Dashboard Cleanup Script
Consolidates all dashboard files into one clean file and removes duplicates.
"""

import json
import glob
import os
from datetime import datetime
from pathlib import Path
import re

def normalize_field(value):
    if not isinstance(value, str):
        return ''
    # Remove all whitespace, lowercase, and remove special characters
    return re.sub(r'[^a-z0-9]', '', value.lower())

def cleanup_dashboard():
    # Dashboard data directory
    dashboard_dir = Path(__file__).parent / "dashboard_data"
    
    if not dashboard_dir.exists():
        print("Dashboard directory does not exist")
        return
    
    # Get all JSON files
    json_files = glob.glob(str(dashboard_dir / "*.json"))
    print(f"Found {len(json_files)} JSON files")
    
    if not json_files:
        print("No JSON files found")
        return
    
    # Load all records from all files
    all_records = []
    for file_path in json_files:
        print(f"Reading: {file_path}")
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                if isinstance(data, list):
                    all_records.extend(data)
                else:
                    all_records.append(data)
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
    
    print(f"Total records loaded: {len(all_records)}")
    
    # Create a unique key for each record to detect duplicates
    def get_record_key(record):
        return normalize_field(record.get('propertyName', ''))
    
    # Deduplicate records
    seen_keys = set()
    unique_records = []
    duplicates_removed = 0
    near_duplicates = []
    
    for record in all_records:
        key = get_record_key(record)
        if key in seen_keys:
            print(f"Removing duplicate: {record.get('propertyName', 'Unknown')}")
            duplicates_removed += 1
            near_duplicates.append(record)
        else:
            seen_keys.add(key)
            unique_records.append(record)
    
    print(f"Removed {duplicates_removed} duplicates by property name")
    print(f"Unique records remaining: {len(unique_records)}")
    if near_duplicates:
        print(f"Found {len(near_duplicates)} duplicates by property name.")
        for dup in near_duplicates[:10]:
            print(f"DUPLICATE: {dup.get('propertyName', '')}")
    
    # Sort records by effective date (newest first)
    unique_records.sort(key=lambda x: x.get('effectiveDate', ''), reverse=True)
    
    # Create new consolidated file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    new_filename = dashboard_dir / f"dashboard_data_consolidated_{timestamp}.json"
    
    # Save consolidated records
    with open(new_filename, 'w') as f:
        json.dump(unique_records, f, indent=2)
    
    print(f"Saved consolidated data to: {new_filename}")
    
    # Optionally, remove old files (uncomment if you want to do this)
    # print("Removing old files...")
    # for file_path in json_files:
    #     try:
    #         os.remove(file_path)
    #         print(f"Removed: {file_path}")
    #     except Exception as e:
    #         print(f"Error removing {file_path}: {e}")
    
    print("Cleanup complete!")

if __name__ == "__main__":
    cleanup_dashboard() 