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

async function seed() {
    console.log("Seeding initial data...");

    const catId = 'eb514971-5485-4efd-94cc-46d1f6fbef87';
    const { error: catError } = await supabase.from('categories').insert([
        { id: catId, name: 'تنسيقات ملكية' }
    ]).select();

    if (catError && !catError.message.includes('duplicate key')) {
        console.error("❌ Error adding category:", catError.message);
        return;
    }
    console.log("✅ Category checked/added.");

    const { error: itemError } = await supabase.from('items').insert([
        {
            id: '7b7ad143-559d-4720-bd9c-46d1f6fbef87',
            name: 'تنسيق الطاولة الذهبية',
            price: 1500,
            sale_price: 1200,
            category_id: catId,
            description: 'تنسيق فاخر يضم شمعدانات ذهبية وكريستالات عالمية.'
        }
    ]);

    if (itemError && !itemError.message.includes('duplicate key')) {
        console.error("❌ Error adding item:", itemError.message);
    } else {
        console.log("✅ Sample item checked/added.");
    }

    console.log("\nDone! Refresh http://localhost:3000 to see the result.");
}

seed();
