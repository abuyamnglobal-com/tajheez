# TAJHEEZ – Combined Front-End Developer Specification Document

## **Front-End Design & Development Brief**

**Project:** Partnership Finance App (Abu Yamen Global & Yamen Trading)  
**Frontend Platforms:**  
- Web App → Next.js (preferred)  
- Mobile App → React Native  
**Backend:** Google Cloud Run (REST API)

---

# 1. Project Overview
TAJHEEZ is developing a modern and user-friendly finance tracking solution. The front-end developer will be fully responsible for UI/UX, design implementation, web and mobile development, backend integration, and all future enhancements.

---

# 2. Branding & Design Guidelines
### Primary Colors:
- **Dark Navy** – primary UI elements, text  
- **Orange** – highlights and accents  

### Design Expectations:
- Clean, modern, minimalistic  
- Consistent across Web & Mobile  
- Touch-friendly and mobile-first  

---

# 3. Technical Requirements

## Web Frontend (Next.js)
- Next.js 14+ (preferred)  
- TailwindCSS or similar  
- React Query / SWR for API  
- Deployment: Vercel or equivalent  

## Mobile Frontend (React Native)
- React Native  
- Expo recommended  
- Android (primary), iOS (later)  

## Backend Integration
- Google Cloud Run REST API  
- Secure Identity Token Auth  
- Centralized API service  
- Error handling and retry logic  

---

# 4. Core Functional Screens

### Authentication
- Email + Password  
- Validation and loading states  

### Dashboard
- Summary cards (In / Out / Net)  
- Quick access buttons: Add Transaction, Approvals, Summary  

### Transactions List
- Filters: date, category, status  
- Status colors:  
  - Approved: Green  
  - Submitted: Orange  
  - Rejected: Red  
  - Draft: Grey  

### Add / Edit Transaction
Fields:
- Company, Parties, Category, Amount, Payment Method, Date, Description, Attachment  

### Approvals Module
- Pending items  
- Approve or Reject (requires reason)  

### Reports
- Weekly Report  
- Party Statement  
- Filters by date range  

### Profile
- Basic user info  
- Role  
- Logout  

---

# 5. Developer Responsibilities
- Full UI/UX design in Figma  
- Web + Mobile development  
- API integration  
- Testing and quality checks  
- Future enhancements & support  

---

# 6. Deliverables
- Figma design  
- Web & Mobile codebases  
- API integration layer  
- Deployment instructions  
- Documentation  

---

# 7. Workflow
- Weekly updates  
- Milestone demos  
- Continuous pushes to GitHub  

---

# **Functional Specification Document (FSD)**

## Purpose & Scope
Build a financial operations management system between companies and investors.  
Includes:  
- Mobile/web input  
- Party management  
- Weekly/monthly reporting  
- Roles and permissions  
- Attachments archiving  

---

# 1. Glossary
- **Party:** Company/Investor/Vendor  
- **Company:** Abu Yamen Global / Yamen Trading  
- **Investor:** Raed / Ghaznafar  
- **Transaction Types:** Expense / Loan / Loan Return / Transfer  
- **Attachment:** Invoice or photo  
- **Roles:** Partner, Accountant, Approver, Viewer  

---

# 2. Assumptions
- Each transaction contains: date, amount, from→to, category, description, payment method  
- Reports based solely on transaction records  
- Mobile entry supports attachments  

---

# 3. Users & Roles
- **Partner:** Full control, approvals, reports  
- **Accountant:** Input transactions  
- **Approver:** Approvals above threshold  
- **Viewer:** Reporting only  

---

# 4. User Stories
- Register expenses  
- Log loans and returns  
- Weekly net reporting  
- Approvals workflow  
- View dashboards and statements  
- Daily sales entry  

---

# 5. Key Flows

## Create Transaction
1. Select parties  
2. Select category  
3. Enter details  
4. Upload attachment  
5. Auto-approve if below threshold  

## Approve Transaction
1. View pending  
2. Review  
3. Approve or Reject  

## Weekly Report
- View inflow/outflow/net  
- Select date range  

---

# 6. Business Rules
- Valid categories: Expense, Loan, Loan Return, Transfer  
- From Party ≠ To Party  
- Amount > 0  
- Above threshold = must approve  
- Loan Return must reverse original  
- Attachment optional  

---

# 7. Data Model (Logical)

### Entities:
- **Party:** id, name, type  
- **Transaction:** id, date, from_party_id, to_party_id, category, amount, payment_method, status  
- **Attachment:** id, transaction_id, file_url  
- **User:** id, full_name, email, role  

---

# 8. Validation Rules
- Date ≤ today  
- Amount > 0  
- Attachments ≤ 5 MB (image/pdf)  
- Reject must include comment  

---

# 9. Transaction States
- DRAFT  
- SUBMITTED  
- APPROVED  
- REJECTED  

Includes audit log.

---

# 10. Reports
- Weekly Summary  
- Party Statement  
- Inter-Party Matrix  
- Category Spend  
- Loan Analysis  
- Daily Sales  
- Cashflow Forecast  

---

# 11. Analytics & KPIs
- Net position  
- Expense ratios  
- Profitability snapshot  
- Cash burn  
- Outstanding loans  

---

# 12. Security & Permissions
- Email/Password login  
- RBAC (Role Based Access Control)  
- Secure storage for attachments  

---

# 13. Performance Requirements
- API response < 1s  
- Upload < 3s  

---

# 14. Integrations (Phase 2)
- Cloud Storage  
- Email / WhatsApp notifications  

---

# 15. Mobile-First UX Summary
- Quick-add screen (5 fields + attachment)  
- Clean list view  
- Simple filters  

---

# 16. UAT Acceptance Criteria
- Auto-approve under threshold  
- Submit for approval above threshold  
- Accurate weekly report outputs  
- Enforce validation  

---

# 17. Risks
- Missing attachments reduce credibility  
- Full loan matching needed in Phase 2  

---

# 18. MVP Plan
- Parties, Users, Transactions, Attachments  
- Simple approvals  
- Weekly & statement reports  

---

# 19. Roadmap (8 Weeks)

**Week 1:** Database  
**Weeks 2–3:** Backend API  
**Weeks 4–5:** Web UI  
**Week 6:** Mobile App  
**Week 7:** KPIs & security  
**Week 8:** Testing & Go-Live  

---

**End of Document**