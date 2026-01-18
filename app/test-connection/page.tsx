"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestConnectionPage() {
    const [results, setResults] = useState<string[]>([]);
    const [isTesting, setIsTesting] = useState(false);

    const addLog = (message: string) => {
        setResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const runTests = async () => {
        setResults([]);
        setIsTesting(true);

        // Test 1: Check credentials
        addLog("🔍 Checking Supabase credentials...");
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url) {
            addLog("❌ ERROR: NEXT_PUBLIC_SUPABASE_URL is Missing!");
        } else if (url === 'https://placeholder.supabase.co') {
            addLog("❌ ERROR: Using placeholder URL! Env var not loaded.");
        } else {
            addLog(`✅ URL Found: ${url.substring(0, 15)}...`);
        }

        if (!key) {
            addLog("❌ ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY is Missing!");
        } else if (key === 'placeholder') {
            addLog("❌ ERROR: Using placeholder Key! Env var not loaded.");
        } else {
            addLog(`✅ Key Found: ${key.substring(0, 10)}... (Length: ${key.length})`);
        }

        // Test 2: Try to read from categories
        addLog("🔍 Testing READ access to 'categories' table...");
        try {
            const { data, error } = await supabase.from('categories').select('*');
            if (error) {
                addLog(`❌ READ FAILED: ${error.message}`);
            } else {
                addLog(`✅ READ SUCCESS: Found ${data?.length || 0} categories`);
            }
        } catch (e: any) {
            addLog(`❌ READ EXCEPTION: ${e.message}`);
        }

        // Test 3: Try to insert a test category
        addLog("🔍 Testing WRITE access to 'categories' table...");
        const testCategory = {
            id: `test-${Date.now()}`,
            name: `Test Category ${new Date().toLocaleTimeString()}`
        };

        try {
            const { data, error } = await supabase.from('categories').insert([testCategory]);
            if (error) {
                addLog(`❌ WRITE FAILED: ${error.message}`);
                addLog(`   Error code: ${error.code}`);
                addLog(`   Error hint: ${error.hint || 'N/A'}`);
            } else {
                addLog(`✅ WRITE SUCCESS: Category inserted!`);

                // Test 4: Try to delete it
                addLog("🔍 Testing DELETE access...");
                const { error: deleteError } = await supabase.from('categories').delete().eq('id', testCategory.id);
                if (deleteError) {
                    addLog(`❌ DELETE FAILED: ${deleteError.message}`);
                } else {
                    addLog(`✅ DELETE SUCCESS: Test category removed`);
                }
            }
        } catch (e: any) {
            addLog(`❌ WRITE EXCEPTION: ${e.message}`);
        }

        // Test 5: Check Realtime
        addLog("🔍 Testing Realtime subscription...");
        let realtimeWorked = false;

        const channel = supabase
            .channel('test-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
                realtimeWorked = true;
                addLog(`✅ REALTIME: Event received!`);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    addLog(`✅ REALTIME: Subscribed successfully`);
                } else if (status === 'CHANNEL_ERROR') {
                    addLog(`❌ REALTIME: Subscription failed`);
                } else if (status === 'TIMED_OUT') {
                    addLog(`❌ REALTIME: Subscription timed out`);
                } else {
                    addLog(`🟡 REALTIME: Status = ${status}`);
                }
            });

        // Wait a bit for subscription
        await new Promise(resolve => setTimeout(resolve, 3000));
        channel.unsubscribe();

        // Test 6: Storage Check
        addLog("🔍 Testing Storage 'images' bucket...");
        try {
            const testBlob = new Blob(['test-file'], { type: 'text/plain' });
            const fileName = `diagnostic-${Date.now()}.txt`;

            // Upload
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(fileName, testBlob);

            if (uploadError) {
                addLog(`❌ STORAGE UPLOAD FAILED: ${uploadError.message}`);
            } else {
                addLog(`✅ STORAGE UPLOAD SUCCESS`);

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(fileName);
                addLog(`✅ PUBLIC URL GEN: ${publicUrl ? 'OK' : 'FAIL'}`);

                // Clean up
                await supabase.storage.from('images').remove([fileName]);
            }
        } catch (e: any) {
            addLog(`❌ STORAGE EXCEPTION: ${e.message}`);
        }

        setIsTesting(false);
        addLog("✅ All tests completed!");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Supabase Connection Tester</h1>
                    <button
                        onClick={runTests}
                        disabled={isTesting}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        {isTesting ? "Testing..." : "Run All Tests"}
                    </button>
                </div>

                {results.length > 0 && (
                    <div className="bg-gray-900 rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Test Results</h2>
                        <div className="font-mono text-sm space-y-1 text-green-400">
                            {results.map((result, idx) => (
                                <div key={idx} className={
                                    result.includes('❌') ? 'text-red-400' :
                                        result.includes('✅') ? 'text-green-400' :
                                            result.includes('🟡') ? 'text-yellow-400' :
                                                'text-gray-300'
                                }>
                                    {result}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
