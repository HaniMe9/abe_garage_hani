const DatabaseSetup = require('./database/setup');
const AdminInitializer = require('./database/init-admin');
const DatabaseMigrations = require('./database/migrations');
const DatabaseTester = require('./database/test');
require('dotenv').config();

class CompleteSetup {
  constructor() {
    this.steps = [
      { name: 'Database Setup', handler: this.setupDatabase.bind(this) },
      { name: 'Admin Initialization', handler: this.initializeAdmin.bind(this) },
      { name: 'Database Migrations', handler: this.runMigrations.bind(this) },
      { name: 'System Testing', handler: this.runTests.bind(this) },
      { name: 'Final Verification', handler: this.verifySetup.bind(this) }
    ];
  }

  async setupDatabase() {
    console.log('📊 Setting up database...');
    const setup = new DatabaseSetup();
    return await setup.runFullSetup();
  }

  async initializeAdmin() {
    console.log('👤 Initializing admin account...');
    const adminInit = new AdminInitializer();
    return await adminInit.runFullSetup();
  }

  async runMigrations() {
    console.log('🔄 Running database migrations...');
    const migrations = new DatabaseMigrations();
    return await migrations.runAllMigrations();
  }

  async runTests() {
    console.log('🧪 Running system tests...');
    const tester = new DatabaseTester();
    return await tester.runAllTests();
  }

  async verifySetup() {
    console.log('✅ Verifying complete setup...');
    
    try {
      const { query } = require('./config/db.config');
      
      // Verify admin account exists
      const [admin] = await query(`
        SELECT 
          e.employee_email,
          ei.employee_first_name,
          ei.employee_last_name,
          cr.role_name
        FROM employee e
        JOIN employee_info ei ON e.employee_id = ei.employee_id
        JOIN employee_role er ON e.employee_id = er.employee_id
        JOIN company_roles cr ON er.company_role_id = cr.company_role_id
        WHERE e.employee_email = 'admin@abegarage.com'
      `);

      if (!admin) {
        console.log('❌ Admin account verification failed');
        return false;
      }

      console.log('✅ Admin account verified:', admin.employee_email);
      
      // Verify database tables
      const [tables] = await query('SHOW TABLES');
      console.log(`✅ Database tables: ${tables.length} found`);
      
      // Verify sample data
      const [customers] = await query('SELECT COUNT(*) as count FROM customer_identifier');
      const [employees] = await query('SELECT COUNT(*) as count FROM employee');
      const [services] = await query('SELECT COUNT(*) as count FROM common_services');
      
      console.log(`✅ Sample data: ${customers.count} customers, ${employees.count} employees, ${services.count} services`);
      
      return true;
    } catch (error) {
      console.error('❌ Setup verification failed:', error.message);
      return false;
    }
  }

  async runCompleteSetup() {
    console.log('🚀 Starting Complete Abe Garage Setup...\n');
    console.log('==========================================\n');
    
    let allSuccessful = true;
    
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      console.log(`\n📋 Step ${i + 1}/${this.steps.length}: ${step.name}`);
      console.log('='.repeat(50));
      
      try {
        const success = await step.handler();
        if (success) {
          console.log(`✅ ${step.name} completed successfully`);
        } else {
          console.log(`❌ ${step.name} failed`);
          allSuccessful = false;
        }
      } catch (error) {
        console.error(`❌ ${step.name} error:`, error.message);
        allSuccessful = false;
      }
      
      console.log(''); // Add spacing
    }
    
    console.log('\n🎯 SETUP SUMMARY');
    console.log('================');
    
    if (allSuccessful) {
      console.log('🎉 Complete setup finished successfully!\n');
      
      console.log('🔐 ADMIN LOGIN CREDENTIALS:');
      console.log('===========================');
      console.log('📧 Email: admin@abegarage.com');
      console.log('🔑 Password: admin123');
      console.log('🎯 Role: Admin\n');
      
      console.log('🚀 NEXT STEPS:');
      console.log('===============');
      console.log('1. Start your backend server:');
      console.log('   cd Backend && npm start');
      console.log('');
      console.log('2. Test admin login:');
      console.log('   POST /api/login');
      console.log('   Body: {"employee_email": "admin@abegarage.com", "employee_password": "admin123"}');
      console.log('');
      console.log('3. Access dashboard:');
      console.log('   GET /api/dashboard');
      console.log('   Header: Authorization: Bearer <your_jwt_token>');
      console.log('');
      console.log('4. Start your frontend:');
      console.log('   cd Frontend && npm run dev');
      console.log('');
      
      console.log('📊 API ENDPOINTS:');
      console.log('=================');
      console.log('POST /api/login          - Employee login');
      console.log('GET  /api/dashboard      - Dashboard data (protected)');
      console.log('GET  /api/verify         - Token verification');
      console.log('GET  /api/admin/stats    - Admin statistics (admin only)');
      console.log('GET  /api/health         - Health check');
      console.log('');
      
    } else {
      console.log('❌ Setup completed with errors. Please check the logs above.');
    }
    
    return allSuccessful;
  }
}

// Export for use in other modules
module.exports = CompleteSetup;

// Run complete setup if called directly
if (require.main === module) {
  const setup = new CompleteSetup();
  setup.runCompleteSetup().then(success => {
    process.exit(success ? 0 : 1);
  });
}
