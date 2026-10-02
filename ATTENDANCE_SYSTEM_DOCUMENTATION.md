# Attendance System Documentation

## Overview
The attendance system has been successfully implemented with all necessary components including MongoDB schema, model, controller, routes, and validation schemas.

## Schema Structure

### Attendance Schema (`src/schemas/mongoDB/App/attendance.schema.js`)
```javascript
{
  attendanceId: String (required, unique),
  date: Date (required, indexed),
  attendance: [
    {
      employeeId: String (required, ref: 'employee'),
      checkInTime: Date (required),
      checkOutTime: Date (optional),
      workingHours: Number (default: 0, in hours),
      overTime: Number (default: 0, in hours),
      attendanceStatus: String (enum: ['present', 'absent', 'late', 'half-day', 'leave']),
      note: String (optional)
    }
  ],
  userID: String (required),
  status: String (enum: ['active', 'inactive'], default: 'active'),
  timestamps: true
}
```

## API Endpoints

### 1. Create Attendance
- **Method**: POST
- **Path**: `/api/app/v1/attendance/create`
- **Body**: 
  ```json
  {
    "attendanceId": "ATT001",
    "date": "2024-01-15T00:00:00.000Z",
    "attendance": [
      {
        "employeeId": "EMP001",
        "checkInTime": "2024-01-15T09:00:00.000Z",
        "checkOutTime": "2024-01-15T17:00:00.000Z",
        "workingHours": 8,
        "overTime": 0,
        "attendanceStatus": "present",
        "note": "Regular day"
      }
    ]
  }
  ```

### 2. Update Attendance
- **Method**: PUT
- **Path**: `/api/app/v1/attendance/update`
- **Body**: Same as create but with optional fields

### 3. Get All Attendance
- **Method**: GET
- **Path**: `/api/app/v1/attendance/get-all-attendance`
- **Query Parameters**:
  - `dateFrom`: Start date filter
  - `dateTo`: End date filter
  - `employeeId`: Filter by specific employee
  - `attendanceStatus`: Filter by status
  - `sortBy`: Sort field (date, createdAt, updatedAt)
  - `sortOrder`: asc/desc
  - `page`: Page number
  - `limit`: Items per page

### 4. Get Attendance by ID
- **Method**: GET
- **Path**: `/api/app/v1/attendance/get-attendance-by-id`
- **Query Parameters**:
  - `attendanceId`: Required

### 5. Delete Attendance
- **Method**: DELETE
- **Path**: `/api/app/v1/attendance/delete-attendance`
- **Body**:
  ```json
  {
    "attendanceId": "ATT001"
  }
  ```

### 6. Get Employee Attendance
- **Method**: GET
- **Path**: `/api/app/v1/attendance/get-employee-attendance`
- **Query Parameters**:
  - `employeeId`: Required
  - `dateFrom`: Start date filter
  - `dateTo`: End date filter
  - `attendanceStatus`: Filter by status
  - `sortBy`: Sort field
  - `sortOrder`: asc/desc
  - `page`: Page number
  - `limit`: Items per page

## Files Created/Modified

### New Files:
1. `src/schemas/mongoDB/App/attendance.schema.js` - MongoDB schema
2. `src/models/mongodb/app/Attendance.model.js` - Model with CRUD operations
3. `src/controllers/app/payroll/attendance.controller.js` - Controller with endpoints
4. `src/routes/app/v1/payroll/attendance.route.js` - Route definitions
5. `src/validations/schemas/app/attendance.schema.js` - Joi validation schemas

### Modified Files:
1. `src/lib/configs/route.config.js` - Added attendance route configuration
2. `src/routes/app/v1/index.js` - Added attendance route to main routes
3. `src/validations/schemas/index.js` - Added attendance validation to exports

## Suggested Additional Schema Entities

### 1. Leave Management Schema
```javascript
{
  leaveId: String (required, unique),
  employeeId: String (required, ref: 'employee'),
  leaveType: String (enum: ['sick', 'casual', 'annual', 'maternity', 'paternity']),
  startDate: Date (required),
  endDate: Date (required),
  totalDays: Number (required),
  reason: String (required),
  status: String (enum: ['pending', 'approved', 'rejected']),
  approvedBy: String (ref: 'employee'),
  approvedAt: Date,
  userID: String (required),
  timestamps: true
}
```

