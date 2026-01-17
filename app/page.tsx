import { Hero } from "@/components/Hero";
import { Catalog } from "@/components/Catalog";
import { Navbar } from "@/components/Navbar";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-900 selection:text-white pb-0">
      <Navbar />
      <Hero />
      <div id="catalog">
        <Catalog />
      </div>
      <Contact />
    </main>
  );
}
