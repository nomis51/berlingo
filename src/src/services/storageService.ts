import {IpcService} from "../content/services/ipcService";
import {IpcMessageType} from "../content/types/ipc/ipcMessageType";

class StorageServiceImpl {
    /**
     * Public functions
     */
    public async get<T>(key: string): Promise<T | undefined> {
        return await IpcService.sendAndReceiveMessage<string, T>(IpcMessageType.getStorage.request, key)
    }

    public async set(key: string, value: any): Promise<void> {
        await IpcService.sendMessage<{ key: string, value: any }>(IpcMessageType.setStorage.request, {key, value});
    }
}

export const StorageService = new StorageServiceImpl();