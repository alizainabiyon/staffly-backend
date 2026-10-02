# Staffly Attendance API - Postman Collection

## 📋 Overview
This Postman collection contains all the API endpoints for the Staffly Attendance Management System. The collection is designed to help you test and interact with the attendance API efficiently.

## 🚀 Quick Start

### 1. Import the Collection
1. Open Postman
2. Click "Import" button
3. Select the `Staffly_Attendance_API.postman_collection.json` file
4. The collection will be imported with all endpoints

### 2. Set Up Environment Variables
Before using the collection, set up these environment variables:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `baseUrl` | Your API base URL | `http://localhost:3000` |
| `authToken` | Your authentication token | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### 3. Authentication
All endpoints require authentication. Make sure to:
1. Set your `authToken` variable
2. The token will be automatically included in the Authorization header

## 📚 API Endpoints

### 1. Mark Attendance
**POST** `/api/app/v1/attendance/mark-attendance`

Mark attendance for all employees for a specific date.

**Request Body:**
```json
{
  "date": "2024-01-15T00:00:00.000Z",
  "day": "Monday",
  "attendance": [
    {
      "employeeId": "EMP001",
      "checkInTime": "2024-01-15T09:00:00.000Z",
      "checkOutTime": "2024-01-15T17:00:00.000Z",
      "workingHours": 8,
      "overTime": 0,
      "attendanceStatus": "present",
      "note": "Regular working day"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance created successfully",
  "data": {
    "attendanceId": "attendence-uuid-here",
    "date": "2024-01-15T00:00:00.000Z",
    "day": "Monday",
    "attendance": [...],
    "userID": "user123",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

### 2. Update Attendance
**PUT** `/api/app/v1/attendance/update-attendance`

Update existing attendance record.

**Request Body:**
```json
{
  "attendanceId": "attendence-uuid-here",
  "date": "2024-01-15T00:00:00.000Z",
  "attendance": [
    {
      "employeeId": "EMP001",
      "checkInTime": "2024-01-15T09:00:00.000Z",
      "checkOutTime": "2024-01-15T18:00:00.000Z",
      "workingHours": 8,
      "overTime": 1,
      "attendanceStatus": "present",
      "note": "Updated with overtime"
    }
  ]
}
```

### 3. Get One Day Attendance
**GET** `/api/app/v1/attendance/get-one-day-attendance`

Get attendance records for all employees for a specific date.

**Query Parameters:**
- `date` (required): Date in ISO format

**Example URL:**
```
{{baseUrl}}/api/app/v1/attendance/get-one-day-attendance?date=2024-01-15
```

### 4. Get Employee Attendance Detail
**GET** `/api/app/v1/attendance/get-employee-attendance-detail`

Get specific employee's attendance detail from an attendance record.

**Query Parameters:**
- `attendanceId` (required): Attendance record ID
- `employeeId` (required): Employee ID

**Example URL:**
```
{{baseUrl}}/api/app/v1/attendance/get-employee-attendance-detail?attendanceId=attendence-uuid&employeeId=EMP001
```

### 5. Get Monthly Attendance
**GET** `/api/app/v1/attendance/get-monthly-attendance`

Get full month attendance records for a specific employee.

**Query Parameters:**
- `employeeId` (required): Employee ID
- `month` (required): Month (1-12)
- `year` (required): Year

**Example URL:**
```
{{baseUrl}}/api/app/v1/attendance/get-monthly-attendance?employeeId=EMP001&month=1&year=2024
```

## 📊 Attendance Status Types

| Status | Description |
|--------|-------------|
| `present` | Employee is present and working |
| `absent` | Employee is not present |
| `late` | Employee arrived late |
| `half-day` | Employee worked half day |
| `leave` | Employee is on leave |
| `holiday` | Company holiday |
| `weekend` | Weekend day |

## 🔧 Testing Scenarios

### Scenario 1: Daily Attendance Marking
1. Use "Mark Attendance" endpoint
2. Include multiple employees with different statuses
3. Verify the response contains the generated attendanceId

### Scenario 2: Attendance Updates
1. First mark attendance using "Mark Attendance"
2. Copy the attendanceId from the response
3. Use "Update Attendance" to modify the record
4. Verify the changes are reflected

### Scenario 3: Attendance Queries
1. Mark attendance for multiple days
2. Use "Get One Day Attendance" to retrieve specific day
3. Use "Get Monthly Attendance" to get monthly report
4. Use "Get Employee Attendance Detail" for specific employee

## 🛠️ Troubleshooting

### Common Issues:

1. **401 Unauthorized**
   - Check if `authToken` is set correctly
   - Verify the token is valid and not expired

2. **400 Bad Request**
   - Check request body format
   - Verify all required fields are present
   - Ensure date formats are correct (ISO format)

3. **404 Not Found**
   - Verify the attendanceId exists
   - Check if the employeeId is correct

4. **500 Internal Server Error**
   - Check server logs
   - Verify database connection

### Validation Rules:

- `date`: Must be in ISO date format
- `employeeId`: Must be a valid employee ID
- `checkInTime`: Required for present/late status
- `workingHours`: Must be between 0-24
- `overTime`: Must be between 0-24
- `attendanceStatus`: Must be one of the valid statuses

## 📝 Example Data

### Sample Employee IDs:
- `EMP001` - John Doe
- `EMP002` - Jane Smith
- `EMP003` - Mike Johnson

### Sample Dates:
- `2024-01-15T00:00:00.000Z` - Monday
- `2024-01-16T00:00:00.000Z` - Tuesday
- `2024-01-17T00:00:00.000Z` - Wednesday

## 🔄 Workflow Examples

### Daily Workflow:
1. **Morning**: Mark attendance for all employees
2. **Throughout Day**: Update attendance as needed
3. **Evening**: Review daily attendance report
4. **End of Month**: Generate monthly reports

### Employee Management:
1. **New Employee**: Add to attendance records
2. **Leave Request**: Update status to 'leave'
3. **Return from Leave**: Update status to 'present'
4. **Termination**: Remove from attendance records

## 📞 Support

For technical support or questions about the API:
- Check the server logs for detailed error messages
- Verify all request parameters are correct
- Ensure authentication is properly configured

## 🔗 Related Documentation

- [Staffly Backend API Documentation](../README.md)
- [Employee Management API](../employee/README.md)
- [Authentication Guide](../../auth/README.md) 