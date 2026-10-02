# Vendor Module

## Overview

The Vendor Module is a comprehensive CRM component designed to manage vendor relationships, track vendor performance, and maintain vendor information within the Staffly backend system. This module follows the same architectural patterns as other CRM modules (Customer, Contractor) and provides a complete set of CRUD operations, search capabilities, and analytics.

## Features

### Core Features
- **Vendor Management**: Complete CRUD operations for vendor records
- **Vendor Classification**: Categorize vendors by type (supplier, service_provider, manufacturer, distributor, wholesaler)
- **Performance Tracking**: Track vendor ratings, total orders, and total spent
- **Status Management**: Manage vendor status (active, inactive, suspended, blacklisted)
- **Priority Management**: Set vendor priority levels (low, medium, high, critical)
- **Search & Filtering**: Advanced search capabilities with multiple filter options
- **Analytics**: Comprehensive vendor statistics and reporting

### Vendor-Specific Features
- **Services & Products**: Track services and products offered by vendors
- **Certifications**: Manage vendor certifications and credentials
- **Contact Person**: Detailed contact person information
- **Document Management**: Store and manage vendor-related documents
- **Social Media Integration**: Track vendor social media presence
- **Custom Fields**: Extensible custom field system for additional data

## API Endpoints

### Vendor Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/app/v1/vendor/create` | Create a new vendor |
| GET | `/api/app/v1/vendor/get-all-vendors` | Get all vendors with filtering |
| GET | `/api/app/v1/vendor/get-vendor-by-id/:vendorId` | Get vendor by ID |
| GET | `/api/app/v1/vendor/get-vendors-by-contractor/:contractorId` | Get vendors by contractor |
| PUT | `/api/app/v1/vendor/update/:vendorId` | Update vendor information |
| PUT | `/api/app/v1/vendor/update-status/:vendorId` | Update vendor status |
| PUT | `/api/app/v1/vendor/update-rating/:vendorId` | Update vendor rating |
| DELETE | `/api/app/v1/vendor/delete/:vendorId` | Delete vendor |

### Search & Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/app/v1/vendor/search` | Search vendors with advanced filters |
| GET | `/api/app/v1/vendor/stats` | Get vendor statistics |
| GET | `/api/app/v1/vendor/top-rated` | Get top rated vendors |

## Data Models

### Vendor Schema

```javascript
{
  vendorId: String,                    // Unique vendor identifier
  contractorId: String,                // Associated contractor
  name: String,                        // Vendor name
  companyName: String,                 // Company name
  type: String,                        // individual, company, organization
  category: String,                    // supplier, service_provider, manufacturer, distributor, wholesaler
  email: String,                       // Primary email
  phone: String,                       // Primary phone
  alternatePhone: String,              // Alternate phone
  website: String,                     // Website URL
  address: {                           // Address object
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  businessType: String,                // Type of business
  industry: String,                    // Industry classification
  taxId: String,                       // Tax identification number
  registrationNumber: String,          // Business registration number
  creditLimit: Number,                 // Credit limit amount
  paymentTerms: String,                // Payment terms (immediate, net_7, net_15, net_30, net_45, net_60)
  currency: String,                    // Currency code
  contactPerson: {                     // Contact person details
    name: String,
    position: String,
    email: String,
    phone: String
  },
  services: [String],                  // Array of services offered
  products: [String],                  // Array of products offered
  certifications: [String],            // Array of certifications
  rating: Number,                      // Vendor rating (0-5)
  totalOrders: Number,                 // Total number of orders
  totalSpent: Number,                  // Total amount spent with vendor
  source: String,                      // Source of vendor (referral, website, exhibition, etc.)
  notes: String,                       // Additional notes
  tags: [String],                      // Tags for categorization
  status: String,                      // active, inactive, suspended, blacklisted
  priority: String,                    // low, medium, high, critical
  preferredContactMethod: String,      // email, phone, sms, whatsapp
  socialMedia: {                       // Social media links
    linkedin: String,
    facebook: String,
    twitter: String,
    instagram: String
  },
  documents: [{                        // Array of documents
    name: String,
    file: String,
    type: String,                      // contract, license, certificate, insurance, tax_document, other
    uploadedAt: Date
  }],
  customFields: [{                     // Array of custom fields
    key: String,
    value: String,
    type: String                       // text, number, date, boolean
  }],
  createdBy: String,                   // User who created the vendor
  updatedBy: String,                   // User who last updated the vendor
  createdAt: Date,                     // Creation timestamp
  updatedAt: Date                      // Last update timestamp
}
```

## Usage Examples

### Creating a Vendor

```javascript
// POST /api/app/v1/vendor/create
{
  "contractorId": "cont-123456789",
  "name": "ABC Supplies",
  "companyName": "ABC Supplies Inc.",
  "type": "company",
  "category": "supplier",
  "email": "contact@abcsupplies.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Business St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10001"
  },
  "businessType": "Wholesale",
  "industry": "Manufacturing",
  "services": ["Raw Materials", "Equipment"],
  "products": ["Steel", "Aluminum", "Machinery"],
  "paymentTerms": "net_30",
  "currency": "USD",
  "contactPerson": {
    "name": "John Doe",
    "position": "Sales Manager",
    "email": "john@abcsupplies.com",
    "phone": "+1234567891"
  }
}
```

### Updating Vendor Rating

```javascript
// PUT /api/app/v1/vendor/update-rating/vend-123456789
{
  "rating": 4.5
}
```

### Searching Vendors

```javascript
// GET /api/app/v1/vendor/search?searchTerm=supplies&category=supplier&status=active
```

### Getting Vendor Statistics

```javascript
// GET /api/app/v1/vendor/stats?contractorId=cont-123456789
```

## Status Values

### Vendor Status
- `active`: Vendor is currently active and available
- `inactive`: Vendor is temporarily inactive
- `suspended`: Vendor is suspended due to issues
- `blacklisted`: Vendor is blacklisted and should not be used

### Vendor Priority
- `low`: Low priority vendor
- `medium`: Medium priority vendor (default)
- `high`: High priority vendor
- `critical`: Critical priority vendor

### Vendor Categories
- `supplier`: General supplier
- `service_provider`: Service provider
- `manufacturer`: Product manufacturer
- `distributor`: Product distributor
- `wholesaler`: Wholesale supplier

### Payment Terms
- `immediate`: Payment due immediately
- `net_7`: Payment due in 7 days
- `net_15`: Payment due in 15 days
- `net_30`: Payment due in 30 days (default)
- `net_45`: Payment due in 45 days
- `net_60`: Payment due in 60 days

## Error Handling

The module follows the standard error handling patterns:

- **400 Bad Request**: Invalid input data or validation errors
- **404 Not Found**: Vendor not found
- **500 Internal Server Error**: Server-side errors

All errors include descriptive messages and appropriate HTTP status codes.

## Security Considerations

- All endpoints require authentication
- Vendor data is scoped to the authenticated user
- Input validation is performed on all endpoints
- Sensitive vendor information is protected

## Dependencies

- **MongoDB/Mongoose**: Database operations
- **Joi**: Input validation
- **Express.js**: HTTP routing
- **UUID**: Unique identifier generation

## Integration

The Vendor Module integrates with:
- **Contractor Module**: Vendors are associated with contractors
- **Finance Module**: Can be extended to integrate with purchase orders and invoices
- **File Handler Module**: For document uploads and management

## Future Enhancements

- Integration with purchase order system
- Vendor performance analytics dashboard
- Automated vendor rating calculations
- Vendor communication history
- Vendor contract management
- Vendor payment tracking 