const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

class DatabaseDebugger {
  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'abe_garage',
      port: process.env.DB_PORT || 3306
    };
    this.issues = [];
    this.fixes = [];
  }

  async runFullDiagnostic() {
    console.log('🔍 Starting comprehensive database diagnostic...\n');
    
    await this.checkConnection();
    await this.checkDatabase();
    await this.checkTables();
    await this.checkConstraints();
    await this.checkIndexes();
    await this.checkDataIntegrity();
    await this.checkPerformance();
    
    this.generateReport();
    await this.applyFixes();
    
    console.log('\n✅ Database diagnostic completed!');
  }

  async checkConnection() {
    console.log('🔄 Checking database connection...');
    try {
      const connection = await mysql.createConnection(this.config);
      await connection.execute('SELECT 1');
      await connection.end();
      console.log('✅ Database connection successful');
    } catch (error) {
      this.issues.push({
        type: 'CONNECTION',
        severity: 'CRITICAL',
        message: `Database connection failed: ${error.message}`,
        fix: 'Check XAMPP server status and database credentials'
      });
      console.log('❌ Database connection failed:', error.message);
    }
  }

  async checkDatabase() {
    console.log('🔄 Checking database existence and configuration...');
    try {
      const connection = await mysql.createConnection({
        host: this.config.host,
        user: this.config.user,
        password: this.config.password,
        port: this.config.port
      });

      // Check if database exists
      const [databases] = await connection.execute('SHOW DATABASES LIKE ?', [this.config.database]);
      if (databases.length === 0) {
        this.issues.push({
          type: 'DATABASE',
          severity: 'CRITICAL',
          message: `Database '${this.config.database}' does not exist`,
          fix: `CREATE DATABASE \`${this.config.database}\``
        });
        this.fixes.push(`CREATE DATABASE IF NOT EXISTS \`${this.config.database}\``);
      } else {
        console.log('✅ Database exists');
      }

      await connection.end();
    } catch (error) {
      this.issues.push({
        type: 'DATABASE',
        severity: 'CRITICAL',
        message: `Database check failed: ${error.message}`,
        fix: 'Verify MySQL server is running'
      });
    }
  }

  async checkTables() {
    console.log('🔄 Checking table structure...');
    try {
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
      
      const missingTables = expectedTables.filter(table => !existingTables.includes(table));
      
      if (missingTables.length > 0) {
        this.issues.push({
          type: 'TABLES',
          severity: 'HIGH',
          message: `Missing tables: ${missingTables.join(', ')}`,
          fix: 'Import the complete database schema'
        });
      } else {
        console.log('✅ All required tables exist');
      }

      // Check for extra tables
      const extraTables = existingTables.filter(table => !expectedTables.includes(table));
      if (extraTables.length > 0) {
        console.log(`ℹ️  Additional tables found: ${extraTables.join(', ')}`);
      }

      await connection.end();
    } catch (error) {
      this.issues.push({
        type: 'TABLES',
        severity: 'HIGH',
        message: `Table check failed: ${error.message}`,
        fix: 'Verify database schema'
      });
    }
  }

  async checkConstraints() {
    console.log('🔄 Checking foreign key constraints...');
    try {
      const connection = await mysql.createConnection(this.config);
      
      const [constraints] = await connection.execute(`
        SELECT 
          CONSTRAINT_NAME,
          TABLE_NAME,
          COLUMN_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE REFERENCED_TABLE_SCHEMA = ? 
        AND REFERENCED_TABLE_NAME IS NOT NULL
      `, [this.config.database]);

      if (constraints.length === 0) {
        this.issues.push({
          type: 'CONSTRAINTS',
          severity: 'MEDIUM',
          message: 'No foreign key constraints found',
          fix: 'Add foreign key constraints for data integrity'
        });
      } else {
        console.log(`✅ Found ${constraints.length} foreign key constraints`);
      }

      await connection.end();
    } catch (error) {
      this.issues.push({
        type: 'CONSTRAINTS',
        severity: 'MEDIUM',
        message: `Constraint check failed: ${error.message}`,
        fix: 'Review database schema constraints'
      });
    }
  }

  async checkIndexes() {
    console.log('🔄 Checking database indexes...');
    try {
      const connection = await mysql.createConnection(this.config);
      
      const [indexes] = await connection.execute(`
        SELECT 
          TABLE_NAME,
          INDEX_NAME,
          COLUMN_NAME,
          NON_UNIQUE
        FROM information_schema.STATISTICS 
        WHERE TABLE_SCHEMA = ?
        ORDER BY TABLE_NAME, INDEX_NAME
      `, [this.config.database]);

      const indexCount = indexes.length;
      console.log(`✅ Found ${indexCount} indexes`);

      // Check for missing indexes on foreign keys
      const [foreignKeys] = await connection.execute(`
        SELECT 
          TABLE_NAME,
          COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE REFERENCED_TABLE_SCHEMA = ? 
        AND REFERENCED_TABLE_NAME IS NOT NULL
      `, [this.config.database]);

      for (const fk of foreignKeys) {
        const hasIndex = indexes.some(idx => 
          idx.TABLE_NAME === fk.TABLE_NAME && idx.COLUMN_NAME === fk.COLUMN_NAME
        );
        
        if (!hasIndex) {
          this.issues.push({
            type: 'INDEXES',
            severity: 'LOW',
            message: `Missing index on foreign key: ${fk.TABLE_NAME}.${fk.COLUMN_NAME}`,
            fix: `CREATE INDEX idx_${fk.COLUMN_NAME} ON ${fk.TABLE_NAME}(${fk.COLUMN_NAME})`
          });
        }
      }

      await connection.end();
    } catch (error) {
      this.issues.push({
        type: 'INDEXES',
        severity: 'LOW',
        message: `Index check failed: ${error.message}`,
        fix: 'Review database indexes'
      });
    }
  }

  async checkDataIntegrity() {
    console.log('🔄 Checking data integrity...');
    try {
      const connection = await mysql.createConnection(this.config);
      
      // Check for orphaned records
      const integrityChecks = [
        {
          name: 'Orphaned customer_info records',
          query: `SELECT COUNT(*) as count FROM customer_info ci 
                   LEFT JOIN customer_identifier cid ON ci.customer_id = cid.customer_id 
                   WHERE cid.customer_id IS NULL`
        },
        {
          name: 'Orphaned employee_info records',
          query: `SELECT COUNT(*) as count FROM employee_info ei 
                   LEFT JOIN employee e ON ei.employee_id = e.employee_id 
                   WHERE e.employee_id IS NULL`
        },
        {
          name: 'Orders without customers',
          query: `SELECT COUNT(*) as count FROM orders o 
                   LEFT JOIN customer_info ci ON o.customer_id = ci.customer_id 
                   WHERE ci.customer_id IS NULL`
        },
        {
          name: 'Orders without vehicles',
          query: `SELECT COUNT(*) as count FROM orders o 
                   LEFT JOIN customer_vehicle_info cv ON o.vehicle_id = cv.vehicle_id 
                   WHERE cv.vehicle_id IS NULL`
        }
      ];

      for (const check of integrityChecks) {
        try {
          const [result] = await connection.execute(check.query);
          const count = result[0].count;
          if (count > 0) {
            this.issues.push({
              type: 'DATA_INTEGRITY',
              severity: 'MEDIUM',
              message: `${check.name}: ${count} records`,
              fix: 'Clean up orphaned records or fix relationships'
            });
          }
        } catch (checkError) {
          // Table might not exist, skip this check
          console.log(`⚠️  Skipping check: ${check.name} - ${checkError.message}`);
        }
      }

      await connection.end();
      console.log('✅ Data integrity check completed');
    } catch (error) {
      this.issues.push({
        type: 'DATA_INTEGRITY',
        severity: 'MEDIUM',
        message: `Data integrity check failed: ${error.message}`,
        fix: 'Review data consistency'
      });
    }
  }

  async checkPerformance() {
    console.log('🔄 Checking database performance...');
    try {
      const connection = await mysql.createConnection(this.config);
      
      // Check table sizes
      const [tableSizes] = await connection.execute(`
        SELECT 
          TABLE_NAME,
          TABLE_ROWS,
          ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'Size_MB'
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = ?
        ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC
      `, [this.config.database]);

      console.log('📊 Table sizes:');
      tableSizes.forEach(table => {
        console.log(`   ${table.TABLE_NAME}: ${table.TABLE_ROWS} rows, ${table.Size_MB} MB`);
        
        if (table.Size_MB > 100) {
          this.issues.push({
            type: 'PERFORMANCE',
            severity: 'LOW',
            message: `Large table: ${table.TABLE_NAME} (${table.Size_MB} MB)`,
            fix: 'Consider archiving old data or optimizing queries'
          });
        }
      });

      await connection.end();
    } catch (error) {
      this.issues.push({
        type: 'PERFORMANCE',
        severity: 'LOW',
        message: `Performance check failed: ${error.message}`,
        fix: 'Review database performance metrics'
      });
    }
  }

  generateReport() {
    console.log('\n📋 DIAGNOSTIC REPORT');
    console.log('===================');
    
    if (this.issues.length === 0) {
      console.log('✅ No issues found! Database is healthy.');
      return;
    }

    const criticalIssues = this.issues.filter(i => i.severity === 'CRITICAL');
    const highIssues = this.issues.filter(i => i.severity === 'HIGH');
    const mediumIssues = this.issues.filter(i => i.severity === 'MEDIUM');
    const lowIssues = this.issues.filter(i => i.severity === 'LOW');

    console.log(`\n🚨 CRITICAL ISSUES (${criticalIssues.length}):`);
    criticalIssues.forEach(issue => {
      console.log(`   ❌ ${issue.message}`);
      console.log(`      Fix: ${issue.fix}`);
    });

    console.log(`\n⚠️  HIGH PRIORITY ISSUES (${highIssues.length}):`);
    highIssues.forEach(issue => {
      console.log(`   ⚠️  ${issue.message}`);
      console.log(`      Fix: ${issue.fix}`);
    });

    console.log(`\n🔶 MEDIUM PRIORITY ISSUES (${mediumIssues.length}):`);
    mediumIssues.forEach(issue => {
      console.log(`   🔶 ${issue.message}`);
      console.log(`      Fix: ${issue.fix}`);
    });

    console.log(`\nℹ️  LOW PRIORITY ISSUES (${lowIssues.length}):`);
    lowIssues.forEach(issue => {
      console.log(`   ℹ️  ${issue.message}`);
      console.log(`      Fix: ${issue.fix}`);
    });
  }

  async applyFixes() {
    if (this.fixes.length === 0) {
      return;
    }

    console.log('\n🔧 Applying automatic fixes...');
    try {
      const connection = await mysql.createConnection({
        host: this.config.host,
        user: this.config.user,
        password: this.config.password,
        port: this.config.port
      });

      for (const fix of this.fixes) {
        try {
          await connection.execute(fix);
          console.log(`✅ Applied: ${fix}`);
        } catch (error) {
          console.log(`❌ Failed to apply: ${fix} - ${error.message}`);
        }
      }

      await connection.end();
    } catch (error) {
      console.log(`❌ Failed to apply fixes: ${error.message}`);
    }
  }

  async exportReport() {
    const report = {
      timestamp: new Date().toISOString(),
      database: this.config.database,
      issues: this.issues,
      summary: {
        total: this.issues.length,
        critical: this.issues.filter(i => i.severity === 'CRITICAL').length,
        high: this.issues.filter(i => i.severity === 'HIGH').length,
        medium: this.issues.filter(i => i.severity === 'MEDIUM').length,
        low: this.issues.filter(i => i.severity === 'LOW').length
      }
    };

    const reportPath = path.join(__dirname, `diagnostic-report-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Report exported to: ${reportPath}`);
    
    return reportPath;
  }
}

// Export for use in other modules
module.exports = DatabaseDebugger;

// Run diagnostic if called directly
if (require.main === module) {
  const debugger = new DatabaseDebugger();
  debugger.runFullDiagnostic().then(() => {
    debugger.exportReport().then(() => {
      process.exit(0);
    });
  }).catch(error => {
    console.error('Diagnostic failed:', error);
    process.exit(1);
  });
}
