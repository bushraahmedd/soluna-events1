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

async function checkSchema() {
    // Try to insert a dummy item to see the error message
    const { error } = await supabase.from('items').insert([{
        id: 'test-schema-' + Date.now(),
        name: 'test',
        price: 0,
        categoryId: 'eb514971-50e5-4720-bd9c-46d1f6fbef' // Valid ID from inspector
    }]);

    if (error) {
        console.log(JSON.stringify(error, null, 2));
    } else {
        console.log("Insert success - schema seems OK for basic fields.");
    }
}

checkSchema();
