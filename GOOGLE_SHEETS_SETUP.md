# Google Sheets + Google Apps Script Backend Setup

Follow this step-by-step guide to connect your live Google Sheet database to your React Application for **100% free lifetime cloud persistence**.

---

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.google.com) and create a **Blank Spreadsheet**.
2. Name it **`IT Asset Management DB`**.

---

### Step 2: Open Google Apps Script Editor
1. In your Google Sheet top menu, click **Extensions** ➔ **Apps Script**.
2. Delete any existing code inside `Code.gs`.
3. Copy all code from the file [`google-apps-script/Code.gs`](file:///C:/Users/shikh/Desktop/IT%20ASSET%20MANAGEMENT/google-apps-script/Code.gs) in this repository and paste it into `Code.gs`.
4. Click the **Save (💾)** icon.

---

### Step 3: Run Initial Setup (Creates All Sheets Automatically)
1. At the top toolbar of Apps Script, select the function dropdown and choose **`setupSystem`**.
2. Click **Run**.
3. Google will ask for permissions. Click **Review Permissions** ➔ Select your Google Account ➔ **Advanced** ➔ **Go to IT Asset Management (unsafe)** ➔ Click **Allow**.
4. Go back to your Google Sheet! You will see all 9 tabs automatically created with formatted headers:
   - `Users`
   - `Asset Register`
   - `Repair & Damage`
   - `Assignment History`
   - `IT Tickets`
   - `Departments`
   - `IT Expenses`
   - `Printer & Cartridge`
   - `Audit Log`

---

### Step 4: Deploy as a Web App API
1. In the top right of the Apps Script editor, click **Deploy** ➔ **New deployment**.
2. Click the gear icon (**Select type**) ➔ Choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `IT Asset Management API v1`
   - **Execute as**: `Me (your@gmail.com)`
   - **Who has access**: **`Anyone`** *(Crucial step so your React app can connect!)*
4. Click **Deploy**.
5. Copy the generated **Web App URL** (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Step 5: Connect Web App URL to your React App
Open [`src/api.ts`](file:///C:/Users/shikh/Desktop/IT%20ASSET%20MANAGEMENT/src/api.ts) in your workspace and paste your Web App URL into the `GAS_WEB_APP_URL` variable at the top:

```typescript
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec";
```

Now, every action you take in your React app (adding assets, changing statuses, logging repairs) will directly save to your Google Sheet in real-time!
