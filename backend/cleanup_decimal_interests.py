#!/usr/bin/env python3
"""
Decimal Interest Cleanup Script
Removes percentage signs from decimal interest values and ensures proper decimal formatting.
"""

import json
import glob
import os
from datetime import datetime
from pathlib import Path

def cleanup_decimal_interests():
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
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                if isinstance(data, list):
                    all_records.extend(data)
                else:
                    all_records.append(data)
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
    
    print(f"Loaded {len(all_records)} total records")
    
    # Clean up decimal interests
    cleaned_count = 0
    for record in all_records:
        if 'decimalInterest' in record and record['decimalInterest']:
            original_value = record['decimalInterest']
            
            # Remove percentage sign if present
            if isinstance(original_value, str) and '%' in original_value:
                cleaned_value = original_value.replace('%', '').strip()
                record['decimalInterest'] = cleaned_value
                cleaned_count += 1
                print(f"Cleaned: '{original_value}' -> '{cleaned_value}'")
    
    print(f"Cleaned {cleaned_count} decimal interest values")
    
    if cleaned_count == 0:
        print("No decimal interest values needed cleaning")
        return
    
    # Create new consolidated file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = dashboard_dir / f"dashboard_data_cleaned_{timestamp}.json"
    
    with open(output_file, 'w') as f:
        json.dump(all_records, f, indent=2)
    
    print(f"Saved cleaned data to: {output_file}")
    
    # Remove old files (optional - uncomment if you want to replace all files)
    # for file_path in json_files:
    #     try:
    #         os.remove(file_path)
    #         print(f"Removed: {file_path}")
    #     except Exception as e:
    #         print(f"Error removing {file_path}: {e}")
    
    # Rename the cleaned file to be the main file
    main_file = dashboard_dir / f"dashboard_data_{timestamp}.json"
    try:
        os.rename(output_file, main_file)
        print(f"Renamed to main file: {main_file}")
    except Exception as e:
        print(f"Error renaming file: {e}")

if __name__ == "__main__":
    cleanup_decimal_interests() 