import {getFromWindow, setToWindow} from "./windowUtils";

let DEBUG: boolean = true;

setToWindow("logs", []);
setToWindow("downloadLogs", () => {
    const blob = new Blob([JSON.stringify(getFromWindow("logs"))], {type: "text/json"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "logs.json";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
});
setToWindow("toggleDebug", async () => {
    DEBUG = !DEBUG;

    if (DEBUG) {
        log("Debug mode enabled");
    } else {
        log("Debug mode disabled");
    }
});

export function enableConsole() {
    const frame = document.createElement("frame");
    frame.style.display = "none";
    document.body.appendChild(frame);
    // @ts-ignore
    console.log = frame.contentWindow!.console.log.bind(frame.contentWindow!.console);
}

export function welcomeLog() {
    log("Welcome to Berlingo!");
}

export function log(...args: any[]) {
    pushToLogs(["INFO", ...args]);
    console.log('%c BERLINGO ', 'background: #008000; color: #90ee90; border-radius: 8px', ...args);
}

export function error(...args: any[]) {
    pushToLogs(["ERROR", ...args]);
    console.log('%c BERLINGO ', 'background: #b30000; color: #ffcccb; border-radius: 8px', ...args);
}

export function debug(...args: any[]) {
    pushToLogs(["DEBUG", ...args]);
    if (!DEBUG) return;

    console.log('%c BERLINGO ', 'background: #c46210; color: #fed8b1; border-radius: 8px', ...args);
}

function pushToLogs(args: any[]) {
    const logs = getFromWindow("logs");
    logs.push(args);
    setToWindow("logs", logs);
}