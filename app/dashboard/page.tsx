'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiFile, FiRefreshCw, FiTrash2, FiDownload } from 'react-icons/fi';
import * as ExcelJS from 'exceljs';

interface DashboardRecord {
  propertyName: string;
  operator: string;
  entity: string;
  propertyDescription: string;
  decimalInterest: string;
  county: string;
  state: string;
  effectiveDate: string;
  status: string;
  notes: string;
  dateScannedIn?: string;
  originalPdfPath?: string;
}

// State abbreviation mapping
const STATE_ABBREVIATIONS: { [key: string]: string } = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
  'District of Columbia': 'DC'
};

// Function to get state abbreviation
const getStateAbbreviation = (state: string): string => {
  if (!state) return 'N/A';
  const normalizedState = state.trim();
  return STATE_ABBREVIATIONS[normalizedState] || normalizedState;
};

// Function to format county to uppercase
const formatCounty = (county: string): string => {
  return county ? county.toUpperCase() : '';
};

// Function to format date to MM/DD/YYYY format
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  // If it's not a date (like "FIRST SALES", "INITIAL PRODUCTION"), return as is
  const nonDateKeywords = ['FIRST SALES', 'INITIAL PRODUCTION', 'FIRST PRODUCTION', 'All Credits Accrued', 'Next Settlement', 'Date of First Sales', 'Date of First Production'];
  if (nonDateKeywords.some(keyword => dateString.toUpperCase().includes(keyword))) {
    return dateString;
  }
  
  try {
    let date: Date;
    
    // Handle formats like "04082025" (MMDDYYYY)
    if (/^\d{8}$/.test(dateString)) {
      const month = parseInt(dateString.substring(0, 2));
      const day = parseInt(dateString.substring(2, 4));
      const year = parseInt(dateString.substring(4, 8));
      date = new Date(year, month - 1, day);
    }
    // Handle formats like "03232025" (MMDDYYYY)
    else if (/^\d{8}$/.test(dateString)) {
      const month = parseInt(dateString.substring(0, 2));
      const day = parseInt(dateString.substring(2, 4));
      const year = parseInt(dateString.substring(4, 8));
      date = new Date(year, month - 1, day);
    }
    // Handle formats like "3/1/25" (M/D/YY)
    else if (/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(dateString)) {
      const parts = dateString.split('/');
      const month = parseInt(parts[0]);
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]) + 2000; // Assume 20xx for 2-digit years
      date = new Date(year, month - 1, day);
    }
    // Handle formats like "3/1/2025" (M/D/YYYY)
    else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      const parts = dateString.split('/');
      const month = parseInt(parts[0]);
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      date = new Date(year, month - 1, day);
    }
    // Handle formats like "06/10/2025" (MM/DD/YYYY)
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const parts = dateString.split('/');
      const month = parseInt(parts[0]);
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      date = new Date(year, month - 1, day);
    }
    // Handle formats like "April 1, 2025" or "May 1, 2022"
    else if (/^[A-Za-z]+\s+\d{1,2},?\s+\d{4}$/.test(dateString)) {
      date = new Date(dateString);
    }
    // Handle formats like "February 28, 2025"
    else if (/^[A-Za-z]+\s+\d{1,2},?\s+\d{4}$/.test(dateString)) {
      date = new Date(dateString);
    }
    // Try parsing as a general date
    else {
      date = new Date(dateString);
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if parsing failed
    }
    
    // Format as MM/DD/YYYY
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  } catch (error) {
    // If any error occurs, return the original string
    return dateString;
  }
};

// Function to format decimal interest with leading zero
const formatDecimalInterest = (decimalString: string): string => {
  if (!decimalString) return '';
  
  // Remove any existing leading zeros and decimal point
  let cleaned = decimalString.replace(/^0+/, '').replace(/^\./, '');
  
  // If it's empty after cleaning, return '0'
  if (!cleaned) return '0';
  
  // Add leading zero and decimal point
  return `0.${cleaned}`;
};

