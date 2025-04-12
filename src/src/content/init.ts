import {StorageService} from "./services/storageService";
import {IpcService} from "./services/ipcService";
import {SetStorageRequest} from "./types/storage/setStorageRequest";
import {GetStorageRequest} from "./types/storage/getStorageRequest";
import {IpcMessageType} from "./types/ipc/ipcMessageType";
import {LoggerService} from "./services/loggerService";

LoggerService.initialize();
injectStylesheet();
injectScript();

IpcService.addListener<SetStorageRequest>(IpcMessageType.setStorage.request, async e => {
    await StorageService.set(e.data!.key, e.data!.value);
    await IpcService.sendMessage(e.type, true);
});
IpcService.addListener<GetStorageRequest>(IpcMessageType.getStorage.request, async e => {
    const value = await StorageService.get(e.data!.key);
    await IpcService.sendMessage(e.type, value);
});

function injectStylesheet() {
    const stylesheet = document.createElement("link");
    stylesheet.setAttribute("rel", "stylesheet")
    stylesheet.setAttribute("type", "text/css")
    stylesheet.setAttribute("berlingo", "1")
    stylesheet.setAttribute("href", `chrome-extension://${chrome.runtime.id}/main.css`)
    document.body.appendChild(stylesheet)
}

function injectScript() {
    const body = document.body;
    const script = document.createElement("script");
    script.setAttribute("type", "module");
    script.setAttribute("berlingo", "1")
    script.setAttribute("src", `chrome-extension://${chrome.runtime.id}/main.js`);
    body.appendChild(script);
}