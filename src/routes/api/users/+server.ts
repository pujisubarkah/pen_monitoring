import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, insertUserSchema } from '$lib/server/schema';
import { createUser, findUserByEmail } from '$lib/server/auth';

// GET /api/users - list users (omit password)
export const GET: RequestHandler = async () => {
  try {
    const rows = await db.select().from(users);
    const data = rows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
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

    const safe = {
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
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
