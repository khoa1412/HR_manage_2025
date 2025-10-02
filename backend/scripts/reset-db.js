const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function resetDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: 'postgres', // Connect to default database first
  });

  try {
    console.log('🔌 Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully');

    // Drop and recreate database
    console.log('🗑️  Dropping database if exists...');
    await client.query('DROP DATABASE IF EXISTS hrm_db');
    
    console.log('🆕 Creating database...');
    await client.query('CREATE DATABASE hrm_db');
    console.log('✅ Database created successfully');

  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }

  // Now connect to the new database and run migration
  const hrmClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: 'hrm_db',
  });

  try {
    console.log('🔌 Connecting to HRM database...');
    await hrmClient.connect();
    console.log('✅ Connected to HRM database successfully');

    // Read and run migration
    const migrationPath = path.join(__dirname, '../src/database/migrations/001_create_employee_database.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Running migration...');
    await hrmClient.query(migrationSQL);
    console.log('✅ Migration completed successfully');

    // Read and run seed data
    const seedPath = path.join(__dirname, '../src/database/seeders/001_employee_seed_data.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');

    console.log('🌱 Running seed data...');
    await hrmClient.query(seedSQL);
    console.log('✅ Seed data completed successfully');

    console.log('🎉 Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await hrmClient.end();
  }
}

resetDatabase();
