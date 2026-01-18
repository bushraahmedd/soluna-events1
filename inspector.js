const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Read .env.local manually
const envPath = path.resolve(__dirname, '.env.local');
let envVars = {};

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) envVars[key.trim()] = value.trim();
    });
} catch (e) {
    console.error("❌ Could not search .env.local. Making sure I am in the right folder...");
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || 'https://apicsvdfvouqraercnmv.supabase.co'; // Fallback to what we know
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Stats: Missing API Keys in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log("🕵️‍♂️ Inspecting Supabase Project...\n");

    // 1. Check Tables
    console.log("Checking Tables:");
    const { data: categories, error: catError } = await supabase.from('categories').select('*');
    if (catError) console.log(`   ❌ Categories: Error - ${catError.message}`);
    else console.log(`   ✅ Categories: Found ${categories.length} rows`);

    const { data: items, error: itemError } = await supabase.from('items').select('*');
    if (itemError) console.log(`   ❌ Items: Error - ${itemError.message}`);
    else console.log(`   ✅ Items: Found ${items.length} rows`);

    // 2. Check Storage
    console.log("\nChecking Storage:");
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
        console.log(`   ❌ Error listing buckets: ${bucketError.message}`);
    } else {
        const imagesBucket = buckets.find(b => b.name === 'images');
        if (imagesBucket) {
            console.log(`   ✅ Bucket 'images' exists (Public: ${imagesBucket.public})`);

            // Test Upload
            console.log("   👉 Testing upload permission...");
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(`inspector-test-${Date.now()}.txt`, 'test connection', { upsert: true });

            if (uploadError) console.log(`   ❌ Upload Failed: ${uploadError.message}`);
            else console.log(`   ✅ Upload Success! (Write permission OK)`);

        } else {
            console.log(`   ❌ Bucket 'images' NOT found.`);
            console.log(`       Found: ${buckets.map(b => b.name).join(', ') || 'None'}`);
        }
    }
}

inspect();
