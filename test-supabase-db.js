const { Pool } = require('pg');

// Try multiple connection methods
const connections = [
  {
    name: 'Direct Connection (IPv6, port 5432)',
    config: {
      host: 'db.mqkoydypybxgcwxioqzc.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'rootadmin',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    }
  },
  {
    name: 'Connection Pooler (port 6543)',
    config: {
      host: 'db.mqkoydypybxgcwxioqzc.supabase.co',
      port: 6543,
      database: 'postgres',
      user: 'postgres.mqkoydypybxgcwxioqzc',
      password: 'rootadmin',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    }
  }
];

async function testConnection(connectionConfig) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Testing: ${connectionConfig.name}`);
  console.log('='.repeat(80) + '\n');

  const pool = new Pool(connectionConfig.config);

  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected!\n');

    // Get database version
    const versionResult = await client.query('SELECT version()');
    console.log('📊 Database Version:');
    console.log(versionResult.rows[0].version.substring(0, 100) + '...\n');

    // List all tables in public schema
    const tablesQuery = `
      SELECT
        schemaname,
        tablename,
        tableowner
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;

    const tablesResult = await client.query(tablesQuery);
    console.log(`📋 Found ${tablesResult.rows.length} tables in public schema:\n`);
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.tablename} (owner: ${row.tableowner})`);
    });
    console.log();

    // Get detailed schema for each table
    if (tablesResult.rows.length > 0) {
      console.log('\n📖 Table Structures:\n');

      for (const table of tablesResult.rows) {
        const columnsQuery = `
          SELECT
            column_name,
            data_type,
            character_maximum_length,
            is_nullable,
            column_default
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position;
        `;

        const columnsResult = await client.query(columnsQuery, [table.tablename]);

        console.log(`\nTable: ${table.tablename}`);
        console.log('-'.repeat(80));

        columnsResult.rows.forEach(col => {
          const type = col.character_maximum_length
            ? `${col.data_type}(${col.character_maximum_length})`
            : col.data_type;
          const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
          const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
          console.log(`  ${col.column_name.padEnd(30)} ${type.padEnd(25)} ${nullable}${defaultVal}`);
        });

        // Get row count
        try {
          const countResult = await client.query(`SELECT COUNT(*) FROM "${table.tablename}"`);
          console.log(`\n  📊 Row count: ${countResult.rows[0].count}`);
        } catch (e) {
          console.log(`\n  ⚠️  Could not get row count: ${e.message}`);
        }
      }
    }

    // Sample some data from common tables
    console.log('\n\n📦 Sample Data:\n');
    const sampleTables = ['products', 'users', 'orders', 'categories', 'cart_items', 'order_items'];

    for (const tableName of sampleTables) {
      const tableExists = tablesResult.rows.some(t => t.tablename === tableName);
      if (tableExists) {
        try {
          const sampleResult = await client.query(`SELECT * FROM "${tableName}" LIMIT 3`);
          console.log(`\n${tableName} (showing ${sampleResult.rows.length} of ${sampleResult.rows.length} rows):`);
          console.log('-'.repeat(80));
          if (sampleResult.rows.length > 0) {
            console.table(sampleResult.rows);
          } else {
            console.log('  (empty table)');
          }
        } catch (e) {
          console.log(`\n${tableName}: ⚠️  ${e.message}`);
        }
      }
    }

    client.release();
    await pool.end();

    console.log('\n✅ Connection test completed successfully!');
    return true;

  } catch (error) {
    console.error(`❌ Connection failed: ${error.message}`);
    console.error(`   Error code: ${error.code || 'N/A'}`);
    await pool.end();
    return false;
  }
}

async function runTests() {
  console.log('🔍 Testing Supabase Database Connections...\n');
  console.log(`Database: postgres`);
  console.log(`Host: db.mqkoydypybxgcwxioqzc.supabase.co\n`);

  for (const conn of connections) {
    const success = await testConnection(conn);
    if (success) {
      console.log('\n✅ Found working connection method!');
      break;
    }
  }
}

runTests();
