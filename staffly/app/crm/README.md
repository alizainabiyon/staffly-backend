# CRM Management System

This document describes the Customer Relationship Management (CRM) system for the Staffly backend application.

## Overview

The CRM system provides comprehensive functionality for managing customers and contractors, including detailed contact information, business relationships, and performance tracking. It supports various customer types, contractor categories, and includes advanced search and reporting capabilities.

## Features

### Customer Management
- **Customer Profiles**: Comprehensive customer information management
- **Multiple Customer Types**: Support for individual, company, and organization customers
- **Customer Categories**: Regular, premium, VIP, wholesale, and retail customers
- **Contact Management**: Multiple contact methods and preferences
- **Business Information**: Industry, business type, tax information
- **Financial Management**: Credit limits, payment terms, currency preferences
- **Document Management**: Support for customer-related documents
- **Status Tracking**: Active, inactive, prospect, lead, suspended statuses
- **Search & Filtering**: Advanced search across multiple fields
- **Statistics & Reporting**: Customer analytics and insights

### Contractor Management
- **Contractor Profiles**: Detailed contractor information management
- **Multiple Contractor Types**: Individual, company, partnership, corporation
- **Service Categories**: Construction, maintenance, consulting, supplier, service provider
- **Performance Tracking**: Ratings, project completion, on-time delivery
- **Certification Management**: Professional certifications and licenses
- **Insurance Tracking**: Insurance provider and coverage information
- **Bank Details**: Payment and financial information
- **Service Specializations**: Services offered and specializations
- **Status Management**: Active, inactive, suspended, blacklisted statuses
- **Top Rated Contractors**: Performance-based contractor ranking

## Database Schemas

### Customer Schema

