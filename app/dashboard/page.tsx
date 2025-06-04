'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { stateData } from "@/lib/state-data"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { FileSpreadsheet, PencilIcon, Search } from "lucide-react"
import * as XLSX from 'xlsx';
import { Input } from "@/components/ui/input"

interface DivisionOrder {
  id: string;
  operator: string;
  entity: string;
  wellName: string;
  propertyDescription: string;
  royaltyInterest: string;
  effectiveDate: string;
  state: string;
  county: string;
  status: string;
  notes: string;
  ownerNumber: string;
}

// Sample division order data for demonstration
const divisionOrders: DivisionOrder[] = [
  {
    id: "DO-2024-001",
    operator: "Devon Energy",
    entity: "Blackrock Minerals LLC",
    wellName: "Bobcat 23-1H",
    propertyDescription: "Section 23, Block 4, 160 acres",
    royaltyInterest: "0.125",
    effectiveDate: "2024-01-15",
    state: "TX",
    county: "Midland",
    status: "in_process",
    notes: "Waiting on title opinion",
    ownerNumber: "OWN-001"
  },
  {
    id: "DO-2024-002",
    operator: "Pioneer Natural Resources",
    entity: "Crown Minerals Trust",
    wellName: "Eagle Ford 14-2H",
    propertyDescription: "Section 14, Block 2, 80 acres",
    royaltyInterest: "0.1875",
    effectiveDate: "2024-01-14",
    state: "TX",
    county: "Reeves",
    status: "title_issue",
    notes: "Missing heirship documentation",
    ownerNumber: "OWN-002"
  },
  {
    id: "DO-2024-003",
    operator: "Occidental",
    entity: "Desert Holdings LLC",
    wellName: "Permian Vista 5-3H",
    propertyDescription: "Section 5, Block 3, 320 acres",
    royaltyInterest: "0.25",
    effectiveDate: "2024-01-13",
    state: "NM",
    county: "Lea",
    status: "contact_operator",
    notes: "Need updated division order form",
    ownerNumber: "OWN-003"
  },
];

export default function DashboardPage() {
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [orders, setOrders] = useState<DivisionOrder[]>(divisionOrders);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter orders based on state, status, and search query
  const getFilteredOrders = (statusFilter: string = selectedStatus) => {
    return orders
      .filter(order => selectedState === "all" || order.state === selectedState)
      .filter(order => statusFilter === "all" || order.status === statusFilter)
      .filter(order => {
        const query = searchQuery.toLowerCase();
        return (
          order.operator.toLowerCase().includes(query) ||
          order.entity.toLowerCase().includes(query) ||
          order.wellName.toLowerCase().includes(query) ||
          order.propertyDescription.toLowerCase().includes(query) ||
          order.county.toLowerCase().includes(query) ||
          order.notes.toLowerCase().includes(query) ||
          order.ownerNumber.toLowerCase().includes(query)
        );
      });
  };

  // Clear filters and search
  const clearFilters = () => {
    setSelectedState("all");
    setSelectedStatus("all");
    setSearchQuery("");
  };

  // Status display helper
  const getStatusDisplay = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      in_process: { label: "In Process", color: "bg-blue-50 text-blue-700" },
      in_pay: { label: "In Pay", color: "bg-green-50 text-green-700" },
      not_received: { label: "Not Received", color: "bg-gray-50 text-gray-700" },
      title_issue: { label: "Title Issue", color: "bg-red-50 text-red-700" },
      contact_operator: { label: "Contact Operator", color: "bg-yellow-50 text-yellow-700" }
    };
    return statusMap[status] || { label: status, color: "bg-gray-50 text-gray-700" };
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleNoteEdit = (orderId: string, currentNote: string) => {
    setEditingNote(orderId);
    setNoteText(currentNote);
  };

  const handleNoteSave = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, notes: noteText } : order
      )
    );
    setEditingNote(null);
  };

  const handleExportToExcel = () => {
    const exportData = getFilteredOrders().map(order => ({
      'ID': order.id,
      'Owner #': order.ownerNumber,
      'Operator': order.operator,
      'Entity': order.entity,
      'Well/Property': order.wellName,
      'Property Description': order.propertyDescription,
      'Royalty Interest': order.royaltyInterest,
      'Effective Date': order.effectiveDate,
      'State': order.state,
      'County': order.county,
      'Status': getStatusDisplay(order.status).label,
      'Notes': order.notes
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Division Orders');
    XLSX.writeFile(wb, `division_orders_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const OrdersTable = ({ orders }: { orders: DivisionOrder[] }) => (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="grid grid-cols-10 gap-4 font-medium text-sm">
          <div>Status</div>
          <div>Owner #</div>
          <div>Operator</div>
          <div>Entity</div>
          <div>Well/Property</div>
          <div>Property Description</div>
          <div>Royalty Interest</div>
          <div>Effective Date</div>
          <div>County</div>
          <div>Notes</div>
        </div>
      </div>
      <div className="divide-y">
        {orders.map((order) => (
          <div key={order.id} className="grid grid-cols-10 gap-4 p-4 hover:bg-muted/50">
            <div className="flex gap-2">
              <select
                value={order.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusChange(order.id, e.target.value)}
                className={`text-xs border rounded px-1.5 py-0.5 ${getStatusDisplay(order.status).color} min-w-[100px] focus:outline-none focus:ring-1 focus:ring-blue-500`}
              >
                <option value="in_process">In Process</option>
                <option value="in_pay">In Pay</option>
                <option value="not_received">Not Received</option>
                <option value="title_issue">Title Issue</option>
                <option value="contact_operator">Contact Operator</option>
              </select>
            </div>
            <div className="text-sm font-medium">{order.ownerNumber}</div>
            <div>{order.operator}</div>
            <div>{order.entity}</div>
            <div>{order.wellName}</div>
            <div>{order.propertyDescription}</div>
            <div>{order.royaltyInterest}</div>
            <div>{order.effectiveDate}</div>
            <div>{order.county}</div>
            <div className="relative">
              {editingNote === order.id ? (
                <div className="absolute inset-0 z-10 bg-background">
                  <div className="flex flex-col gap-2 h-full">
                    <Textarea
                      value={noteText}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNoteText(e.target.value)}
                      className="flex-1 text-sm resize-none"
                      placeholder="Add a note..."
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingNote(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleNoteSave(order.id)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{order.notes}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6"
                    onClick={() => handleNoteEdit(order.id, order.notes)}
                  >
                    <PencilIcon className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No division orders found matching your criteria
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Division Orders Dashboard</h1>
        <Button onClick={handleExportToExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by owner #, operator, entity, well name, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All States</option>
            {stateData.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Statuses</option>
            <option value="in_process">In Process</option>
            <option value="in_pay">In Pay</option>
            <option value="not_received">Not Received</option>
            <option value="title_issue">Title Issue</option>
            <option value="contact_operator">Contact Operator</option>
          </select>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Division Orders</CardTitle>
            <CardDescription>
              {getFilteredOrders().length} orders found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersTable orders={getFilteredOrders()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
