import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { findUserByEmail, findUserById, hashPassword } from '$lib/server/auth';
import { eq } from 'drizzle-orm';

// PUT /api/users/[id] - update user
export const PUT: RequestHandler = async ({ request, params }) => {
  try {
    const userIdParam = params.id;
    if (!userIdParam) {
      throw error(400, { message: 'ID pengguna diperlukan' });
    }

    const userId = parseInt(userIdParam);
    if (isNaN(userId)) {
      throw error(400, { message: 'ID pengguna tidak valid' });
    }

    const body = await request.json();

    // Check if user exists
    const existingUser = await findUserById(userId);
    if (!existingUser) {
      throw error(404, { message: 'Pengguna tidak ditemukan' });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Update name if provided
    if (body.name) {
      updateData.name = body.name;
    }

    // Update email if provided and different
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await findUserByEmail(body.email);
      if (emailExists) {
        return json({ success: false, message: 'Email sudah digunakan' }, { status: 409 });
      }
      updateData.email = body.email;
    }


    // Update role if provided
    if (body.role) {
      updateData.role = body.role;
    }

    // Update is_verified if provided
    if (typeof body.is_verified === 'boolean') {
      updateData.is_verified = body.is_verified;
    }

    // Update password if provided
    if (body.password) {
      updateData.password = await hashPassword(body.password);
    }

    // Update user
    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    if (result.length === 0) {
      throw error(404, { message: 'Pengguna tidak ditemukan' });
    }

    const updated = result[0];
    const safe = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    };

    return json({ success: true, data: safe });
  } catch (err: any) {
    console.error('/api/users/[id] PUT error', err);
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal memperbarui pengguna' });
  }
};

// DELETE /api/users/[id] - delete user
export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const userIdParam = params.id;
    if (!userIdParam) {
      throw error(400, { message: 'ID pengguna diperlukan' });
    }

    const userId = parseInt(userIdParam);
    if (isNaN(userId)) {
      throw error(400, { message: 'ID pengguna tidak valid' });
    }

    // Check if user exists
    const existingUser = await findUserById(userId);
    if (!existingUser) {
      throw error(404, { message: 'Pengguna tidak ditemukan' });
    }

    // Delete user
    await db.delete(users).where(eq(users.id, userId));

    return json({ success: true, message: 'Pengguna berhasil dihapus' });
  } catch (err: any) {
    console.error('/api/users/[id] DELETE error', err);
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal menghapus pengguna' });
  }
};