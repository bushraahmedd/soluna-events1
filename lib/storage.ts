import { supabase } from './supabase';

export async function uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

    if (uploadError) {
        throw new Error(uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

    return publicUrl;
}

export async function deleteImage(url: string) {
    try {
        const fileName = url.split('/').pop();
        if (!fileName) return;

        const { error } = await supabase.storage
            .from('images')
            .remove([fileName]);

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}
