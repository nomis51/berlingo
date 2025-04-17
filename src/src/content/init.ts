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

import {StorageService} from "./services/storageService";
import {IpcService} from "./services/ipcService";
import {SetStorageRequest} from "./types/storage/setStorageRequest";
import {GetStorageRequest} from "./types/storage/getStorageRequest";
import {IpcMessageType} from "./types/ipc/ipcMessageType";
import {LoggerService} from "./services/loggerService";
import {IpcMessageProtocol} from "./types/ipc/ipcMessageProtocol";

LoggerService.initialize();
injectStylesheet();
injectScript();

IpcService.addListener<SetStorageRequest>(IpcMessageType.setStorage, async e => {
    await StorageService.set(e.data!.key, e.data!.value);
    await IpcService.responseMessage(e.id, IpcMessageType.setStorage, true);
}, IpcMessageProtocol.Window);
IpcService.addListener<string>(IpcMessageType.getStorage, async e => {
    const value = await StorageService.get(e.data!);
    await IpcService.responseMessage(e.id, IpcMessageType.getStorage, value);
}, IpcMessageProtocol.Window);
IpcService.addListener<string>(IpcMessageType.languageUpdated, async e => {
    await IpcService.sendMessage(IpcMessageType.languageUpdated, e.data, IpcMessageProtocol.Chrome);
}, IpcMessageProtocol.Window);

function injectStylesheet() {
    LoggerService.debug("Injecting stylesheet");
    const stylesheet = document.createElement("link");
    stylesheet.setAttribute("rel", "stylesheet")
    stylesheet.setAttribute("type", "text/css")
    stylesheet.setAttribute("berlingo", "1")
    stylesheet.setAttribute("href", `chrome-extension://${chrome.runtime.id}/main.css`)
    document.body.appendChild(stylesheet)
}

function injectScript() {
    LoggerService.debug("Injecting script");
    const body = document.body;
    const script = document.createElement("script");
    script.setAttribute("type", "module");
    script.setAttribute("berlingo", "1")
    script.setAttribute("src", `chrome-extension://${chrome.runtime.id}/main.js`);
    body.appendChild(script);
}