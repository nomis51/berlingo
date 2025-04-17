/*
 * This file is part of Berlingo
 *
 * Copyright (C) 2025 nomis51
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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