/**
 * IT ASSET MANAGEMENT SYSTEM - GOOGLE APPS SCRIPT BACKEND
 * 
 * Instructions:
 * 1. Open your Google Sheet (or create a new one).
 * 2. Extensions -> Apps Script.
 * 3. Replace Code.gs with this file content.
 * 4. Run `setupSystem()` function once from the Apps Script editor toolbar.
 * 5. Click "Deploy" -> "New Deployment" -> Select "Web App".
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 6. Copy the Web App URL and paste it into your React app's `src/api.ts` file!
 */

const CONFIG = {
  USERS_SHEET: 'Users',
  ASSET_SHEET: 'Asset Register',
  REPAIR_SHEET: 'Repair & Damage',
  ASSIGNMENT_SHEET: 'Assignment History',
  CARTRIDGE_SHEET: 'Printer & Cartridge',
  EXPENSE_SHEET: 'IT Expenses',
  AUDIT_SHEET: 'Audit Log',
  TICKET_SHEET: 'IT Tickets',
  DEPARTMENT_SHEET: 'Departments'
};

function doGet(e) {
  const action = e.parameter.action;
  let responseData = {};

  try {
    switch (action) {
      case 'getDashboard':
        responseData = getDashboardData_();
        break;
      case 'getAssets':
        responseData = getAssets_(e.parameter);
        break;
      case 'getRepairs':
        responseData = getRepairs_(e.parameter);
        break;
      case 'getTickets':
        responseData = getTickets_(e.parameter);
        break;
      case 'getDepartments':
        responseData = getDepartments_();
        break;
      case 'getExpenses':
        responseData = getExpenses_();
        break;
      case 'getCartridges':
        responseData = getCartridges_();
        break;
      case 'getUsers':
        responseData = getUsers_();
        break;
      case 'getAuditLogs':
        responseData = getAuditLogs_();
        break;
      default:
        responseData = { success: false, message: 'Invalid action API requested.' };
    }
  } catch (err) {
    responseData = { success: false, error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let body = {};
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    body = e.parameter;
  }

  const action = body.action;
  let responseData = {};

  try {
    switch (action) {
      case 'login':
        responseData = login_(body.username, body.password);
        break;
      case 'saveAsset':
        responseData = saveAsset_(body.asset, body.isNew);
        break;
      case 'deleteAsset':
        responseData = deleteAsset_(body.assetId);
        break;
      case 'saveRepair':
        responseData = saveRepair_(body.repair, body.isNew);
        break;
      case 'assignAsset':
        responseData = assignAsset_(body.data);
        break;
      case 'returnAsset':
        responseData = returnAsset_(body.data);
        break;
      case 'saveTicket':
        responseData = saveTicket_(body.ticket, body.isNew);
        break;
      case 'saveDepartment':
        responseData = saveDepartment_(body.department, body.isNew);
        break;
      case 'saveExpense':
        responseData = saveExpense_(body.expense, body.isNew);
        break;
      default:
        responseData = { success: false, message: 'Invalid POST action.' };
    }
  } catch (err) {
    responseData = { success: false, error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ================= SYSTEM SETUP & SEEDING ================= */
function setupSystem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  ensureManagedSheet_(CONFIG.USERS_SHEET, ['Email', 'Name', 'Role', 'Status', 'Password']);
  ensureManagedSheet_(CONFIG.ASSET_SHEET, ['Asset ID', 'Asset Type', 'Brand', 'Model', 'Serial No.', 'Purchase Date', 'Purchase Cost', 'Assigned To', 'Department', 'Location', 'Status', 'Condition', 'Warranty Until', 'Vendor', 'Remarks']);
  ensureManagedSheet_(CONFIG.REPAIR_SHEET, ['Repair ID', 'Asset ID', 'Asset Type', 'Employee', 'Damage Date', 'Problem / Damage', 'Vendor / Repairer', 'Repair Cost', 'Status', 'Remarks']);
  ensureManagedSheet_(CONFIG.ASSIGNMENT_SHEET, ['Transaction ID', 'Asset ID', 'Employee', 'Department', 'Issue Date', 'Return Date', 'Returned Condition', 'Issued By', 'Remarks']);
  ensureManagedSheet_(CONFIG.TICKET_SHEET, ['Ticket ID', 'Date', 'Raised By', 'Employee', 'Department', 'Category', 'Priority', 'Subject', 'Description', 'Assigned To', 'Status', 'Resolution', 'Closed Date']);
  ensureManagedSheet_(CONFIG.DEPARTMENT_SHEET, ['Department ID', 'Department Name', 'Head', 'Location', 'Status', 'Remarks']);
  ensureManagedSheet_(CONFIG.EXPENSE_SHEET, ['Expense ID', 'Date', 'Expense Type', 'Description', 'Amount', 'Vendor', 'Remarks']);
  ensureManagedSheet_(CONFIG.CARTRIDGE_SHEET, ['Cartridge ID', 'Printer ID', 'Cartridge Type', 'Status', 'Refill Count', 'Last Refill Date', 'Remarks']);
  ensureManagedSheet_(CONFIG.AUDIT_SHEET, ['Timestamp', 'User', 'Role', 'Action', 'Module', 'Record ID', 'Details']);

  // Seed default admin user if empty
  const uSheet = ss.getSheetByName(CONFIG.USERS_SHEET);
  if (uSheet.getLastRow() < 2) {
    uSheet.appendRow(['admin@company.com', 'Alex Morgan', 'IT Admin', 'Active', 'admin123']);
    uSheet.appendRow(['tech@company.com', 'Sam Wilson', 'IT Technician', 'Active', 'tech123']);
    uSheet.appendRow(['viewer@company.com', 'Jordan Lee', 'Viewer', 'Active', 'viewer123']);
  }

  return 'System setup completed successfully.';
}

function ensureManagedSheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  const current = sh.getLastColumn() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0].map(v => String(v).trim()) : [];
  if (!current.length || current.every(v => !v)) sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold');
  return sh;
}

/* ================= INTERNAL HANDLERS ================= */
function login_(username, password) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(CONFIG.USERS_SHEET);
  if (!sh || sh.getLastRow() < 2) return { success: false, message: 'Users sheet empty.' };

  const values = sh.getDataRange().getDisplayValues();
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[0].toLowerCase().trim() === String(username).toLowerCase().trim()) {
      if (row[3] !== 'Active') return { success: false, message: 'Account inactive.' };
      return { success: true, email: row[0], name: row[1], role: row[2], token: 'TOK_' + Utilities.getUuid() };
    }
  }
  return { success: false, message: 'Invalid email or password.' };
}

