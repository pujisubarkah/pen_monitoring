import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, insertUserSchema, instansi } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { createUser, findUserByEmail } from '$lib/server/auth';

// GET /api/users - list users (omit password)
export const GET: RequestHandler = async () => {
  try {
    const rows = await db
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
      .leftJoin(instansi, eq(users.instansi_id, instansi.id));

    const data = rows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      is_active: u.is_active,
      created_at: u.created_at,
      updated_at: u.updated_at,
      nama_instansi: u.nama_instansi || null,
      is_verified: u.is_verified,
    }));

    return json({ success: true, data });
  } catch (err) {
    console.error('/api/users GET error', err);
    throw error(500, { message: 'Gagal mengambil daftar pengguna' });
  }
};

// POST /api/users - create new user
export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();

    // Validate using schema exported from server/schema
    const parsed = insertUserSchema.parse(body);

    // Check for existing email
    const existing = await findUserByEmail(parsed.email);
    if (existing) {
      return json({ success: false, message: 'Email sudah terdaftar' }, { status: 409 });
    }

    // Create user (createUser hashes password)
    const created = await createUser({
      name: parsed.name,
      email: parsed.email,
      password: parsed.password,
      role: parsed.role,
    });

    // Fetch the created user with instansi join
    const [userWithInstansi] = await db
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
      .where(eq(users.id, created.id));

    const safe = {
      id: userWithInstansi.id,
      name: userWithInstansi.name,
      email: userWithInstansi.email,
      role: userWithInstansi.role,
      is_active: userWithInstansi.is_active,
      created_at: userWithInstansi.created_at,
      updated_at: userWithInstansi.updated_at,
      nama_instansi: userWithInstansi.nama_instansi || null,
      is_verified: userWithInstansi.is_verified,
    };

    return json({ success: true, data: safe }, { status: 201 });
  } catch (err: any) {
    console.error('/api/users POST error', err);
    // Zod validation errors
    if (err?.name === 'ZodError' && err?.issues) {
      return json({ success: false, errors: err.issues }, { status: 400 });
    }
    if (err instanceof Response) throw err;
    throw error(500, { message: 'Gagal membuat pengguna' });
  }
};
