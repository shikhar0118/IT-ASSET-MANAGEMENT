import type { Asset, Repair, Ticket, Department, Expense, Cartridge, User, AuditLog, DashboardData } from './types';

const STORAGE_KEY = 'IT_ASSET_MGMT_STORE_PROD';

const INITIAL_DATA = {
  users: [
    { Email: 'admin@company.com', Name: 'Alex Morgan', Role: 'IT Admin', Status: 'Active' },
    { Email: 'tech@company.com', Name: 'Sam Wilson', Role: 'IT Technician', Status: 'Active' },
    { Email: 'viewer@company.com', Name: 'Jordan Lee', Role: 'Viewer', Status: 'Active' }
  ] as User[],

  assets: [
    { 'Asset ID': 'AST-001', 'Asset Type': 'Laptop', Brand: 'Dell', Model: 'XPS 15 9530', 'Serial No.': 'SN-DL-9912', 'Purchase Date': '2025-01-15', 'Purchase Cost': 145000, 'Assigned To': 'Vikram Sharma', Department: 'Engineering', Location: 'Floor 3 - Bay B', Status: 'Assigned', Condition: 'Good', 'Warranty Until': '2028-01-15', Vendor: 'Dell India', Remarks: 'Primary workstation' },
    { 'Asset ID': 'AST-002', 'Asset Type': 'Laptop', Brand: 'Apple', Model: 'MacBook Pro M3 Max', 'Serial No.': 'SN-AP-8831', 'Purchase Date': '2025-03-10', 'Purchase Cost': 240000, 'Assigned To': 'Priya Nair', Department: 'Design', Location: 'Floor 2 - Studio', Status: 'Assigned', Condition: 'New', 'Warranty Until': '2027-03-10', Vendor: 'Apple Store', Remarks: 'Design Lead laptop' },
    { 'Asset ID': 'AST-003', 'Asset Type': 'Printer', Brand: 'HP', Model: 'LaserJet Pro M404dn', 'Serial No.': 'SN-HP-4411', 'Purchase Date': '2024-06-20', 'Purchase Cost': 32000, 'Assigned To': 'IT Ops', Department: 'IT', Location: 'Floor 1 - Server Room', Status: 'Available', Condition: 'Good', 'Warranty Until': '2026-06-20', Vendor: 'HP Office World', Remarks: 'Network shared printer' },
    { 'Asset ID': 'AST-004', 'Asset Type': 'Monitor', Brand: 'Dell', Model: 'UltraSharp 27" 4K', 'Serial No.': 'SN-DL-1123', 'Purchase Date': '2024-11-05', 'Purchase Cost': 42000, 'Assigned To': '', Department: 'HR', Location: 'Floor 4 - HR Office', Status: 'Under Repair', Condition: 'Fair', 'Warranty Until': '2026-11-05', Vendor: 'Dell India', Remarks: 'Flickering display panel' },
    { 'Asset ID': 'AST-005', 'Asset Type': 'Desktop', Brand: 'Lenovo', Model: 'ThinkCentre M70', 'Serial No.': 'SN-LN-6623', 'Purchase Date': '2023-09-12', 'Purchase Cost': 65000, 'Assigned To': 'Rahul Verma', Department: 'Finance', Location: 'Floor 1 - Finance', Status: 'Assigned', Condition: 'Good', 'Warranty Until': '2025-09-12', Vendor: 'Lenovo Commercial', Remarks: 'Accounting workstation' },
  ] as Asset[],

  repairs: [
    { 'Repair ID': 'REP-001', 'Asset ID': 'AST-004', 'Asset Type': 'Monitor', Employee: 'Anita Roy', 'Damage Date': '2026-09-28', 'Problem / Damage': 'Display backlight blinking', 'Vendor / Repairer': 'Dell Service Center', 'Repair Cost': 4500, Status: 'In Progress', Remarks: 'Sent to vendor for panel replacement' },
    { 'Repair ID': 'REP-002', 'Asset ID': 'AST-001', 'Asset Type': 'Laptop', Employee: 'Vikram Sharma', 'Damage Date': '2026-08-10', 'Problem / Damage': 'Keyboard key sticking', 'Vendor / Repairer': 'In-House Tech', 'Repair Cost': 1200, Status: 'Completed', Remarks: 'Cleaned and replaced keycap' },
  ] as Repair[],

  tickets: [
    { 'Ticket ID': 'TKT-001', Date: '2026-10-01', 'Raised By': 'Priya Nair', Employee: 'Priya Nair', Department: 'Design', Category: 'Software', Priority: 'High', Subject: 'Figma license upgrade request', Description: 'Need Enterprise seat for team collaboration plugin.', 'Assigned To': 'Sam Wilson', Status: 'In Progress', Resolution: '' },
    { 'Ticket ID': 'TKT-002', Date: '2026-09-30', 'Raised By': 'Rahul Verma', Employee: 'Rahul Verma', Department: 'Finance', Category: 'Network', Priority: 'Medium', Subject: 'VPN disconnection in evening', Description: 'VPN drops connection after 6 PM regularly.', 'Assigned To': 'Alex Morgan', Status: 'Open', Resolution: '' }
  ] as Ticket[],

  departments: [
    { 'Department ID': 'DEP-001', 'Department Name': 'Engineering', Head: 'Rajesh Kumar', Location: 'Floor 3', Status: 'Active', Remarks: 'Software Development & Architecture' },
    { 'Department ID': 'DEP-002', 'Department Name': 'Design', Head: 'Priya Nair', Location: 'Floor 2', Status: 'Active', Remarks: 'UI/UX & Graphics Studio' },
    { 'Department ID': 'DEP-003', 'Department Name': 'Finance', Head: 'Sanjay Gupta', Location: 'Floor 1', Status: 'Active', Remarks: 'Accounts & Treasury' },
    { 'Department ID': 'DEP-004', 'Department Name': 'HR', Head: 'Meena Kapoor', Location: 'Floor 4', Status: 'Active', Remarks: 'Talent Acquisition & People Ops' },
    { 'Department ID': 'DEP-005', 'Department Name': 'IT', Head: 'Alex Morgan', Location: 'Floor 1 - Server Room', Status: 'Active', Remarks: 'IT Operations & Security' }
  ] as Department[],

  expenses: [
    { 'Expense ID': 'EXP-001', Date: '2026-09-15', 'Expense Type': 'Software License', Description: 'Google Workspace Annual Renewal', Amount: 185000, Vendor: 'Google Cloud India', Remarks: '120 Seats' },
    { 'Expense ID': 'EXP-002', Date: '2026-09-20', 'Expense Type': 'Hardware Maintenance', Description: 'Server Room AC Servicing', Amount: 12500, Vendor: 'Blue Star Service', Remarks: 'Quarterly maintenance' },
    { 'Expense ID': 'EXP-003', Date: '2026-08-05', 'Expense Type': 'Peripherals', Description: 'Logitech Wireless Mouse Pack (10x)', Amount: 18000, Vendor: 'Amazon Business', Remarks: 'Buffer stock' },
  ] as Expense[],

  cartridges: [
    { 'Cartridge ID': 'CAR-001', 'Printer ID': 'AST-003', 'Cartridge Type': 'HP 76A Black Laser Toner', Status: 'Installed', 'Refill Count': 2, 'Last Refill Date': '2026-09-10', Remarks: 'Yield 3000 pages' },
    { 'Cartridge ID': 'CAR-002', 'Printer ID': 'AST-003', 'Cartridge Type': 'HP 76A Spare Cartridge', Status: 'In Stock', 'Refill Count': 0, 'Last Refill Date': '', Remarks: 'Ready in storage cabinet' }
  ] as Cartridge[],

  auditLogs: [
    { Timestamp: '2026-10-04 10:15:00', User: 'Alex Morgan', Role: 'IT Admin', Action: 'Login', Module: 'Authentication', 'Record ID': '', Details: 'Successful login' },
    { Timestamp: '2026-10-04 11:30:22', User: 'Sam Wilson', Role: 'IT Technician', Action: 'Create', Module: 'Repairs & Damage', 'Record ID': 'REP-001', Details: 'Repair record added for AST-004' }
  ] as AuditLog[]
};

