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

import {LoggerService} from "../content/services/loggerService";
import {HomePage} from "../pages/homePage";
import {Page} from "../pages/abstractions/page";
import {LessonPage} from "../pages/lessonPage";
import {SettingsPage} from "../pages/settingsPage";

class UiServiceImpl {
    /**
     * Members
     */
    private _currentPage: Page | undefined;

    /**
     * Public functions
     */
    public async initialize(): Promise<void> {
        LoggerService.debug("Initializing UI");
        this.setHotkeys();
        this.setObservers();
        await this.setPage();
    }

    /**
     * Private functions
     */
    private async setPage(): Promise<void> {
        this._currentPage?.dispose();

        if (location.pathname === "/learn") {
            this._currentPage = new HomePage();
        } else if (location.pathname.startsWith("/lesson") ||
            location.pathname.startsWith("/practice")) {
            this._currentPage = new LessonPage();
        } else if (location.pathname.startsWith("/settings")) {
            this._currentPage = new SettingsPage();
        }

        await this._currentPage?.render();
    }

    private setPageObserver() {
        const pushState = history.pushState;
        history.pushState = async (...args: any) => {
            LoggerService.debug("pushState", args);
            pushState.apply(history, args);
            await this.setPage();
        };

        const replaceState = history.replaceState;
        history.replaceState = async (...args: any) => {
            LoggerService.debug("replaceState", args);
            replaceState.apply(history, args);
        };
    }

    private setObservers() {
        this.setPageObserver();
    }

    private setHotkeys() {
        LoggerService.debug("Setting hotkeys");

        document.addEventListener("keyup", async e => {
            if (e.key === "Enter" && e.ctrlKey) {
                // TODO:
            }

            if (e.key === "Enter" && e.altKey) {
                // TODO:
            }
        });
    }
}

export const UiService = new UiServiceImpl();