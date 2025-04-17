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