const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
    const { data, error } = await supabase.from('Challenge').select('*, EmployerProfile(companyName)');
    console.log(JSON.stringify({data, error}, null, 2));
}
run();
