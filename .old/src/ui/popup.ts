import {getStorage, setStorage} from "../helpers/storage";
import {StorageKey, WindowMessageType} from "../types";
import {ANSWER_TEXT_ID} from "../content/extension";

document.addEventListener("DOMContentLoaded", async () => {
    const textInputSolveDelay = document.getElementById("text-input-solve-delay") as HTMLInputElement;

    textInputSolveDelay.addEventListener("change", async () => {
        await setStorage("settings", {solveDelay: textInputSolveDelay.value});
    });

    const settingsButton = document.getElementById("settings-button") as HTMLButtonElement;
    settingsButton.addEventListener("click", async () => {
        const settingsContainer = document.getElementById("settings-container") as HTMLDivElement;
        settingsContainer.classList.toggle("hidden");
    });

    const downloadLogsButton = document.getElementById("download-logs") as HTMLButtonElement;
    downloadLogsButton.addEventListener("click", async () => {
        const settingsContainer = document.getElementById("settings-container") as HTMLDivElement;
        settingsContainer.classList.toggle("hidden");

        sendExtensionMessage(WindowMessageType.DownloadLogs.request);
    });

    await setDelay();
    await setLanguageLabel();
});

async function setDelay() {
    const settings = await getStorage<any>(StorageKey.Settings);
    if (!settings) return;

    const textInputSolveDelay = document.getElementById("text-input-solve-delay") as HTMLInputElement;
    if (!textInputSolveDelay) return;

    textInputSolveDelay.value = settings.solveDelay ?? "0";
}

async function setLanguageLabel() {
    const course = await getStorage<any>(StorageKey.Course);
    if (!course) return;

    const labelLanguage = document.getElementById("label-language") as HTMLParagraphElement;
    if (!labelLanguage) return;

    labelLanguage.innerText = course.learningLanguageName;
    labelLanguage.classList.toggle("hidden");
}

function sendExtensionMessage(type: string, data: any = {}) {
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
        await chrome.tabs.sendMessage(tabs[0].id as number, {
            action: type,
            ...data
        });
    });
}
