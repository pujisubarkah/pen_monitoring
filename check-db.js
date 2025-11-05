import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

async function checkInstansiData() {
  const sql = postgres(process.env.DATABASE_URL);

  try {
    const result = await sql`SELECT * FROM instansi ORDER BY nama_instansi`;
    console.log('Current instansi data:');
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sql.end();
  }
}

checkInstansiData();