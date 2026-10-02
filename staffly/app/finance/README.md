# Finance Module

The Finance Module provides comprehensive financial management capabilities including quotation management, invoice processing, and ledger tracking.

## Overview

This module handles the complete financial workflow from creating quotations for customers to generating invoices and maintaining detailed ledger entries for financial tracking.

## Features

### 1. Quotation Management
- Create and manage quotations for customers
- Send quotations to customers
- Track quotation status (draft, sent, accepted, rejected, expired, converted)
- Convert accepted quotations to invoices
- Search and filter quotations
- Generate quotation statistics

### 2. Invoice Management
- Create invoices directly or from quotations
- Send invoices to customers via multiple channels
- Track invoice status (draft, sent, paid, overdue, cancelled, partially_paid)
- Automatic ledger entry creation for invoices
- Search and filter invoices
- Generate invoice statistics

### 3. Ledger Management
- Create ledger entries for all financial transactions
- Track customer balances
- Support multiple entry types (debit, credit, payment, refund, adjustment)
- Generate financial reports
- Search and filter ledger entries
- Calculate running balances

## API Endpoints

### Quotation Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/app/v1/finance/quotation/create` | Create a new quotation |
| GET | `/api/app/v1/finance/quotation/get-all-quotations` | Get all quotations with filters |
| GET | `/api/app/v1/finance/quotation/get-quotation-by-id` | Get quotation by ID |
| GET | `/api/app/v1/finance/quotation/get-quotations-by-customer` | Get quotations for a specific customer |
| PUT | `/api/app/v1/finance/quotation/update` | Update quotation details |
| PUT | `/api/app/v1/finance/quotation/update-status` | Update quotation status |
| DELETE | `/api/app/v1/finance/quotation/delete` | Delete a quotation |
| GET | `/api/app/v1/finance/quotation/search` | Search quotations |
| GET | `/api/app/v1/finance/quotation/stats` | Get quotation statistics |
| POST | `/api/app/v1/finance/quotation/convert-to-invoice` | Convert quotation to invoice |

### Invoice Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/app/v1/finance/invoice/create` | Create a new invoice |
| GET | `/api/app/v1/finance/invoice/get-all-invoices` | Get all invoices with filters |
| GET | `/api/app/v1/finance/invoice/get-invoice-by-id` | Get invoice by ID |
| GET | `/api/app/v1/finance/invoice/get-invoices-by-customer` | Get invoices for a specific customer |
| PUT | `/api/app/v1/finance/invoice/update` | Update invoice details |
| PUT | `/api/app/v1/finance/invoice/update-status` | Update invoice status |
| DELETE | `/api/app/v1/finance/invoice/delete` | Delete an invoice |
| GET | `/api/app/v1/finance/invoice/search` | Search invoices |
| GET | `/api/app/v1/finance/invoice/stats` | Get invoice statistics |
| POST | `/api/app/v1/finance/invoice/create-ledger-entry` | Create ledger entry for invoice |
| POST | `/api/app/v1/finance/invoice/send` | Send invoice to customer |

### Ledger Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/app/v1/finance/ledger/create` | Create a new ledger entry |
| GET | `/api/app/v1/finance/ledger/get-all-entries` | Get all ledger entries with filters |
| GET | `/api/app/v1/finance/ledger/get-entry-by-id` | Get ledger entry by ID |
| GET | `/api/app/v1/finance/ledger/get-entries-by-customer` | Get ledger entries for a specific customer |
| PUT | `/api/app/v1/finance/ledger/update` | Update ledger entry details |
| PUT | `/api/app/v1/finance/ledger/update-status` | Update ledger entry status |
| DELETE | `/api/app/v1/finance/ledger/delete` | Delete a ledger entry |
| GET | `/api/app/v1/finance/ledger/search` | Search ledger entries |
| GET | `/api/app/v1/finance/ledger/stats` | Get ledger statistics |
| GET | `/api/app/v1/finance/ledger/customer-balance` | Get customer balance |
| GET | `/api/app/v1/finance/ledger/financial-report` | Generate financial report |

## Data Models

