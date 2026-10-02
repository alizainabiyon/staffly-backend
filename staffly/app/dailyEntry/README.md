# Daily Entry Module

## Overview

The Daily Entry Module is a central transaction hub designed to manage all financial activities on a daily basis. This module acts as the primary entry point for all financial transactions including receiving payments from orders, making payments to vendors, handling director bill payments, employee salary payments, and managing office till operations. All entries are created with draft status initially and are processed at the end of the day, providing a comprehensive audit trail and financial oversight.

## Features

### Core Features
- **Central Transaction Hub**: Single point of entry for all financial transactions
- **Daily Entry Management**: Record all financial activities with draft status
- **End-of-Day Processing**: Process all entries when day is complete
- **Multi-Source/Destination Support**: Handle transactions between till, directors, customers, vendors, employees
- **Day Summary Management**: Comprehensive daily financial summaries
- **Transaction Routing**: Automatically route transactions to appropriate destinations
- **Audit Trail**: Complete transaction history and tracking

### Transaction Types
- **Receipts**: Money received (order payments, refunds, etc.)
- **Payments**: Money paid out (vendor payments, salaries, bills, etc.)
- **Transfers**: Internal transfers between accounts
- **Adjustments**: Financial adjustments and corrections

### Source/Destination Types
- **Till**: Office cash till
- **Director**: Director accounts
- **Customer**: Customer payments
- **Vendor**: Vendor payments
- **Employee**: Employee salary payments
- **Bank**: Bank accounts
- **Cash**: Physical cash
- **Other**: Miscellaneous sources/destinations

## API Endpoints

### Daily Entry Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/app/v1/daily-entry/create` | Create a new daily entry |
| GET | `/api/app/v1/daily-entry/get-all-entries` | Get all entries with filtering |
| GET | `/api/app/v1/daily-entry/get-entry-by-id/:entryId` | Get entry by ID |
| PUT | `/api/app/v1/daily-entry/update/:entryId` | Update entry (draft only) |
| DELETE | `/api/app/v1/daily-entry/delete/:entryId` | Delete entry (draft only) |
| PUT | `/api/app/v1/daily-entry/process/:entryId` | Process an entry |

### Day Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/app/v1/daily-entry/close-day` | Close a day (end-of-day processing) |
| GET | `/api/app/v1/daily-entry/get-day-summary` | Get day summary |
| GET | `/api/app/v1/daily-entry/get-all-day-summaries` | Get all day summaries |

### Statistics and Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/app/v1/daily-entry/stats` | Get entry statistics |

## Data Models

### Daily Entry Schema

