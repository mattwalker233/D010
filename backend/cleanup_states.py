#!/usr/bin/env python3
"""
State Abbreviation Cleanup Script
Normalizes all state fields in dashboard data to their two-letter abbreviations.
"""

import json
import glob
import os
from datetime import datetime
from pathlib import Path

# US state name to abbreviation mapping
STATE_ABBREVIATIONS = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
    'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
    'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
    'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
    'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
    'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
    'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
    'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY',
    'district of columbia': 'DC', 'dc': 'DC',
}

# Add abbreviations as keys for idempotency
abbrs = list(STATE_ABBREVIATIONS.values())
for abbr in abbrs:
    STATE_ABBREVIATIONS[abbr.lower()] = abbr


def normalize_state(state):
    if not state:
        return state
    s = str(state).strip().lower()
    return STATE_ABBREVIATIONS.get(s, state)

def cleanup_states():
    dashboard_dir = Path(__file__).parent / "dashboard_data"
    if not dashboard_dir.exists():
        print("Dashboard directory does not exist")
        return
    json_files = glob.glob(str(dashboard_dir / "*.json"))
    print(f"Found {len(json_files)} JSON files")
    if not json_files:
        print("No JSON files found")
        return
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
    changed = 0
    for record in all_records:
        if 'state' in record and record['state']:
            orig = record['state']
            abbr = normalize_state(orig)
            if abbr != orig:
                print(f"State cleaned: '{orig}' -> '{abbr}'")
                record['state'] = abbr
                changed += 1
    print(f"Cleaned {changed} state values")
    if changed == 0:
        print("No state values needed cleaning")
        return
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = dashboard_dir / f"dashboard_data_states_{timestamp}.json"
    with open(output_file, 'w') as f:
        json.dump(all_records, f, indent=2)
    print(f"Saved cleaned data to: {output_file}")
    main_file = dashboard_dir / f"dashboard_data_{timestamp}.json"
    try:
        os.rename(output_file, main_file)
        print(f"Renamed to main file: {main_file}")
    except Exception as e:
        print(f"Error renaming file: {e}")

if __name__ == "__main__":
    cleanup_states() 