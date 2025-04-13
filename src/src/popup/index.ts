import {StorageService} from "../content/services/storageService";
import {StorageKey} from "../content/types/storage/storageKey";
import {IpcMessageType} from "../content/types/ipc/ipcMessageType";

const GITHUB_URL = "https://github.com/nomis51/berlingo";
const WIKI_URL = "https://nomis51.github.io/berlingo"

document.addEventListener("DOMContentLoaded", async () => {
    const buttonReportBug = document.getElementById("button-report-bug") as HTMLButtonElement;
    buttonReportBug.addEventListener("click", () => {
        chrome.tabs.create({
            url: `${GITHUB_URL}/issues/new/choose`
        })
    });

    const buttonDocumentation = document.getElementById("button-documentation") as HTMLButtonElement;
    buttonDocumentation.addEventListener("click", () => {
        chrome.tabs.create({
            url: WIKI_URL
        });
    });

    const buttonOpenGithub = document.getElementById("button-open-github") as HTMLButtonElement;
    buttonOpenGithub.addEventListener("click", () => {
        chrome.tabs.create({
            url: GITHUB_URL
        });
    });

    const buttonDownloadLogs = document.getElementById("button-download-logs") as HTMLButtonElement;
    buttonDownloadLogs.addEventListener("click", async () => {
        const logs = await StorageService.get<string[][]>(StorageKey.logs);

        const blob = new Blob([JSON.stringify(logs)], {type: "text/json"});
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

    const labelLanguage = document.getElementById("label-language") as HTMLLabelElement;
    labelLanguage.innerText = await StorageService.get<string>(StorageKey.language) ?? "";
    if (!!labelLanguage.innerText) {
        labelLanguage.style.display = "block";
    }

    chrome.runtime.onMessage.addListener((message: any, _, __) => {
        if (message.type === IpcMessageType.languageUpdated.request) {
            labelLanguage.innerText = message.data;
            if (!labelLanguage.innerText) return;

            labelLanguage.style.display = "block";
        }
    });
});