"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Facebook } from "lucide-react";

export function Contact() {
    return (
        <section id="contact" className="py-20 bg-[#2C2420] text-[#FDFCF8] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#B89E5F] to-transparent" />

            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-cinzel font-bold mb-4 text-[#B89E5F]">تواصل معنا</h2>
                    <p className="text-lg font-tajawal text-stone-300 mb-12 max-w-xl mx-auto">
                        نحن جاهزون لتحويل أحلامكم إلى حقيقة. تواصلوا معنا الآن
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                        {/* Phone */}
                        <a
                            href="tel:+218920786047"
                            className="flex flex-col items-center gap-4 group p-6 rounded-2xl border border-white/5 hover:border-[#B89E5F]/50 hover:bg-white/5 transition-all duration-300 w-full md:w-64"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#B89E5F]/10 flex items-center justify-center group-hover:bg-[#B89E5F] transition-colors duration-300">
                                <Phone className="w-8 h-8 text-[#B89E5F] group-hover:text-[#2C2420]" />
                            </div>
                            <span className="font-tajawal text-lg dir-ltr font-bold text-stone-200">+218 92 0786047</span>
                        </a>

                        {/* Facebook */}
                        <a
                            href="https://www.facebook.com/profile.php?id=61579035951683"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-4 group p-6 rounded-2xl border border-white/5 hover:border-[#B89E5F]/50 hover:bg-white/5 transition-all duration-300 w-full md:w-64"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#B89E5F]/10 flex items-center justify-center group-hover:bg-[#B89E5F] transition-colors duration-300">
                                <Facebook className="w-8 h-8 text-[#B89E5F] group-hover:text-[#2C2420]" />
                            </div>
                            <span className="font-tajawal text-lg font-bold text-stone-200">Facebook</span>
                        </a>

                        {/* WhatsApp (Simulated with phone for now or standard WA link if preferred, usually same number) */}
                        <a
                            href="https://wa.me/218920786047"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-4 group p-6 rounded-2xl border border-white/5 hover:border-[#B89E5F]/50 hover:bg-white/5 transition-all duration-300 w-full md:w-64"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#B89E5F]/10 flex items-center justify-center group-hover:bg-[#B89E5F] transition-colors duration-300">
                                <MessageCircle className="w-8 h-8 text-[#B89E5F] group-hover:text-[#2C2420]" />
                            </div>
                            <span className="font-tajawal text-lg font-bold text-stone-200">WhatsApp</span>
                        </a>
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-4 inset-x-0 text-center text-xs text-stone-500 font-tajawal">
                © 2026 SOLUNA. All rights reserved.
            </div>
        </section>
    );
}
