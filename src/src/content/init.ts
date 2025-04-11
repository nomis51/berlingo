import {ChromeMessage, WindowMessage, WindowMessageType} from "../types";
import {getStorage, setStorage} from "../helpers/storage";
import {log} from "../helpers/logger";

// Extension communications
window.addEventListener("message", async e => {
    if (e.data.type === WindowMessageType.SetStorage.request) {
        await setStorage(e.data.data.key, e.data.data.value);
        window.postMessage({
            id: e.data.id,
            type: WindowMessageType.SetStorage.response,
            data: true
        } as WindowMessage)
    } else if (e.data.type === WindowMessageType.GetStorage.request) {
        const value = await getStorage(e.data.data);
        window.postMessage({
            id: e.data.id,
            type: WindowMessageType.GetStorage.response,
            data: value
        } as WindowMessage)
    }
});

// Popup communications
chrome.runtime.onMessage.addListener((message: ChromeMessage, _, __) => {
    sendCustomEvent(message.action, message.data);
});

injectStylesheet();
injectScript();

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
    script.setAttribute("src", `chrome-extension://${chrome.runtime.id}/extension.js`);
    body.appendChild(script);
}

function sendCustomEvent(actionType: string, data: any | undefined) {
    const event = document.createEvent("CustomEvent");
    event.initCustomEvent(actionType, true, true, {data});
    document.dispatchEvent(event);
}