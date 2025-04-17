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
import {LoggerService} from "../content/services/loggerService";
import {TextFieldComponent} from "../components/textFieldComponent";
import {StorageService} from "../services/storageService";
import {StorageKey} from "../content/types/storage/storageKey";
import {Settings} from "../content/types/settings";

export class SettingsPage extends Page {
    /**
     * Members
     */
    private _solveDelayTextField!: TextFieldComponent;

    /**
     * Public functions
     */
    public async render(): Promise<void> {
        await super.render();

        LoggerService.debug("Rendering settings page");

        const result = document.evaluate(
            "//h1[text()='Preferences']",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        const header = result.singleNodeValue as HTMLDivElement | undefined;
        if (!header) {
            LoggerService.error("Unable to find preferences page header");
            return;
        }

        const container = header!.parentElement;
        if (!container) {
            LoggerService.error("Unable to find preferences page container");
            return;
        }

        this._solveDelayTextField = this.addComponent(new TextFieldComponent(
            "e.g. 500",
            "Solve delay",
            "",
            "number",
        ));
        container.appendChild(this._solveDelayTextField.render());

        this._solveDelayTextField.onChange(async (value) => {
            const iValue = parseInt(value);
            if (isNaN(iValue)) return;

            let settings = await StorageService.get<Settings>(StorageKey.settings);
            if (!settings) {
                settings = {
                    solveDelay: 200
                };
            }

            settings.solveDelay = iValue;
            await StorageService.set(StorageKey.settings, settings);
        });

        const settings = await StorageService.get<Settings>(StorageKey.settings);
        this._solveDelayTextField.setValue(settings?.solveDelay.toString() ?? "200");
    }

    /**
     * Protected functions
     */
    protected isReady(): boolean {
        return !!document.querySelector("a[data-test='settings-account']");
    }
}