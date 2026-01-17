'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';

export function StoreInitializer() {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            useStore.getState().initialize();
            initialized.current = true;
        }
    }, []);

    return null;
}
