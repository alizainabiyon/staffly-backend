# Director Module

## Overview

The Director Module is a comprehensive business management system designed to handle the financial activities and operations of business directors. This module manages 3-4 directors who run the business, tracks their expenses (home bills, grocery, etc.), manages their payment capabilities, and maintains an office till for cash management. The module provides complete financial oversight and control mechanisms for director-related business operations.

## Features

### Core Features
- **Director Management**: Complete CRUD operations for business directors
- **Expense Tracking**: Comprehensive expense management for directors (home bills, grocery, etc.)
- **Payment Management**: Directors can make payments to vendors, employees, or others
- **Office Till Management**: Cash management system for office operations
- **Approval Workflows**: Multi-level approval system for expenses and payments
- **Financial Reporting**: Comprehensive financial analytics and reporting
- **Access Control**: Role-based permissions and payment limits

### Director-Specific Features
- **Share Management**: Track director share percentages and ownership
- **Credit Limits**: Set and manage payment limits for each director
- **Banking Integration**: Store and manage director banking information
- **Document Management**: Store director-related documents and contracts
- **Status Management**: Active, inactive, suspended, resigned status tracking

### Financial Management Features
- **Expense Categories**: Home bills, grocery, transportation, entertainment, business travel, etc.
- **Payment Methods**: Cash, bank transfer, card, check, till
- **Approval System**: Pending, approved, rejected status management
- **Receipt Management**: Digital receipt storage and management
- **Transaction History**: Complete audit trail for all financial activities

## API Endpoints

### Director Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/app/v1/director/create` | Create a new director |
| GET | `/api/app/v1/director/get-all-directors` | Get all directors with filtering |
| GET | `/api/app/v1/director/get-director-by-id/:directorId` | Get director by ID |
| PUT | `/api/app/v1/director/update/:directorId` | Update director information |
| PUT | `/api/app/v1/director/update-status/:directorId` | Update director status |
| DELETE | `/api/app/v1/director/delete/:directorId` | Delete director |
| GET | `/api/app/v1/director/stats` | Get director statistics |

### Director Expense Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/app/v1/director/create-expense` | Create a new expense |
| GET | `/api/app/v1/director/get-all-expenses` | Get all expenses with filtering |
| PUT | `/api/app/v1/director/approve-expense/:expenseId` | Approve/reject expense |

### Director Payment Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/app/v1/director/create-payment` | Create a new payment |
| GET | `/api/app/v1/director/get-all-payments` | Get all payments with filtering |
| PUT | `/api/app/v1/director/approve-payment/:paymentId` | Approve/reject payment |

### Office Till Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/app/v1/director/create-till` | Create a new office till |
| GET | `/api/app/v1/director/get-all-tills` | Get all tills with filtering |
| PUT | `/api/app/v1/director/update-till-balance/:tillId` | Update till balance |

### Till Transaction Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/app/v1/director/create-transaction` | Create a new till transaction |
| GET | `/api/app/v1/director/get-till-transactions` | Get all till transactions |

## Data Models

### Director Schema

```javascript
{
  directorId: String,                    // Unique director identifier
  contractorId: String,                  // Associated contractor
  name: String,                          // Director name
  email: String,                         // Primary email
  phone: String,                         // Primary phone
  alternatePhone: String,                // Alternate phone
  address: {                             // Address object
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  position: String,                      // ceo, managing_director, director, executive_director, board_member
  sharePercentage: Number,               // Ownership percentage (0-100)
  joiningDate: Date,                     // Date of joining
  salary: Number,                        // Director salary
  currentBalance: Number,                // Current available balance
  creditLimit: Number,                   // Credit limit amount
  currency: String,                      // Currency code
  bankDetails: {                         // Banking information
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    branchName: String
  },
  status: String,                        // active, inactive, suspended, resigned
  canApproveExpenses: Boolean,           // Can approve expenses
  canMakePayments: Boolean,              // Can make payments
  canAccessTill: Boolean,                // Can access office till
  maxPaymentLimit: Number,               // Maximum payment limit
  preferredContactMethod: String,        // email, phone, sms, whatsapp
  notes: String,                         // Additional notes
  documents: [{                          // Array of documents
    name: String,
    file: String,
    type: String,                        // id_proof, contract, bank_statement, tax_document, other
    uploadedAt: Date
  }],
  createdBy: String,                     // User who created the director
  updatedBy: String,                     // User who last updated the director
  createdAt: Date,                       // Creation timestamp
  updatedAt: Date                        // Last update timestamp
}
```