export default function Dashboard() {
  const router = useRouter();
  const [records, setRecords] = useState<DashboardRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNotes, setEditingNotes] = useState<{ [key: number]: string }>({});
  const [editingStatus, setEditingStatus] = useState<{ [key: number]: string }>({});
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);
  const [executingIndex, setExecutingIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Status options
  const statusOptions = ['Executed', 'Curative', 'Title issue', 'Pending Review'];

  const fetchDashboardData = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching dashboard data...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/dashboard?page=${page}&page_size=150`);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Dashboard data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dashboard data');
      }
      
      if (!data.records) {
        throw new Error('No records found in response');
      }
      
      setRecords(data.records);
      setTotalPages(data.total_pages);
      setTotalRecords(data.total);
      setCurrentPage(data.page);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(currentPage);
  }, [currentPage]);

  const handleNotesChange = (index: number, value: string) => {
    setEditingNotes(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleStatusChange = (index: number, value: string) => {
    setEditingStatus(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleNotesBlur = async (index: number) => {
    try {
      console.log('handleNotesBlur called with index:', index);
      console.log('Notes value:', editingNotes[index]);
      
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/dashboard/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            index,
            notes: editingNotes[index] || ''
          }),
        });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to update notes: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);

      // Clear the editing state for this index
      setEditingNotes(prev => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });

      // Refresh the records
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating notes:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while updating notes');
    }
  };

  const handleStatusBlur = async (index: number) => {
    try {
      console.log('handleStatusBlur called with index:', index);
      console.log('Status value:', editingStatus[index]);
      
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/dashboard/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            index,
            status: editingStatus[index] || ''
          }),
        });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to update status: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);

      // Clear the editing state for this index
      setEditingStatus(prev => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });

      // Refresh the records
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while updating status');
    }
  };

  const handleDelete = async (index: number) => {
    try {
      console.log('Delete called with index:', index);
      console.log('Filtered records length:', filteredRecords.length);
      console.log('Original records length:', records.length);
      
      // Validate the index
      if (index < 0 || index >= filteredRecords.length) {
        throw new Error(`Invalid index: ${index}. Filtered records length: ${filteredRecords.length}`);
      }

      // Get the record from the filtered array
      const recordToDelete = filteredRecords[index];
      
      if (!recordToDelete) {
        console.error('Record to delete is undefined. Index:', index);
        console.error('Filtered records:', filteredRecords);
        throw new Error('Record not found in filtered results');
      }

      console.log('Record to delete:', recordToDelete);

      // Find the actual index in the original records array
      const actualIndex = records.findIndex(record => 
        record.propertyName === recordToDelete.propertyName &&
        record.effectiveDate === recordToDelete.effectiveDate &&
        record.entity === recordToDelete.entity
      );

      console.log('Actual index found:', actualIndex);
      console.log('Total records:', records.length);

      if (actualIndex === -1) {
        console.error('Could not find record in original records array');
        console.error('Looking for record:', recordToDelete);
        throw new Error('Record not found in original records');
      }

      console.log('Sending delete request with actual index:', actualIndex);
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/dashboard/delete?index=${actualIndex}`, {
        method: 'DELETE',
      });

      console.log('Delete API response status:', response.status);
      console.log('Delete API response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete API error response:', errorText);
        throw new Error(`Failed to delete record: ${response.status} - ${errorText}`);
      }

      // Remove the record from the local state
      setRecords(prevRecords => prevRecords.filter((_, i) => i !== actualIndex));
      setDeleteConfirmIndex(null);
      
      // Refresh the data to ensure consistency
      fetchDashboardData(currentPage);
    } catch (error) {
      console.error('Error deleting record:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while deleting the record');
    }
  };

  const handleDeduplicate = async () => {
    try {
      setError(null);
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/dashboard/deduplicate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to deduplicate: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Deduplication result:', result);
      
      // Refresh the data to show the deduplicated results
      fetchDashboardData();
      
      // Show success message
      setError(`Success: ${result.message}. Removed ${result.duplicates_removed} duplicates.`);
    } catch (error) {
      console.error('Error deduplicating:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while deduplicating');
    }
  };

  const handleClearDashboard = async () => {
    try {
      setError(null);
      
      // Try the new clear endpoint first
              let response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/dashboard/clear`, {
        method: 'POST',
      });

      if (!response.ok) {
        // Fallback: use deploy endpoint with empty array
        console.log('Clear endpoint not available, using deploy fallback');
        response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/deploy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            records: [],
            replace: true
          }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to clear dashboard');
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      // Refresh the data
      fetchDashboardData(currentPage);
      setError(`Dashboard cleared. ${totalRecords} records removed.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while clearing the dashboard');
    }
  };

  const handleExecute = (record: DashboardRecord, index: number) => {
    if (!record.originalPdfPath) {
      setError('No PDF file available for this record');
      return;
    }
    
    setExecutingIndex(index);
    setError(null);
    
    // Navigate to sign page with the PDF file path
    const filename = record.originalPdfPath.split('/').pop() || record.originalPdfPath.split('\\').pop();
    if (filename) {
      router.push(`/sign?pdf=${encodeURIComponent(filename)}`);
    } else {
      setError('Invalid PDF file path');
      setExecutingIndex(null);
    }
  };

  const handleExportToExcel = async () => {
    try {
      setError(null);
      
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Division Orders');
      
      // Define the columns
      worksheet.columns = [
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Property Name', key: 'propertyName', width: 30 },
        { header: 'Operator', key: 'operator', width: 25 },
        { header: 'Entity', key: 'entity', width: 25 },
        { header: 'State', key: 'state', width: 15 },
        { header: 'County', key: 'county', width: 20 },
        { header: 'Property Description', key: 'propertyDescription', width: 40 },
        { header: 'Decimal Interest', key: 'decimalInterest', width: 20 },
        { header: 'Effective Date', key: 'effectiveDate', width: 20 },
        { header: 'Date Scanned In', key: 'dateScannedIn', width: 20 },
        { header: 'Notes', key: 'notes', width: 30 }
      ];
      
      // Style the header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      
      // Add all records to the worksheet
      records.forEach(record => {
        worksheet.addRow({
          status: record.status || '',
          propertyName: record.propertyName || '',
          operator: record.operator || '',
          entity: record.entity || '',
          state: getStateAbbreviation(record.state),
          county: formatCounty(record.county),
          propertyDescription: record.propertyDescription || '',
          decimalInterest: formatDecimalInterest(record.decimalInterest),
          effectiveDate: formatDate(record.effectiveDate),
          dateScannedIn: record.dateScannedIn ? formatDate(record.dateScannedIn) : 'Not available',
          notes: record.notes || ''
        });
      });
      
      // Auto-fit columns
      worksheet.columns.forEach(column => {
        if (column.width) {
          column.width = Math.min(column.width, 50); // Cap width at 50
        }
      });
      
      // Generate the Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      
      // Create a blob and download link
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `division-orders-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      setError(`Success: Excel file exported with ${records.length} records.`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while exporting to Excel');
    }
  };

  // Filter records based on search term
  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    
    // Split search term into words
    const searchWords = searchTerm.toLowerCase().split(/\s+/);
    
    // Check if all search words are found in any of the relevant fields
    return searchWords.every(word => {
      const searchableFields = [
        record.propertyName?.toLowerCase() || '',
        record.operator?.toLowerCase() || '',
        record.entity?.toLowerCase() || '',
        record.state?.toLowerCase() || '',
        record.county?.toLowerCase() || '',
        record.propertyDescription?.toLowerCase() || '',
        record.decimalInterest?.toLowerCase() || '',
        formatDecimalInterest(record.decimalInterest)?.toLowerCase() || '',
        record.effectiveDate?.toLowerCase() || '',
        formatDate(record.effectiveDate)?.toLowerCase() || '',
        record.dateScannedIn?.toLowerCase() || '',
        formatDate(record.dateScannedIn || '')?.toLowerCase() || '',
        record.status?.toLowerCase() || '',
        record.notes?.toLowerCase() || ''
      ];
      
      return searchableFields.some(field => field.includes(word));
    });
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[98vw] mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Division Orders Dashboard</h1>
              <p className="text-gray-600 text-sm">Showing {records.length} of {totalRecords} records</p>
            </div>
            <div className="flex gap-3">
            <div className="relative">
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-72 px-3 py-2 pl-9 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <svg
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
            </div>
            <button
              onClick={handleExportToExcel}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 text-sm"
            >
              <FiDownload className="h-4 w-4" />
              Export to Excel
            </button>
            <button
              onClick={handleDeduplicate}
              className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center gap-2 text-sm"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Remove Duplicates
            </button>
            <button
              onClick={handleClearDashboard}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 text-sm"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Dashboard
            </button>
          </div>
        </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap w-20">Status</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap w-32">Property Name</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap w-28">Operator</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap w-28">Entity</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap w-16">State</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap w-20">County</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-64">Property Description</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap w-24">Decimal Interest</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap w-24">Effective Date</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap w-24">Date Scanned In</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap w-32">Notes</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap w-16">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-3 py-2 whitespace-nowrap">
                        {editingStatus[index] !== undefined ? (
                          <select
                            value={editingStatus[index]}
                            onChange={(e) => handleStatusChange(index, e.target.value)}
                            onBlur={() => handleStatusBlur(index)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                            autoFocus
                          >
                            <option value="">Select Status</option>
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div
                            onClick={() => setEditingStatus(prev => ({ ...prev, [index]: record.status || '' }))}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:bg-gray-100 transition-colors duration-150 ${
                              record.status === 'Executed' 
                                ? 'bg-green-100 text-green-800'
                                : record.status === 'Curative'
                                ? 'bg-orange-100 text-orange-800'
                                : record.status === 'Title issue'
                                ? 'bg-red-100 text-red-800'
                                : record.status === 'Pending Review'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                            title="Click to edit status"
                          >
                            {record.status || 'Click to edit'}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">{record.propertyName || 'N/A'}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        <div className="truncate max-w-28" title={record.operator}>
                          {record.operator}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        <div className="truncate max-w-28" title={record.entity}>
                          {record.entity}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">{getStateAbbreviation(record.state)}</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{formatCounty(record.county)}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">
                        <div 
                          className="max-w-64 leading-relaxed"
                          title={record.propertyDescription}
                        >
                          {record.propertyDescription && record.propertyDescription.length > 120 ? (
                            <div>
                              <span className="line-clamp-2">{record.propertyDescription}</span>
                              <button 
                                onClick={() => {
                                  const fullText = record.propertyDescription;
                                  if (navigator.clipboard) {
                                    navigator.clipboard.writeText(fullText);
                                    alert('Full description copied to clipboard!');
                                  } else {
                                    // Fallback for older browsers
                                    const textArea = document.createElement('textarea');
                                    textArea.value = fullText;
                                    document.body.appendChild(textArea);
                                    textArea.select();
                                    document.execCommand('copy');
                                    document.body.removeChild(textArea);
                                    alert('Full description copied to clipboard!');
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-800 text-xs mt-1 block"
                              >
                                Copy full description
                              </button>
                            </div>
                          ) : (
                            <span className="break-words">{record.propertyDescription}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-mono">{formatDecimalInterest(record.decimalInterest)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{formatDate(record.effectiveDate)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {record.dateScannedIn ? formatDate(record.dateScannedIn) : 'Not available'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {editingNotes[index] !== undefined ? (
                          <input
                            type="text"
                            value={editingNotes[index]}
                            onChange={(e) => handleNotesChange(index, e.target.value)}
                            onBlur={() => handleNotesBlur(index)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                            autoFocus
                          />
                        ) : (
                          <div
                            onClick={() => setEditingNotes(prev => ({ ...prev, [index]: record.notes || '' }))}
                            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md transition-colors duration-150 text-xs break-words max-w-32 leading-tight line-clamp-3"
                            title={record.notes || 'Click to edit'}
                          >
                            {record.notes || 'Click to edit'}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          {/* Execute button - only show if PDF is available */}
                          {record.originalPdfPath && (
                            <button
                              onClick={() => handleExecute(record, index)}
                              disabled={executingIndex === index}
                              className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Execute PDF (go to sign page)"
                            >
                              <FiFile className="h-4 w-4" />
                            </button>
                          )}
                          
                          {deleteConfirmIndex === index ? (
                            <>
                              <button
                                onClick={() => handleDelete(index)}
                                className="text-red-600 hover:text-red-900 font-medium text-xs"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmIndex(null)}
                                className="text-gray-600 hover:text-gray-900 font-medium text-xs"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmIndex(index)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete record"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

              {/* Pagination */}
              <div className="mt-3 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
          </div>
      </div>
    </div>
  );
}