// Test script for Aura app connections
import { supabase } from './src/config/supabase.js';

console.log('🚀 Testing Aura App Connections...\n');

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    console.log('📡 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('brands').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    console.log(`📊 Found ${data?.[0]?.count || 0} brands in database`);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
}

// Test environment variables
function testEnvironmentVariables() {
  console.log('\n🔧 Testing environment variables...');
  
  const requiredVars = [
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    'EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY'
  ];
  
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: ${varName.includes('URL') ? process.env[varName] : '***'}`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

// Run tests
async function runTests() {
  console.log('🧪 Starting Aura App Tests...\n');
  
  const envTest = testEnvironmentVariables();
  const supabaseTest = await testSupabaseConnection();
  
  console.log('\n📋 Test Results:');
  console.log(`Environment Variables: ${envTest ? '✅ Passed' : '❌ Failed'}`);
  console.log(`Supabase Connection: ${supabaseTest ? '✅ Passed' : '❌ Failed'}`);
  
  if (envTest && supabaseTest) {
    console.log('\n🎉 All tests passed! Aura app is ready to run.');
    console.log('\n🚀 To start the app:');
    console.log('   npm install');
    console.log('   npm run web');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the configuration.');
  }
}

// Run the tests
runTests().catch(console.error);