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

async function verify() {
    console.log("--- Supabase Verification ---");

    // 1. Check Table Columns
    const tables = ['categories', 'items'];
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`❌ ${table} table access error:`, error.message);
        } else {
            console.log(`✅ ${table} table is accessible.`);
            if (data.length > 0) {
                console.log(`   Columns in ${table}:`, Object.keys(data[0]).join(', '));
            } else {
                // Try to get column names by selecting a non-existent column to trigger error
                const { error: colError } = await supabase.from(table).select('non_existent_column_for_debug');
                console.log(`   (No rows found. Use dashboard to verify columns if needed)`);
            }
        }
    }

    // 2. Check Storage
    console.log("\n--- Storage Check ---");
    const testFileName = `test-${Date.now()}.txt`;
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(testFileName, 'verification test content');

    if (uploadError) {
        console.log("❌ Storage 'images' bucket test FAILED:", uploadError.message);
        if (uploadError.message.includes("not found")) {
            console.log("   👉 The bucket 'images' does not exist yet.");
        }
    } else {
        console.log("✅ Storage 'images' bucket is working and accessible!");
        // Clean up
        await supabase.storage.from('images').remove([testFileName]);
    }
}

verify();
