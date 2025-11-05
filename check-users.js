// Check users table and demo users
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

// Load environment variables manually from .env file
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

async function checkUsers() {
	try {
		console.log('Checking users table...');

		if (!process.env.DATABASE_URL) {
			console.error('❌ DATABASE_URL environment variable is not set');
			process.exit(1);
		}

		// Create connection
		const sql = postgres(process.env.DATABASE_URL, {
			max: 10,
			onnotice: () => {},
		});

		// Check if users table exists
		const tables = await sql`
			SELECT table_name
			FROM information_schema.tables
			WHERE table_schema = 'public'
			AND table_name = 'users'
		`;

		if (tables.length === 0) {
			console.log('❌ Users table does not exist!');
			console.log('Please run: pnpm db:push');
			await sql.end();
			process.exit(1);
		}

		console.log('✅ Users table exists');

		// Get all users
		const users = await sql`
			SELECT id, name, email, role, created_at
			FROM users
			ORDER BY created_at DESC
		`;

		console.log(`Found ${users.length} users:`);
		users.forEach(user => {
			console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
		});

		if (users.length === 0) {
			console.log('⚠️  No users found. Demo users may not have been created.');
			console.log('Try restarting the dev server to trigger demo user creation.');
		}

		// Close connection
		await sql.end();

	} catch (error) {
		console.error('❌ Error checking users:', error);
		process.exit(1);
	}
}

checkUsers();