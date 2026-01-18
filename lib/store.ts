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

            set({
                categories: categoriesRes.data || [],
                items: itemsRes.data || [],
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
                    if (data) set({ items: data });
                })
                .subscribe();

        } catch (error) {
            console.error('Error initializing Supabase store:', error);
            set({ isLoading: false });
        }
    },

    addCategory: async (category) => {
        const { error } = await supabase.from('categories').insert([category]);
        if (error) console.error('Error adding category:', error);
    },

    updateCategory: async (id, name) => {
        const { error } = await supabase.from('categories').update({ name }).eq('id', id);
        if (error) console.error('Error updating category:', error);
    },

    deleteCategory: async (id) => {
        // Items will be deleted via cascade if set up in DB, or manually here
        const { error: itemError } = await supabase.from('items').delete().eq('categoryId', id);
        const { error: catError } = await supabase.from('categories').delete().eq('id', id);
        if (itemError) console.error('Error deleting items for category:', itemError);
        if (catError) console.error('Error deleting category:', catError);
    },

    addItem: async (item) => {
        const { error } = await supabase.from('items').insert([item]);
        if (error) console.error('Error adding item:', error);
    },

    updateItem: async (updatedItem) => {
        const { error } = await supabase.from('items').update(updatedItem).eq('id', updatedItem.id);
        if (error) console.error('Error updating item:', error);
    },

    deleteItem: async (id) => {
        const { error } = await supabase.from('items').delete().eq('id', id);
        if (error) console.error('Error deleting item:', error);
    },

    getCategories: () => get().categories,
    getItemsByCategory: (categoryId) => get().items.filter((i) => i.categoryId === categoryId),
}));

