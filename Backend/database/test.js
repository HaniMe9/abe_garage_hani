const mysql = require('mysql2/promise');
const DatabaseUtils = require('./utils');
const DatabaseQueries = require('./queries');
require('dotenv').config();

class DatabaseTester {
  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'abe_garage',
      port: process.env.DB_PORT || 3306
    };
    this.testResults = [];
  }

  async runTest(testName, testFunction) {
    console.log(`🧪 Running test: ${testName}`);
    const startTime = Date.now();
    
    try {
      await testFunction();
      const duration = Date.now() - startTime;
      this.testResults.push({
        name: testName,
        status: 'PASSED',
        duration: `${duration}ms`,
        error: null
      });
      console.log(`✅ ${testName} - PASSED (${duration}ms)`);
      return true;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.testResults.push({
        name: testName,
        status: 'FAILED',
        duration: `${duration}ms`,
        error: error.message
      });
      console.log(`❌ ${testName} - FAILED (${duration}ms): ${error.message}`);
      return false;
    }
  }

  async testConnection() {
    await this.runTest('Database Connection', async () => {
      const connection = await mysql.createConnection(this.config);
      const [result] = await connection.execute('SELECT 1 as test');
      await connection.end();
      
      if (result[0].test !== 1) {
        throw new Error('Connection test failed');
      }
    });
  }

  async testTableStructure() {
    await this.runTest('Table Structure', async () => {
      const connection = await mysql.createConnection(this.config);
      
      const expectedTables = [
        'common_services',
        'company_roles', 
        'customer_identifier',
        'customer_info',
        'customer_vehicle_info',
        'employee',
        'employee_info',
        'employee_pass',
        'employee_role',
        'orders',
        'order_info',
        'order_services',
        'order_status'
      ];

      const [tables] = await connection.execute('SHOW TABLES');
      const existingTables = tables.map(row => Object.values(row)[0]);
      
      for (const expectedTable of expectedTables) {
        if (!existingTables.includes(expectedTable)) {
          throw new Error(`Missing table: ${expectedTable}`);
        }
      }
      
      await connection.end();
    });
  }

  async testCRUDOperations() {
    await this.runTest('CRUD Operations', async () => {
      // Test customer creation
      const testCustomer = {
        email: 'test@example.com',
        phone: '555-0123',
        hash: 'test_hash',
        password: 'hashed_password',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User'
      };

      const customerId = await DatabaseQueries.createCustomer(testCustomer);
      if (!customerId) {
        throw new Error('Failed to create customer');
      }

      // Test customer retrieval
      const customer = await DatabaseUtils.getCustomerWithVehicles(customerId);
      if (!customer || customer.length === 0) {
        throw new Error('Failed to retrieve customer');
      }

      // Test customer update
      const updateResult = await DatabaseQueries.updateCustomer(customerId, {
        firstName: 'Updated',
        lastName: 'Name'
      });
      if (!updateResult) {
        throw new Error('Failed to update customer');
      }

      // Test customer deletion
      const deleteResult = await DatabaseUtils.delete('customer_identifier', 'customer_id', customerId);
      if (deleteResult === 0) {
        throw new Error('Failed to delete customer');
      }
    });
  }

  async testEmployeeOperations() {
    await this.runTest('Employee Operations', async () => {
      const testEmployee = {
        email: 'employee@test.com',
        phone: '555-0124',
        firstName: 'Test',
        lastName: 'Employee',
        hashedPassword: 'hashed_password',
        roleId: 1
      };

      const employeeId = await DatabaseQueries.createEmployee(testEmployee);
      if (!employeeId) {
        throw new Error('Failed to create employee');
      }

      const employee = await DatabaseUtils.getEmployeeWithRole(employeeId);
      if (!employee || employee.length === 0) {
        throw new Error('Failed to retrieve employee');
      }

      // Cleanup
      await DatabaseUtils.delete('employee', 'employee_id', employeeId);
    });
  }

  async testVehicleOperations() {
    await this.runTest('Vehicle Operations', async () => {
      // First create a customer
      const testCustomer = {
        email: 'vehicle_test@example.com',
        phone: '555-0125',
        hash: 'test_hash',
        password: 'hashed_password',
        username: 'vehicletestuser',
        firstName: 'Vehicle',
        lastName: 'Test'
      };

      const customerId = await DatabaseQueries.createCustomer(testCustomer);

      const testVehicle = {
        customerId: customerId,
        year: 2020,
        make: 'Toyota',
        model: 'Camry',
        type: 'Sedan',
        mileage: 50000,
        tag: 'TEST123',
        serial: 'TEST123456789',
        color: 'Blue'
      };

      const vehicleId = await DatabaseQueries.addVehicle(testVehicle);
      if (!vehicleId) {
        throw new Error('Failed to create vehicle');
      }

      const updateResult = await DatabaseQueries.updateVehicle(vehicleId, {
        vehicle_mileage: 55000
      });
      if (updateResult === 0) {
        throw new Error('Failed to update vehicle');
      }

      // Cleanup
      await DatabaseUtils.delete('customer_identifier', 'customer_id', customerId);
    });
  }

  async testOrderOperations() {
    await this.runTest('Order Operations', async () => {
      // Create test data
      const testCustomer = {
        email: 'order_test@example.com',
        phone: '555-0126',
        hash: 'test_hash',
        password: 'hashed_password',
        username: 'ordertestuser',
        firstName: 'Order',
        lastName: 'Test'
      };

      const customerId = await DatabaseQueries.createCustomer(testCustomer);

      const testVehicle = {
        customerId: customerId,
        year: 2019,
        make: 'Honda',
        model: 'Civic',
        type: 'Sedan',
        mileage: 40000,
        tag: 'ORDER123',
        serial: 'ORDER123456789',
        color: 'Red'
      };

      const vehicleId = await DatabaseQueries.addVehicle(testVehicle);

      // Get an employee for the order
      const employees = await DatabaseUtils.findAll('employee', {}, 'employee_id LIMIT 1');
      if (employees.length === 0) {
        throw new Error('No employees found for order test');
      }

      const testOrder = {
        employeeId: employees[0].employee_id,
        customerId: customerId,
        vehicleId: vehicleId,
        orderHash: 'test_order_hash',
        totalPrice: 150.00,
        additionalRequest: 'Test order',
        services: [1, 2] // Oil change and brake service
      };

      const orderId = await DatabaseQueries.createOrder(testOrder);
      if (!orderId) {
        throw new Error('Failed to create order');
      }

      const orderDetails = await DatabaseUtils.getOrderDetails(orderId);
      if (!orderDetails || orderDetails.length === 0) {
        throw new Error('Failed to retrieve order details');
      }

      const orderServices = await DatabaseUtils.getOrderServices(orderId);
      if (!orderServices || orderServices.length !== 2) {
        throw new Error('Failed to retrieve order services');
      }

      // Test order completion
      const completionResult = await DatabaseQueries.completeOrder(orderId, {
        totalPrice: 175.00,
        notes: 'Order completed successfully'
      });
      if (!completionResult) {
        throw new Error('Failed to complete order');
      }

      // Cleanup
      await DatabaseUtils.delete('customer_identifier', 'customer_id', customerId);
    });
  }

  async testDashboardStats() {
    await this.runTest('Dashboard Statistics', async () => {
      const stats = await DatabaseUtils.getDashboardStats();
      
      if (typeof stats.totalCustomers !== 'number' ||
          typeof stats.totalEmployees !== 'number' ||
          typeof stats.totalOrders !== 'number' ||
          typeof stats.activeOrders !== 'number' ||
          typeof stats.completedOrders !== 'number' ||
          typeof stats.totalRevenue !== 'number') {
        throw new Error('Invalid dashboard statistics format');
      }
    });
  }

  async testSearchFunctionality() {
    await this.runTest('Search Functionality', async () => {
      // Test customer search
      const customers = await DatabaseQueries.searchCustomers('test');
      if (!Array.isArray(customers)) {
        throw new Error('Customer search should return an array');
      }

      // Test service popularity
      const serviceStats = await DatabaseQueries.getServicePopularity();
      if (!Array.isArray(serviceStats)) {
        throw new Error('Service popularity should return an array');
      }
    });
  }

  async testDataIntegrity() {
    await this.runTest('Data Integrity', async () => {
      const connection = await mysql.createConnection(this.config);
      
      // Test foreign key constraints
      const integrityChecks = [
        {
          name: 'Customer Info Integrity',
          query: `SELECT COUNT(*) as count FROM customer_info ci 
                   LEFT JOIN customer_identifier cid ON ci.customer_id = cid.customer_id 
                   WHERE cid.customer_id IS NULL`
        },
        {
          name: 'Employee Info Integrity',
          query: `SELECT COUNT(*) as count FROM employee_info ei 
                   LEFT JOIN employee e ON ei.employee_id = e.employee_id 
                   WHERE e.employee_id IS NULL`
        }
      ];

      for (const check of integrityChecks) {
        try {
          const [result] = await connection.execute(check.query);
          const count = result[0].count;
          if (count > 0) {
            throw new Error(`${check.name}: Found ${count} orphaned records`);
          }
        } catch (error) {
          if (!error.message.includes('doesn\'t exist')) {
            throw error;
          }
        }
      }
      
      await connection.end();
    });
  }

  async testPerformance() {
    await this.runTest('Performance Test', async () => {
      const startTime = Date.now();
      
      // Run multiple queries to test performance
      const promises = [
        DatabaseUtils.findAll('customer_identifier'),
        DatabaseUtils.findAll('employee'),
        DatabaseUtils.findAll('common_services'),
        DatabaseUtils.getDashboardStats(),
        DatabaseQueries.getServicePopularity()
      ];

      await Promise.all(promises);
      
      const duration = Date.now() - startTime;
      if (duration > 5000) { // 5 seconds
        throw new Error(`Performance test took too long: ${duration}ms`);
      }
    });
  }

  async runAllTests() {
    console.log('🚀 Starting comprehensive database tests...\n');
    
    const tests = [
      () => this.testConnection(),
      () => this.testTableStructure(),
      () => this.testCRUDOperations(),
      () => this.testEmployeeOperations(),
      () => this.testVehicleOperations(),
      () => this.testOrderOperations(),
      () => this.testDashboardStats(),
      () => this.testSearchFunctionality(),
      () => this.testDataIntegrity(),
      () => this.testPerformance()
    ];

    let passedTests = 0;
    let failedTests = 0;

    for (const test of tests) {
      const result = await test();
      if (result) {
        passedTests++;
      } else {
        failedTests++;
      }
    }

    console.log('\n📊 TEST RESULTS');
    console.log('===============');
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);

    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(result => result.status === 'FAILED')
        .forEach(result => {
          console.log(`   ${result.name}: ${result.error}`);
        });
    }

    return failedTests === 0;
  }

  generateTestReport() {
    const report = {
      timestamp: new Date().toISOString(),
      database: this.config.database,
      totalTests: this.testResults.length,
      passedTests: this.testResults.filter(r => r.status === 'PASSED').length,
      failedTests: this.testResults.filter(r => r.status === 'FAILED').length,
      results: this.testResults
    };

    return report;
  }
}

module.exports = DatabaseTester;

// Run tests if called directly
if (require.main === module) {
  const tester = new DatabaseTester();
  tester.runAllTests().then(success => {
    const report = tester.generateTestReport();
    console.log('\n📄 Test report generated');
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}
