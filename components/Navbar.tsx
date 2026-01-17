"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

import { X } from "lucide-react";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-40 p-4 md:p-6 transition-all duration-300",
            isScrolled ? "bg-[#FDFCF8]/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        )}>
            <div className="container mx-auto flex items-center justify-between relative z-50">
                {/* Logo */}
                <Link href="/" className="relative">
                    <div className="relative h-16 w-16 md:h-20 md:w-20 drop-shadow-md hover:scale-105 transition-transform duration-500">
                        <Image
                            src="/logo.png"
                            alt="Soluna Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10 text-lg">
                    {["الرئيسية", "كتالوج المناسبات", "تواصل معنا"].map((item, i) => (
                        <Link
                            key={i}
                            href={i === 1 ? "#catalog" : i === 2 ? "#contact" : "/"}
                            className={cn(
                                "font-tajawal font-medium transition-colors relative group",
                                isScrolled ? "text-[#2C2420] hover:text-[#B89E5F]" : "text-[#2C2420] hover:text-[#B89E5F]"
                            )}
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#B89E5F] transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <Button variant="ghost" className={cn("md:hidden", isScrolled ? "text-[#2C2420]" : "text-[#2C2420]")} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <span className="sr-only">Menu</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                </Button>
            </div>

            {/* Mobile Menu Overlay */}
            <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? "0%" : "100%" }}
                transition={{ duration: 0.3 }}
                className={cn(
                    "fixed inset-0 z-40 bg-[#FDFCF8] md:hidden flex flex-col items-center justify-center gap-8",
                    isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
                )}
            >
                {/* Close Button */}
                <Button variant="ghost" className="absolute top-6 right-6 text-[#2C2420]" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="w-8 h-8" />
                </Button>

                {["الرئيسية", "كتالوج المناسبات", "تواصل معنا"].map((item, i) => (
                    <Link
                        key={i}
                        href={i === 1 ? "#catalog" : i === 2 ? "#contact" : "/"}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl font-tajawal font-bold text-[#2C2420] hover:text-[#B89E5F] transition-colors"
                    >
                        {item}
                    </Link>
                ))}
            </motion.div>
        </nav>
    );
}
