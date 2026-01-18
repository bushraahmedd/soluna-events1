const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
let supabaseUrl = '';
let supabaseAnonKey = '';

try {
    const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
        if (line.includes('NEXT_PUBLIC_SUPABASE_URL=')) {
            supabaseUrl = line.split('=')[1].trim();
        }
        if (line.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
            supabaseAnonKey = line.split('=')[1].trim();
        }
    });
} catch (e) {
    console.error('❌ Failed to read .env.local file');
    process.exit(1);
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase credentials not found in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
    console.log('🔍 Checking Supabase integration...');

    // Check categories table
    const { data: categories, error: catError } = await supabase.from('categories').select('count', { count: 'exact', head: true });
    if (catError) {
        if (catError.message.includes('relation "public.categories" does not exist')) {
            console.log('❌ TABLE MISSING: "categories" table does not exist.');
        } else {
            console.error('❌ Error checking "categories":', catError.message);
        }
    } else {
        console.log('✅ TABLE EXISTS: "categories" table is ready.');
    }

    // Check items table
    const { data: items, error: itemError } = await supabase.from('items').select('count', { count: 'exact', head: true });
    if (itemError) {
        if (itemError.message.includes('relation "public.items" does not exist')) {
            console.log('❌ TABLE MISSING: "items" table does not exist.');
        } else {
            console.error('❌ Error checking "items":', itemError.message);
        }
    } else {
        console.log('✅ TABLE EXISTS: "items" table is ready.');
    }

    // Check storage bucket
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
        console.error('❌ Error checking storage buckets:', bucketError.message);
    } else {
        const hasImagesBucket = buckets.find(b => b.id === 'images');
        if (hasImagesBucket) {
            console.log('✅ STORAGE READY: "images" bucket exists.');
        } else {
            console.log('❌ STORAGE MISSING: "images" bucket does not exist.');
        }
    }

    process.exit(0);
}

checkDatabase();
