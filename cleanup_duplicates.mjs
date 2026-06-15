import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env parser
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
  const { data: testResults, error } = await supabase.from('test_results').select('*');
  if (error) {
    console.error('Error fetching test results:', error);
    return;
  }

  const completedUsers = new Set();
  const duplicateIdsToDelete = [];

  // Find all completed users
  testResults.forEach(row => {
    if (row.status === 'Completed') {
      completedUsers.add(`${row.email}-${row.phone}`);
    }
  });

  // Find duplicate 'Started' rows to delete
  testResults.forEach(row => {
    if (row.status === 'Started') {
      const key = `${row.email}-${row.phone}`;
      if (completedUsers.has(key)) {
        duplicateIdsToDelete.push(row.id);
      }
    }
  });

  if (duplicateIdsToDelete.length > 0) {
    console.log(`Found ${duplicateIdsToDelete.length} duplicate 'Started' rows. Deleting...`);
    for (const id of duplicateIdsToDelete) {
      await supabase.from('test_results').delete().eq('id', id);
    }
    console.log('Cleanup finished!');
  } else {
    console.log('No duplicates found.');
  }
}

cleanup();
