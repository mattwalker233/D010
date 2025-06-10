'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiFile, FiRefreshCw } from 'react-icons/fi';

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

export default function Dashboard() {
  const [records, setRecords] = useState<DashboardRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNotes, setEditingNotes] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching dashboard data...');
      const response = await fetch('http://localhost:8000/api/dashboard');
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
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleNotesChange = (index: number, value: string) => {
    setEditingNotes(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleNotesBlur = async (index: number) => {
    try {
      const response = await fetch('/api/dashboard/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          index,
          notes: editingNotes[index] || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update notes');
      }

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
        record.effectiveDate?.toLowerCase() || '',
        record.notes?.toLowerCase() || ''
      ];
      
      return searchableFields.some(field => field.includes(word));
    });
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[100vw] mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Division Orders Dashboard</h1>
              <p className="text-gray-600">Manage and track your division orders in one place</p>
            </div>
            <div className="flex gap-4">
            <div className="relative">
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 px-4 py-2.5 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <svg
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
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

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Property Name</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Operator</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Entity</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">State</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">County</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Property Description</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Decimal Interest</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Effective Date</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'Completed' 
                            ? 'bg-green-100 text-green-800'
                            : record.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.propertyName || 'N/A'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.operator}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.entity}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">{getStateAbbreviation(record.state)}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.county}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.propertyDescription}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.decimalInterest}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.effectiveDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {editingNotes[index] !== undefined ? (
                          <input
                            type="text"
                            value={editingNotes[index]}
                            onChange={(e) => handleNotesChange(index, e.target.value)}
                            onBlur={() => handleNotesBlur(index)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            autoFocus
                          />
                        ) : (
                          <div
                            onClick={() => setEditingNotes(prev => ({ ...prev, [index]: record.notes || '' }))}
                            className="cursor-pointer hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors duration-150"
                          >
                            {record.notes || ''}
                </div>
              )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
      </div>
    </div>
  );
}