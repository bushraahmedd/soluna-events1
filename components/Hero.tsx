"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown, Star, Music, Utensils, Camera, X } from "lucide-react";

const HERO_IMAGES = [
    "/hero-luxury.jpg",
    "/hero-bg-2.jpg",
];

export function Hero() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    // Scroll Effects
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    // Mouse 3D Effect for Logo
    const x = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 100, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 100, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            x.set(e.clientX / innerWidth - 0.5);
            mouseY.set(e.clientY / innerHeight - 0.5);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [x, mouseY]);

    return (
        <div ref={ref} className="relative h-screen w-full overflow-hidden bg-[#FDFCF8] perspective-1000">
            {/* Background Layer */}
            <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg-final.jpg"
                    alt="Luxury Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FDFCF8] via-[#FDFCF8]/50 to-transparent" />
            </motion.div>

            {/* Content Layer */}
            <motion.div
                style={{ opacity }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4"
            >
                {/* 3D Floating Logo Container */}
                <motion.div
                    style={{ rotateX, rotateY, z: 100 }}
                    className="relative w-72 h-72 md:w-96 md:h-96 mb-8 cursor-pointer perspective-1000"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="relative w-full h-full drop-shadow-2xl">
                        <Image
                            src="/logo.png"
                            alt="Soluna Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </motion.div>

                {/* Typography with staggered reveal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-center relative z-20"
                >
                    <h1 className="text-6xl md:text-8xl font-cinzel text-[#2C2420] drop-shadow-sm mb-4">
                        SOLUNA
                    </h1>
                    <p className="text-xl md:text-3xl font-tajawal text-[#B89E5F] font-bold tracking-wide max-w-2xl mx-auto leading-relaxed mb-8">
                        لأن الأحلام تستحق أن تروى ، ولحظات العمر تستحق أن تُغلف
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
