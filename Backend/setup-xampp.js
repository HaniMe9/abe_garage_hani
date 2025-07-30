const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

class XAMPPSetup {
  constructor() {
    // XAMPP default configuration
    this.config = {
      host: 'localhost',
      user: 'root',
      password: '', // XAMPP default has no password
      port: 3306
    };
  }

  async testConnection() {
    console.log('🔄 Testing XAMPP MySQL connection...');
    try {
      const connection = await mysql.createConnection(this.config);
      await connection.execute('SELECT 1');
      await connection.end();
      console.log('✅ XAMPP MySQL connection successful!');
      return true;
    } catch (error) {
      console.error('❌ XAMPP MySQL connection failed:', error.message);
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Make sure XAMPP is running');
      console.log('2. Start MySQL service in XAMPP Control Panel');
      console.log('3. Check if MySQL port 3306 is available');
      return false;
    }
  }

  async createDatabase() {
    console.log('🔄 Creating abe_garage database...');
    try {
      const connection = await mysql.createConnection(this.config);
      await connection.execute('CREATE DATABASE IF NOT EXISTS abe_garage');
      console.log('✅ Database abe_garage created/verified!');
      await connection.end();
      return true;
    } catch (error) {
      console.error('❌ Failed to create database:', error.message);
      return false;
    }
  }

