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