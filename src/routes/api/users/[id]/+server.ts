import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, instansi } from '$lib/server/schema';
import { findUserByEmail, findUserById, hashPassword } from '$lib/server/auth';
import { sendEmail } from '$lib/email';
import { eq } from 'drizzle-orm';

// GET /api/users/[id] - get user by id
export const GET: RequestHandler = async ({ params }) => {
  try {
    const userIdParam = params.id;
    if (!userIdParam) {
      throw error(400, { message: 'ID pengguna diperlukan' });
    }

    const userId = parseInt(userIdParam);
    if (isNaN(userId)) {
      throw error(400, { message: 'ID pengguna tidak valid' });
    }

    // Get user data with instansi join
    const [userData] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        is_active: users.is_active,
        created_at: users.created_at,
        updated_at: users.updated_at,
        instansi_id: users.instansi_id,
        is_verified: users.is_verified,
        nama_instansi: instansi.namaInstansi,
      })
      .from(users)
      .leftJoin(instansi, eq(users.instansi_id, instansi.id))
      .where(eq(users.id, userId));

    if (!userData) {
      throw error(404, { message: 'Pengguna tidak ditemukan' });
    }

    const safe = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      is_active: userData.is_active,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      nama_instansi: userData.nama_instansi || null,
      is_verified: userData.is_verified,
    };

    return json({ success: true, data: safe });
  } catch (err: any) {
    console.error('/api/users/[id] GET error', err);
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal mengambil data pengguna' });
  }
};

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

    // Track verification status before update
    const wasVerified = !!existingUser.is_verified;

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
    let willBeVerified = wasVerified;
    if (typeof body.is_verified === 'boolean') {
      updateData.is_verified = body.is_verified;
      willBeVerified = body.is_verified;
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

    // Fetch updated user with instansi join
    const [updatedUser] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        is_active: users.is_active,
        created_at: users.created_at,
        updated_at: users.updated_at,
        instansi_id: users.instansi_id,
        is_verified: users.is_verified,
        nama_instansi: instansi.namaInstansi,
      })
      .from(users)
      .leftJoin(instansi, eq(users.instansi_id, instansi.id))
      .where(eq(users.id, userId));

    const safe = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      is_active: updatedUser.is_active,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
      nama_instansi: updatedUser.nama_instansi || null,
      is_verified: updatedUser.is_verified,
    };

    // If user just got verified, send email
    if (!wasVerified && willBeVerified) {
      // Send verification email
      await sendEmail({
        to: safe.email,
        subject: 'Akun Anda Telah Diverifikasi',
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Akun Anda Telah Diverifikasi</h2>
          <p>Selamat, akun Anda telah diverifikasi oleh admin. Silakan login ke sistem menggunakan email dan password Anda.</p>
          <a href="${process.env.APP_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Login ke Sistem</a>
          <p>Salam,<br>Tim Sistem Monitoring PEN</p>
        </div>`
      });
    }
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