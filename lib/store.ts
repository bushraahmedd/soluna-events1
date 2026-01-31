import { create } from 'zustand';
import { supabase } from './supabase';

export type Category = {
    id: string;
    name: string;
};

export type Item = {
    id: string;
    name: string;
    price: number;
    salePrice?: number | null;
    categoryId: string;
    image?: string;
    images?: string[];
    description?: string;
};

interface StoreState {
    categories: Category[];
    items: Item[];
    isLoading: boolean;
    initialize: () => Promise<void>;
    addCategory: (category: Category) => Promise<void>;
    updateCategory: (id: string, name: string) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    addItem: (item: Item) => Promise<void>;
    updateItem: (item: Item) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    getCategories: () => Category[];
    getItemsByCategory: (categoryId: string) => Item[];
}

export const useStore = create<StoreState>()((set, get) => ({
    categories: [],
    items: [],
    isLoading: false,

    initialize: async () => {
        set({ isLoading: true });
        try {
            // Fetch initial data
            const [categoriesRes, itemsRes] = await Promise.all([
                supabase.from('categories').select('*'),
                supabase.from('items').select('*')
            ]);

            if (categoriesRes.error) throw categoriesRes.error;
            if (itemsRes.error) throw itemsRes.error;

            const mappedItems = (itemsRes.data || []).map((i: any) => ({
                ...i,
                // Flexible mapping to handle both snake_case (DB standard) and camelCase (potential legacy)
                categoryId: i.category_id || i.categoryId || i.categoryid || '',
                salePrice: i.sale_price !== undefined ? i.sale_price : i.salePrice,
                images: i.images || (i.image ? [i.image] : [])
            }));

            set({
                categories: categoriesRes.data || [],
                items: mappedItems,
                isLoading: false
            });

            // Set up real-time subscriptions
            supabase
                .channel('db-changes')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, async () => {
                    const { data } = await supabase.from('categories').select('*');
                    if (data) set({ categories: data });
                })
                .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, async () => {
                    const { data } = await supabase.from('items').select('*');
                    if (data) {
                        const updatedItems = data.map((i: any) => ({
                            ...i,
                            categoryId: i.category_id || i.categoryId || i.categoryid || '',
                            salePrice: i.sale_price !== undefined ? i.sale_price : i.salePrice,
                            images: i.images || (i.image ? [i.image] : [])
                        }));
                        set({ items: updatedItems });
                    }
                })
                .subscribe();

        } catch (error: any) {
            console.error('Error initializing Supabase store:', error.message || error);
            set({ isLoading: false });
        }
    },

    addCategory: async (category) => {
        // Optimistic update
        set((state) => ({ categories: [...state.categories, category] }));

        const { error } = await supabase.from('categories').insert([category]);
        if (error) {
            console.error('Error adding category:', error);
            // Revert on error
            const { data } = await supabase.from('categories').select('*');
            if (data) set({ categories: data });
        }
    },

    updateCategory: async (id, name) => {
        // Optimistic update
        set((state) => ({
            categories: state.categories.map((c) => (c.id === id ? { ...c, name } : c)),
        }));

        const { error } = await supabase.from('categories').update({ name }).eq('id', id);
        if (error) {
            console.error('Error updating category:', error);
            const { data } = await supabase.from('categories').select('*');
            if (data) set({ categories: data });
        }
    },

    deleteCategory: async (id) => {
        // Optimistic update
        set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
            items: state.items.filter((i) => i.categoryId !== id),
        }));

        const { error: itemError } = await supabase.from('items').delete().eq('category_id', id);
        const { error: catError } = await supabase.from('categories').delete().eq('id', id);

        if (itemError || catError) {
            console.error('Error deleting category:', itemError || catError);
            // Revert
            const [categoriesRes, itemsRes] = await Promise.all([
                supabase.from('categories').select('*'),
                supabase.from('items').select('*')
            ]);
            if (categoriesRes.data) set({ categories: categoriesRes.data });
            if (itemsRes.data) {
                const mapped = itemsRes.data.map((i: any) => ({
                    ...i,
                    categoryId: i.category_id || i.categoryId || i.categoryid || '',
                    salePrice: i.sale_price !== undefined ? i.sale_price : i.salePrice,
                    images: i.images || (i.image ? [i.image] : [])
                }));
                set({ items: mapped });
            }
        }
    },

    addItem: async (item) => {
        // Optimistic update
        set((state) => ({ items: [...state.items, item] }));

        // Map for DB (snake_case)
        const dbItem = {
            id: item.id,
            name: item.name,
            price: Number(item.price),
            sale_price: item.salePrice ? Number(item.salePrice) : null,
            category_id: item.categoryId,
            images: item.images || [],
            description: item.description || ''
        };

        const { error } = await supabase.from('items').insert([dbItem]);
        if (error) {
            console.error('Error adding item:', error);
            // Revert on error - re-fetch to be safe
            const { data } = await supabase.from('items').select('*');
            if (data) {
                const mapped = data.map((i: any) => ({
                    ...i,
                    categoryId: i.category_id || i.categoryId || i.categoryid || '',
                    salePrice: i.sale_price !== undefined ? i.sale_price : i.salePrice,
                    images: i.images || (i.image ? [i.image] : [])
                }));
                set({ items: mapped });
            }
        }
    },

    updateItem: async (updatedItem) => {
        // Optimistic update
        set((state) => ({
            items: state.items.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
        }));

        // Map for DB
        const dbItem = {
            name: updatedItem.name,
            price: Number(updatedItem.price),
            sale_price: updatedItem.salePrice ? Number(updatedItem.salePrice) : null,
            category_id: updatedItem.categoryId,
            images: updatedItem.images || [],
            description: updatedItem.description || ''
        };

        const { error } = await supabase.from('items').update(dbItem).eq('id', updatedItem.id);
        if (error) {
            console.error('Error updating item:', error);
            const { data } = await supabase.from('items').select('*');
            if (data) {
                const mapped = data.map((i: any) => ({
                    ...i,
                    categoryId: i.category_id || i.categoryId || i.categoryid || '',
                    salePrice: i.sale_price !== undefined ? i.sale_price : i.salePrice,
                    images: i.images || (i.image ? [i.image] : [])
                }));
                set({ items: mapped });
            }
        }
    },

    deleteItem: async (id) => {
        // Optimistic update
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));

        const { error } = await supabase.from('items').delete().eq('id', id);
        if (error) {
            console.error('Error deleting item:', error);
            const { data } = await supabase.from('items').select('*');
            if (data) {
                const mapped = data.map((i: any) => ({
                    ...i,
                    categoryId: i.category_id || i.categoryId || i.categoryid || '',
                    salePrice: i.sale_price !== undefined ? i.sale_price : i.salePrice,
                    images: i.images || (i.image ? [i.image] : [])
                }));
                set({ items: mapped });
            }
        }
    },

    getCategories: () => get().categories,
    getItemsByCategory: (categoryId) => get().items.filter((i) => i.categoryId === categoryId),
}));

