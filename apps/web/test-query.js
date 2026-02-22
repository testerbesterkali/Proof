import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/ali/Developer/Proof/.env' });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function run() {
    const { data, error } = await supabase.from('Challenge').select('*, EmployerProfile(*)').limit(1);
    console.log('Result:', JSON.stringify({ data, error }, null, 2));

    // let's also query EmployerProfile directly
    const { data: employer, error: empErr } = await supabase.from('EmployerProfile').select('*').limit(1);
    console.log('Employer Table Direct Query:', JSON.stringify({ employer, empErr }, null, 2));
}

run();