```javascript
{
  entryId: String,                        // Unique entry identifier
  contractorId: String,                   // Associated contractor
  entryNumber: String,                    // Auto-generated entry number
  entryDate: Date,                        // Date of entry
  entryType: String,                      // receipt, payment, transfer, adjustment
  title: String,                          // Entry title
  description: String,                    // Entry description
  amount: Number,                         // Transaction amount
  currency: String,                       // Currency code
  
  // Source Information (Where money comes from)
  sourceType: String,                     // till, director, customer, vendor, employee, bank, cash, other
  sourceId: String,                       // Source entity ID
  sourceName: String,                     // Source entity name
  sourceReference: String,                // Source reference
  
  // Destination Information (Where money goes to)
  destinationType: String,                // till, director, customer, vendor, employee, bank, cash, other
  destinationId: String,                  // Destination entity ID
  destinationName: String,                // Destination entity name
  destinationReference: String,           // Destination reference
  
  // Related Information
  relatedTo: String,                      // order, invoice, expense, salary, bill, loan, other
  relatedId: String,                      // Related entity ID
  relatedReference: String,               // Related reference
  
  // Payment Method
  paymentMethod: String,                  // cash, bank_transfer, card, check, till, director_account
  
  // Status and Processing
  status: String,                         // draft, pending, processed, failed, cancelled
  isProcessed: Boolean,                   // Is entry processed
  processedAt: Date,                      // Processing timestamp
  
  // Approval Information
  approvalStatus: String,                 // pending, approved, rejected
  approvedBy: String,                     // User who approved
  approvedAt: Date,                       // Approval timestamp
  approvalNotes: String,                  // Approval notes
  
  // Day Management
  dayId: String,                          // Associated day ID
  dayStatus: String,                      // open, closed, reconciled
  isDayClosed: Boolean,                   // Is day closed
  dayClosedAt: Date,                      // Day close timestamp
  dayClosedBy: String,                    // User who closed day
  
  // Balance Information
  sourceBalanceBefore: Number,            // Source balance before transaction
  sourceBalanceAfter: Number,             // Source balance after transaction
  destinationBalanceBefore: Number,       // Destination balance before transaction
  destinationBalanceAfter: Number,        // Destination balance after transaction
  
  // Receipt and Documentation
  receipt: String,                        // Receipt file path
  attachments: [String],                  // Array of attachment files
  
  // Tags and Classification
  tags: [String],                         // Tags for categorization
  category: String,                       // order_payment, vendor_payment, employee_salary, director_expense, bill_payment, loan_payment, refund, adjustment, other
  
  // Metadata
  createdBy: String,                      // User who created the entry
  updatedBy: String,                      // User who last updated the entry
  createdAt: Date,                        // Creation timestamp
  updatedAt: Date                         // Last update timestamp
}
```

### Day Summary Schema

```javascript
{
  dayId: String,                          // Unique day identifier
  contractorId: String,                   // Associated contractor
  date: Date,                             // Day date
  dayNumber: String,                      // Day number
  
  // Status Information
  status: String,                         // open, closed, reconciled
  isClosed: Boolean,                      // Is day closed
  closedAt: Date,                         // Close timestamp
  closedBy: String,                       // User who closed day
  
  // Entry Statistics
  totalEntries: Number,                   // Total number of entries
  draftEntries: Number,                   // Number of draft entries
  processedEntries: Number,               // Number of processed entries
  failedEntries: Number,                  // Number of failed entries
  
  // Financial Summary
  totalReceipts: Number,                  // Total receipts amount
  totalPayments: Number,                  // Total payments amount
  totalTransfers: Number,                 // Total transfers amount
  totalAdjustments: Number,               // Total adjustments amount
  netAmount: Number,                      // Net amount (receipts - payments)
  currency: String,                       // Currency code
  
  // Source/Destination Summary
  sourceSummary: {                        // Summary by source type
    till: Number,
    director: Number,
    customer: Number,
    vendor: Number,
    employee: Number,
    bank: Number,
    cash: Number,
    other: Number
  },
  destinationSummary: {                   // Summary by destination type
    till: Number,
    director: Number,
    customer: Number,
    vendor: Number,
    employee: Number,
    bank: Number,
    cash: Number,
    other: Number
  },
  
  // Category Summary
  categorySummary: {                      // Summary by category
    order_payment: Number,
    vendor_payment: Number,
    employee_salary: Number,
    director_expense: Number,
    bill_payment: Number,
    loan_payment: Number,
    refund: Number,
    adjustment: Number,
    other: Number
  },
  
  // Reconciliation Information
  isReconciled: Boolean,                  // Is day reconciled
  reconciledAt: Date,                     // Reconciliation timestamp
  reconciledBy: String,                   // User who reconciled
  reconciliationNotes: String,            // Reconciliation notes
  
  // Notes
  notes: String,                          // Additional notes
  
  // Metadata
  createdBy: String,                      // User who created the day
  updatedBy: String,                      // User who last updated the day
  createdAt: Date,                        // Creation timestamp
  updatedAt: Date                         // Last update timestamp
}
```

## Usage Examples

### Creating a Daily Entry (Receiving Order Payment)

