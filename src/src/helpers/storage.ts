import {error, log} from "./logger";
import {WindowMessage, WindowMessageType} from "../types";
import {generateRandomId} from "./randomId";

export async function getStorage<T>(key: string): Promise<T | null> {
    if (isLocalCall()) return await getStorageLocal<T>(key);

    return await getStorageExternal<T>(key);
}

export async function setStorage(key: string, value: any) {
    if (isLocalCall()) return await setStorageLocal(key, value);

    return await setStorageExternal(key, value);
}

function isLocalCall(): boolean {
    return !!(chrome && chrome.storage && chrome.storage.local);
}

function getStorageExternal<T>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
        const id = generateRandomId();

        function receiver(e: MessageEvent<any>) {
            if (e.data.type !== WindowMessageType.GetStorage.response ||
                e.data.id !== id) return;

            resolve(e.data.data);
            window.removeEventListener("message", receiver);
        }

        window.addEventListener("message", receiver);
        window.postMessage({
            id,
            type: WindowMessageType.GetStorage.request,
            data: key,
        } as WindowMessage);
    });
}

function setStorageExternal(key: string, value: any): Promise<void> {
    return new Promise((resolve) => {
        const id = generateRandomId();

        function receiver(e: MessageEvent<any>) {
            if (e.data.type !== WindowMessageType.SetStorage.response ||
                e.data.id !== id) return;

            resolve();
            window.removeEventListener("message", receiver);
        }

        window.addEventListener("message", receiver);
        window.postMessage({
            id,
            type: WindowMessageType.SetStorage.request,
            data: {
                key,
                value
            }
        } as WindowMessage);
    });
}

async function getStorageLocal<T>(key: string): Promise<T | null> {
    try {
        const value = await chrome.storage.local.get(key);
        if (!value) return null;

        return value[key] as T;
    } catch (e: any) {
        error(e);
    }

    return null;
}

async function setStorageLocal(key: string, value: any) {
    try {
        await chrome.storage.local.set({[key]: value});
    } catch (e: any) {
        error(e);
    }
}