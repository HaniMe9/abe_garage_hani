# 🔐 Abe Garage Admin Credentials

## Default Admin Account

**Email:** `admin@abegarage.com`  
**Password:** `Admin123!`  
**Role:** System Administrator  
**Full Access:** Yes  

## Existing Sample Employees (from database)

### 1. John Doe - Manager
- **Email:** `john.doe@abegarage.com`
- **Role:** Manager
- **Phone:** 555-0101
- **Employee ID:** 1

### 2. Jane Smith - Mechanic
- **Email:** `jane.smith@abegarage.com`
- **Role:** Mechanic
- **Phone:** 555-0102
- **Employee ID:** 2

### 3. Mike Wilson - Mechanic
- **Email:** `mike.wilson@abegarage.com`
- **Role:** Mechanic
- **Phone:** 555-0103
- **Employee ID:** 3

### 4. Sarah Jones - Receptionist
- **Email:** `sarah.jones@abegarage.com`
- **Role:** Receptionist
- **Phone:** 555-0104
- **Employee ID:** 4

## Company Roles

1. **Manager** - Garage manager with full access to all operations
2. **Mechanic** - Certified mechanic responsible for vehicle repairs
3. **Receptionist** - Front desk staff handling customer service
4. **Admin** - System administrator with full access

## Default Passwords

⚠️ **IMPORTANT:** All sample accounts use placeholder passwords:
- Sample employees: `$2b$10$hashedpassword1`, `$2b$10$hashedpassword2`, etc.
- These are **NOT real passwords** and need to be properly set up

## How to Create/Reset Admin Account

### Create Admin Account
```bash
cd Backend/database
node create-admin.js create
```

### Reset Admin Password
```bash
cd Backend/database
node create-admin.js reset [new_password]
```

### List All Admin Accounts
```bash
cd Backend/database
node create-admin.js list
```

## Database Setup Commands

### Complete Database Setup
```bash
cd Backend/database
node setup.js
```

### Run Database Diagnostics
```bash
cd Backend/database
node debug.js
```

### Run Database Tests
```bash
cd Backend/database
node test.js
```

### Database CLI Tool
```bash
cd Backend/database
node cli.js setup    # Complete setup
node cli.js debug    # Run diagnostics
node cli.js test     # Run tests
node cli.js health   # Check health
node cli.js stats    # Show statistics
```

## Environment Configuration

Make sure your `.env` file contains:

```env
# Database Configuration
DB_USER=root
DB_PASS=your_mysql_password
DB_HOST=localhost
DB_NAME=abe_garage
DB_PORT=3306

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## Security Notes

1. **Change default passwords** immediately after setup
2. **Use strong passwords** for production
3. **Enable HTTPS** in production
4. **Regularly backup** the database
5. **Monitor access logs** for security

## Troubleshooting

### Database Connection Issues
1. Ensure XAMPP MySQL is running
2. Check database credentials in `.env`
3. Verify database `abe_garage` exists
4. Run `node debug.js` for diagnostics

### Login Issues
1. Verify admin account exists: `node create-admin.js list`
2. Reset password if needed: `node create-admin.js reset`
3. Check employee role assignments
4. Verify JWT secret is configured

## Quick Start

1. **Start XAMPP** and ensure MySQL is running
2. **Create admin account:** `node create-admin.js create`
3. **Run database setup:** `node setup.js`
4. **Test everything:** `node test.js`
5. **Login with:** `admin@abegarage.com` / `Admin123!`

---

**Last Updated:** $(date)  
**Database:** abe_garage  
**System:** Abe Garage Management System
