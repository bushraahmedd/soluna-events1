import { supabase } from './supabase';

async function compressImage(file: File): Promise<Blob | File> {
    // Only compress if we are in the browser
    if (typeof window === 'undefined') return file;

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Max dimensions for web use
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        resolve(blob || file);
                    },
                    'image/jpeg',
                    0.8 // 80% quality is a good balance
                );
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
}

export async function uploadImage(file: File): Promise<string> {
    const compressedFile = await compressImage(file);
    const fileExt = 'jpg'; // Use jpg as we compress to jpeg
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, compressedFile);

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
