import { eq } from 'drizzle-orm';
import { db } from './db';
import { users, sessions, instansi, type User, type NewUser, type NewSession, type Session, type Instansi, type NewInstansi } from './schema';
import jwt from 'jsonwebtoken';

// JWT Configuration
const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN || '7d';

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

// JWT functions
export function generateJWT(payload: { id: number; email: string; role: string; instansi_id?: number | null }): string {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

export function verifyJWT(token: string): { id: number; email: string; role: string; instansi_id?: number | null } | null {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as any;
		return {
			id: decoded.id,
			email: decoded.email,
			role: decoded.role,
			instansi_id: decoded.instansi_id
		};
	} catch (error) {
		return null;
	}
}

// User functions
export async function createUser(userData: { name: string; email: string; password: string; role?: string; instansi_id?: number | null; is_active?: boolean; is_verified?: boolean }): Promise<User> {
	const hashedPassword = await hashPassword(userData.password);

	const newUser: NewUser = {
		name: userData.name,
		email: userData.email,
		password: hashedPassword,
		role: userData.role || 'user',
		is_active: userData.is_active ?? true,
		instansi_id: userData.instansi_id,
		is_verified: userData.is_verified ?? false,
	};

	const result = await db.insert(users).values(newUser).returning();
	return result[0];
}

export async function findUserByEmail(email: string): Promise<User | null> {
	const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
	return result[0] || null;
}

export async function findUserById(id: number): Promise<User | null> {
	const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
	return result[0] || null;
}

// Instansi functions
export async function getAllInstansi(): Promise<Instansi[]> {
	const result = await db.select().from(instansi).orderBy(instansi.namaInstansi);
	return result;
}

export async function findInstansiById(id: number): Promise<Instansi | null> {
	const result = await db.select().from(instansi).where(eq(instansi.id, id)).limit(1);
	return result[0] || null;
}

export async function createInstansi(instansiData: NewInstansi): Promise<Instansi> {
	const result = await db.insert(instansi).values(instansiData).returning();
	return result[0];
}

export async function updateInstansi(id: number, data: Partial<NewInstansi>): Promise<Instansi | null> {
	const result = await db.update(instansi).set(data).where(eq(instansi.id, id)).returning();
	return result[0] || null;
}

export async function deleteInstansi(id: number): Promise<boolean> {
	try {
		await db.delete(instansi).where(eq(instansi.id, id));
		return true;
	} catch {
		return false;
	}
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
				instansi_id: 48, // Add instansi_id for demo user
			});
			console.log('Demo admin user created');
		} else if (!existingAdmin.instansi_id) {
			// Update existing user if instansi_id is missing
			await db.update(users).set({ instansi_id: 48 }).where(eq(users.id, existingAdmin.id));
			console.log('Demo admin user updated with instansi_id');
		}

		if (!existingUser) {
			await createUser({
				name: 'User Demo',
				email: 'user@demo.com',
				password: 'user123',
				role: 'user',
				instansi_id: 48, // Add instansi_id for demo user
			});
			console.log('Demo user created');
		} else if (!existingUser.instansi_id) {
			// Update existing user if instansi_id is missing
			await db.update(users).set({ instansi_id: 48 }).where(eq(users.id, existingUser.id));
			console.log('Demo user updated with instansi_id');
		}
	} catch (error) {
		console.error('Error initializing demo users:', error);
	}
}