### Director Expense Schema

```javascript
{
  expenseId: String,                     // Unique expense identifier
  directorId: String,                    // Associated director
  contractorId: String,                  // Associated contractor
  title: String,                         // Expense title
  description: String,                   // Expense description
  amount: Number,                        // Expense amount
  currency: String,                      // Currency code
  category: String,                      // home_bills, grocery, transportation, entertainment, business_travel, office_supplies, utilities, maintenance, insurance, healthcare, education, other
  subCategory: String,                   // Sub-category
  paymentMethod: String,                 // cash, bank_transfer, card, check, till
  paymentStatus: String,                 // pending, paid, rejected, cancelled
  approvalStatus: String,                // pending, approved, rejected
  approvedBy: String,                    // User who approved
  approvedAt: Date,                      // Approval timestamp
  approvalNotes: String,                 // Approval notes
  expenseDate: Date,                     // Date of expense
  dueDate: Date,                         // Due date
  receipt: String,                       // Receipt file path
  attachments: [String],                 // Array of attachment files
  tags: [String],                        // Tags for categorization
  createdBy: String,                     // User who created the expense
  updatedBy: String,                     // User who last updated the expense
  createdAt: Date,                       // Creation timestamp
  updatedAt: Date                        // Last update timestamp
}
```

### Director Payment Schema

```javascript
{
  paymentId: String,                     // Unique payment identifier
  directorId: String,                    // Associated director
  contractorId: String,                  // Associated contractor
  title: String,                         // Payment title
  description: String,                   // Payment description
  amount: Number,                        // Payment amount
  currency: String,                      // Currency code
  recipientType: String,                 // vendor, employee, customer, contractor, other
  recipientId: String,                   // Recipient identifier
  recipientName: String,                 // Recipient name
  paymentMethod: String,                 // cash, bank_transfer, card, check, till
  paymentStatus: String,                 // pending, completed, failed, cancelled
  approvalStatus: String,                // pending, approved, rejected
  approvedBy: String,                    // User who approved
  approvedAt: Date,                      // Approval timestamp
  approvalNotes: String,                 // Approval notes
  paymentDate: Date,                     // Date of payment
  processedAt: Date,                     // Processing timestamp
  referenceNumber: String,               // Reference number
  invoiceId: String,                     // Associated invoice ID
  receipt: String,                       // Receipt file path
  attachments: [String],                 // Array of attachment files
  tags: [String],                        // Tags for categorization
  createdBy: String,                     // User who created the payment
  updatedBy: String,                     // User who last updated the payment
  createdAt: Date,                       // Creation timestamp
  updatedAt: Date                        // Last update timestamp
}
```

### Office Till Schema

```javascript
{
  tillId: String,                        // Unique till identifier
  contractorId: String,                  // Associated contractor
  name: String,                          // Till name
  location: String,                      // Till location
  currentBalance: Number,                // Current balance
  openingBalance: Number,                // Opening balance
  currency: String,                      // Currency code
  status: String,                        // active, inactive, closed
  isDefault: Boolean,                    // Is default till
  authorizedUsers: [String],             // Array of authorized user IDs
  maxTransactionLimit: Number,           // Maximum transaction limit
  notes: String,                         // Additional notes
  createdBy: String,                     // User who created the till
  updatedBy: String,                     // User who last updated the till
  createdAt: Date,                       // Creation timestamp
  updatedAt: Date                        // Last update timestamp
}
```

