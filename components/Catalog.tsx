"use client";

import { useState, useEffect } from "react";
import { useStore, Item } from "@/lib/store";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Catalog() {
    const { categories, items: storeItems, getItemsByCategory, isLoading, isConnected } = useStore();
    const [activeCategoryId, setActiveCategoryId] = useState("");
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    useEffect(() => {
        if (categories.length > 0 && !activeCategoryId) {
            setActiveCategoryId(categories[0].id);
        }
    }, [categories, activeCategoryId]);

    // If active category is deleted or list changes, ensure we have a valid selection
    useEffect(() => {
        if (categories.length > 0) {
            if (!activeCategoryId || !categories.find(c => c.id === activeCategoryId)) {
                setActiveCategoryId(categories[0].id);
            }
        }
    }, [categories, activeCategoryId]);

    const items = activeCategoryId ? getItemsByCategory(activeCategoryId) : [];

    if (isLoading && categories.length === 0) {
        return <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center font-tajawal text-[#6B625E]">جاري التحميل...</div>;
    }

    return (
        <section className="min-h-screen bg-[#FDFCF8] py-20 px-4 md:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-tajawal font-bold text-[#2C2420] mb-3">تنسيقاتنا المميزة</h2>
                    <div className="h-1 w-24 bg-[#B89E5F] mx-auto rounded-full mb-4" />
                    <div className="flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.4)]" : "bg-amber-500 animate-pulse"}`} />
                        <span className="font-tajawal text-xs text-[#6B625E] opacity-70">
                            {isConnected ? "مزامنة سحابية نشطة" : "جاري الاتصال بالسحابة..."}
                        </span>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategoryId(category.id)}
                            className={cn(
                                "px-8 py-3 rounded-full text-base font-tajawal font-medium transition-all duration-300 border",
                                activeCategoryId === category.id
                                    ? "bg-[#2C2420] text-[#FDFCF8] border-[#2C2420] shadow-lg scale-105"
                                    : "bg-white text-[#6B625E] border-[#EBE9E1] hover:border-[#B89E5F] hover:text-[#B89E5F]"
                            )}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {items.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center text-[#6B625E] py-20 font-tajawal text-lg"
                            >
                                لا يوجد عناصر في هذا القسم
                            </motion.div>
                        ) : (
                            items.map((item) => (
                                <ItemCard key={item.id} item={item} onSelect={() => setSelectedItem(item)} />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Item Details Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <ItemDetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
                )}
            </AnimatePresence>
        </section>
    );
}

function ItemCard({ item, onSelect }: { item: Item; onSelect: () => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="overflow-hidden bg-white border-[#EBE9E1] group hover:border-[#B89E5F]/50 hover:shadow-xl transition-all duration-500 h-full flex flex-col rounded-2xl cursor-pointer" onClick={onSelect}>
                <div className="relative aspect-square w-full overflow-hidden bg-[#F9F8F4]">
                    {(item.images && item.images.length > 0 ? item.images[0] : item.image) ? (
                        <Image
                            src={(item.images && item.images.length > 0 ? item.images[0] : item.image)!}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#EBE9E1]">
                            <span className="text-4xl font-cinzel italic">Soluna</span>
                        </div>
                    )}
                    {item.salePrice && (
                        <div className="absolute top-4 right-4">
                            <Badge className="bg-[#B89E5F] text-white border-none text-lg px-3 py-1 font-tajawal shadow-md">عرض خاص</Badge>
                        </div>
                    )}
                </div>
                <CardHeader className="pt-6">
                    <h3 className="text-xl font-tajawal font-bold text-[#2C2420] group-hover:text-[#B89E5F] transition-colors">{item.name}</h3>
                </CardHeader>
                <CardFooter className="mt-auto flex justify-between items-end pb-6">
                    <div className="flex flex-col">
                        {item.salePrice ? (
                            <>
                                <span className="text-sm text-[#6B625E] line-through font-tajawal">{item.price} د.أ</span>
                                <span className="text-2xl font-bold text-[#B89E5F] font-tajawal">{item.salePrice} د.أ</span>
                            </>
                        ) : (
                            <span className="text-2xl font-bold text-[#2C2420] font-tajawal">{item.price} د.أ</span>
                        )}
                    </div>
                    <button className="text-sm text-[#6B625E] hover:text-[#B89E5F] font-medium transition-colors font-tajawal flex items-center gap-1 group/btn">
                        التفاصيل
                        <span className="block max-w-0 group-hover/btn:max-w-full transition-all duration-300 h-0.5 bg-[#B89E5F]"></span>
                    </button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

function ItemDetailsModal({ item, onClose }: { item: Item; onClose: () => void }) {
    const images = item.images && item.images.length > 0 ? item.images : (item.image ? [item.image] : []);
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#FDFCF8] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-[#B89E5F]/30 flex flex-col md:flex-row overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                dir="rtl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 z-10 bg-white/50 hover:bg-white text-[#2C2420] rounded-full p-2 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>

                {/* Left: Image Gallery */}
                <div className="w-full md:w-1/2 bg-[#F9F8F4] relative aspect-square md:aspect-auto">
                    {images.length > 0 ? (
                        <>
                            <Image
                                src={images[currentImageIdx]}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                            {images.length > 1 && (
                                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIdx(idx)}
                                            className={cn(
                                                "w-2 h-2 rounded-full transition-all",
                                                currentImageIdx === idx ? "bg-[#B89E5F] w-4" : "bg-white/50 hover:bg-white"
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#EBE9E1]">
                            <span className="text-4xl font-cinzel italic">Soluna</span>
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-1/2 p-8 flex flex-col bg-white">
                    <div className="mb-6">
                        <Badge className="mb-2 bg-[#F9F8F4] text-[#6B625E] hover:bg-[#F9F8F4] border-[#EBE9E1]">
                            تنسيق مميز
                        </Badge>
                        <h2 className="text-3xl font-tajawal font-bold text-[#2C2420] mb-2">{item.name}</h2>

                        <div className="flex items-end gap-3 mb-6">
                            {item.salePrice ? (
                                <>
                                    <span className="text-3xl font-bold text-[#B89E5F] font-tajawal">{item.salePrice} د.أ</span>
                                    <span className="text-lg text-[#6B625E] line-through font-tajawal mb-1">{item.price} د.أ</span>
                                </>
                            ) : (
                                <span className="text-3xl font-bold text-[#2C2420] font-tajawal">{item.price} د.أ</span>
                            )}
                        </div>

                        <div className="w-full h-px bg-[#EBE9E1] mb-6" />

                        {item.description && (
                            <div className="mb-8">
                                <h3 className="font-bold text-[#2C2420] font-tajawal mb-2">التفاصيل</h3>
                                <p className="text-[#6B625E] font-tajawal leading-relaxed whitespace-pre-wrap">
                                    {item.description}
                                </p>
                            </div>
                        )}

                        <div className="mt-auto">
                            <a
                                href={`https://wa.me/218918405037?text=أهلاً، أود الاستفسار عن: ${item.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-[#2C2420] hover:bg-[#B89E5F] text-white text-center py-4 rounded-xl font-bold font-tajawal transition-colors"
                            >
                                طلب / استفسار عبر واتساب
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
