import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Category = {
    id: string;
    name: string;
};

export type Item = {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    categoryId: string;
    image?: string; // Kept for backward compatibility key, but UI should prefer images
    images?: string[];
    description?: string;
};

interface StoreState {
    categories: Category[];
    items: Item[];
    addCategory: (category: Category) => void;
    updateCategory: (id: string, name: string) => void;
    deleteCategory: (id: string) => void;
    addItem: (item: Item) => void;
    updateItem: (item: Item) => void;
    deleteItem: (id: string) => void;
    getCategories: () => Category[];
    getItemsByCategory: (categoryId: string) => Item[];
}

export const useStore = create<StoreState>()(
    persist(
        (set, get) => ({
            categories: [
                { id: '1', name: 'تجهيزات الأفراح' },
                { id: '2', name: 'زينة وإضاءة' },
                { id: '3', name: 'طاولات وكراسي' },
            ],
            items: [
                { id: '1', name: 'ثريا كريستال ملكية', price: 1200, salePrice: 999, categoryId: '2', image: '/chandelier.jpg', images: ['/chandelier.jpg'] },
                { id: '2', name: 'مصباح مخملي فاخر', price: 150, categoryId: '2', images: [] },
                { id: '3', name: 'طاولة استقبال ذهبية', price: 300, categoryId: '3', images: [] },
                { id: '4', name: 'كرسي تيفاني (ذهبي)', price: 25, categoryId: '3', images: [] },
                { id: '5', name: 'كوشة عروس ملكية', price: 5000, categoryId: '1', images: [] },
            ],
            addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
            updateCategory: (id, name) => set((state) => ({
                categories: state.categories.map((c) => (c.id === id ? { ...c, name } : c)),
            })),
            deleteCategory: (id) => set((state) => ({
                categories: state.categories.filter((c) => c.id !== id),
                items: state.items.filter((i) => i.categoryId !== id),
            })),
            addItem: (item) => set((state) => ({ items: [...state.items, item] })),
            updateItem: (updatedItem) => set((state) => ({
                items: state.items.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
            })),
            deleteItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            getCategories: () => get().categories,
            getItemsByCategory: (categoryId) => get().items.filter((i) => i.categoryId === categoryId),
        }),
        {
            name: 'soluna-storage',
        }
    )
);