### Till Transaction Schema

```javascript
{
  transactionId: String,                 // Unique transaction identifier
  tillId: String,                        // Associated till
  contractorId: String,                  // Associated contractor
  type: String,                          // deposit, withdrawal, payment, receipt
  amount: Number,                        // Transaction amount
  currency: String,                      // Currency code
  title: String,                         // Transaction title
  description: String,                   // Transaction description
  relatedTo: String,                     // director, vendor, employee, customer, expense, payment, other
  relatedId: String,                     // Related entity ID
  relatedName: String,                   // Related entity name
  balanceBefore: Number,                 // Balance before transaction
  balanceAfter: Number,                  // Balance after transaction
  transactionDate: Date,                 // Transaction date
  referenceNumber: String,               // Reference number
  receipt: String,                       // Receipt file path
  attachments: [String],                 // Array of attachment files
  createdBy: String,                     // User who created the transaction
  updatedBy: String,                     // User who last updated the transaction
  createdAt: Date,                       // Creation timestamp
  updatedAt: Date                        // Last update timestamp
}
```

## Usage Examples

### Creating a Director

```javascript
// POST /api/app/v1/director/create
{
  "contractorId": "cont-123456789",
  "name": "John Smith",
  "email": "john.smith@company.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Business Ave",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10001"
  },
  "position": "managing_director",
  "sharePercentage": 25,
  "salary": 100000,
  "creditLimit": 50000,
  "currency": "USD",
  "bankDetails": {
    "bankName": "Chase Bank",
    "accountNumber": "1234567890",
    "ifscCode": "CHASUS33",
    "branchName": "Manhattan Branch"
  },
  "maxPaymentLimit": 10000,
  "canApproveExpenses": true,
  "canMakePayments": true,
  "canAccessTill": true
}
```

### Creating an Expense

```javascript
// POST /api/app/v1/director/create-expense
{
  "directorId": "dir-123456789",
  "contractorId": "cont-123456789",
  "title": "Home Internet Bill",
  "description": "Monthly internet bill for home office",
  "amount": 89.99,
  "currency": "USD",
  "category": "home_bills",
  "subCategory": "internet",
  "paymentMethod": "bank_transfer",
  "expenseDate": "2024-01-15",
  "dueDate": "2024-01-20",
  "tags": ["monthly", "home-office"]
}
```

### Creating a Payment

```javascript
// POST /api/app/v1/director/create-payment
{
  "directorId": "dir-123456789",
  "contractorId": "cont-123456789",
  "title": "Vendor Payment - ABC Supplies",
  "description": "Payment for office supplies",
  "amount": 1500.00,
  "currency": "USD",
  "recipientType": "vendor",
  "recipientId": "vend-123456789",
  "recipientName": "ABC Supplies Inc.",
  "paymentMethod": "till",
  "paymentDate": "2024-01-15",
  "referenceNumber": "PAY-2024-001",
  "tags": ["office-supplies", "vendor-payment"]
}
```

### Creating an Office Till

```javascript
// POST /api/app/v1/director/create-till
{
  "contractorId": "cont-123456789",
  "name": "Main Office Till",
  "location": "Reception Area",
  "openingBalance": 5000.00,
  "currency": "USD",
  "status": "active",
  "isDefault": true,
  "authorizedUsers": ["user1", "user2"],
  "maxTransactionLimit": 2000.00,
  "notes": "Main cash till for office operations"
}
```

### Creating a Till Transaction

```javascript
// POST /api/app/v1/director/create-transaction
{
  "tillId": "till-123456789",
  "contractorId": "cont-123456789",
  "type": "withdrawal",
  "amount": 500.00,
  "currency": "USD",
  "title": "Cash Withdrawal for Office Supplies",
  "description": "Withdrawal for purchasing office supplies",
  "relatedTo": "expense",
  "relatedId": "exp-123456789",
  "relatedName": "Office Supplies Purchase",
  "transactionDate": "2024-01-15",
  "referenceNumber": "TXN-2024-001"
}
```

