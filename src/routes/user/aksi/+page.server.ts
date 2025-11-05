import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { findUserById } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { actions as actionsTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

const actionSchema = z.object({
	title: z.string().min(1, 'Judul aksi wajib diisi'),
	description: z.string().optional(),
	target_date: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']).default('medium'),
	status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).default('pending'),
	assigned_to: z.string().optional(),
});

export async function load({ cookies }: any) {
	// Check authentication via cookies
	const userCookie = cookies.get('user');
	if (!userCookie) {
		throw redirect(302, '/login');
	}

	let user;
	try {
		user = JSON.parse(userCookie);
	} catch (error) {
		throw redirect(302, '/login');
	}

	// Verify user exists in database
	const dbUser = await findUserById(user.id);
	if (!dbUser) {
		throw redirect(302, '/login');
	}

	// Only users can access this page
	if (dbUser.role !== 'user') {
		throw redirect(302, '/admin');
	}

	// Load user's actions
	const userActions = await db.select().from(actionsTable).where(eq(actionsTable.userId, dbUser.id));

	return {
		user: dbUser,
		actions: userActions
	};
}

export const actions = {
	createAction: async ({ request, cookies }: any) => {
		// Check authentication
		const userCookie = cookies.get('user');
		if (!userCookie) {
			throw redirect(302, '/login');
		}

		let user;
		try {
			user = JSON.parse(userCookie);
		} catch (error) {
			throw redirect(302, '/login');
		}

		// Verify user exists and has correct role
		const dbUser = await findUserById(user.id);
		if (!dbUser || dbUser.role !== 'user') {
			return fail(403, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const data = {
			title: formData.get('title')?.toString() || '',
			description: formData.get('description')?.toString() || '',
			target_date: formData.get('target_date')?.toString() || '',
			priority: formData.get('priority')?.toString() || 'medium',
			status: formData.get('status')?.toString() || 'pending',
			assigned_to: formData.get('assigned_to')?.toString() || '',
		};

		// Validate input
		const result = actionSchema.safeParse(data);
		if (!result.success) {
			return fail(400, {
				error: result.error.issues[0].message,
				...data
			});
		}

		try {
			// Insert new action
			await db.insert(actionsTable).values({
				title: data.title,
				description: data.description || null,
				targetDate: data.target_date ? new Date(data.target_date) : null,
				priority: data.priority as 'low' | 'medium' | 'high',
				status: data.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
				assignedTo: data.assigned_to || null,
				userId: dbUser.id,
			});

			// Redirect back with success message
			throw redirect(302, '/user/aksi?success=true');
		} catch (error) {
			console.error('Error creating action:', error);
			return fail(500, {
				error: 'Gagal membuat aksi. Silakan coba lagi.',
				...data
			});
		}
	}
};