import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

// Database connection
const connectionString = env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL environment variable is not set');
}

// Create postgres client
const client = postgres(connectionString, {
	max: 10,
	onnotice: () => {}, // Disable notices
});

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export for testing/cleanup
export { client };