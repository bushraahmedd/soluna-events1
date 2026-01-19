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
    const columnsToTry = ['categoryId', 'category_id', 'categoryid', 'salePrice', 'sale_price', 'saleprice'];
    const results = {};

    for (const col of columnsToTry) {
        const { error } = await supabase.from('items').select(col).limit(1);
        results[col] = error ? '❌ ' + error.message : '✅ EXISTS';
    }

    console.log(JSON.stringify(results, null, 2));
}

listColumns();
