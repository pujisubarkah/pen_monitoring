import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userInstansiAssignments, instansi } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

// GET: Fetch all instansi assigned to a specific user (admin)
export const GET: RequestHandler = async ({ params }) => {
	try {
		const userId = parseInt(params.userId || '');
		if (isNaN(userId)) {
			return json({ success: false, message: 'Invalid user ID' }, { status: 400 });
		}

		// Get all instansi assignments for this user
		const assignments = await db
			.select({
				id: instansi.id,
				namaInstansi: instansi.namaInstansi,
				assignedAt: userInstansiAssignments.assigned_at,
			})
			.from(userInstansiAssignments)
			.innerJoin(instansi, eq(userInstansiAssignments.instansi_id, instansi.id))
			.where(eq(userInstansiAssignments.user_id, userId));

		return json({ success: true, data: assignments });
	} catch (error) {
		console.error('Error fetching user instansi assignments:', error);
		return json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
};

// POST: Add new instansi assignment
export const POST: RequestHandler = async ({ request, params }) => {
	try {
		const userId = parseInt(params.userId || '');
		if (isNaN(userId)) {
			return json({ success: false, message: 'Invalid user ID' }, { status: 400 });
		}

		const { instansi_id, assigned_by } = await request.json();
		
		if (!instansi_id) {
			return json({ success: false, message: 'instansi_id is required' }, { status: 400 });
		}

		// Check if assignment already exists
		const existing = await db
			.select()
			.from(userInstansiAssignments)
			.where(and(
				eq(userInstansiAssignments.user_id, userId),
				eq(userInstansiAssignments.instansi_id, instansi_id)
			))
			.limit(1);

		if (existing.length > 0) {
			return json({ success: false, message: 'Assignment already exists' }, { status: 400 });
		}

		// Create new assignment
		const result = await db.insert(userInstansiAssignments).values({
			user_id: userId,
			instansi_id,
			assigned_by: assigned_by || null,
		}).returning();

		return json({ success: true, data: result[0] });
	} catch (error) {
		console.error('Error creating user instansi assignment:', error);
		return json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
};

// DELETE: Remove instansi assignment
export const DELETE: RequestHandler = async ({ url, params }) => {
	try {
		const userId = parseInt(params.userId || '');
		const instansiId = parseInt(url.searchParams.get('instansi_id') || '');
		
		if (isNaN(userId) || isNaN(instansiId)) {
			return json({ success: false, message: 'Invalid user ID or instansi ID' }, { status: 400 });
		}

		await db
			.delete(userInstansiAssignments)
			.where(and(
				eq(userInstansiAssignments.user_id, userId),
				eq(userInstansiAssignments.instansi_id, instansiId)
			));

		return json({ success: true, message: 'Assignment removed successfully' });
	} catch (error) {
		console.error('Error deleting user instansi assignment:', error);
		return json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
};
