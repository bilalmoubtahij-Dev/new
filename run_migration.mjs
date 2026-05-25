import pg from 'pg';
import fs from 'fs';

const { Client } = pg;

const password = encodeURIComponent("@@Bilalnew1234");
const connectionString = `postgresql://postgres:${password}@db.mfwnznopjuqwxaramgli.supabase.co:5432/postgres`;

const client = new Client({
  connectionString,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to Supabase successfully.");
    
    const sql = fs.readFileSync('update_test_results.sql', 'utf8');
    await client.query(sql);
    console.log("SQL executed successfully (columns added to test_results).");
    
  } catch (err) {
    console.error("Error executing SQL:", err);
  } finally {
    await client.end();
  }
}

run();