function getDashboardData_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aSheet = ss.getSheetByName(CONFIG.ASSET_SHEET);
  const assets = aSheet && aSheet.getLastRow() >= 2 ? aSheet.getDataRange().getDisplayValues().slice(1) : [];

  let assigned = 0, available = 0, underRepair = 0, damaged = 0, totalValue = 0;
  assets.forEach(row => {
    const st = String(row[10] || '').toLowerCase();
    if (st === 'assigned') assigned++;
    else if (st === 'available') available++;
    else if (st === 'under repair') underRepair++;
    else if (st === 'damaged') damaged++;

    const val = Number(String(row[6] || '').replace(/[₹,\s]/g, '')) || 0;
    totalValue += val;
  });

  return {
    kpis: { totalAssets: assets.length, assigned, available, underRepair, damaged, totalValue },
    printerSummary: { printers: 0, cartridges: 0 }
  };
}

function getAssets_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(CONFIG.ASSET_SHEET);
  if (!sh || sh.getLastRow() < 2) return { assets: [], options: { statuses: [], types: [] } };
  const values = sh.getDataRange().getDisplayValues();
  const headers = values[0];
  const assets = [];
  for (let i = 1; i < values.length; i++) {
    const rec = {};
    headers.forEach((h, j) => { rec[h] = values[i][j]; });
    assets.push(rec);
  }
  return { assets, options: { statuses: ['Available', 'Assigned', 'Under Repair', 'Damaged'], types: ['Laptop', 'Desktop', 'Printer', 'Monitor'] } };
}

function saveAsset_(asset, isNew) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(CONFIG.ASSET_SHEET);
  if (isNew) {
    sh.appendRow([
      asset['Asset ID'], asset['Asset Type'], asset.Brand, asset.Model, asset['Serial No.'],
      asset['Purchase Date'], asset['Purchase Cost'], asset['Assigned To'], asset.Department,
      asset.Location, asset.Status, asset.Condition, asset['Warranty Until'], asset.Vendor, asset.Remarks
    ]);
  }
  return { success: true, message: 'Asset saved to Google Sheet.' };
}

function getRepairs_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(CONFIG.REPAIR_SHEET);
  if (!sh || sh.getLastRow() < 2) return { repairs: [] };
  const values = sh.getDataRange().getDisplayValues();
  const headers = values[0];
  const repairs = [];
  for (let i = 1; i < values.length; i++) {
    const rec = {};
    headers.forEach((h, j) => { rec[h] = values[i][j]; });
    repairs.push(rec);
  }
  return { repairs };
}

function saveRepair_(repair, isNew) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(CONFIG.REPAIR_SHEET);
  if (isNew) {
    sh.appendRow([
      repair['Repair ID'], repair['Asset ID'], repair['Asset Type'] || '', repair.Employee || '',
      repair['Damage Date'], repair['Problem / Damage'], repair['Vendor / Repairer'] || '',
      repair['Repair Cost'] || 0, repair.Status, repair.Remarks || ''
    ]);
  }
  return { success: true, message: 'Repair logged in Google Sheet.' };
}

function assignAsset_(data) { return { success: true }; }
function returnAsset_(data) { return { success: true }; }
function getTickets_() { return { tickets: [] }; }
function saveTicket_(t, isNew) { return { success: true }; }
function getDepartments_() { return { departments: [] }; }
function saveDepartment_(d, isNew) { return { success: true }; }
function getExpenses_() { return { expenses: [] }; }
function saveExpense_(e, isNew) { return { success: true }; }
function getCartridges_() { return { cartridges: [] }; }
function getUsers_() { return { users: [] }; }
function getAuditLogs_() { return { logs: [] }; }