### 2. Payroll Schema
```javascript
{
  payrollId: String (required, unique),
  employeeId: String (required, ref: 'employee'),
  month: Number (required, 1-12),
  year: Number (required),
  basicSalary: Number (required),
  allowances: [
    {
      type: String (enum: ['housing', 'transport', 'medical', 'other']),
      amount: Number (required)
    }
  ],
  deductions: [
    {
      type: String (enum: ['tax', 'insurance', 'loan', 'advance', 'other']),
      amount: Number (required)
    }
  ],
  overtimePay: Number (default: 0),
  bonus: Number (default: 0),
  netSalary: Number (required),
  paymentStatus: String (enum: ['pending', 'paid', 'cancelled']),
  paymentDate: Date,
  userID: String (required),
  timestamps: true
}
```

### 3. Department Schema
```javascript
{
  departmentId: String (required, unique),
  name: String (required),
  description: String,
  managerId: String (ref: 'employee'),
  budget: Number,
  status: String (enum: ['active', 'inactive']),
  userID: String (required),
  timestamps: true
}
```

### 4. Shift Schema
```javascript
{
  shiftId: String (required, unique),
  name: String (required),
  startTime: String (required, format: "HH:mm"),
  endTime: String (required, format: "HH:mm"),
  breakTime: Number (in minutes),
  totalHours: Number (required),
  isNightShift: Boolean (default: false),
  status: String (enum: ['active', 'inactive']),
  userID: String (required),
  timestamps: true
}
```

### 5. Holiday Schema
```javascript
{
  holidayId: String (required, unique),
  name: String (required),
  date: Date (required),
  type: String (enum: ['public', 'company', 'optional']),
  description: String,
  isPaid: Boolean (default: true),
  userID: String (required),
  timestamps: true
}
```

### 6. Overtime Schema
```javascript
{
  overtimeId: String (required, unique),
  employeeId: String (required, ref: 'employee'),
  date: Date (required),
  startTime: Date (required),
  endTime: Date (required),
  totalHours: Number (required),
  rate: Number (required, multiplier for overtime pay),
  reason: String (required),
  status: String (enum: ['pending', 'approved', 'rejected']),
  approvedBy: String (ref: 'employee'),
  approvedAt: Date,
  userID: String (required),
  timestamps: true
}
```

### 7. Salary Structure Schema
```javascript
{
  salaryStructureId: String (required, unique),
  employeeId: String (required, ref: 'employee'),
  basicSalary: Number (required),
  allowances: [
    {
      type: String (enum: ['housing', 'transport', 'medical', 'food', 'other']),
      amount: Number (required),
      isPercentage: Boolean (default: false),
      percentage: Number (if isPercentage is true)
    }
  ],
  effectiveFrom: Date (required),
  effectiveTo: Date,
  status: String (enum: ['active', 'inactive']),
  userID: String (required),
  timestamps: true
}
```

## Usage Examples

### Creating Daily Attendance
```javascript
// Example request body for creating attendance
{
  "attendanceId": "ATT_2024_01_15",
  "date": "2024-01-15T00:00:00.000Z",
  "attendance": [
    {
      "employeeId": "EMP001",
      "checkInTime": "2024-01-15T09:00:00.000Z",
      "checkOutTime": "2024-01-15T17:00:00.000Z",
      "workingHours": 8,
      "overTime": 0,
      "attendanceStatus": "present",
      "note": "Regular working day"
    },
    {
      "employeeId": "EMP002",
      "checkInTime": "2024-01-15T09:30:00.000Z",
      "checkOutTime": "2024-01-15T17:30:00.000Z",
      "workingHours": 8,
      "overTime": 0.5,
      "attendanceStatus": "late",
      "note": "Late by 30 minutes"
    }
  ]
}
```

### Getting Employee Attendance Report
```javascript
// Example query parameters
GET /api/app/v1/attendance/get-employee-attendance?employeeId=EMP001&dateFrom=2024-01-01&dateTo=2024-01-31&attendanceStatus=present&sortBy=date&sortOrder=asc&page=1&limit=10
```

## Features Implemented

1. **Complete CRUD Operations**: Create, Read, Update, Delete attendance records
2. **Employee-specific Attendance**: Get attendance records for specific employees
3. **Advanced Filtering**: Filter by date range, employee, attendance status
4. **Pagination**: Support for paginated results
5. **Sorting**: Sort by date, creation time, update time
6. **Validation**: Comprehensive Joi validation for all endpoints
7. **Error Handling**: Proper error handling and responses
8. **Authentication**: User-based data isolation

## Next Steps

1. Implement the suggested additional schemas (Leave, Payroll, Department, etc.)
2. Add attendance analytics and reporting features
3. Implement attendance approval workflow
4. Add bulk attendance import/export functionality
5. Implement attendance notifications and reminders
6. Add attendance dashboard with charts and statistics 