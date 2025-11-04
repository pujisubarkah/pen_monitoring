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

async function createSessionsTable() {
	try {
		console.log('Creating sessions table...');

		if (!process.env.DATABASE_URL) {
			console.error('❌ DATABASE_URL environment variable is not set');
			process.exit(1);
		}

		// Create connection
		const sql = postgres(process.env.DATABASE_URL, {
			max: 10,
			onnotice: () => {},
		});

		// Create sessions table
		console.log('Creating sessions table...');
		await sql`
			CREATE TABLE IF NOT EXISTS sessions (
				id TEXT PRIMARY KEY,
				user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				expires_at TIMESTAMP NOT NULL,
				created_at TIMESTAMP NOT NULL DEFAULT NOW()
			)
		`;

		console.log('✅ Sessions table created successfully');

		// Verify table creation
		const tables = await sql`
			SELECT table_name
			FROM information_schema.tables
			WHERE table_schema = 'public'
			AND table_name = 'sessions'
		`;

		if (tables.length > 0) {
			console.log('✅ Sessions table verified');

			// Show table structure
			const columns = await sql`
				SELECT column_name, data_type, is_nullable, column_default
				FROM information_schema.columns
				WHERE table_name = 'sessions'
				ORDER BY ordinal_position
			`;
			console.table(columns);
		} else {
			console.log('❌ Sessions table creation failed');
		}

		// Close connection
		await sql.end();

	} catch (error) {
		console.error('❌ Failed to create sessions table:', error);
		process.exit(1);
	}
}

createSessionsTable();