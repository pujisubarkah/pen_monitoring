import { eq } from 'drizzle-orm';
import { db } from './db';
import { users, sessions, type User, type NewUser, type NewSession, type Session } from './schema';

// Hash password function using bcrypt
export async function hashPassword(password: string): Promise<string> {
	const bcrypt = await import('bcrypt');
	const saltRounds = 10;
	return bcrypt.hash(password, saltRounds);
}

// Verify password function using bcrypt
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	const bcrypt = await import('bcrypt');
	return bcrypt.compare(password, hash);
}

// User functions
export async function createUser(userData: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
	const hashedPassword = await hashPassword(userData.password);

	const newUser: NewUser = {
		name: userData.name,
		email: userData.email,
		password: hashedPassword,
		role: userData.role || 'user',
	};

	const result = await db.insert(users).values(newUser).returning();
	return result[0];
}

export async function findUserByEmail(email: string): Promise<User | null> {
	const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
	return result[0] || null;
}

export async function findUserById(id: string): Promise<User | null> {
	const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
	return result[0] || null;
}

// Session functions
export async function createSession(sessionData: NewSession): Promise<Session> {
	const result = await db.insert(sessions).values(sessionData).returning();
	return result[0];
}

export async function findSessionById(id: string): Promise<Session | null> {
	const result = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1);
	return result[0] || null;
}

export async function deleteSession(id: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, id));
}

// Initialize demo users (only run once)
export async function initDemoUsers(): Promise<void> {
	try {
		// Check if demo users already exist
		const existingAdmin = await findUserByEmail('admin@demo.com');
		const existingUser = await findUserByEmail('user@demo.com');

		if (!existingAdmin) {
			await createUser({
				name: 'Admin Demo',
				email: 'admin@demo.com',
				password: 'demo123',
				role: 'admin',
			});
			console.log('Demo admin user created');
		}

		if (!existingUser) {
			await createUser({
				name: 'User Demo',
				email: 'user@demo.com',
				password: 'user123',
				role: 'user',
			});
			console.log('Demo user created');
		}
	} catch (error) {
		console.error('Error initializing demo users:', error);
	}
}