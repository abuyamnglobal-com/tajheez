# TAJHEEZ – Front-End Prototype & Implementation Blueprint  
### **Final Version — Mandatory Requirements for Developer**

This document includes all requirements agreed with the front-end developer regarding the implementation of the TAJHEEZ Finance App UI using **Next.js**, **TailwindCSS**, modern icons, and clean UI practices.  
It also includes a mandatory instruction to **clear the existing front-end folder before starting**.

---

# 🚨 **0. Mandatory Instructions Before Starting**

Before beginning development:

```
You MUST delete any existing code inside the front-end folder
(frontend, web-app, client, or any UI directory)
to avoid conflicts with outdated files.
Start with a clean folder.
```

No exceptions — this ensures a clean, consistent, and maintainable project setup.

---

# ✔ 1. Required Front-End Stack

### **Mandatory Technologies**
- **Next.js 14+ (App Router preferred)**
- **TailwindCSS** for styling the entire UI
- **React Query or SWR** for data fetching and caching
- **TypeScript** (recommended for maintainability)
- **Axios or Fetch wrapper** in a centralized API layer
- **Responsive design (mobile-first)**

Developer must confirm:
```
Yes, I will implement the UI using Next.js + TailwindCSS.
```

---

# ✔ 2. Branding Guidelines (TAJHEEZ Identity)

### **Primary TAJHEEZ Colors**
- **Dark Navy (#0A1A2F approx.)** – Primary UI, typography, cards  
- **Orange (#F26A1A approx.)** – Buttons, highlights  
- **Green** – Approved status  
- **Red** – Rejected status  
- **Gray/White** – Backgrounds  

### **Logo Usage**
Developer must confirm:
```
Yes, I will use the provided TAJHEEZ logo consistently across the UI.
```

---

# ✔ 3. Icons Requirement (Mandatory)

Developer must use **modern, clean, consistent icons** throughout the entire UI.

### **Approved Icon Libraries**
- **Heroicons** (recommended)
- **Lucide Icons**
- **React-Icons** (fallback)

### Icons MUST be used in:
- Dashboard cards  
- Buttons (Add Transaction, Approvals, Weekly Summary)  
- Status indicators  
- Approve & Reject actions  
- Navigation and sidebar elements  
- Attachments, filters, and date pickers  

Developer must confirm:
```
Yes, I will use consistent icons (Heroicons/Lucide) across the UI.
```

---

# ✔ 4. Required Pages (Full Prototype Deliverables)

The developer must prepare a **full prototype** (Figma OR static Next.js pages) before wiring any API.

---

## **4.1 Authentication Page**
- Login (email + password)
- Error messages  
- Loading state  

---

## **4.2 Dashboard UI**
Must include:
- Total In  
- Total Out  
- Net Cash Position  
- Pending Approvals  
- Buttons:
  - Add Transaction  
  - Approvals  
  - Weekly Summary  
- Recent Activity list  
- Status tags (Submitted/Approved/Rejected)

---

## **4.3 Transactions List**
- Search bar  
- Filters (date, category, status)  
- Transaction cards/rows  
- Colored status labels  
- Pagination or infinite scroll  

---

## **4.4 Add Transaction Page**
Fields:
- Company  
- From Party  
- To Party  
- Category  
- Amount  
- Payment Method  
- Date  
- Description  
- Attachment upload  

Validations:
- From Party ≠ To Party  
- Amount > 0  
- Auto-approve if below threshold  

---

## **4.5 Approvals Page**
- List all pending transactions  
- View full details  
- Approve or Reject (reject requires comment)  

---

## **4.6 Reports**
### Weekly Summary
- Date range filter  
- Cards/charts: Inflow / Outflow / Net  
- Detailed list  

### Party Statement
- Select party  
- Show complete financial history  

---

## **4.7 Profile / Settings**
- Display name & role  
- Logout option  

---

# ✔ 5. Backend Integration Requirements

### Base URL
(Provided separately in env variables)

### Authentication
- Identity Token  
- Secure storage only  

### API Structure (Required)
```
/lib/api/
  http.ts
  auth.ts
  transactions.ts
  approvals.ts
  reports.ts
  parties.ts
```

### Error Handling
- Toast system  
- Retry on network failure  
- Input validations  

---

# ✔ 6. Prototype Deliverables (Before Real Coding)

Developer must deliver:

### **1. Complete UI Prototype**
- All screens  
- All components  
- Full layout  
- Navigation flow  

### **2. Component Library**
- Buttons  
- Badges  
- Cards  
- Modals  
- Input fields  
- Tables or list rows  

### **3. Navigation Map**
- Dashboard → Transactions → Add → Approvals → Reports → Profile  

---

# ✔ 7. MVP Completion Checklist

| Module | Required |
|--------|----------|
| Login | UI complete |
| Dashboard | Cards + activity |
| Transactions List | All filters + display |
| Add Transaction | Full form + validation |
| Approvals | Approve/Reject |
| Reports | Weekly + Statement |
| Profile | Basic info |
| Branding | Tailwind + TAJHEEZ theme |
| Icons | Heroicons/Lucide |
| Responsive | Mobile-first |

---

# ✔ 8. Developer Confirmation Required

Developer must answer:

1. Will you use Next.js?  
2. Will you use TailwindCSS?  
3. Will you use Heroicons/Lucide icons?  
4. Will you apply TAJHEEZ branding & logo?  
5. Will you deliver a full prototype before backend integration?  
6. Estimated delivery date of prototype?  
7. Confirm deletion of old front-end folder before starting?

---

# End of Document  
Prepared for **TAJHEEZ Front-End Developer**

