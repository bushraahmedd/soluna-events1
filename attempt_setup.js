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

async function attemptSetup() {
    console.log("Checking connection...");
    const { data: catData, error: catError } = await supabase.from('categories').select('*').limit(1);

    if (catError) {
        console.error("❌ Database connection failed:", catError.message);
        if (catError.message.includes("fetch failed")) {
            console.log("👉 The database might still be waking up. Please wait 1-2 minutes.");
        }
        return;
    }
    console.log("✅ Database is ONLINE.");

    console.log("Attempting to create 'images' bucket via API...");
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('images', {
        public: true
    });

    if (bucketError) {
        console.log("❌ Could not create bucket via API:", bucketError.message);
        console.log("👉 This is expected if using the ANON key. Admin tasks usually require the SQL editor.");
    } else {
        console.log("✅ Bucket 'images' created successfully!");
    }
}

attemptSetup();