### Quotation Schema
```javascript
{
  quotationId: String,
  userID: String,
  contractorId: String,
  customerId: String,
  quotationNumber: String,
  subject: String,
  description: String,
  items: Array,
  subtotal: Number,
  taxAmount: Number,
  discountAmount: Number,
  totalAmount: Number,
  currency: String,
  validUntil: Date,
  terms: String,
  notes: String,
  status: String,
  attachments: Array,
  sentAt: Date,
  acceptedAt: Date,
  rejectedAt: Date,
  convertedToInvoice: Boolean,
  invoiceId: String,
  createdBy: String,
  updatedBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Invoice Schema
```javascript
{
  invoiceId: String,
  userID: String,
  contractorId: String,
  customerId: String,
  quotationId: String,
  invoiceNumber: String,
  subject: String,
  description: String,
  items: Array,
  subtotal: Number,
  taxAmount: Number,
  discountAmount: Number,
  totalAmount: Number,
  currency: String,
  dueDate: Date,
  paymentTerms: String,
  terms: String,
  notes: String,
  status: String,
  attachments: Array,
  sentAt: Date,
  paidAt: Date,
  paidAmount: Number,
  remainingAmount: Number,
  ledgerCreated: Boolean,
  ledgerId: String,
  createdBy: String,
  updatedBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Ledger Schema
```javascript
{
  ledgerId: String,
  userID: String,
  contractorId: String,
  customerId: String,
  invoiceId: String,
  entryType: String,
  amount: Number,
  currency: String,
  description: String,
  reference: String,
  transactionDate: Date,
  paymentMethod: String,
  status: String,
  notes: String,
  balanceBefore: Number,
  balanceAfter: Number,
  transactionId: String,
  receiptNumber: String,
  bankReference: String,
  createdBy: String,
  updatedBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Workflow

### Quotation to Invoice Workflow
1. Create a quotation for a customer
2. Send the quotation to the customer
3. Customer accepts the quotation
4. Convert the accepted quotation to an invoice
5. Send the invoice to the customer
6. Create ledger entry when invoice is generated
7. Track payments and update invoice status

### Direct Invoice Workflow
1. Create an invoice directly for a customer
2. Send the invoice to the customer
3. Create ledger entry for the invoice
4. Track payments and update invoice status

### Ledger Management
1. All financial transactions are recorded in the ledger
2. Automatic balance calculation for each customer
3. Support for multiple payment methods
4. Comprehensive financial reporting capabilities

## Status Values

### Quotation Status
- `draft`: Initial state
- `sent`: Quotation sent to customer
- `accepted`: Customer accepted the quotation
- `rejected`: Customer rejected the quotation
- `expired`: Quotation validity expired
- `converted`: Quotation converted to invoice

### Invoice Status
- `draft`: Initial state
- `sent`: Invoice sent to customer
- `paid`: Invoice fully paid
- `overdue`: Invoice past due date
- `cancelled`: Invoice cancelled
- `partially_paid`: Invoice partially paid

### Ledger Entry Types
- `debit`: Amount owed by customer
- `credit`: Amount credited to customer
- `payment`: Payment received from customer
- `refund`: Refund given to customer
- `adjustment`: Manual adjustment entry

### Ledger Entry Status
- `pending`: Transaction pending
- `completed`: Transaction completed
- `failed`: Transaction failed
- `cancelled`: Transaction cancelled
- `reversed`: Transaction reversed

## Usage Examples

### Creating a Quotation
```javascript
const quotationData = {
  contractorId: "contractor-123",
  customerId: "customer-456",
  quotationNumber: "QUT-2024-001",
  subject: "Website Development Services",
  description: "Complete website development for e-commerce platform",
  items: [
    {
      name: "Frontend Development",
      description: "React.js frontend development",
      quantity: 1,
      unitPrice: 5000,
      total: 5000,
      taxRate: 10
    }
  ],
  subtotal: 5000,
  taxAmount: 500,
  totalAmount: 5500,
  currency: "USD",
  validUntil: "2024-12-31",
  terms: "Payment due within 30 days",
  status: "draft"
};
```

### Converting Quotation to Invoice
```javascript
const conversionData = {
  quotationId: "quot-123456789"
};
```

### Creating Ledger Entry
```javascript
const ledgerData = {
  contractorId: "contractor-123",
  customerId: "customer-456",
  invoiceId: "inv-123456789",
  entryType: "debit",
  amount: 5500,
  currency: "USD",
  description: "Invoice INV-2024-001 - Website Development Services",
  reference: "INV-2024-001",
  transactionDate: "2024-01-15",
  paymentMethod: "invoice",
  status: "completed",
  notes: "Ledger entry created for invoice INV-2024-001"
};
```

## Error Handling

The module includes comprehensive error handling for:
- Invalid contractor or customer IDs
- Duplicate quotation/invoice numbers
- Invalid status transitions
- Missing required fields
- Database operation failures

## Security

- All endpoints require authentication
- User-specific data isolation
- Input validation for all parameters
- SQL injection prevention through parameterized queries

## Dependencies

- MongoDB for data storage
- Express.js for API routing
- Joi for input validation
- UUID for unique ID generation 