function getStore() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  try { return JSON.parse(raw); } catch { return INITIAL_DATA; }
}

function saveStore(data: typeof INITIAL_DATA) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const api = {
  async login(username: string, _password: string) {
    await new Promise(r => setTimeout(r, 350));
    const store = getStore();
    const u = store.users.find((x: User) => x.Email.toLowerCase() === username.toLowerCase().trim());
    if (!u) return { success: false, message: 'User email not found.' };
    if (u.Status !== 'Active') return { success: false, message: 'Account inactive. Contact administrator.' };
    
    const token = 'TOK_' + Math.random().toString(36).substring(2);
    const session = { email: u.Email, name: u.Name, role: u.Role, token };
    localStorage.setItem('IT_SESSION', JSON.stringify(session));

    store.auditLogs.unshift({
      Timestamp: new Date().toLocaleString('en-IN'),
      User: u.Name,
      Role: u.Role,
      Action: 'Login',
      Module: 'Authentication',
      'Record ID': '',
      Details: 'Successful user authentication'
    });
    saveStore(store);

    return { success: true, token, email: u.Email, name: u.Name, role: u.Role };
  },

  getCurrentUser() {
    const raw = localStorage.getItem('IT_SESSION');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  logout() {
    localStorage.removeItem('IT_SESSION');
    return { success: true };
  },

  async getDashboardData(): Promise<DashboardData> {
    await new Promise(r => setTimeout(r, 200));
    const store = getStore();
    
    let totalAssets = store.assets.length;
    let assigned = 0, available = 0, underRepair = 0, damaged = 0, totalValue = 0;

    const typeMap: Record<string, number> = {};
    const locMap: Record<string, number> = {};
    const deptMap: Record<string, number> = {};

    store.assets.forEach((a: Asset) => {
      const status = (a.Status || '').toLowerCase();
      if (status === 'assigned') assigned++;
      else if (status === 'available') available++;
      else if (status === 'under repair') underRepair++;
      else if (status === 'damaged') damaged++;

      const cost = Number(String(a['Purchase Cost']).replace(/[₹,\s]/g, '')) || 0;
      totalValue += cost;

      if (a['Asset Type']) typeMap[a['Asset Type']] = (typeMap[a['Asset Type']] || 0) + 1;
      if (a.Location) locMap[a.Location] = (locMap[a.Location] || 0) + 1;
      if (a.Department) deptMap[a.Department] = (deptMap[a.Department] || 0) + 1;
    });

    const top = (obj: Record<string, number>) => Object.keys(obj)
      .map(k => ({ label: k, value: obj[k] }))
      .sort((a, b) => b.value - a.value);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyExpenses = months.map(m => ({ month: m, value: 0 }));
    store.expenses.forEach((e: Expense) => {
      const d = new Date(e.Date);
      if (!isNaN(d.getTime())) {
        const amt = Number(String(e.Amount).replace(/[₹,\s]/g, '')) || 0;
        monthlyExpenses[d.getMonth()].value += amt;
      }
    });

    return {
      kpis: { totalAssets, assigned, available, underRepair, damaged, totalValue },
      assetTypes: top(typeMap),
      assetLocations: top(locMap),
      departments: top(deptMap),
      recentRepairs: store.repairs.slice(0, 5),
      recentAssets: store.assets.slice(0, 5),
      monthlyExpenses,
      printerSummary: {
        printers: store.assets.filter((a: Asset) => a['Asset Type'].toLowerCase().includes('printer')).length,
        cartridges: store.cartridges.length
      }
    };
  },

  async getAssets(filters?: any) {
    const store = getStore();
    let res = [...store.assets];
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      res = res.filter((a: Asset) => JSON.stringify(a).toLowerCase().includes(q));
    }
    if (filters?.status) res = res.filter((a: Asset) => a.Status.toLowerCase() === filters.status.toLowerCase());
    if (filters?.type) res = res.filter((a: Asset) => a['Asset Type'].toLowerCase() === filters.type.toLowerCase());
    
    return {
      assets: res,
      options: {
        statuses: Array.from(new Set(store.assets.map((a: Asset) => a.Status))),
        types: Array.from(new Set(store.assets.map((a: Asset) => a['Asset Type']))),
        departments: Array.from(new Set(store.assets.map((a: Asset) => a.Department))),
        locations: Array.from(new Set(store.assets.map((a: Asset) => a.Location)))
      }
    };
  },

  async saveAsset(asset: Asset, isNew: boolean) {
    const store = getStore();
    if (isNew) {
      if (store.assets.some((a: Asset) => a['Asset ID'].toLowerCase() === asset['Asset ID'].toLowerCase())) {
        throw new Error('Asset ID already exists.');
      }
      store.assets.push(asset);
    } else {
      const idx = store.assets.findIndex((a: Asset) => a['Asset ID'] === asset['Asset ID']);
      if (idx !== -1) store.assets[idx] = asset;
    }
    saveStore(store);
    return { success: true, message: `Asset ${asset['Asset ID']} saved.` };
  },

  async deleteAsset(assetId: string) {
    const store = getStore();
    store.assets = store.assets.filter((a: Asset) => a['Asset ID'] !== assetId);
    saveStore(store);
    return { success: true, message: 'Asset deleted.' };
  },

  async getRepairs() {
    const store = getStore();
    return { repairs: store.repairs };
  },

  async saveRepair(repair: Repair, isNew: boolean) {
    const store = getStore();
    if (isNew) {
      if (!repair['Repair ID']) repair['Repair ID'] = 'REP-' + String(store.repairs.length + 1).padStart(3, '0');
      store.repairs.push(repair);
    } else {
      const idx = store.repairs.findIndex((r: Repair) => r['Repair ID'] === repair['Repair ID']);
      if (idx !== -1) store.repairs[idx] = repair;
    }
    const assetIdx = store.assets.findIndex((a: Asset) => a['Asset ID'] === repair['Asset ID']);
    if (assetIdx !== -1) {
      if (repair.Status === 'Completed') store.assets[assetIdx].Status = 'Available';
      else if (repair.Status === 'In Progress' || repair.Status === 'Pending') store.assets[assetIdx].Status = 'Under Repair';
    }
    saveStore(store);
    return { success: true, message: 'Repair record saved.' };
  },

  async assignAsset(data: { 'Asset ID': string; Employee: string; Department: string; Remarks?: string }) {
    const store = getStore();
    const assetIdx = store.assets.findIndex((a: Asset) => a['Asset ID'] === data['Asset ID']);
    if (assetIdx === -1) throw new Error('Asset not found');

    store.assets[assetIdx].Status = 'Assigned';
    store.assets[assetIdx]['Assigned To'] = data.Employee;
    store.assets[assetIdx].Department = data.Department;
    saveStore(store);
    return { success: true, message: `Asset ${data['Asset ID']} assigned to ${data.Employee}` };
  },

  async returnAsset(data: { 'Asset ID': string; 'Returned Condition': string; Remarks?: string }) {
    const store = getStore();
    const assetIdx = store.assets.findIndex((a: Asset) => a['Asset ID'] === data['Asset ID']);
    if (assetIdx === -1) throw new Error('Asset not found');

    const cond = (data['Returned Condition'] || '').toLowerCase();
    store.assets[assetIdx].Status = (cond === 'damaged' || cond === 'critical') ? 'Damaged' : 'Available';
    store.assets[assetIdx]['Assigned To'] = '';
    store.assets[assetIdx].Condition = data['Returned Condition'] as any || store.assets[assetIdx].Condition;
    saveStore(store);
    return { success: true, message: `Asset ${data['Asset ID']} returned successfully.` };
  },

  async getTickets() {
    const store = getStore();
    return { tickets: store.tickets };
  },

  async saveTicket(ticket: Ticket, isNew: boolean) {
    const store = getStore();
    if (isNew) {
      if (!ticket['Ticket ID']) ticket['Ticket ID'] = 'TKT-' + String(store.tickets.length + 1).padStart(3, '0');
      ticket.Date = new Date().toISOString().split('T')[0];
      ticket.Status = ticket.Status || 'Open';
      store.tickets.unshift(ticket);
    } else {
      const idx = store.tickets.findIndex((t: Ticket) => t['Ticket ID'] === ticket['Ticket ID']);
      if (idx !== -1) store.tickets[idx] = ticket;
    }
    saveStore(store);
    return { success: true, message: 'Ticket saved.' };
  },

  async getDepartments() {
    const store = getStore();
    return { departments: store.departments };
  },

  async saveDepartment(dept: Department, isNew: boolean) {
    const store = getStore();
    if (isNew) {
      if (!dept['Department ID']) dept['Department ID'] = 'DEP-' + String(store.departments.length + 1).padStart(3, '0');
      store.departments.push(dept);
    } else {
      const idx = store.departments.findIndex((d: Department) => d['Department ID'] === dept['Department ID']);
      if (idx !== -1) store.departments[idx] = dept;
    }
    saveStore(store);
    return { success: true, message: 'Department saved.' };
  },

  async saveExpense(exp: Expense, isNew: boolean) {
    const store = getStore();
    if (isNew) {
      if (!exp['Expense ID']) exp['Expense ID'] = 'EXP-' + String(store.expenses.length + 1).padStart(3, '0');
      store.expenses.unshift(exp);
    } else {
      const idx = store.expenses.findIndex((e: Expense) => e['Expense ID'] === exp['Expense ID']);
      if (idx !== -1) store.expenses[idx] = exp;
    }
    saveStore(store);
    return { success: true, message: 'Expense saved.' };
  },

  async getExpenses() {
    const store = getStore();
    return { expenses: store.expenses };
  },

  async getCartridges() {
    const store = getStore();
    return { cartridges: store.cartridges };
  },

  async getUsers() {
    const store = getStore();
    return { users: store.users };
  },

  async getAuditLogs() {
    const store = getStore();
    return { logs: store.auditLogs };
  }
};
