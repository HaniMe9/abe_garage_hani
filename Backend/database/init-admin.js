const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

class AdminInitializer {
  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'abe_garage',
      port: process.env.DB_PORT || 3306
    };
  }

  async initializeAdminAccount() {
    console.log('🔐 Initializing Admin Account for Abe Garage...\n');
    
    try {
      const connection = await mysql.createConnection(this.config);
      
      // Admin credentials
      const adminData = {
        email: 'admin@abegarage.com',
        password: 'admin123', // Simple password for demo
        firstName: 'Admin',
        lastName: 'User',
        phone: '555-0000'
      };

      // Check if admin already exists
      const [existingAdmin] = await connection.execute(
        'SELECT employee_id FROM employee WHERE employee_email = ?',
        [adminData.email]
      );

      if (existingAdmin.length > 0) {
        console.log('⚠️  Admin account already exists!');
        console.log(`📧 Email: ${adminData.email}`);
        console.log('🔑 Password: admin123');
        await connection.end();
        return true;
      }

      await connection.beginTransaction();

      // Hash the password properly
      const hashedPassword = await bcrypt.hash(adminData.password, 10);

      // 1. Insert into employee table
      const [employeeResult] = await connection.execute(
        'INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)',
        [adminData.email, 1]
      );
      const employeeId = employeeResult.insertId;

      // 2. Insert into employee_info table
      await connection.execute(
        'INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)',
        [employeeId, adminData.firstName, adminData.lastName, adminData.phone]
      );

      // 3. Insert into employee_pass table
      await connection.execute(
        'INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)',
        [employeeId, hashedPassword]
      );

      // 4. Ensure Admin role exists
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

      // 5. Assign admin role
      await connection.execute(
        'INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)',
        [employeeId, adminRoleId]
      );

      await connection.commit();
      await connection.end();

      console.log('✅ Admin account created successfully!\n');
      console.log('🔐 ADMIN LOGIN CREDENTIALS:');
      console.log('===========================');
      console.log(`📧 Email: ${adminData.email}`);
      console.log(`🔑 Password: ${adminData.password}`);
      console.log(`👤 Name: ${adminData.firstName} ${adminData.lastName}`);
      console.log(`🆔 Employee ID: ${employeeId}`);
      console.log(`🎯 Role: Admin\n`);

      return true;
    } catch (error) {
      console.error('❌ Error initializing admin account:', error.message);
      return false;
    }
  }

  async updateExistingPasswords() {
    console.log('🔄 Updating existing employee passwords for demo...\n');
    
    try {
      const connection = await mysql.createConnection(this.config);
      
      // Demo passwords for existing employees
      const demoPasswords = [
        { id: 1, email: 'john.doe@abegarage.com', password: 'password123' },
        { id: 2, email: 'jane.smith@abegarage.com', password: 'password123' },
        { id: 3, email: 'mike.wilson@abegarage.com', password: 'password123' },
        { id: 4, email: 'sarah.jones@abegarage.com', password: 'password123' }
      ];

      for (const emp of demoPasswords) {
        const hashedPassword = await bcrypt.hash(emp.password, 10);
        
        // Update or insert password
        const [existing] = await connection.execute(
          'SELECT employee_id FROM employee_pass WHERE employee_id = ?',
          [emp.id]
        );

        if (existing.length > 0) {
          await connection.execute(
            'UPDATE employee_pass SET employee_password_hashed = ? WHERE employee_id = ?',
            [hashedPassword, emp.id]
          );
        } else {
          await connection.execute(
            'INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)',
            [emp.id, hashedPassword]
          );
        }
        
        console.log(`✅ Updated password for ${emp.email}`);
      }

      await connection.end();
      console.log('\n✅ All demo passwords updated!\n');
      
      console.log('📋 DEMO LOGIN CREDENTIALS:');
      console.log('==========================');
      demoPasswords.forEach(emp => {
        console.log(`📧 ${emp.email} | 🔑 ${emp.password}`);
      });
      console.log('');

      return true;
    } catch (error) {
      console.error('❌ Error updating passwords:', error.message);
      return false;
    }
  }

  async runFullSetup() {
    console.log('🚀 Starting Complete Admin Setup...\n');
    
    const adminCreated = await this.initializeAdminAccount();
    if (!adminCreated) {
      console.log('❌ Admin setup failed');
      return false;
    }

    const passwordsUpdated = await this.updateExistingPasswords();
    if (!passwordsUpdated) {
      console.log('⚠️  Password update failed, but admin account is ready');
    }

    console.log('🎉 Admin setup completed successfully!');
    console.log('\n📝 QUICK START:');
    console.log('===============');
    console.log('1. Start your backend server: npm start');
    console.log('2. Login with: admin@abegarage.com / admin123');
    console.log('3. Access dashboard at: /api/dashboard');
    console.log('4. Use JWT token in Authorization header\n');

    return true;
  }
}

// Export for use in other modules
module.exports = AdminInitializer;

// Run setup if called directly
if (require.main === module) {
  const initializer = new AdminInitializer();
  initializer.runFullSetup().then(success => {
    process.exit(success ? 0 : 1);
  });
}
