import {generateRandomId} from "../helpers/randomId";
import {IpcMessage} from "../types/ipc/ipcMessage";
import {LoggerService} from "./loggerService";

class IpcServiceImpl {
    /**
     * Members
     */
    private readonly _listeners: Map<string, any> = new Map();

    /**
     * Public function
     */
    public async sendMessage<T>(type: string, data: T | undefined = undefined): Promise<string> {
        LoggerService.debug("[IPC] sendMessage", type, data);
        const message: IpcMessage<T> = {
            id: generateRandomId(),
            type,
            data
        };
        window.postMessage(message);
        return message.id;
    }

    public sendAndReceiveMessage<T>(type: string, data: T | undefined = undefined): Promise<T> {
        LoggerService.debug("[IPC] sendAndReceiveMessage", type, data);

        return new Promise(async (resolve) => {
            function receiver(e: MessageEvent) {
                if (e.data.type !== type || e.data.id !== id) return;

                window.removeEventListener("message", receiver);
                resolve(e.data.data as T);
            }

            window.addEventListener("message", receiver);
            const id = await this.sendMessage(type, data);
        });
    }

    public addListener<T>(type: string, callback: (e: IpcMessage<T>) => void): string {
        LoggerService.debug("[IPC] addListener", type);
        const id = generateRandomId();
        const wrapper = (e: MessageEvent<any>) => e.data.type === type && callback(e.data);
        window.addEventListener("message", wrapper);
        this._listeners.set(id, wrapper);
        return id;
    }

    public removeListener(id: string): void {
        LoggerService.debug("[IPC] removeListener", id);
        const wrapper = this._listeners.get(id);
        if (!wrapper) return;

        window.removeEventListener("message", wrapper);
        this._listeners.delete(id);
    }
}

export const IpcService = new IpcServiceImpl();