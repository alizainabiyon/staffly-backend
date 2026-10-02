# Salary Management System

This document describes the salary management system for the Staffly backend application.

## Overview

The salary management system provides comprehensive functionality for generating, managing, and tracking employee salaries. It includes automatic salary generation, manual salary management, and detailed reporting capabilities.

## Features

- **Automatic Salary Generation**: Generates salaries for all active employees on the 1st of each month
- **Manual Salary Generation**: Allows manual generation of salaries for specific months
- **Salary History**: View salary history for all employees or specific employees
- **Salary Details**: Get detailed information about specific salary records
- **Salary Updates**: Update salary information and status
- **Deduction Management**: Track and manage salary deductions
- **Status Tracking**: Track salary status (pending, approved, paid, cancelled)

## Database Schema

### Salary Model

```javascript
{
  salaryId: String (unique),
  employeeId: String (reference to employee),
  month: Number (1-12),
  year: Number (2000-2100),
  basicSalary: Number,
  overtimeAmount: Number,
  deduction: [{
    date: Date,
    reason: String,
    amount: Number
  }],
  grossSalary: Number,
  netSalary: Number,
  status: String (pending|approved|paid|cancelled),
  paymentDate: Date,
  remarks: String,
  userID: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### 1. Generate Salary for All Employees

**POST** `/api/app/v1/salary/generate-salary`

Generates salaries for all active employees for a specific month and year. Can only be executed on the 1st of each month for the previous month.

**Request Body:**
```json
{
  "month": 7,
  "year": 2024
}
```

**Response:**
```json
{
  "success": true,
  "message": "Salary generation completed. 15 salaries generated successfully.",
  "data": {
    "generatedSalaries": [...],
    "errors": [...]
  }
}
```

### 2. Get Salary History of All Employees

**GET** `/api/app/v1/salary/salary-history`

Retrieves salary history for all employees with filtering and pagination options.

**Query Parameters:**
- `month` (optional): Filter by month (1-12)
- `year` (optional): Filter by year (2000-2100)
- `status` (optional): Filter by status (pending|approved|paid|cancelled)
- `sortBy` (optional): Sort field (createdAt|updatedAt|month|year|netSalary|grossSalary)
- `sortOrder` (optional): Sort order (asc|desc)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "message": "Salary history retrieved successfully",
  "data": {
    "salaries": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 50,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### 3. Get Salary History of an Employee

**GET** `/api/app/v1/salary/employee-salary-history`

Retrieves salary history for a specific employee.

**Query Parameters:**
- `employeeId` (required): Employee ID
- `month` (optional): Filter by month (1-12)
- `year` (optional): Filter by year (2000-2100)
- `status` (optional): Filter by status (pending|approved|paid|cancelled)
- `sortBy` (optional): Sort field (createdAt|updatedAt|month|year|netSalary|grossSalary)
- `sortOrder` (optional): Sort order (asc|desc)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

### 4. Get Salary Detail

**GET** `/api/app/v1/salary/salary-detail`

Retrieves detailed information about a specific salary record.

**Query Parameters:**
- `salaryId` (required): Salary ID

**Response:**
```json
{
  "success": true,
  "message": "Salary details retrieved successfully",
  "data": {
    "salaryId": "salary-1234567890",
    "employeeId": {
      "name": "John Doe",
      "email": "john@example.com",
      "department": "Engineering",
      "position": "Software Engineer"
    },
    "month": 7,
    "year": 2024,
    "basicSalary": 5000,
    "overtimeAmount": 500,
    "deduction": [...],
    "grossSalary": 5500,
    "netSalary": 5200,
    "status": "pending",
    "paymentDate": null,
    "remarks": "",
    "createdAt": "2024-08-01T00:00:00.000Z",
    "updatedAt": "2024-08-01T00:00:00.000Z"
  }
}
```

### 5. Update Salary

**PUT** `/api/app/v1/salary/update-salary`

Updates salary information for a specific salary record.

**Request Body:**
```json
{
  "salaryId": "salary-1234567890",
  "basicSalary": 5500,
  "overtimeAmount": 600,
  "deduction": [
    {
      "date": "2024-07-15",
      "reason": "Late arrival",
      "amount": 100
    },
    {
      "date": "2024-07-01",
      "reason": "Loan Installment - personal loan (loan-1234567890)",
      "amount": 4395.83,
      "loanId": "loan-1234567890",
      "installmentNumber": 1
    }
  ],
  "grossSalary": 6100,
  "netSalary": 6000,
  "remarks": "Updated salary information"
}
```

### 6. Update Salary Status

**PUT** `/api/app/v1/salary/update-salary-status`

Updates the status of a salary record. When status is set to 'paid', loan deductions are automatically processed.

**Request Body:**
```json
{
  "salaryId": "salary-1234567890",
  "status": "paid",
  "paymentDate": "2024-08-05"
}
```

### 7. Process Loan Deductions

**PUT** `/api/app/v1/salary/process-loan-deductions`

Manually process loan deductions for a specific salary record.

**Request Body:**
```json
{
  "salaryId": "salary-1234567890"
}
```

## Loan Integration

The salary system is fully integrated with the loan management system to automatically handle loan deductions:

### Automatic Loan Deductions

1. **During Salary Generation**: When generating monthly salaries, the system automatically:
   - Checks for active loans for each employee
   - Finds pending installments for the salary month
   - Adds loan deductions to the salary record
   - Calculates net salary after loan deductions

2. **Loan Deduction Structure**:
   ```json
   {
     "date": "2024-07-01",
     "reason": "Loan Installment - personal loan (loan-1234567890)",
     "amount": 4395.83,
     "loanId": "loan-1234567890",
     "installmentNumber": 1
   }
   ```

3. **Automatic Processing**: When salary status is updated to 'paid':
   - Loan installments are automatically marked as paid
   - Loan totals are updated (paidInstallments, remainingAmount)
   - Loan status is updated to 'completed' if all installments are paid

### Manual Processing

You can also manually process loan deductions using the dedicated API endpoint:
- **PUT** `/api/app/v1/salary/process-loan-deductions`

## Automatic Salary Generation

The system includes a cron job that automatically generates salaries for all active employees on the 1st of each month at 00:01 UTC for the previous month.

### Cron Job Configuration

- **Schedule**: `1 0 1 * *` (1st of every month at 00:01)
- **Timezone**: UTC
- **Function**: `generateSalaryForAllEmployees`

### Salary Generation Logic

1. **Date Validation**: Only runs on the 1st of each month
2. **Month Calculation**: Generates salary for the previous month
3. **Employee Filtering**: Only processes active employees
4. **Duplicate Prevention**: Checks for existing salary records
5. **Salary Calculation**: 
   - Basic salary from employee record
   - Overtime amount (currently set to 0, can be enhanced with attendance data)
   - Deductions (currently empty array, can be populated based on business logic)
   - Gross salary = Basic salary + Overtime amount
   - Net salary = Gross salary - Total deductions

## Business Rules

1. **Salary Generation Timing**: Salaries can only be generated on the 1st of each month for the previous month
2. **Employee Status**: Only active employees are included in salary generation
3. **Duplicate Prevention**: System prevents duplicate salary generation for the same employee, month, and year
4. **Status Flow**: Salary status follows the flow: pending → approved → paid
5. **Data Validation**: All monetary values must be non-negative numbers
6. **Loan Integration**: Active loan installments are automatically deducted from monthly salaries
7. **Automatic Processing**: When salary status is updated to 'paid', loan installments are automatically marked as paid

## Error Handling

The system includes comprehensive error handling for:
- Invalid date parameters
- Missing employee data
- Database connection issues
- Validation errors
- Duplicate salary records

## Security

- All endpoints require authentication
- User-specific data isolation through `userID` field
- Input validation using Joi schemas
- Role-based access control (can be extended)

## Future Enhancements

1. **Overtime Calculation**: Integrate with attendance system for accurate overtime calculation
2. **Deduction Rules**: Implement configurable deduction rules and policies
3. **Tax Calculation**: Add tax calculation based on salary brackets
4. **Bonus Management**: Add support for bonuses and incentives
5. **Payroll Reports**: Generate comprehensive payroll reports
6. **Email Notifications**: Send salary slips via email
7. **Bank Integration**: Direct bank transfers for salary payments
8. **Audit Trail**: Track all salary modifications and approvals

## Usage Examples

### Generate July 2024 Salaries (on August 1st, 2024)

```bash
curl -X POST http://localhost:3000/api/app/v1/salary/generate-salary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "month": 7,
    "year": 2024
  }'
```

### Get Salary History for August 2024

```bash
curl -X GET "http://localhost:3000/api/app/v1/salary/salary-history?month=8&year=2024&status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Salary Status to Paid

```bash
curl -X PUT http://localhost:3000/api/app/v1/salary/update-salary-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "salaryId": "salary-1234567890",
    "status": "paid",
    "paymentDate": "2024-08-05"
  }'
``` 