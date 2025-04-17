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

import {generateRandomId} from "../helpers/randomId";
import {IpcMessage} from "../types/ipc/ipcMessage";
import {LoggerService} from "./loggerService";
import {IpcMessageTypeValue} from "../types/ipc/ipcMessageType";
import {IpcMessageProtocol} from "../types/ipc/ipcMessageProtocol";

class IpcServiceImpl {
    /**
     * Members
     */
    private readonly _listeners: Map<string, any> = new Map();

    /**
     * Public function
     */
    public async sendMessage<T>(type: IpcMessageTypeValue, data: T | undefined = undefined, protocol: IpcMessageProtocol = IpcMessageProtocol.Window): Promise<string> {
        LoggerService.debug("[IPC] sendMessage", type, data, protocol);
        const message: IpcMessage<T> = {
            id: generateRandomId(),
            type: type.request,
            data
        };

        if (protocol === IpcMessageProtocol.Window) {
            window.postMessage(message);
        } else if (protocol === IpcMessageProtocol.Chrome) {
            try {
                await chrome.runtime.sendMessage(message);
            } catch (e: any) {
                if (e.message && e.message.includes("Receiving end does not exist")) {
                    // ignore, popup simply hasn't been opened yet
                    LoggerService.debug("Receiving end didn't exists (chrome), ignoring");
                } else {
                    LoggerService.error("Failed to send message (chrome)", e);
                }
            }
        } else {
            throw new Error("Invalid protocol");
        }

        return message.id;
    }

    public async responseMessage<T>(id: string, type: IpcMessageTypeValue, data: T | undefined = undefined): Promise<void> {
        LoggerService.debug("[IPC] responseMessage", type, data);
        const message: IpcMessage<T> = {
            id,
            type: type.response,
            data
        };
        window.postMessage(message);
    }

    public sendAndReceiveMessage<TIn, TOut>(type: IpcMessageTypeValue, data: TIn | undefined = undefined): Promise<TOut> {
        LoggerService.debug("[IPC] sendAndReceiveMessage", type, data);

        return new Promise(async (resolve) => {
            function receiver(e: MessageEvent) {
                if (e.data.type !== type.response || e.data.id !== id) return;

                window.removeEventListener("message", receiver);
                resolve(e.data.data as TOut);
            }

            window.addEventListener("message", receiver);
            const id = await this.sendMessage(type, data);
        });
    }

    public addListener<T>(type: IpcMessageTypeValue, callback: (e: IpcMessage<T>) => void, protocol: IpcMessageProtocol = IpcMessageProtocol.Window): string {
        LoggerService.debug("[IPC] addListener", type);
        const id = generateRandomId();

        if (protocol === IpcMessageProtocol.Window) {

            const wrapper = (e: MessageEvent<any>) => e.data.type === type.request && callback(e.data);
            window.addEventListener("message", wrapper);
            this._listeners.set(id, wrapper);
            return id;
        } else if (protocol === IpcMessageProtocol.Chrome) {
            const wrapper = (e: any, _: chrome.runtime.MessageSender, __: (response?: any) => void) => e.type === type.request && callback(e.data);
            chrome.runtime.onMessage.addListener(wrapper);
            this._listeners.set(id, wrapper);
            return id;
        } else {
            throw new Error("Invalid protocol");
        }
    }

    public removeListener(id: string, protocol: IpcMessageProtocol = IpcMessageProtocol.Window): void {
        LoggerService.debug("[IPC] removeListener", id);
        const wrapper = this._listeners.get(id);
        if (!wrapper) return;

        if (protocol === IpcMessageProtocol.Window) {
            window.removeEventListener("message", wrapper);
        } else if (protocol === IpcMessageProtocol.Chrome) {
            chrome.runtime.onMessage.removeListener(wrapper);
        }

        this._listeners.delete(id);
    }
}

export const IpcService = new IpcServiceImpl();