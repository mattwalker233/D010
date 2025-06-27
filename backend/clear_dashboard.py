import json
import os
from datetime import datetime
from pathlib import Path

def clear_dashboard_data():
    """Clear all dashboard data with optional backup"""
    
    # Dashboard data directory
    dashboard_dir = Path(__file__).parent / "dashboard_data"
    main_file = dashboard_dir / "dashboard_data_main.json"
    
    if not main_file.exists():
        print("No dashboard data file found.")
        return
    
    # Create backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = dashboard_dir / f"dashboard_data_backup_{timestamp}.json"
    
    try:
        # Read current data
        with open(main_file, 'r') as f:
            current_data = json.load(f)
        
        # Create backup
        with open(backup_file, 'w') as f:
            json.dump(current_data, f, indent=2)
        
        print(f"Backup created: {backup_file}")
        print(f"Records in backup: {len(current_data)}")
        
        # Clear the main file
        with open(main_file, 'w') as f:
            json.dump([], f, indent=2)
        
        print(f"Dashboard cleared successfully!")
        print(f"All {len(current_data)} records have been removed.")
        
    except Exception as e:
        print(f"Error clearing dashboard: {str(e)}")

if __name__ == "__main__":
    clear_dashboard_data() 