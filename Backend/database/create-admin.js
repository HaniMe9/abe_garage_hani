const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

class AdminSetup {
  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'abe_garage',
      port: process.env.DB_PORT || 3306
    };
  }

  async createAdminAccount() {
    console.log('🔐 Creating admin account for Abe Garage...\n');
    
    const adminCredentials = {
      email: 'admin@abegarage.com',
      password: 'Admin123!', // Change this to a secure password
      firstName: 'System',
      lastName: 'Administrator',
      phone: '555-0000'
    };

    try {
      const connection = await mysql.createConnection(this.config);
      await connection.beginTransaction();

      // Check if admin already exists
      const [existingAdmin] = await connection.execute(
        'SELECT employee_id FROM employee WHERE employee_email = ?',
        [adminCredentials.email]
      );

      if (existingAdmin.length > 0) {
        console.log('⚠️  Admin account already exists!');
        console.log(`📧 Email: ${adminCredentials.email}`);
        console.log('🔑 Password: Use existing password or reset it');
        await connection.rollback();
        await connection.end();
        return false;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(adminCredentials.password, 10);

      // Insert into employee table
      const [employeeResult] = await connection.execute(
        'INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)',
        [adminCredentials.email, true]
      );

      const employeeId = employeeResult.insertId;

      // Insert into employee_info table
      await connection.execute(
        'INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)',
        [employeeId, adminCredentials.firstName, adminCredentials.lastName, adminCredentials.phone]
      );

      // Insert into employee_pass table
      await connection.execute(
        'INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)',
        [employeeId, hashedPassword]
      );

      // Get Admin role ID (role_id 4 is Admin based on the schema)
      const [adminRole] = await connection.execute(
        'SELECT company_role_id FROM company_roles WHERE role_name = ?',
        ['Admin']
      );

      if (adminRole.length === 0) {
        // Create Admin role if it doesn't exist
        const [roleResult] = await connection.execute(
          'INSERT INTO company_roles (role_name, role_description) VALUES (?, ?)',
          ['Admin', 'System administrator with full access']
        );
        const adminRoleId = roleResult.insertId;
        
        // Assign admin role
        await connection.execute(
          'INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)',
          [employeeId, adminRoleId]
        );
      } else {
        // Assign existing admin role
        await connection.execute(
          'INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)',
          [employeeId, adminRole[0].company_role_id]
        );
      }

      await connection.commit();
      await connection.end();

      console.log('✅ Admin account created successfully!\n');
      console.log('🔐 ADMIN CREDENTIALS:');
      console.log('=====================');
      console.log(`📧 Email: ${adminCredentials.email}`);
      console.log(`🔑 Password: ${adminCredentials.password}`);
      console.log(`👤 Name: ${adminCredentials.firstName} ${adminCredentials.lastName}`);
      console.log(`📞 Phone: ${adminCredentials.phone}`);
      console.log(`🆔 Employee ID: ${employeeId}`);
      console.log('\n⚠️  IMPORTANT: Change the default password after first login!');
      console.log('💾 Save these credentials in a secure location.\n');

      return {
        email: adminCredentials.email,
        password: adminCredentials.password,
        employeeId: employeeId
      };

    } catch (error) {
      console.error('❌ Error creating admin account:', error.message);
      return false;
    }
  }

  async resetAdminPassword(newPassword = 'Admin123!') {
    console.log('🔄 Resetting admin password...\n');
    
    try {
      const connection = await mysql.createConnection(this.config);
      
      // Find admin user
      const [admin] = await connection.execute(
        'SELECT e.employee_id FROM employee e JOIN employee_role er ON e.employee_id = er.employee_id JOIN company_roles cr ON er.company_role_id = cr.company_role_id WHERE cr.role_name = ? AND e.employee_email = ?',
        ['Admin', 'admin@abegarage.com']
      );

      if (admin.length === 0) {
        console.log('❌ Admin account not found. Please create admin account first.');
        await connection.end();
        return false;
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await connection.execute(
        'UPDATE employee_pass SET employee_password_hashed = ?, updated_at = CURRENT_TIMESTAMP WHERE employee_id = ?',
        [hashedPassword, admin[0].employee_id]
      );

      await connection.end();

      console.log('✅ Admin password reset successfully!');
      console.log(`🔑 New Password: ${newPassword}`);
      console.log('📧 Email: admin@abegarage.com\n');

      return true;
    } catch (error) {
      console.error('❌ Error resetting admin password:', error.message);
      return false;
    }
  }

  async listAllAdmins() {
    console.log('👥 Listing all admin accounts...\n');
    
    try {
      const connection = await mysql.createConnection(this.config);
      
      const [admins] = await connection.execute(`
        SELECT 
          e.employee_id,
          e.employee_email,
          ei.employee_first_name,
          ei.employee_last_name,
          ei.employee_phone,
          cr.role_name,
          e.active_employee,
          e.created_at
        FROM employee e
        JOIN employee_info ei ON e.employee_id = ei.employee_id
        JOIN employee_role er ON e.employee_id = er.employee_id
        JOIN company_roles cr ON er.company_role_id = cr.company_role_id
        WHERE cr.role_name = 'Admin'
        ORDER BY e.created_at
      `);

      if (admins.length === 0) {
        console.log('❌ No admin accounts found.');
      } else {
        console.log('📋 Admin Accounts:');
        console.log('==================');
        admins.forEach((admin, index) => {
          console.log(`${index + 1}. ${admin.employee_first_name} ${admin.employee_last_name}`);
          console.log(`   📧 Email: ${admin.employee_email}`);
          console.log(`   📞 Phone: ${admin.employee_phone}`);
          console.log(`   🆔 ID: ${admin.employee_id}`);
          console.log(`   ✅ Active: ${admin.active_employee ? 'Yes' : 'No'}`);
          console.log(`   📅 Created: ${admin.created_at}`);
          console.log('');
        });
      }

      await connection.end();
      return admins;
    } catch (error) {
      console.error('❌ Error listing admin accounts:', error.message);
      return [];
    }
  }
}

module.exports = AdminSetup;

// Run admin setup if called directly
if (require.main === module) {
  const adminSetup = new AdminSetup();
  const command = process.argv[2];

  switch (command) {
    case 'create':
      adminSetup.createAdminAccount();
      break;
    case 'reset':
      const newPassword = process.argv[3] || 'Admin123!';
      adminSetup.resetAdminPassword(newPassword);
      break;
    case 'list':
      adminSetup.listAllAdmins();
      break;
    default:
      console.log('🔧 Admin Setup Commands:');
      console.log('========================');
      console.log('node create-admin.js create  - Create new admin account');
      console.log('node create-admin.js reset   - Reset admin password');
      console.log('node create-admin.js list    - List all admin accounts');
  }
}
