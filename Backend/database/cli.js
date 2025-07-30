#!/usr/bin/env node

const DatabaseSetup = require('./setup');
const DatabaseDebugger = require('./debug');
const DatabaseMigrations = require('./migrations');
const DatabaseTester = require('./test');
const DatabaseUtils = require('./utils');
require('dotenv').config();

class DatabaseCLI {
  constructor() {
    this.commands = {
      setup: 'Run complete database setup',
      debug: 'Run database diagnostic',
      migrate: 'Run database migrations',
      test: 'Run database tests',
      health: 'Check database health',
      stats: 'Show database statistics',
      backup: 'Backup database tables',
      help: 'Show this help message'
    };
  }

  showHelp() {
    console.log('🔧 Abe Garage Database Management CLI\n');
    console.log('Available commands:');
    console.log('==================');
    
    Object.entries(this.commands).forEach(([command, description]) => {
      console.log(`  ${command.padEnd(10)} - ${description}`);
    });
    
    console.log('\nUsage:');
    console.log('  node cli.js <command>');
    console.log('  npm run db:setup');
    console.log('  npm run db:debug');
    console.log('  npm run db:test\n');
  }

  async runSetup() {
    console.log('🚀 Running complete database setup...\n');
    
    const setup = new DatabaseSetup();
    const success = await setup.runFullSetup();
    
    if (success) {
      console.log('\n🔄 Running migrations...');
      const migrations = new DatabaseMigrations();
      await migrations.runAllMigrations();
      
      console.log('\n🧪 Running tests...');
      const tester = new DatabaseTester();
      await tester.runAllTests();
    }
    
    return success;
  }

  async runDebug() {
    console.log('🔍 Running database diagnostic...\n');
    
    const debugger = new DatabaseDebugger();
    await debugger.runFullDiagnostic();
    await debugger.exportReport();
    
    return true;
  }

  async runMigrations() {
    console.log('🔄 Running database migrations...\n');
    
    const migrations = new DatabaseMigrations();
    const success = await migrations.runAllMigrations();
    
    if (success) {
      await migrations.listMigrations();
    }
    
    return success;
  }

  async runTests() {
    console.log('🧪 Running database tests...\n');
    
    const tester = new DatabaseTester();
    const success = await tester.runAllTests();
    
    const report = tester.generateTestReport();
    console.log('\n📊 Test Summary:');
    console.log(`Total Tests: ${report.totalTests}`);
    console.log(`Passed: ${report.passedTests}`);
    console.log(`Failed: ${report.failedTests}`);
    console.log(`Success Rate: ${((report.passedTests / report.totalTests) * 100).toFixed(1)}%`);
    
    return success;
  }

  async checkHealth() {
    console.log('🏥 Checking database health...\n');
    
    const health = await DatabaseUtils.healthCheck();
    
    if (health.status === 'healthy') {
      console.log('✅ Database is healthy');
      console.log(`   Timestamp: ${health.timestamp}`);
    } else {
      console.log('❌ Database is unhealthy');
      console.log(`   Error: ${health.error}`);
      console.log(`   Timestamp: ${health.timestamp}`);
    }
    
    return health.status === 'healthy';
  }

  async showStats() {
    console.log('📊 Database Statistics\n');
    
    try {
      const stats = await DatabaseUtils.getDashboardStats();
      
      console.log('📈 Overview:');
      console.log(`   Total Customers: ${stats.totalCustomers}`);
      console.log(`   Total Employees: ${stats.totalEmployees}`);
      console.log(`   Total Orders: ${stats.totalOrders}`);
      console.log(`   Active Orders: ${stats.activeOrders}`);
      console.log(`   Completed Orders: ${stats.completedOrders}`);
      console.log(`   Total Revenue: $${stats.totalRevenue.toFixed(2)}`);
      
      // Get service popularity
      const serviceStats = await require('./queries').getServicePopularity();
      console.log('\n🔧 Service Popularity:');
      serviceStats.slice(0, 5).forEach(service => {
        console.log(`   ${service.service_name}: ${service.service_count} orders`);
      });
      
      return true;
    } catch (error) {
      console.error('❌ Failed to get statistics:', error.message);
      return false;
    }
  }

  async backupTables() {
    console.log('💾 Backing up database tables...\n');
    
    try {
      const tables = [
        'customer_identifier',
        'customer_info',
        'employee',
        'employee_info',
        'orders',
        'order_info',
        'common_services'
      ];
      
      const backups = {};
      
      for (const table of tables) {
        console.log(`📦 Backing up ${table}...`);
        const backup = await DatabaseUtils.backupTable(table);
        backups[table] = backup;
      }
      
      const fs = require('fs').promises;
      const path = require('path');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(__dirname, `backup-${timestamp}.json`);
      
      await fs.writeFile(backupPath, JSON.stringify(backups, null, 2));
      console.log(`✅ Backup saved to: ${backupPath}`);
      
      return true;
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      return false;
    }
  }

  async run() {
    const command = process.argv[2];
    
    if (!command || command === 'help') {
      this.showHelp();
      return;
    }
    
    let success = false;
    
    switch (command) {
      case 'setup':
        success = await this.runSetup();
        break;
      case 'debug':
        success = await this.runDebug();
        break;
      case 'migrate':
        success = await this.runMigrations();
        break;
      case 'test':
        success = await this.runTests();
        break;
      case 'health':
        success = await this.checkHealth();
        break;
      case 'stats':
        success = await this.showStats();
        break;
      case 'backup':
        success = await this.backupTables();
        break;
      default:
        console.log(`❌ Unknown command: ${command}`);
        this.showHelp();
        process.exit(1);
    }
    
    process.exit(success ? 0 : 1);
  }
}

// Run CLI if called directly
if (require.main === module) {
  const cli = new DatabaseCLI();
  cli.run().catch(error => {
    console.error('CLI Error:', error);
    process.exit(1);
  });
}

module.exports = DatabaseCLI;
