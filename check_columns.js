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

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    const { data, error } = await supabase.from('items').select('*').limit(1);
    if (error) {
        console.error("Error fetching items:", error.message);
    } else if (data.length > 0) {
        console.log("Columns found in 'items' table:");
        console.log(Object.keys(data[0]));
    } else {
        console.log("No rows in 'items' table to check schema.");
    }
}

checkSchema();