## Status Values

### Director Status
- `active`: Director is currently active and can perform operations
- `inactive`: Director is temporarily inactive
- `suspended`: Director is suspended due to issues
- `resigned`: Director has resigned from the company

### Director Positions
- `ceo`: Chief Executive Officer
- `managing_director`: Managing Director
- `director`: Director
- `executive_director`: Executive Director
- `board_member`: Board Member

### Expense Categories
- `home_bills`: Home utility bills
- `grocery`: Grocery and food expenses
- `transportation`: Transportation and travel expenses
- `entertainment`: Entertainment and leisure expenses
- `business_travel`: Business travel expenses
- `office_supplies`: Office supplies and equipment
- `utilities`: Utility bills
- `maintenance`: Maintenance and repair expenses
- `insurance`: Insurance payments
- `healthcare`: Healthcare and medical expenses
- `education`: Education and training expenses
- `other`: Other miscellaneous expenses

### Payment Methods
- `cash`: Cash payment
- `bank_transfer`: Bank transfer
- `card`: Credit/debit card payment
- `check`: Check payment
- `till`: Office till payment

### Payment Status
- `pending`: Payment is pending
- `completed`: Payment has been completed
- `failed`: Payment has failed
- `cancelled`: Payment has been cancelled

### Approval Status
- `pending`: Waiting for approval
- `approved`: Has been approved
- `rejected`: Has been rejected

### Till Status
- `active`: Till is active and operational
- `inactive`: Till is temporarily inactive
- `closed`: Till has been closed

### Transaction Types
- `deposit`: Money deposited into till
- `withdrawal`: Money withdrawn from till
- `payment`: Payment made from till
- `receipt`: Money received into till

## Error Handling

The module follows the standard error handling patterns:

- **400 Bad Request**: Invalid input data or validation errors
- **404 Not Found**: Director, expense, payment, or till not found
- **500 Internal Server Error**: Server-side errors

All errors include descriptive messages and appropriate HTTP status codes.

## Security Considerations

- All endpoints require authentication
- Director data is scoped to the authenticated user
- Input validation is performed on all endpoints
- Payment limits are enforced based on director permissions
- Till access is controlled through authorized users list
- Sensitive financial information is protected

## Dependencies

- **MongoDB/Mongoose**: Database operations
- **Joi**: Input validation
- **Express.js**: HTTP routing
- **UUID**: Unique identifier generation

## Integration

The Director Module integrates with:
- **Contractor Module**: Directors are associated with contractors
- **Vendor Module**: Directors can make payments to vendors
- **Employee Module**: Directors can make payments to employees
- **Customer Module**: Directors can make payments to customers
- **Finance Module**: Can be extended to integrate with invoices and financial reports
- **File Handler Module**: For document uploads and receipt management

## Business Workflows

### Expense Approval Workflow
1. Director creates expense request
2. System validates director permissions and limits
3. Expense goes to approval queue
4. Authorized director approves/rejects expense
5. If approved, expense is marked as paid
6. Receipt and documentation are stored

### Payment Approval Workflow
1. Director creates payment request
2. System validates payment limits and recipient
3. Payment goes to approval queue
4. Authorized director approves/rejects payment
5. If approved, payment is processed
6. Till balance is updated accordingly

### Till Management Workflow
1. Till is created with opening balance
2. Authorized users are assigned
3. Transactions are recorded with balance tracking
4. Regular reconciliation is performed
5. Reports are generated for financial oversight

## Future Enhancements

- Integration with accounting software
- Automated expense categorization using AI
- Mobile app for expense submission
- Real-time notifications for approvals
- Advanced financial analytics dashboard
- Integration with banking APIs
- Multi-currency support
- Automated reconciliation
- Expense policy enforcement
- Budget tracking and alerts 