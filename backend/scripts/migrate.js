const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

async function runMigration() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'hrm_db',
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database successfully');

    // Read migration file
    const migrationPath = path.join(__dirname, '../src/database/migrations/001_create_employee_database.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Running migration...');
    
    try {
      // Execute the entire migration file
      await client.query(migrationSQL);
      console.log('✅ Migration completed successfully');
    } catch (error) {
      console.error('❌ Migration error:', error.message);
      throw error;
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

async function runSeed() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'hrm_db',
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database successfully');

    // Read seed file
    const seedPath = path.join(__dirname, '../src/database/seeders/001_employee_seed_data.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');

    console.log('🌱 Running seed data...');
    await client.query(seedSQL);
    console.log('✅ Seed data completed successfully');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'migrate') {
  runMigration();
} else if (command === 'seed') {
  runSeed();
} else if (command === 'setup') {
  runMigration().then(() => runSeed());
} else {
  console.log('Usage: node migrate.js [migrate|seed|setup]');
  console.log('  migrate - Run database migrations');
  console.log('  seed    - Run seed data');
  console.log('  setup   - Run both migration and seed');
}
