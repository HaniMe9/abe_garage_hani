const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

class DatabaseMigrations {
  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'abe_garage',
      port: process.env.DB_PORT || 3306
    };
  }

  async createMigrationsTable() {
    const connection = await mysql.createConnection(this.config);
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          migration_name VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_migration_name (migration_name)
        )
      `);
      console.log('✅ Migrations table created/verified');
    } catch (error) {
      console.error('❌ Error creating migrations table:', error.message);
      throw error;
    } finally {
      await connection.end();
    }
  }

  async runMigration(migrationName, migrationSQL) {
    const connection = await mysql.createConnection(this.config);
    try {
      // Check if migration already executed
      const [existing] = await connection.execute(
        'SELECT id FROM migrations WHERE migration_name = ?',
        [migrationName]
      );

      if (existing.length > 0) {
        console.log(`⏭️  Migration '${migrationName}' already executed`);
        return false;
      }

      // Execute migration
      await connection.beginTransaction();
      
      // Split SQL by semicolons and execute each statement
      const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          await connection.execute(statement);
        }
      }

      // Record migration
      await connection.execute(
        'INSERT INTO migrations (migration_name) VALUES (?)',
        [migrationName]
      );

      await connection.commit();
      console.log(`✅ Migration '${migrationName}' executed successfully`);
      return true;
    } catch (error) {
      await connection.rollback();
      console.error(`❌ Migration '${migrationName}' failed:`, error.message);
      throw error;
    } finally {
      await connection.end();
    }
  }

  async addMissingIndexes() {
    const indexMigrations = `
      -- Add performance indexes
      CREATE INDEX IF NOT EXISTS idx_customer_email ON customer_identifier(customer_email);
      CREATE INDEX IF NOT EXISTS idx_customer_phone ON customer_identifier(customer_phone_number);
      CREATE INDEX IF NOT EXISTS idx_employee_email ON employee(employee_email);
      CREATE INDEX IF NOT EXISTS idx_order_date ON orders(order_date);
      CREATE INDEX IF NOT EXISTS idx_order_status ON order_status(order_status);
      CREATE INDEX IF NOT EXISTS idx_active_order ON orders(active_order);
      CREATE INDEX IF NOT EXISTS idx_completion_date ON order_info(completion_date);
      CREATE INDEX IF NOT EXISTS idx_service_completed ON order_services(service_completed);
      CREATE INDEX IF NOT EXISTS idx_active_customer ON customer_info(active_customer_status);
      CREATE INDEX IF NOT EXISTS idx_active_employee ON employee_info(active_employee);
    `;

    await this.runMigration('add_performance_indexes', indexMigrations);
  }

  async addMissingConstraints() {
    const constraintMigrations = `
      -- Ensure all foreign key constraints exist
      ALTER TABLE customer_info 
      ADD CONSTRAINT IF NOT EXISTS fk_customer_info_identifier 
      FOREIGN KEY (customer_id) REFERENCES customer_identifier(customer_id) ON DELETE CASCADE;

      ALTER TABLE customer_vehicle_info 
      ADD CONSTRAINT IF NOT EXISTS fk_vehicle_customer 
      FOREIGN KEY (customer_id) REFERENCES customer_info(customer_id) ON DELETE CASCADE;

      ALTER TABLE employee_info 
      ADD CONSTRAINT IF NOT EXISTS fk_employee_info_employee 
      FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE;

      ALTER TABLE employee_pass 
      ADD CONSTRAINT IF NOT EXISTS fk_employee_pass_employee 
      FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE;

      ALTER TABLE employee_role 
      ADD CONSTRAINT IF NOT EXISTS fk_employee_role_employee 
      FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE;

      ALTER TABLE employee_role 
      ADD CONSTRAINT IF NOT EXISTS fk_employee_role_company_role 
      FOREIGN KEY (company_role_id) REFERENCES company_roles(company_role_id);

      ALTER TABLE orders 
      ADD CONSTRAINT IF NOT EXISTS fk_orders_employee 
      FOREIGN KEY (employee_id) REFERENCES employee(employee_id);

      ALTER TABLE orders 
      ADD CONSTRAINT IF NOT EXISTS fk_orders_customer 
      FOREIGN KEY (customer_id) REFERENCES customer_info(customer_id);

      ALTER TABLE orders 
      ADD CONSTRAINT IF NOT EXISTS fk_orders_vehicle 
      FOREIGN KEY (vehicle_id) REFERENCES customer_vehicle_info(vehicle_id);

      ALTER TABLE order_info 
      ADD CONSTRAINT IF NOT EXISTS fk_order_info_order 
      FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE;

      ALTER TABLE order_services 
      ADD CONSTRAINT IF NOT EXISTS fk_order_services_order 
      FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE;

      ALTER TABLE order_services 
      ADD CONSTRAINT IF NOT EXISTS fk_order_services_service 
      FOREIGN KEY (service_id) REFERENCES common_services(service_id);

      ALTER TABLE order_status 
      ADD CONSTRAINT IF NOT EXISTS fk_order_status_order 
      FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE;
    `;

    await this.runMigration('add_foreign_key_constraints', constraintMigrations);
  }

  async addDataValidationConstraints() {
    const validationMigrations = `
      -- Add data validation constraints
      ALTER TABLE customer_identifier 
      ADD CONSTRAINT IF NOT EXISTS chk_customer_email_format 
      CHECK (customer_email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');

      ALTER TABLE employee 
      ADD CONSTRAINT IF NOT EXISTS chk_employee_email_format 
      CHECK (employee_email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');

      ALTER TABLE customer_vehicle_info 
      ADD CONSTRAINT IF NOT EXISTS chk_vehicle_year_range 
      CHECK (vehicle_year BETWEEN 1900 AND YEAR(CURDATE()) + 1);

      ALTER TABLE order_info 
      ADD CONSTRAINT IF NOT EXISTS chk_order_total_positive 
      CHECK (order_total_price >= 0);

      ALTER TABLE customer_vehicle_info 
      ADD CONSTRAINT IF NOT EXISTS chk_vehicle_mileage_positive 
      CHECK (vehicle_mileage >= 0);
    `;

    await this.runMigration('add_data_validation_constraints', validationMigrations);
  }

  async addMissingColumns() {
    const columnMigrations = `
      -- Add missing columns that might be needed
      ALTER TABLE customer_info 
      ADD COLUMN IF NOT EXISTS customer_address TEXT,
      ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100),
      ADD COLUMN IF NOT EXISTS customer_state VARCHAR(50),
      ADD COLUMN IF NOT EXISTS customer_zip_code VARCHAR(20);

      ALTER TABLE employee_info 
      ADD COLUMN IF NOT EXISTS employee_address TEXT,
      ADD COLUMN IF NOT EXISTS employee_hire_date DATE,
      ADD COLUMN IF NOT EXISTS employee_salary DECIMAL(10,2);

      ALTER TABLE order_info 
      ADD COLUMN IF NOT EXISTS estimated_completion_date DATETIME,
      ADD COLUMN IF NOT EXISTS labor_cost DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS parts_cost DECIMAL(10,2) DEFAULT 0;

      ALTER TABLE common_services 
      ADD COLUMN IF NOT EXISTS service_price DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS estimated_duration_hours DECIMAL(4,2) DEFAULT 1;
    `;

    await this.runMigration('add_missing_columns', columnMigrations);
  }

  async createViews() {
    const viewMigrations = `
      -- Create useful views
      CREATE OR REPLACE VIEW customer_summary AS
      SELECT 
        ci.customer_id,
        ci.customer_email,
        ci.customer_phone_number,
        cinfo.customer_first_name,
        cinfo.customer_last_name,
        cinfo.active_customer_status,
        COUNT(DISTINCT cv.vehicle_id) as vehicle_count,
        COUNT(DISTINCT o.order_id) as total_orders,
        COALESCE(SUM(oi.order_total_price), 0) as total_spent
      FROM customer_identifier ci
      LEFT JOIN customer_info cinfo ON ci.customer_id = cinfo.customer_id
      LEFT JOIN customer_vehicle_info cv ON ci.customer_id = cv.customer_id
      LEFT JOIN orders o ON ci.customer_id = o.customer_id
      LEFT JOIN order_info oi ON o.order_id = oi.order_id
      GROUP BY ci.customer_id;

      CREATE OR REPLACE VIEW employee_summary AS
      SELECT 
        e.employee_id,
        e.employee_email,
        e.employee_phone,
        ei.employee_first_name,
        ei.employee_last_name,
        ei.active_employee,
        cr.role_name,
        COUNT(DISTINCT o.order_id) as total_orders_handled,
        COUNT(DISTINCT CASE WHEN os.order_status = 'Completed' THEN o.order_id END) as completed_orders
      FROM employee e
      LEFT JOIN employee_info ei ON e.employee_id = ei.employee_id
      LEFT JOIN employee_role er ON e.employee_id = er.employee_id
      LEFT JOIN company_roles cr ON er.company_role_id = cr.company_role_id
      LEFT JOIN orders o ON e.employee_id = o.employee_id
      LEFT JOIN order_status os ON o.order_id = os.order_id
      GROUP BY e.employee_id;

      CREATE OR REPLACE VIEW order_summary AS
      SELECT 
        o.order_id,
        o.order_date,
        o.active_order,
        oi.order_total_price,
        oi.completion_date,
        os.order_status,
        CONCAT(ci.customer_first_name, ' ', ci.customer_last_name) as customer_name,
        ci.customer_email,
        CONCAT(cv.vehicle_year, ' ', cv.vehicle_make, ' ', cv.vehicle_model) as vehicle_info,
        CONCAT(ei.employee_first_name, ' ', ei.employee_last_name) as assigned_employee,
        COUNT(DISTINCT ose.service_id) as service_count,
        COUNT(DISTINCT CASE WHEN ose.service_completed = 1 THEN ose.service_id END) as completed_services
      FROM orders o
      LEFT JOIN order_info oi ON o.order_id = oi.order_id
      LEFT JOIN order_status os ON o.order_id = os.order_id
      LEFT JOIN customer_info ci ON o.customer_id = ci.customer_id
      LEFT JOIN customer_vehicle_info cv ON o.vehicle_id = cv.vehicle_id
      LEFT JOIN employee_info ei ON o.employee_id = ei.employee_id
      LEFT JOIN order_services ose ON o.order_id = ose.order_id
      GROUP BY o.order_id;
    `;

    await this.runMigration('create_summary_views', viewMigrations);
  }

  async createStoredProcedures() {
    const procedureMigrations = `
      -- Create stored procedures for common operations
      DELIMITER //

      CREATE OR REPLACE PROCEDURE GetCustomerOrders(IN customer_id_param INT)
      BEGIN
        SELECT 
          o.order_id,
          o.order_date,
          o.active_order,
          oi.order_total_price,
          os.order_status,
          CONCAT(cv.vehicle_year, ' ', cv.vehicle_make, ' ', cv.vehicle_model) as vehicle_info
        FROM orders o
        LEFT JOIN order_info oi ON o.order_id = oi.order_id
        LEFT JOIN order_status os ON o.order_id = os.order_id
        LEFT JOIN customer_vehicle_info cv ON o.vehicle_id = cv.vehicle_id
        WHERE o.customer_id = customer_id_param
        ORDER BY o.order_date DESC;
      END //

      CREATE OR REPLACE PROCEDURE GetEmployeeWorkload(IN employee_id_param INT)
      BEGIN
        SELECT 
          COUNT(*) as total_orders,
          COUNT(CASE WHEN o.active_order = 1 THEN 1 END) as active_orders,
          COUNT(CASE WHEN os.order_status = 'Completed' THEN 1 END) as completed_orders,
          AVG(oi.order_total_price) as avg_order_value
        FROM orders o
        LEFT JOIN order_info oi ON o.order_id = oi.order_id
        LEFT JOIN order_status os ON o.order_id = os.order_id
        WHERE o.employee_id = employee_id_param;
      END //

      DELIMITER ;
    `;

    await this.runMigration('create_stored_procedures', procedureMigrations);
  }

  async runAllMigrations() {
    console.log('🚀 Starting database migrations...\n');
    
    try {
      await this.createMigrationsTable();
      await this.addMissingIndexes();
      await this.addMissingConstraints();
      await this.addDataValidationConstraints();
      await this.addMissingColumns();
      await this.createViews();
      await this.createStoredProcedures();
      
      console.log('\n✅ All migrations completed successfully!');
      return true;
    } catch (error) {
      console.error('\n❌ Migration failed:', error.message);
      return false;
    }
  }

  async rollbackMigration(migrationName) {
    const connection = await mysql.createConnection(this.config);
    try {
      await connection.execute(
        'DELETE FROM migrations WHERE migration_name = ?',
        [migrationName]
      );
      console.log(`✅ Migration '${migrationName}' rolled back`);
    } catch (error) {
      console.error(`❌ Failed to rollback migration '${migrationName}':`, error.message);
      throw error;
    } finally {
      await connection.end();
    }
  }

  async listMigrations() {
    const connection = await mysql.createConnection(this.config);
    try {
      const [migrations] = await connection.execute(
        'SELECT migration_name, executed_at FROM migrations ORDER BY executed_at DESC'
      );
      
      console.log('\n📋 Executed Migrations:');
      console.log('======================');
      migrations.forEach(migration => {
        console.log(`✅ ${migration.migration_name} - ${migration.executed_at}`);
      });
      
      return migrations;
    } catch (error) {
      console.error('❌ Failed to list migrations:', error.message);
      return [];
    } finally {
      await connection.end();
    }
  }
}

module.exports = DatabaseMigrations;

// Run migrations if called directly
if (require.main === module) {
  const migrations = new DatabaseMigrations();
  migrations.runAllMigrations().then(success => {
    if (success) {
      migrations.listMigrations().then(() => {
        process.exit(0);
      });
    } else {
      process.exit(1);
    }
  });
}
