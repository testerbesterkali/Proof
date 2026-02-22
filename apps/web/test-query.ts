import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/ali/Developer/Proof/.env' });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function run() {
    const { data: employer, error: empErr } = await supabase.from('EmployerProfile').select('companyName').limit(1);
    console.log('Employer Table Direct Query:', JSON.stringify({ employer, empErr }, null, 2));
}

run();
