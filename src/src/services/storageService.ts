import {IpcService} from "../content/services/ipcService";
import {IpcMessageType} from "../content/types/ipc/ipcMessageType";

class StorageServiceImpl {
    /**
     * Public functions
     */
    public async get<T>(key: string): Promise<T | undefined> {
        if (!key) return;
        return await IpcService.sendAndReceiveMessage<string, T>(IpcMessageType.getStorage, key)
    }

    public async set(key: string, value: any): Promise<void> {
        if (!key) return;
        await IpcService.sendMessage<{ key: string, value: any }>(IpcMessageType.setStorage, {key, value});
    }
}

export const StorageService = new StorageServiceImpl();