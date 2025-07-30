const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

class DatabaseSetup {
  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      multipleStatements: true
    };
  }

  async createDatabase() {
    try {
      console.log('🔄 Connecting to MySQL server...');
      const connection = await mysql.createConnection(this.config);
      
      console.log('🔄 Creating database if not exists...');
      await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'abe_garage'}\``);
      
      console.log('✅ Database created successfully!');
      await connection.end();
      return true;
    } catch (error) {
      console.error('❌ Error creating database:', error.message);
      return false;
    }
  }

  async importSchema() {
    try {
      console.log('🔄 Reading SQL schema file...');
      const sqlPath = path.join(__dirname, '../../abe_garage.sql');
      const sqlContent = await fs.readFile(sqlPath, 'utf8');
      
      console.log('🔄 Connecting to database...');
      const connection = await mysql.createConnection({
        ...this.config,
        database: process.env.DB_NAME || 'abe_garage'
      });
      
      console.log('🔄 Importing schema...');
      await connection.execute(sqlContent);
      
      console.log('✅ Schema imported successfully!');
      await connection.end();
      return true;
    } catch (error) {
      console.error('❌ Error importing schema:', error.message);
      return false;
    }
  }

  async testConnection() {
    try {
      console.log('🔄 Testing database connection...');
      const connection = await mysql.createConnection({
        ...this.config,
        database: process.env.DB_NAME || 'abe_garage'
      });
      
      const [rows] = await connection.execute('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = ?', [process.env.DB_NAME || 'abe_garage']);
      
      console.log(`✅ Connection successful! Found ${rows[0].table_count} tables.`);
      await connection.end();
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
  }

  async getTableInfo() {
    try {
      const connection = await mysql.createConnection({
        ...this.config,
        database: process.env.DB_NAME || 'abe_garage'
      });
      
      const [tables] = await connection.execute(`
        SELECT 
          TABLE_NAME,
          TABLE_ROWS,
          DATA_LENGTH,
          INDEX_LENGTH,
          CREATE_TIME,
          UPDATE_TIME
        FROM information_schema.tables 
        WHERE table_schema = ?
        ORDER BY TABLE_NAME
      `, [process.env.DB_NAME || 'abe_garage']);
      
      console.log('\n📊 Database Tables Information:');
      console.log('================================');
      tables.forEach(table => {
        console.log(`📋 ${table.TABLE_NAME}`);
        console.log(`   Rows: ${table.TABLE_ROWS || 0}`);
        console.log(`   Size: ${((table.DATA_LENGTH + table.INDEX_LENGTH) / 1024).toFixed(2)} KB`);
        console.log(`   Created: ${table.CREATE_TIME || 'N/A'}`);
        console.log('');
      });
      
      await connection.end();
      return tables;
    } catch (error) {
      console.error('❌ Error getting table info:', error.message);
      return [];
    }
  }

  async runFullSetup() {
    console.log('🚀 Starting Abe Garage Database Setup...\n');
    
    const dbCreated = await this.createDatabase();
    if (!dbCreated) return false;
    
    const schemaImported = await this.importSchema();
    if (!schemaImported) return false;
    
    const connectionTest = await this.testConnection();
    if (!connectionTest) return false;
    
    await this.getTableInfo();
    
    console.log('🎉 Database setup completed successfully!');
    return true;
  }
}

// Export for use in other modules
module.exports = DatabaseSetup;

// Run setup if called directly
if (require.main === module) {
  const setup = new DatabaseSetup();
  setup.runFullSetup().then(success => {
    process.exit(success ? 0 : 1);
  });
}
