# Loan Management System

This document describes the loan management system for the Staffly backend application.

## Overview

The loan management system provides comprehensive functionality for managing employee loans, including loan applications, approval workflows, installment tracking, and payment processing. It supports various loan types and includes detailed tracking of loan status and payments.

## Features

- **Loan Applications**: Create and manage loan applications for employees
- **Multiple Loan Types**: Support for personal, home, vehicle, education, medical, and other loans
- **Approval Workflow**: Status-based approval system (pending → approved → active → completed)
- **Installment Management**: Automatic installment generation and payment tracking
- **Guarantor System**: Required guarantor information for loan applications
- **Document Management**: Support for loan-related document uploads
- **Payment Processing**: Track installment payments and update loan status
- **Comprehensive Reporting**: View loans by employee, status, date range, etc.

## Database Schema

### Loan Model

```javascript
{
  loanId: String (unique),
  employeeId: String (reference to employee),
  loanType: String (personal|home|vehicle|education|medical|other),
  loanAmount: Number,
  interestRate: Number (0-100),
  totalAmount: Number (loan + interest),
  installmentAmount: Number,
  totalInstallments: Number,
  paidInstallments: Number,
  remainingAmount: Number,
  startDate: Date,
  endDate: Date,
  nextInstallmentDate: Date,
  status: String (pending|approved|active|completed|cancelled|defaulted),
  purpose: String,
  guarantor: {
    name: String,
    phone: String,
    relationship: String
  },
  documents: [{
    name: String,
    file: String,
    uploadedAt: Date
  }],
  installments: [{
    installmentNumber: Number,
    dueDate: Date,
    amount: Number,
    paidAmount: Number,
    paidDate: Date,
    status: String (pending|paid|overdue|partial),
    remarks: String
  }],
  remarks: String,
  approvedBy: String,
  approvedAt: Date,
  userID: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### 1. Create Loan Application

**POST** `/api/app/v1/loan/create`

Creates a new loan application for an employee.

**Request Body:**
```json
{
  "employeeId": "EMP001",
  "loanType": "personal",
  "loanAmount": 50000,
  "interestRate": 5.5,
  "totalInstallments": 12,
  "startDate": "2024-08-01",
  "purpose": "Home renovation and furniture purchase",
  "guarantor": {
    "name": "John Smith",
    "phone": "+1234567890",
    "relationship": "Brother"
  },
  "documents": [
    {
      "name": "Salary Slip",
      "file": "salary_slip.pdf"
    }
  ],
  "remarks": "Urgent requirement for home renovation"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Loan application created successfully",
  "data": {
    "loanId": "loan-1234567890",
    "employeeId": "EMP001",
    "loanType": "personal",
    "loanAmount": 50000,
    "interestRate": 5.5,
    "totalAmount": 52750,
    "installmentAmount": 4395.83,
    "totalInstallments": 12,
    "paidInstallments": 0,
    "remainingAmount": 52750,
    "status": "pending",
    "installments": [...],
    "createdAt": "2024-08-01T00:00:00.000Z"
  }
}
```

### 2. Get All Loans

**GET** `/api/app/v1/loan/get-all-loans`

Retrieves all loans with filtering and pagination options.

**Query Parameters:**
- `employeeId` (optional): Filter by employee ID
- `loanType` (optional): Filter by loan type
- `status` (optional): Filter by status
- `dateFrom` (optional): Filter by start date from
- `dateTo` (optional): Filter by start date to
- `sortBy` (optional): Sort field
- `sortOrder` (optional): Sort order (asc|desc)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

### 3. Get Loan by ID

**GET** `/api/app/v1/loan/get-loan-by-id`

Retrieves detailed information about a specific loan.

**Query Parameters:**
- `loanId` (required): Loan ID

### 4. Get Employee Loans

**GET** `/api/app/v1/loan/get-employee-loans`

Retrieves all loans for a specific employee.

**Query Parameters:**
- `employeeId` (required): Employee ID
- `status` (optional): Filter by status
- `sortBy` (optional): Sort field
- `sortOrder` (optional): Sort order (asc|desc)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

### 5. Update Loan Status

**PUT** `/api/app/v1/loan/update-status`

Updates the status of a loan (approval workflow).

**Request Body:**
```json
{
  "loanId": "loan-1234567890",
  "status": "approved",
  "approvedBy": "admin@company.com",
  "remarks": "Loan approved after document verification"
}
```

### 6. Pay Installment

**PUT** `/api/app/v1/loan/pay-installment`

Processes an installment payment for a loan.

**Request Body:**
```json
{
  "loanId": "loan-1234567890",
  "installmentNumber": 1,
  "paidAmount": 4395.83,
  "remarks": "First installment paid on time"
}
```

### 7. Update Loan

**PUT** `/api/app/v1/loan/update`

Updates loan information (limited fields).

**Request Body:**
```json
{
  "loanId": "loan-1234567890",
  "purpose": "Updated purpose for home renovation",
  "guarantor": {
    "name": "Jane Smith",
    "phone": "+1234567891",
    "relationship": "Sister"
  },
  "remarks": "Updated loan information"
}
```

### 8. Delete Loan

**DELETE** `/api/app/v1/loan/delete`

Deletes a loan application (only for pending loans).

**Query Parameters:**
- `loanId` (required): Loan ID

## Loan Types

The system supports the following loan types:

1. **Personal**: General personal loans
2. **Home**: Home purchase or renovation loans
3. **Vehicle**: Vehicle purchase loans
4. **Education**: Educational expense loans
5. **Medical**: Medical expense loans
6. **Other**: Miscellaneous loans

## Loan Status Flow

The loan status follows this workflow:

1. **pending**: Initial application status
2. **approved**: Loan approved by management
3. **active**: Loan is active and payments are being made
4. **completed**: All installments paid
5. **cancelled**: Loan cancelled before approval
6. **defaulted**: Loan defaulted due to non-payment

## Installment Status

Each installment can have the following status:

1. **pending**: Installment not yet due
2. **paid**: Installment fully paid
3. **overdue**: Installment past due date
4. **partial**: Partial payment made

## Business Rules

1. **Employee Validation**: Only active employees can apply for loans
2. **Interest Calculation**: Simple interest calculation (Principal × Rate × Time)
3. **Installment Generation**: Automatic generation of installments based on total amount and number of installments
4. **Payment Processing**: Partial payments are supported
5. **Status Updates**: Automatic status updates based on payment progress
6. **Document Requirements**: Optional document uploads for loan applications
7. **Guarantor Requirement**: Mandatory guarantor information for all loans

## Loan Calculation Example

For a loan of $50,000 with 5.5% interest for 12 months:

- **Principal**: $50,000
- **Interest**: $50,000 × 5.5% = $2,750
- **Total Amount**: $52,750
- **Monthly Installment**: $52,750 ÷ 12 = $4,395.83

## Error Handling

The system includes comprehensive error handling for:
- Invalid employee ID
- Invalid loan amounts or interest rates
- Duplicate loan applications
- Payment processing errors
- Status update validation
- Document validation

## Security

- All endpoints require authentication
- User-specific data isolation through `userID` field
- Input validation using Joi schemas
- Role-based access control (can be extended)

## Future Enhancements

1. **Advanced Interest Calculation**: Compound interest and different calculation methods
2. **Loan Limits**: Configurable loan limits based on employee salary
3. **Credit Scoring**: Employee credit history and scoring
4. **Automatic Deductions**: Integration with salary system for automatic deductions
5. **Loan Templates**: Predefined loan templates for different types
6. **Email Notifications**: Payment reminders and status updates
7. **Reports**: Comprehensive loan reports and analytics
8. **Multi-currency Support**: Support for different currencies
9. **Loan Refinancing**: Support for loan refinancing
10. **Early Payment Discounts**: Incentives for early loan repayment

## Usage Examples

### Create a Personal Loan

```bash
curl -X POST http://localhost:3000/api/app/v1/loan/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employeeId": "EMP001",
    "loanType": "personal",
    "loanAmount": 30000,
    "interestRate": 4.5,
    "totalInstallments": 24,
    "startDate": "2024-08-01",
    "purpose": "Debt consolidation and emergency fund",
    "guarantor": {
      "name": "Mary Johnson",
      "phone": "+1234567890",
      "relationship": "Spouse"
    }
  }'
```

### Approve a Loan

```bash
curl -X PUT http://localhost:3000/api/app/v1/loan/update-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "loanId": "loan-1234567890",
    "status": "approved",
    "approvedBy": "hr@company.com",
    "remarks": "Approved after salary verification"
  }'
```

### Pay an Installment

```bash
curl -X PUT http://localhost:3000/api/app/v1/loan/pay-installment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "loanId": "loan-1234567890",
    "installmentNumber": 1,
    "paidAmount": 4395.83,
    "remarks": "First installment paid via bank transfer"
  }'
```

### Get Employee Loans

```bash
curl -X GET "http://localhost:3000/api/app/v1/loan/get-employee-loans?employeeId=EMP001&status=active" \
  -H "Authorization: Bearer YOUR_TOKEN"
``` 