require('dotenv').config();

console.log('🔍 Checking MongoDB Atlas Connection String\n');

if (!process.env.MONGO_URI) {
  console.log('❌ MONGO_URI is not set in .env file');
  process.exit(1);
}

const uri = process.env.MONGO_URI;

console.log('📋 Connection String Analysis:');
console.log(`├── Starts with mongodb+srv://: ${uri.startsWith('mongodb+srv://') ? '✅' : '❌'}`);
console.log(`├── Contains username: ${uri.includes('://') && uri.includes('@') ? '✅' : '❌'}`);
console.log(`├── Contains database name: ${uri.includes('/password-manager') ? '✅' : '❌'}`);
console.log(`├── Contains retryWrites: ${uri.includes('retryWrites=true') ? '✅' : '❌'}`);
console.log(`└── Contains w=majority: ${uri.includes('w=majority') ? '✅' : '❌'}`);

// Extract parts for analysis
const uriParts = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)/);

if (uriParts) {
  console.log('\n📝 Connection String Breakdown:');
  console.log(`├── Username: ${uriParts[1]}`);
  console.log(`├── Password: ${uriParts[2].length > 0 ? '***' + uriParts[2].slice(-3) : '❌ Empty'}`);
  console.log(`├── Cluster: ${uriParts[3]}`);
  console.log(`└── Database: ${uriParts[4]}`);
  
  // Check for common password issues
  if (uriParts[2].includes('%')) {
    console.log('\n⚠️  Password contains URL encoding - this is good!');
  } else if (uriParts[2].includes('@') || uriParts[2].includes('#') || uriParts[2].includes('$') || uriParts[2].includes('&')) {
    console.log('\n⚠️  Password contains special characters that need URL encoding');
    console.log('   Common characters to encode:');
    console.log('   @ → %40, # → %23, $ → %24, & → %26, + → %2B, / → %2F');
  }
} else {
  console.log('\n❌ Connection string format is invalid');
  console.log('Expected format: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
}

console.log('\n💡 Next Steps:');
console.log('1. Make sure your Atlas database user exists');
console.log('2. Verify username and password are correct');
console.log('3. URL encode any special characters in password');
console.log('4. Ensure database name is specified (password-manager)');
console.log('5. Run: node test-atlas.js to test connection'); 