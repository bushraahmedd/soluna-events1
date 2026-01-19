const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
let envVars = {};
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) envVars[key.trim()] = value.trim();
    });
} catch (e) { }

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || 'https://apicsvdfvouqraercnmv.supabase.co';
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWNzdmRmdm91cXJhZXJjbm12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NTg2NDQsImV4cCI6MjA4NDIzNDY0NH0.J-WhVg9vl95OgDDcVDYCS4DgBruJkhdsva767u9Ko84';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listColumns() {
    // This query works on many Postgres setups via Supabase's RPC or just a direct query if enabled, 
    // but here we can try to select a non-existent column to see the DB error which lists valid columns usually,
    // or better, just try to select * and look at the keys of a returned row (if we can find one).
    // Failing that, we'll try a common system query.

    try {
        const { data, error } = await supabase.rpc('get_schema_info'); // Unlikely to exist
        if (error) {
            // Plan B: Try to insert an empty object and see what columns are mandated
            const { error: insertError } = await supabase.from('items').insert([{}]);
            console.log("Insert error details:");
            console.log(JSON.stringify(insertError, null, 2));
        }
    } catch (e) {
        console.log(e);
    }
}

listColumns();
