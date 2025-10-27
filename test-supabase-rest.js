const { createClient } = require('@supabase/supabase-js');

// Get credentials from command line or environment
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mqkoydypybxgcwxioqzc.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.argv[2];

if (!SUPABASE_ANON_KEY) {
  console.error('❌ Please provide Supabase Anon Key as argument or set NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSupabase() {
  console.log('🔍 Testing Supabase Connection via REST API...\n');
  console.log(`URL: ${SUPABASE_URL}\n`);
  console.log('='.repeat(80) + '\n');

  try {
    // Test 1: List all tables by querying the products table
    console.log('📋 Test 1: Querying products table...\n');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);

    if (productsError) {
      console.log('⚠️  Products query error:', productsError.message);
      console.log('   This might mean the table doesn\'t exist or we don\'t have permission\n');
    } else {
      console.log(`✅ Successfully queried products table!`);
      console.log(`   Found ${products.length} products (showing max 5):\n`);
      console.table(products);
      console.log();
    }

    console.log('='.repeat(80) + '\n');

    // Test 2: Try to query users table
    console.log('📋 Test 2: Querying users table...\n');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, created_at')
      .limit(5);

    if (usersError) {
      console.log('⚠️  Users query error:', usersError.message);
      console.log('   This might mean the table doesn\'t exist or we don\'t have permission\n');
    } else {
      console.log(`✅ Successfully queried users table!`);
      console.log(`   Found ${users.length} users (showing max 5):\n`);
      console.table(users);
      console.log();
    }

    console.log('='.repeat(80) + '\n');

    // Test 3: Try to query categories table
    console.log('📋 Test 3: Querying categories table...\n');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(10);

    if (categoriesError) {
      console.log('⚠️  Categories query error:', categoriesError.message);
      console.log('   This might mean the table doesn\'t exist or we don\'t have permission\n');
    } else {
      console.log(`✅ Successfully queried categories table!`);
      console.log(`   Found ${categories.length} categories:\n`);
      console.table(categories);
      console.log();
    }

    console.log('='.repeat(80) + '\n');

    // Test 4: Try to query orders table
    console.log('📋 Test 4: Querying orders table...\n');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(5);

    if (ordersError) {
      console.log('⚠️  Orders query error:', ordersError.message);
      console.log('   This might mean the table doesn\'t exist or we don\'t have permission\n');
    } else {
      console.log(`✅ Successfully queried orders table!`);
      console.log(`   Found ${orders.length} orders (showing max 5):\n`);
      console.table(orders);
      console.log();
    }

    console.log('='.repeat(80) + '\n');

    // Test 5: Test authentication (if available)
    console.log('📋 Test 5: Testing authentication...\n');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.log('⚠️  Session error:', sessionError.message);
    } else if (session) {
      console.log('✅ Active session found!');
      console.log(`   User: ${session.user.email}`);
    } else {
      console.log('ℹ️  No active session (this is normal for API key access)');
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // Summary
    console.log('📊 Test Summary:\n');
    console.log(`   Products table: ${productsError ? '❌' : '✅'}`);
    console.log(`   Users table: ${usersError ? '❌' : '✅'}`);
    console.log(`   Categories table: ${categoriesError ? '❌' : '✅'}`);
    console.log(`   Orders table: ${ordersError ? '❌' : '✅'}`);
    console.log('\n✅ Supabase connection test completed!');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run the test
testSupabase();
