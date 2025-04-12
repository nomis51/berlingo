class StorageServiceImpl {
    /**
     * Public functions
     */
    public async get<T>(key: string): Promise<T | undefined> {
        if (!key) return;

        try {
            const value = await chrome.storage.local.get(key);
            if (!value) return;

            return value[key] as T;
        } catch (e: any) {
            console.error(e);
        }
    }

    public async set(key: string, value: any): Promise<void> {
        if (!key) return;
       
        try {
            await chrome.storage.local.set({[key]: value});
        } catch (e: any) {
            console.error(e);
        }
    }
}

export const StorageService = new StorageServiceImpl();