export interface User {
  Email: string;
  Name: string;
  Role: 'IT Admin' | 'IT Technician' | 'Viewer';
  Status: 'Active' | 'Inactive';
}

export interface Asset {
  'Asset ID': string;
  'Asset Type': string;
  Brand: string;
  Model: string;
  'Serial No.': string;
  'Purchase Date': string;
  'Purchase Cost': number | string;
  'Assigned To': string;
  Department: string;
  Location: string;
  Status: 'Available' | 'Assigned' | 'Under Repair' | 'Damaged' | 'Retired';
  Condition: 'New' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  'Warranty Until': string;
  Vendor: string;
  Remarks: string;
}

export interface Repair {
  'Repair ID': string;
  'Asset ID': string;
  'Asset Type'?: string;
  Employee?: string;
  'Damage Date'?: string;
  'Problem / Damage': string;
  'Vendor / Repairer'?: string;
  'Repair Cost'?: number | string;
  Status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  Remarks?: string;
}

export interface Ticket {
  'Ticket ID': string;
  Date: string;
  'Raised By': string;
  Employee: string;
  Department: string;
  Category: string;
  Priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  Subject: string;
  Description: string;
  'Assigned To': string;
  Status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  Resolution?: string;
  'Closed Date'?: string;
}

export interface Department {
  'Department ID': string;
  'Department Name': string;
  Head: string;
  Location: string;
  Status: 'Active' | 'Inactive';
  Remarks: string;
}

export interface Expense {
  'Expense ID': string;
  Date: string;
  'Expense Type': string;
  Description: string;
  Amount: number | string;
  Vendor?: string;
  Remarks?: string;
}

export interface Cartridge {
  'Cartridge ID': string;
  'Printer ID': string;
  'Cartridge Type': string;
  Status?: string;
  'Refill Count'?: number | string;
  'Last Refill Date'?: string;
  Remarks?: string;
}

export interface AuditLog {
  Timestamp: string;
  User: string;
  Role: string;
  Action: string;
  Module: string;
  'Record ID': string;
  Details: string;
}

export interface DashboardData {
  kpis: {
    totalAssets: number;
    assigned: number;
    available: number;
    underRepair: number;
    damaged: number;
    totalValue: number;
  };
  assetTypes: { label: string; value: number }[];
  assetLocations: { label: string; value: number }[];
  departments: { label: string; value: number }[];
  recentRepairs: Repair[];
  recentAssets: Asset[];
  monthlyExpenses: { month: string; value: number }[];
  printerSummary: { printers: number; cartridges: number };
}
