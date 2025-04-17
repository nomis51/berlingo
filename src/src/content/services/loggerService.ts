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

import {StorageService} from "./storageService";
import {StorageService as ContentStorageService} from "../../content/services/storageService";
import {StorageKey} from "../types/storage/storageKey";

const LOG_PREFIX = "%c BERLINGO ";
const LOG_LEVEL = {
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4
}

class LoggerServiceImpl {
    /**
     * Public functions
     */
    public initialize() {
        const frame = document.createElement("frame");
        frame.style.display = "none";
        document.body.appendChild(frame);
        // @ts-ignore
        console.log = frame.contentWindow!.console.log.bind(frame.contentWindow!.console);
    }

    public info(...args: any[]) {
        this.log(LOG_LEVEL.INFO, ...args);
    }

    public warn(...args: any[]) {
        this.log(LOG_LEVEL.WARN, ...args);
    }

    public error(...args: any[]) {
        this.log(LOG_LEVEL.ERROR, ...args);
    }

    public debug(...args: any[]) {
        this.log(LOG_LEVEL.DEBUG, ...args);
    }

    /**
     * Private functions
     */
    private log(level: number, ...args: any[]) {
        const styles = this.getLevelStyles(level);
        console.log(LOG_PREFIX, styles, ...args);
        this.saveLog([level, ...args]).then();
    }

    private getLevelStyles(level: number): string {
        switch (level) {
            case LOG_LEVEL.DEBUG:
                return "background: #c46210; color: #fed8b1; border-radius: 8px";
            case LOG_LEVEL.INFO:
                return "background: #008000; color: #90ee90; border-radius: 8px";
            case LOG_LEVEL.WARN:
                return "background: yellow; color: #000; border-radius: 8px";
            case LOG_LEVEL.ERROR:
                return "background: #b30000; color: #ffcccb; border-radius: 8px";
            default:
                return "";
        }
    }

    private async saveLog(args: any[]) {
        const storageService = this.hasAccessToChromeApi() ? StorageService : ContentStorageService;

        await ContentStorageService.acquireLock(StorageKey.logs);

        try {
            let logs = await storageService.get<string[][]>(StorageKey.logs);
            if (!logs) {
                logs = [];
            }

            logs.push(args);
            await storageService.set(StorageKey.logs, logs);
        } finally {
            ContentStorageService.releaseLock(StorageKey.logs);
        }
    }

    private hasAccessToChromeApi(): boolean {
        return !!chrome && !!chrome.storage && !!chrome.storage.local;
    }
}

export const LoggerService = new LoggerServiceImpl();
