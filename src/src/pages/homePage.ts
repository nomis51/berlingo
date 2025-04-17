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

import {Page} from "./abstractions/page";
import {AlertComponent} from "../components/alertComponent";
import {LoggerService} from "../content/services/loggerService";
import {DuolingoService} from "../services/duolingoService";
import {ButtonComponent} from "../components/buttonComponent";
import {IconButtonComponent} from "../components/iconButtonComponent";

export class HomePage extends Page {
    /**
     * Public functions
     */
    public async render(): Promise<void> {
        await super.render();

        LoggerService.debug("Rendering home page");

        if (await DuolingoService.loadProfileData()) {
            LoggerService.debug("Profile data refreshed");
        }

        const versionAlert = this.addComponent(new AlertComponent("Berlingo v${version}", "success"));
        const practiceButton = this.addComponent(new IconButtonComponent("practice"));

        const divFlex = document.createElement("div");
        divFlex.style.display = "flex";
        divFlex.style.flexDirection = "row";
        divFlex.style.alignItems = "center";
        divFlex.style.gap = "80px";
        divFlex.style.position = "fixed";
        divFlex.style.bottom = "1rem";
        divFlex.style.left = "1rem";
        divFlex.style.zIndex = "999999";
        divFlex.appendChild(versionAlert.render());
        divFlex.appendChild(practiceButton.render());

        const root = document.querySelector("#root") as HTMLDivElement;
        root.appendChild(divFlex);

        practiceButton.addEventListener("click", this.gotoPractice.bind(this));
    }

    /**
     * Protected functions
     */
    protected isReady(): boolean {
        return !!document.getElementById("root") &&
            !!document.querySelector("[data-test='skill-path']");
    }

    /**
     * Private functions
     */
    private gotoPractice() {
        location.href = "/practice";
    }
}