  async importSchema() {
    console.log('🔄 Importing database schema...');
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      // Use the cleaner database schema
      const sqlPath = path.join(__dirname, '../abe_garage_database.sql');
      const sqlContent = await fs.readFile(sqlPath, 'utf8');
      
      const connection = await mysql.createConnection({
        ...this.config,
        database: 'abe_garage',
        multipleStatements: true
      });
      
      // Split and execute SQL statements
      const statements = sqlContent.split(';').filter(stmt => stmt.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await connection.execute(statement);
          } catch (error) {
            // Ignore errors for statements that might already exist
            if (!error.message.includes('already exists') && 
                !error.message.includes('Duplicate entry')) {
              console.log('⚠️  SQL Warning:', error.message);
            }
          }
        }
      }
      
      await connection.end();
      console.log('✅ Database schema imported successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to import schema:', error.message);
      return false;
    }
  }

  async createAdminAccount() {
    console.log('🔄 Creating admin account...');
    try {
      const connection = await mysql.createConnection({
        ...this.config,
        database: 'abe_garage'
      });

      // Check if admin already exists
      const [existing] = await connection.execute(
        'SELECT employee_id FROM employee WHERE employee_email = ?',
        ['admin@abegarage.com']
      );

      if (existing.length > 0) {
        console.log('✅ Admin account already exists!');
        await connection.end();
        return true;
      }

      // Create admin account
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await connection.beginTransaction();

      // Insert employee
      const [empResult] = await connection.execute(
        'INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)',
        ['admin@abegarage.com', 1]
      );
      const employeeId = empResult.insertId;

      // Insert employee info
      await connection.execute(
        'INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)',
        [employeeId, 'Admin', 'User', '555-0000']
      );

      // Insert password
      await connection.execute(
        'INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)',
        [employeeId, hashedPassword]
      );

      // Ensure Admin role exists and assign it
      let [adminRole] = await connection.execute(
        'SELECT company_role_id FROM company_roles WHERE role_name = ?',
        ['Admin']
      );

      let adminRoleId;
      if (adminRole.length === 0) {
        const [roleResult] = await connection.execute(
          'INSERT INTO company_roles (role_name, role_description) VALUES (?, ?)',
          ['Admin', 'System administrator with full access']
        );
        adminRoleId = roleResult.insertId;
      } else {
        adminRoleId = adminRole[0].company_role_id;
      }

      await connection.execute(
        'INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)',
        [employeeId, adminRoleId]
      );

      await connection.commit();
      await connection.end();

      console.log('✅ Admin account created successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to create admin account:', error.message);
      return false;
    }
  }

  async updateDemoPasswords() {
    console.log('🔄 Updating demo passwords...');
    try {
      const connection = await mysql.createConnection({
        ...this.config,
        database: 'abe_garage'
      });

      const demoAccounts = [
        { id: 1, email: 'john.doe@abegarage.com' },
        { id: 2, email: 'jane.smith@abegarage.com' },
        { id: 3, email: 'mike.wilson@abegarage.com' },
        { id: 4, email: 'sarah.jones@abegarage.com' }
      ];

      const demoPassword = await bcrypt.hash('password123', 10);

      for (const account of demoAccounts) {
        try {
          // Update or insert password
          const [existing] = await connection.execute(
            'SELECT employee_id FROM employee_pass WHERE employee_id = ?',
            [account.id]
          );

          if (existing.length > 0) {
            await connection.execute(
              'UPDATE employee_pass SET employee_password_hashed = ? WHERE employee_id = ?',
              [demoPassword, account.id]
            );
          } else {
            await connection.execute(
              'INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)',
              [account.id, demoPassword]
            );
          }
          console.log(`✅ Updated password for ${account.email}`);
        } catch (error) {
          console.log(`⚠️  Could not update ${account.email}:`, error.message);
        }
      }

      await connection.end();
      console.log('✅ Demo passwords updated!');
      return true;
    } catch (error) {
      console.error('❌ Failed to update demo passwords:', error.message);
      return false;
    }
  }

  async runCompleteSetup() {
    console.log('🚀 Starting XAMPP Abe Garage Setup...\n');
    console.log('====================================\n');

    // Step 1: Test connection
    const connectionOk = await this.testConnection();
    if (!connectionOk) {
      console.log('\n❌ Setup failed: Cannot connect to XAMPP MySQL');
      console.log('\n🔧 Please ensure:');
      console.log('1. XAMPP is installed and running');
      console.log('2. MySQL service is started in XAMPP Control Panel');
      console.log('3. MySQL is running on port 3306');
      return false;
    }

    // Step 2: Create database
    const dbCreated = await this.createDatabase();
    if (!dbCreated) {
      console.log('\n❌ Setup failed: Cannot create database');
      return false;
    }

    // Step 3: Import schema
    const schemaImported = await this.importSchema();
    if (!schemaImported) {
      console.log('\n❌ Setup failed: Cannot import schema');
      return false;
    }

    // Step 4: Create admin
    const adminCreated = await this.createAdminAccount();
    if (!adminCreated) {
      console.log('\n❌ Setup failed: Cannot create admin account');
      return false;
    }

    // Step 5: Update demo passwords
    await this.updateDemoPasswords();

    console.log('\n🎉 XAMPP Setup Completed Successfully!\n');
    console.log('🔐 ADMIN LOGIN CREDENTIALS:');
    console.log('===========================');
    console.log('📧 Email: admin@abegarage.com');
    console.log('🔑 Password: admin123');
    console.log('🎯 Role: Admin\n');

    console.log('📋 DEMO ACCOUNTS:');
    console.log('=================');
    console.log('📧 john.doe@abegarage.com | 🔑 password123 (Manager)');
    console.log('📧 jane.smith@abegarage.com | 🔑 password123 (Mechanic)');
    console.log('📧 mike.wilson@abegarage.com | 🔑 password123 (Mechanic)');
    console.log('📧 sarah.jones@abegarage.com | 🔑 password123 (Receptionist)\n');

    console.log('🚀 NEXT STEPS:');
    console.log('===============');
    console.log('1. Update your .env file with XAMPP settings:');
    console.log('   DB_USER=root');
    console.log('   DB_PASS=');
    console.log('   DB_HOST=localhost');
    console.log('   DB_NAME=abe_garage');
    console.log('');
    console.log('2. Start your backend server:');
    console.log('   npm start');
    console.log('');
    console.log('3. Test admin login:');
    console.log('   POST http://localhost:5000/api/login');
    console.log('   Body: {"employee_email": "admin@abegarage.com", "employee_password": "admin123"}');
    console.log('');

    return true;
  }
}

// Export for use in other modules
module.exports = XAMPPSetup;

// Run setup if called directly
if (require.main === module) {
  const setup = new XAMPPSetup();
  setup.runCompleteSetup().then(success => {
    process.exit(success ? 0 : 1);
  });
}
