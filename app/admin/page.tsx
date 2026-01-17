import { AdminPanel } from "@/components/AdminPanel";
import Link from "next/link";

export default function AdminPage() {
    return (
        <main className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-4">
            <h1 className="text-[#2C2420] text-xl font-cinzel font-bold absolute top-6 left-6 flex items-center gap-2">
                <img src="/logo.png" alt="Soluna Logo" className="w-16 h-16 object-contain" />
                SOLUNA ADMIN
            </h1>
            <Link href="/" className="absolute top-6 right-6 font-tajawal font-bold text-[#2C2420] hover:text-[#B89E5F] transition-colors">
                ← العودة للموقع
            </Link>
            <AdminPanel />
        </main>
    );
}