```javascript
{
  customerId: String (unique),
  contractorId: String (reference to contractor),
  name: String,
  companyName: String,
  type: String (individual|company|organization),
  category: String (regular|premium|vip|wholesale|retail),
  email: String,
  phone: String,
  alternatePhone: String,
  website: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  businessType: String,
  industry: String,
  taxId: String,
  registrationNumber: String,
  creditLimit: Number,
  paymentTerms: String (immediate|net_7|net_15|net_30|net_45|net_60),
  currency: String,
  contactPerson: {
    name: String,
    position: String,
    email: String,
    phone: String
  },
  source: String (website|referral|social_media|cold_call|exhibition|other),
  notes: String,
  tags: [String],
  status: String (active|inactive|prospect|lead|suspended),
  priority: String (low|medium|high|urgent),
  preferredContactMethod: String (email|phone|sms|whatsapp),
  marketingConsent: Boolean,
  socialMedia: {
    linkedin: String,
    facebook: String,
    twitter: String,
    instagram: String
  },
  documents: [{
    name: String,
    file: String,
    type: String,
    uploadedAt: Date
  }],
  customFields: [{
    key: String,
    value: String,
    type: String
  }],
  createdBy: String,
  updatedBy: String,
  userID: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Contractor Schema

```javascript
{
  contractorId: String (unique),
  name: String,
  companyName: String,
  type: String (individual|company|partnership|corporation),
  category: String (construction|maintenance|consulting|supplier|service_provider|other),
  email: String,
  phone: String,
  alternatePhone: String,
  website: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  businessType: String,
  industry: String,
  taxId: String,
  registrationNumber: String,
  licenseNumber: String,
  paymentTerms: String,
  currency: String,
  bankDetails: {
    bankName: String,
    accountNumber: String,
    routingNumber: String,
    accountHolderName: String
  },
  contactPerson: {
    name: String,
    position: String,
    email: String,
    phone: String
  },
  services: [String],
  specializations: [String],
  certifications: [{
    name: String,
    issuingAuthority: String,
    issueDate: Date,
    expiryDate: Date,
    certificateNumber: String
  }],
  insurance: {
    provider: String,
    policyNumber: String,
    coverageAmount: Number,
    expiryDate: Date
  },
  rating: Number (0-5),
  totalProjects: Number,
  completedProjects: Number,
  onTimeDelivery: Number (0-100),
  qualityRating: Number (0-5),
  source: String,
  notes: String,
  tags: [String],
  status: String (active|inactive|suspended|blacklisted),
  priority: String (low|medium|high|preferred),
  preferredContactMethod: String,
  socialMedia: {
    linkedin: String,
    facebook: String,
    twitter: String,
    instagram: String
  },
  documents: [{
    name: String,
    file: String,
    type: String,
    uploadedAt: Date
  }],
  customFields: [{
    key: String,
    value: String,
    type: String
  }],
  createdBy: String,
  updatedBy: String,
  userID: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Customer Endpoints

#### 1. Create Customer

**POST** `/api/app/v1/customer/create`

Creates a new customer record.

**Request Body:**
```json
{
  "contractorId": "cont-1234567890",
  "name": "John Doe",
  "companyName": "ABC Corporation",
  "type": "company",
  "category": "premium",
  "email": "john.doe@abccorp.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Business St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10001"
  },
  "businessType": "Technology",
  "industry": "Software Development",
  "creditLimit": 50000,
  "paymentTerms": "net_30",
  "contactPerson": {
    "name": "Jane Smith",
    "position": "Procurement Manager",
    "email": "jane.smith@abccorp.com",
    "phone": "+1234567891"
  },
  "source": "referral",
  "notes": "High-value customer with potential for long-term partnership",
  "tags": ["tech", "enterprise", "premium"],
  "status": "active",
  "priority": "high"
}
```

#### 2. Get All Customers

**GET** `/api/app/v1/customer/get-all-customers`

Retrieves all customers with filtering and pagination options.

**Query Parameters:**
- `contractorId` (optional): Filter by contractor ID
- `name` (optional): Filter by customer name
- `email` (optional): Filter by email
- `type` (optional): Filter by customer type
- `category` (optional): Filter by category
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `source` (optional): Filter by source
- `tags` (optional): Filter by tags (comma-separated)
- `sortBy` (optional): Sort field
- `sortOrder` (optional): Sort order (asc|desc)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

#### 3. Get Customer by ID

**GET** `/api/app/v1/customer/get-customer-by-id`

Retrieves detailed information about a specific customer.

**Query Parameters:**
- `customerId` (required): Customer ID

#### 4. Get Customers by Contractor

**GET** `/api/app/v1/customer/get-customers-by-contractor`

Retrieves all customers for a specific contractor.

**Query Parameters:**
- `contractorId` (required): Contractor ID
- `status` (optional): Filter by status
- `sortBy` (optional): Sort field
- `sortOrder` (optional): Sort order (asc|desc)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

#### 5. Update Customer

**PUT** `/api/app/v1/customer/update`

Updates customer information.

**Request Body:**
```json
{
  "customerId": "cust-1234567890",
  "name": "John Doe Updated",
  "creditLimit": 75000,
  "priority": "urgent",
  "notes": "Updated customer information"
}
```

#### 6. Update Customer Status

**PUT** `/api/app/v1/customer/update-status`

Updates the status of a customer.

**Request Body:**
```json
{
  "customerId": "cust-1234567890",
  "status": "inactive"
}
```

#### 7. Delete Customer

**DELETE** `/api/app/v1/customer/delete`

Deletes a customer record.

**Query Parameters:**
- `customerId` (required): Customer ID

#### 8. Search Customers

**GET** `/api/app/v1/customer/search`

Searches customers across multiple fields.

**Query Parameters:**
- `searchTerm` (required): Search term (minimum 2 characters)
- `contractorId` (optional): Filter by contractor ID
- `status` (optional): Filter by status
- `sortBy` (optional): Sort field
- `sortOrder` (optional): Sort order (asc|desc)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

#### 9. Get Customer Statistics

**GET** `/api/app/v1/customer/stats`

Retrieves customer statistics and analytics.

**Query Parameters:**
- `contractorId` (optional): Filter by contractor ID

### Contractor Endpoints

#### 1. Create Contractor

**POST** `/api/app/v1/contractor/create`

Creates a new contractor record.

**Request Body:**
```json
{
  "name": "Mike Johnson",
  "companyName": "Johnson Construction Co.",
  "type": "company",
  "category": "construction",
  "email": "mike@johnsonconstruction.com",
  "phone": "+1234567890",
  "address": {
    "street": "456 Construction Ave",
    "city": "Los Angeles",
    "state": "CA",
    "country": "USA",
    "postalCode": "90210"
  },
  "businessType": "Construction Services",
  "industry": "Construction",
  "licenseNumber": "LIC123456",
  "paymentTerms": "net_30",
  "contactPerson": {
    "name": "Mike Johnson",
    "position": "Owner",
    "email": "mike@johnsonconstruction.com",
    "phone": "+1234567890"
  },
  "services": ["Residential Construction", "Commercial Construction", "Renovation"],
  "specializations": ["Green Building", "LEED Certification"],
  "certifications": [
    {
      "name": "General Contractor License",
      "issuingAuthority": "California Contractors State License Board",
      "issueDate": "2020-01-15",
      "expiryDate": "2025-01-15",
      "certificateNumber": "GC123456"
    }
  ],
  "insurance": {
    "provider": "ABC Insurance Co.",
    "policyNumber": "POL789012",
    "coverageAmount": 2000000,
    "expiryDate": "2024-12-31"
  },
  "source": "referral",
  "notes": "Reliable contractor with excellent track record",
  "tags": ["construction", "licensed", "insured"],
  "status": "active",
  "priority": "preferred"
}
```

#### 2. Get All Contractors

**GET** `/api/app/v1/contractor/get-all-contractors`

Retrieves all contractors with filtering and pagination options.

**Query Parameters:**
- `name` (optional): Filter by contractor name
- `email` (optional): Filter by email
- `type` (optional): Filter by contractor type
- `category` (optional): Filter by category
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `source` (optional): Filter by source
- `tags` (optional): Filter by tags (comma-separated)
- `sortBy` (optional): Sort field
- `sortOrder` (optional): Sort order (asc|desc)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

#### 3. Get Contractor by ID

**GET** `/api/app/v1/contractor/get-contractor-by-id`

Retrieves detailed information about a specific contractor.

**Query Parameters:**
- `contractorId` (required): Contractor ID

#### 4. Update Contractor

**PUT** `/api/app/v1/contractor/update`

Updates contractor information.

**Request Body:**
```json
{
  "contractorId": "cont-1234567890",
  "rating": 4.5,
  "totalProjects": 25,
  "completedProjects": 23,
  "onTimeDelivery": 92,
  "qualityRating": 4.3
}
```

#### 5. Update Contractor Status

**PUT** `/api/app/v1/contractor/update-status`

Updates the status of a contractor.

**Request Body:**
```json
{
  "contractorId": "cont-1234567890",
  "status": "suspended"
}
```

#### 6. Update Contractor Rating

**PUT** `/api/app/v1/contractor/update-rating`

Updates contractor performance metrics.

**Request Body:**
```json
{
  "contractorId": "cont-1234567890",
  "rating": 4.5,
  "totalProjects": 25,
  "completedProjects": 23,
  "onTimeDelivery": 92,
  "qualityRating": 4.3
}
```

#### 7. Delete Contractor

**DELETE** `/api/app/v1/contractor/delete`

Deletes a contractor record.

**Query Parameters:**
- `contractorId` (required): Contractor ID

#### 8. Search Contractors

**GET** `/api/app/v1/contractor/search`

Searches contractors across multiple fields.

**Query Parameters:**
- `searchTerm` (required): Search term (minimum 2 characters)
- `category` (optional): Filter by category
- `status` (optional): Filter by status
- `sortBy` (optional): Sort field
- `sortOrder` (optional): Sort order (asc|desc)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

#### 9. Get Contractor Statistics

**GET** `/api/app/v1/contractor/stats`

Retrieves contractor statistics and analytics.

#### 10. Get Top Rated Contractors

**GET** `/api/app/v1/contractor/top-rated`

Retrieves top-rated contractors based on performance.

**Query Parameters:**
- `category` (optional): Filter by category
- `limit` (optional): Number of contractors to return (default: 10, max: 50)

## Business Rules

### Customer Management
1. **Contractor Relationship**: Every customer must be associated with a contractor
2. **Email Uniqueness**: Customer email must be unique within the user's organization
3. **Status Flow**: Customer status can be updated through the workflow
4. **Data Validation**: All contact information and business details are validated
5. **Credit Management**: Credit limits and payment terms are tracked
6. **Document Management**: Support for multiple document types
7. **Custom Fields**: Flexible custom field system for additional data

### Contractor Management
1. **Email Uniqueness**: Contractor email must be unique within the user's organization
2. **Performance Tracking**: Automatic tracking of ratings and project metrics
3. **Certification Management**: Professional certifications with expiry tracking
4. **Insurance Tracking**: Insurance coverage and expiry date management
5. **Service Management**: Multiple services and specializations support
6. **Bank Details**: Secure storage of payment information
7. **Status Management**: Contractor status can be updated based on performance

## Error Handling

The system includes comprehensive error handling for:
- Invalid contractor ID references
- Duplicate email addresses
- Missing required fields
- Invalid data formats
- Database connection issues
- Validation errors
- Authorization failures

## Security

- All endpoints require authentication
- User-specific data isolation through `userID` field
- Input validation using Joi schemas
- Role-based access control (can be extended)
- Secure handling of sensitive information (bank details, tax IDs)

## Future Enhancements

### Customer Management
1. **Lead Management**: Advanced lead scoring and conversion tracking
2. **Customer Segmentation**: Automated customer segmentation based on behavior
3. **Communication History**: Track all customer interactions
4. **Sales Pipeline**: Integration with sales pipeline management
5. **Customer Analytics**: Advanced analytics and reporting
6. **Email Marketing**: Integration with email marketing platforms
7. **Customer Portal**: Self-service customer portal
8. **Integration APIs**: Third-party CRM integrations

### Contractor Management
1. **Project Management**: Integration with project management system
2. **Performance Analytics**: Advanced performance analytics and reporting
3. **Contract Management**: Digital contract management system
4. **Payment Processing**: Automated payment processing
5. **Resource Scheduling**: Contractor scheduling and availability
6. **Quality Assurance**: Quality control and inspection tracking
7. **Compliance Management**: Regulatory compliance tracking
8. **Mobile App**: Contractor mobile application

## Usage Examples

### Create a Customer

```bash
curl -X POST http://localhost:3000/api/app/v1/customer/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "contractorId": "cont-1234567890",
    "name": "John Doe",
    "companyName": "ABC Corporation",
    "type": "company",
    "category": "premium",
    "email": "john.doe@abccorp.com",
    "phone": "+1234567890",
    "address": {
      "street": "123 Business St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "postalCode": "10001"
    },
    "businessType": "Technology",
    "creditLimit": 50000,
    "paymentTerms": "net_30"
  }'
```

### Create a Contractor

```bash
curl -X POST http://localhost:3000/api/app/v1/contractor/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Mike Johnson",
    "companyName": "Johnson Construction Co.",
    "type": "company",
    "category": "construction",
    "email": "mike@johnsonconstruction.com",
    "phone": "+1234567890",
    "address": {
      "street": "456 Construction Ave",
      "city": "Los Angeles",
      "state": "CA",
      "country": "USA",
      "postalCode": "90210"
    },
    "contactPerson": {
      "name": "Mike Johnson",
      "position": "Owner",
      "email": "mike@johnsonconstruction.com"
    },
    "services": ["Residential Construction", "Commercial Construction"],
    "status": "active"
  }'
```

### Search Customers

```bash
curl -X GET "http://localhost:3000/api/app/v1/customer/search?searchTerm=john&status=active" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Top Rated Contractors

```bash
curl -X GET "http://localhost:3000/api/app/v1/contractor/top-rated?category=construction&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Contractor Rating

```bash
curl -X PUT http://localhost:3000/api/app/v1/contractor/update-rating \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "contractorId": "cont-1234567890",
    "rating": 4.5,
    "totalProjects": 25,
    "completedProjects": 23,
    "onTimeDelivery": 92,
    "qualityRating": 4.3
  }'
```

## Integration Points

The CRM system is designed to integrate with future modules:

1. **Quotation System**: Link customers to quotations
2. **Invoice System**: Generate invoices for customers
3. **Order Management**: Track customer orders
4. **Ledger System**: Financial tracking for customers and contractors
5. **Project Management**: Link contractors to projects
6. **Payment Processing**: Automated payment handling
7. **Reporting System**: Comprehensive reporting and analytics
8. **Communication System**: Email and SMS notifications

This CRM system provides a solid foundation for managing customer and contractor relationships with comprehensive data management, advanced search capabilities, and performance tracking features. 