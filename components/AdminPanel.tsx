"use client";

import { useState, useEffect } from "react";
import { useStore, Category, Item } from "@/lib/store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Plus, Pencil, Trash, X, Save, Upload, Image as ImageIcon } from "lucide-react";

export function AdminPanel() {
    const {
        categories, items,
        addCategory, updateCategory, deleteCategory,
        addItem, updateItem, deleteItem
    } = useStore();
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    const [activeTab, setActiveTab] = useState<"categories" | "items">("items");

    // Form States
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [newCategoryName, setNewCategoryName] = useState("");

    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [itemForm, setItemForm] = useState<Partial<Item>>({
        name: "", price: 0, salePrice: undefined, categoryId: "", images: [], description: ""
    });

    const handleCreateCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName) return;
        addCategory({ id: crypto.randomUUID(), name: newCategoryName });
        setNewCategoryName("");
    };

    const handleUpdateCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory || !editingCategory.name) return;
        updateCategory(editingCategory.id, editingCategory.name);
        setEditingCategory(null);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImages: string[] = [];
            let processed = 0;

            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        newImages.push(reader.result as string);
                        processed++;
                        if (processed === files.length) {
                            setItemForm(prev => ({
                                ...prev,
                                images: [...(prev.images || []), ...newImages]
                            }));
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setItemForm(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index)
        }));
    };

    const handleItemSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemForm.name || !itemForm.price || !itemForm.categoryId) return;

        const itemData = {
            name: itemForm.name,
            price: Number(itemForm.price),
            salePrice: itemForm.salePrice ? Number(itemForm.salePrice) : undefined,
            categoryId: itemForm.categoryId,
            images: itemForm.images || [],
            image: itemForm.images?.[0] || "" // Fallback
        };

        if (editingItem) {
            updateItem({ ...editingItem, ...itemData } as Item);
            setEditingItem(null);
        } else {
            addItem({ id: crypto.randomUUID(), ...itemData } as Item);
        }
        // Reset form
        setItemForm({ name: "", price: 0, salePrice: undefined, categoryId: categories[0]?.id || "", images: [] });
    };

    const startEditItem = (item: Item) => {
        setEditingItem(item);
        setItemForm({
            name: item.name,
            price: item.price,
            salePrice: item.salePrice,
            categoryId: item.categoryId,
            images: item.images?.length ? item.images : (item.image ? [item.image] : [])
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditItem = () => {
        setEditingItem(null);
        setItemForm({ name: "", price: 0, salePrice: undefined, categoryId: categories[0]?.id || "", images: [] });
    };

    if (!hasHydrated) return null;

    return (
        <div className="w-full max-w-6xl mx-auto pt-24 pb-12 px-4 dir-rtl">
            {/* Tabs */}
            <div className="flex justify-center gap-8 mb-12 border-b border-[#EBE9E1]">
                <button
                    onClick={() => setActiveTab("items")}
                    className={`font-tajawal font-bold text-xl pb-4 px-4 transition-all ${activeTab === "items" ? "text-[#B89E5F] border-b-4 border-[#B89E5F]" : "text-[#6B625E] hover:text-[#2C2420]"}`}
                >
                    إدارة العناصر (Items)
                </button>
                <button
                    onClick={() => setActiveTab("categories")}
                    className={`font-tajawal font-bold text-xl pb-4 px-4 transition-all ${activeTab === "categories" ? "text-[#B89E5F] border-b-4 border-[#B89E5F]" : "text-[#6B625E] hover:text-[#2C2420]"}`}
                >
                    إدارة التصنيفات (Categories)
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" dir="rtl">
                {activeTab === "items" && (
                    <>
                        {/* Left Column: Form */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="bg-white border-[#EBE9E1] shadow-lg sticky top-24">
                                <CardHeader className="bg-[#FDFCF8] border-b border-[#EBE9E1]">
                                    <CardTitle className="font-tajawal font-bold text-[#2C2420] text-xl flex items-center gap-2">
                                        {editingItem ? <><Pencil className="w-5 h-5" /> تعديل عنصر</> : <><Plus className="w-5 h-5" /> إضافة عنصر جديد</>}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <form onSubmit={handleItemSubmit} className="space-y-4">
                                        <div>
                                            <label className="text-sm font-bold text-[#6B625E] font-tajawal mb-1 block">صور العنصر</label>
                                            <div className="grid grid-cols-4 gap-2 mb-2">
                                                {itemForm.images?.map((img, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#EBE9E1] group">
                                                        <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute top-1 right-1 bg-white/80 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <div className="relative aspect-square bg-[#F9F8F4] border-2 border-dashed border-[#EBE9E1] rounded-lg flex items-center justify-center overflow-hidden group hover:border-[#B89E5F] transition-colors cursor-pointer">
                                                    <ImageIcon className="w-6 h-6 text-[#EBE9E1] group-hover:text-[#B89E5F]" />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleFileUpload}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-xs text-[#6B625E] font-tajawal">يمكنك رفع عدة صور</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-bold text-[#6B625E] font-tajawal mb-1 block">اسم العنصر</label>
                                            <Input
                                                placeholder="اسم العنصر"
                                                value={itemForm.name}
                                                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                                className="bg-[#FDFCF8] border-[#EBE9E1] font-tajawal text-right focus:ring-[#B89E5F] text-[#2C2420]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-sm font-bold text-[#6B625E] font-tajawal mb-1 block">السعر</label>
                                                <Input
                                                    type="number"
                                                    placeholder="السعر"
                                                    value={itemForm.price || ""}
                                                    onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) })}
                                                    className="bg-[#FDFCF8] border-[#EBE9E1] font-tajawal text-right text-[#2C2420]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-[#6B625E] font-tajawal mb-1 block">تخفيض (اختياري)</label>
                                                <Input
                                                    type="number"
                                                    placeholder="تخفيض (اختياري)"
                                                    value={itemForm.salePrice || ""}
                                                    onChange={(e) => setItemForm({ ...itemForm, salePrice: e.target.value ? Number(e.target.value) : undefined })}
                                                    className="bg-[#FDFCF8] border-[#EBE9E1] font-tajawal text-right text-[#2C2420]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-bold text-[#6B625E] font-tajawal mb-1 block">وصف العنصر</label>
                                            <textarea
                                                placeholder="أضف وصفاً تفصيلياً للعنصر..."
                                                value={itemForm.description || ""}
                                                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                                                className="flex min-h-[80px] w-full rounded-md border border-[#EBE9E1] bg-[#FDFCF8] px-3 py-2 text-sm font-tajawal focus:outline-none focus:ring-2 focus:ring-[#B89E5F] text-right text-[#2C2420]"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-bold text-[#6B625E] font-tajawal mb-1 block">التصنيف</label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-[#EBE9E1] bg-[#FDFCF8] px-3 py-2 text-sm font-tajawal focus:outline-none focus:ring-2 focus:ring-[#B89E5F] text-right text-[#2C2420]"
                                                value={itemForm.categoryId}
                                                onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })}
                                            >
                                                <option value="" disabled>اختر التصنيف</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="pt-2 flex gap-2">
                                            <Button type="submit" className="flex-1 bg-[#2C2420] hover:bg-[#B89E5F] text-white font-tajawal font-bold h-10">
                                                {editingItem ? "حفظ التعديلات" : "إضافة العنصر"}
                                            </Button>
                                            {editingItem && (
                                                <Button type="button" variant="ghost" onClick={cancelEditItem} className="font-tajawal text-red-500 hover:text-red-600 hover:bg-red-50">
                                                    إلغاء
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: List */}
                        <div className="lg:col-span-8 space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="group bg-white border border-[#EBE9E1] rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                                    <div className="w-20 h-20 bg-[#F9F8F4] rounded-lg overflow-hidden flex-shrink-0 border border-[#EBE9E1]">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#EBE9E1]"><ImageIcon /></div>
                                        )}
                                    </div>

                                    <div className="flex-1 text-right">
                                        <h3 className="font-bold text-[#2C2420] font-tajawal text-lg mb-1">{item.name}</h3>
                                        <p className="text-[#B89E5F] font-tajawal font-medium">
                                            {item.price} د.أ
                                            {item.salePrice && <span className="text-red-400 line-through text-sm mr-2 opacity-70">{item.salePrice} د.أ</span>}
                                        </p>
                                        <span className="text-xs text-[#6B625E] bg-[#F9F8F4] px-2 py-1 rounded-full mt-2 inline-block font-tajawal">
                                            {categories.find(c => c.id === item.categoryId)?.name || 'غير مصنف'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" onClick={() => startEditItem(item)} className="text-[#6B625E] hover:text-[#B89E5F] hover:bg-[#F9F8F4]">
                                            <Pencil className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => deleteItem(item.id)}>
                                            <Trash className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {items.length === 0 && (
                                <div className="text-center py-12 text-[#6B625E] font-tajawal">
                                    لا يوجد عناصر حتى الآن. ابدأ بإضافة عنصر جديد!
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === "categories" && (
                    <div className="lg:col-span-8 lg:col-start-3 space-y-6">
                        <Card className="bg-white border-[#EBE9E1] shadow-sm mb-8">
                            <CardContent className="p-4 flex gap-2">
                                <Input
                                    placeholder="اسم التصنيف الجديد..."
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="bg-[#FDFCF8] border-[#EBE9E1] focus:ring-[#B89E5F] font-tajawal text-right text-[#2C2420]"
                                />
                                <Button onClick={handleCreateCategory} size="icon" className="bg-[#2C2420] hover:bg-[#B89E5F]"><Plus className="h-5 w-5" /></Button>
                            </CardContent>
                        </Card>

                        <div className="space-y-3">
                            {categories.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between bg-white border border-[#EBE9E1] p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
                                    {editingCategory?.id === cat.id ? (
                                        <form onSubmit={handleUpdateCategory} className="flex flex-1 gap-2">
                                            <Input
                                                value={editingCategory.name}
                                                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                                autoFocus
                                                className="font-tajawal text-right text-[#2C2420]"
                                            />
                                            <Button type="submit" size="sm" className="bg-[#2C2420] font-tajawal">حفظ</Button>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setEditingCategory(null)} className="font-tajawal">إلغاء</Button>
                                        </form>
                                    ) : (
                                        <>
                                            <span className="font-bold font-tajawal text-[#2C2420] text-lg">{cat.name}</span>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => setEditingCategory(cat)} className="text-[#6B625E] hover:text-[#B89E5F]">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600" onClick={() => deleteCategory(cat.id)}>
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