```javascript
// POST /api/app/v1/daily-entry/create
{
  "contractorId": "cont-123456789",
  "entryDate": "2024-01-15",
  "entryType": "receipt",
  "title": "Order Payment Received",
  "description": "Payment received for order ORD-2024-001",
  "amount": 2500.00,
  "currency": "USD",
  "sourceType": "customer",
  "sourceId": "cust-123456789",
  "sourceName": "ABC Company",
  "sourceReference": "Customer Payment",
  "destinationType": "till",
  "destinationId": "till-123456789",
  "destinationName": "Main Office Till",
  "destinationReference": "Till Deposit",
  "relatedTo": "order",
  "relatedId": "ord-123456789",
  "relatedReference": "ORD-2024-001",
  "paymentMethod": "cash",
  "category": "order_payment",
  "tags": ["order-payment", "customer"]
}
```

### Creating a Daily Entry (Vendor Payment)

```javascript
// POST /api/app/v1/daily-entry/create
{
  "contractorId": "cont-123456789",
  "entryDate": "2024-01-15",
  "entryType": "payment",
  "title": "Vendor Payment - ABC Supplies",
  "description": "Payment for office supplies invoice INV-2024-001",
  "amount": 1500.00,
  "currency": "USD",
  "sourceType": "till",
  "sourceId": "till-123456789",
  "sourceName": "Main Office Till",
  "sourceReference": "Till Withdrawal",
  "destinationType": "vendor",
  "destinationId": "vend-123456789",
  "destinationName": "ABC Supplies Inc.",
  "destinationReference": "Vendor Payment",
  "relatedTo": "invoice",
  "relatedId": "inv-123456789",
  "relatedReference": "INV-2024-001",
  "paymentMethod": "till",
  "category": "vendor_payment",
  "tags": ["vendor-payment", "office-supplies"]
}
```

### Creating a Daily Entry (Director Bill Payment)

```javascript
// POST /api/app/v1/daily-entry/create
{
  "contractorId": "cont-123456789",
  "entryDate": "2024-01-15",
  "entryType": "payment",
  "title": "Director Bill Payment - John Smith",
  "description": "Payment for director's home internet bill",
  "amount": 89.99,
  "currency": "USD",
  "sourceType": "director",
  "sourceId": "dir-123456789",
  "sourceName": "John Smith",
  "sourceReference": "Director Account",
  "destinationType": "other",
  "destinationId": "bill-123456789",
  "destinationName": "Internet Provider",
  "destinationReference": "Internet Bill",
  "relatedTo": "bill",
  "relatedId": "bill-123456789",
  "relatedReference": "Internet Bill Jan 2024",
  "paymentMethod": "bank_transfer",
  "category": "director_expense",
  "tags": ["director-expense", "bill-payment"]
}
```

### Creating a Daily Entry (Employee Salary)

```javascript
// POST /api/app/v1/daily-entry/create
{
  "contractorId": "cont-123456789",
  "entryDate": "2024-01-15",
  "entryType": "payment",
  "title": "Employee Salary - Jane Doe",
  "description": "Monthly salary payment for January 2024",
  "amount": 3000.00,
  "currency": "USD",
  "sourceType": "bank",
  "sourceId": "bank-123456789",
  "sourceName": "Company Bank Account",
  "sourceReference": "Bank Transfer",
  "destinationType": "employee",
  "destinationId": "emp-123456789",
  "destinationName": "Jane Doe",
  "destinationReference": "Employee Account",
  "relatedTo": "salary",
  "relatedId": "sal-123456789",
  "relatedReference": "Salary Jan 2024",
  "paymentMethod": "bank_transfer",
  "category": "employee_salary",
  "tags": ["employee-salary", "monthly"]
}
```

### Closing a Day

```javascript
// POST /api/app/v1/daily-entry/close-day
{
  "dayId": "day-2024-01-15",
  "contractorId": "cont-123456789",
  "notes": "All entries processed and reconciled for January 15, 2024"
}
```

