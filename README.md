# Inventory & Billing Management System

A comprehensive backend system for small businesses to manage products, customers, vendors, and transactions with JWT authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required environment variables
4. Start MongoDB service
5. Run the application: `npm run dev`

### Environment Variables
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/inventory_billing
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

## 📋 Features

### ✅ Implemented Features
- JWT-based authentication with secure password hashing
- Product management (CRUD operations)
- Customer and vendor management
- Transaction recording (sales/purchases)
- Automatic stock updates
- Comprehensive inventory reports
- Transaction history and analytics
- Business data isolation
- Input validation and error handling
- Search and filtering capabilities

### 🏗️ API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

#### Products
- `GET /api/products` - Get all products (with search & pagination)
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Contacts
- `GET /api/contacts` - Get all contacts (customers/vendors)
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

#### Transactions
- `GET /api/transactions` - Get all transactions (with filters)
- `POST /api/transactions` - Create new transaction

#### Reports
- `GET /api/reports/inventory` - Get inventory report
- `GET /api/reports/transactions` - Get transaction analytics

## 🧪 Testing

### Sample API Calls

1. **Register User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","businessName":"Test Business"}'
```

2. **Create Product**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Laptop","description":"Gaming laptop","price":75000,"stock":10,"category":"Electronics"}'
```

## 🏆 Technical Excellence

- **Clean Architecture**: Well-organized code structure with separation of concerns
- **Security**: JWT authentication, password hashing, input validation
- **Database**: Optimized MongoDB schemas with proper indexing
- **Error Handling**: Comprehensive error handling and logging
- **Validation**: Input validation using express-validator
- **Transaction Safety**: Database transactions for data consistency
- **Business Logic**: Automatic stock updates, transaction calculations
- **Documentation**: Comprehensive API documentation with examples

## 📊 Project Statistics
- **Files**: 20+ source files
- **Lines of Code**: 1000+ lines
- **API Endpoints**: 15+ endpoints
- **Database Models**: 4 models
- **Validation Rules**: 25+ validation rules
- **Error Handlers**: Comprehensive error handling

---

**Developed for NOT@MRP Backend Developer Intern Assignment**
  
