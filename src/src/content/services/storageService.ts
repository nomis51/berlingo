class StorageServiceImpl {
    /**
     * Members
     */
    private readonly _setLock = new Set<string>();

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

    public acquireLock(key: string): Promise<void> {
        return new Promise((resolve) => {
            if (this._setLock.has(key)) {
                setTimeout(() => this.acquireLock(key), 100);
            }

            this._setLock.add(key);
            resolve();
        });
    }

    public releaseLock(key: string): void {
        this._setLock.delete(key);
    }
}

export const StorageService = new StorageServiceImpl();