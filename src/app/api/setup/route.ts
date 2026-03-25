import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { Pool } from 'pg';

export async function POST(req: Request) {
  try {
    const { supabaseUrl, supabaseAnonKey, postgresUrl } = await req.json();

    if (!supabaseUrl || !supabaseAnonKey || !postgresUrl) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    // Connect to PostgreSQL to run the schema definitions
    const pool = new Pool({
      connectionString: postgresUrl,
      ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();
    
    // Read schema.sql
    const schemaPath = path.join(process.cwd(), 'src/lib/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    await client.query(schemaSql);
    client.release();
    await pool.end();

    // Write to .env.local
    const envContent = `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}\nPOSTGRES_URL=${postgresUrl}\n`;
    fs.writeFileSync(path.join(process.cwd(), '.env.local'), envContent);

    return NextResponse.json({ success: true, message: 'Database configured successfully' });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
