class StorageServiceImpl {
    /**
     * Public functions
     */
    public async get<T>(key: string): Promise<T | undefined> {
        try {
            const value = await chrome.storage.local.get(key);
            if (!value) return;

            return value[key] as T;
        } catch (e: any) {
            console.error(e);
        }
    }

    public async set(key: string, value: any): Promise<void> {
        try {
            await chrome.storage.local.set({[key]: value});
        } catch (e: any) {
            console.error(e);
        }
    }
}

export const StorageService = new StorageServiceImpl();