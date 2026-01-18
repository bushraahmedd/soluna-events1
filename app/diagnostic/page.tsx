"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";

export default function DiagnosticPage() {
    const { categories, items } = useStore();
    const [dbCategories, setDbCategories] = useState<any[]>([]);
    const [dbItems, setDbItems] = useState<any[]>([]);
    const [realtimeStatus, setRealtimeStatus] = useState("Checking...");
    const [lastUpdate, setLastUpdate] = useState("");

    useEffect(() => {
        // Fetch direct from DB
        const fetchData = async () => {
            const { data: cats } = await supabase.from('categories').select('*');
            const { data: itms } = await supabase.from('items').select('*');
            setDbCategories(cats || []);
            setDbItems(itms || []);
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

        // Test realtime
        const channel = supabase
            .channel('diagnostic-test')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
                setRealtimeStatus("✅ Active");
                setLastUpdate(new Date().toLocaleTimeString());
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, () => {
                setRealtimeStatus("✅ Active");
                setLastUpdate(new Date().toLocaleTimeString());
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    setRealtimeStatus("🟡 Subscribed (waiting for changes)");
                } else if (status === 'CHANNEL_ERROR') {
                    setRealtimeStatus("❌ Error");
                } else if (status === 'TIMED_OUT') {
                    setRealtimeStatus("⏱️ Timed Out");
                }
            });

        return () => {
            clearInterval(interval);
            channel.unsubscribe();
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8" dir="ltr">
            <div className="max-w-6xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Sync Diagnostic Tool</h1>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Realtime Status</h2>
                    <p className="text-lg">{realtimeStatus}</p>
                    {lastUpdate && <p className="text-sm text-gray-600">Last update: {lastUpdate}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Zustand Store (Local UI State)</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-700">Categories ({categories.length})</h3>
                                <ul className="list-disc list-inside text-sm">
                                    {categories.map(c => <li key={c.id}>{c.name}</li>)}
                                    {categories.length === 0 && <li className="text-gray-400">Empty</li>}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Items ({items.length})</h3>
                                <ul className="list-disc list-inside text-sm">
                                    {items.map(i => <li key={i.id}>{i.name} - {i.price}</li>)}
                                    {items.length === 0 && <li className="text-gray-400">Empty</li>}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Supabase Database (Cloud Truth)</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-700">Categories ({dbCategories.length})</h3>
                                <ul className="list-disc list-inside text-sm">
                                    {dbCategories.map(c => <li key={c.id}>{c.name}</li>)}
                                    {dbCategories.length === 0 && <li className="text-gray-400">Empty</li>}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Items ({dbItems.length})</h3>
                                <ul className="list-disc list-inside text-sm">
                                    {dbItems.map(i => <li key={i.id}>{i.name} - {i.price}</li>)}
                                    {dbItems.length === 0 && <li className="text-gray-400">Empty</li>}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                        <strong>How to use:</strong> Keep this page open. Go to the Admin Panel and add a category or item.
                        Watch if the numbers change here. If "Supabase Database" updates but "Zustand Store" doesn't, it's a Realtime issue.
                        If neither updates, the data isn't being saved to Supabase.
                    </p>
                </div>
            </div>
        </div>
    );
}