## Status Values

### Entry Status
- `draft`: Entry is in draft status (can be modified)
- `pending`: Entry is pending processing
- `processed`: Entry has been processed
- `failed`: Entry processing failed
- `cancelled`: Entry has been cancelled

### Entry Types
- `receipt`: Money received
- `payment`: Money paid out
- `transfer`: Internal transfer
- `adjustment`: Financial adjustment

### Source/Destination Types
- `till`: Office cash till
- `director`: Director accounts
- `customer`: Customer payments
- `vendor`: Vendor payments
- `employee`: Employee accounts
- `bank`: Bank accounts
- `cash`: Physical cash
- `other`: Miscellaneous

### Payment Methods
- `cash`: Cash payment
- `bank_transfer`: Bank transfer
- `card`: Credit/debit card
- `check`: Check payment
- `till`: Office till
- `director_account`: Director account

### Categories
- `order_payment`: Order-related payments
- `vendor_payment`: Vendor payments
- `employee_salary`: Employee salary payments
- `director_expense`: Director expense payments
- `bill_payment`: Bill payments
- `loan_payment`: Loan payments
- `refund`: Refunds
- `adjustment`: Financial adjustments
- `other`: Other transactions

### Day Status
- `open`: Day is open for entries
- `closed`: Day is closed
- `reconciled`: Day has been reconciled

### Approval Status
- `pending`: Waiting for approval
- `approved`: Has been approved
- `rejected`: Has been rejected

## Business Workflows

### Daily Entry Workflow
1. **Create Entry**: User creates a daily entry with draft status
2. **Review Entry**: Entry can be reviewed and modified while in draft
3. **Process Entry**: Entry is processed (updates balances, creates ledger entries)
4. **Day Closure**: All entries are processed at end of day
5. **Reconciliation**: Day is reconciled for accuracy

### End-of-Day Processing
1. **Review Draft Entries**: Check all draft entries for accuracy
2. **Process Entries**: Process all draft entries
3. **Close Day**: Close the day when all entries are processed
4. **Generate Reports**: Create daily summary reports
5. **Reconcile**: Reconcile with physical cash and bank statements

### Transaction Routing
1. **Entry Creation**: Entry is created with source and destination
2. **Validation**: System validates source and destination entities
3. **Balance Check**: Check if sufficient balance exists
4. **Processing**: Update balances and create related records
5. **Confirmation**: Confirm transaction completion

## Error Handling

The module follows the standard error handling patterns:

- **400 Bad Request**: Invalid input data or validation errors
- **404 Not Found**: Entry or day summary not found
- **500 Internal Server Error**: Server-side errors

All errors include descriptive messages and appropriate HTTP status codes.

## Security Considerations

- All endpoints require authentication
- Entry data is scoped to the authenticated user
- Input validation is performed on all endpoints
- Only draft entries can be modified or deleted
- Day closure requires proper authorization
- Sensitive financial information is protected

## Dependencies

- **MongoDB/Mongoose**: Database operations
- **Joi**: Input validation
- **Express.js**: HTTP routing
- **UUID**: Unique identifier generation

## Integration

The Daily Entry Module integrates with:
- **Contractor Module**: Entries are associated with contractors
- **Director Module**: Director transactions and balance updates
- **Vendor Module**: Vendor payment processing
- **Employee Module**: Employee salary processing
- **Customer Module**: Customer payment processing
- **Finance Module**: Ledger entry creation and balance updates
- **File Handler Module**: Receipt and document management

## Future Enhancements

- Integration with accounting software
- Automated entry categorization using AI
- Real-time balance updates
- Advanced financial analytics dashboard
- Integration with banking APIs
- Multi-currency support
- Automated reconciliation
- Mobile app for entry creation
- Real-time notifications
- Advanced reporting and analytics 