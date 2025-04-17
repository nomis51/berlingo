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

import {Solver} from "./abstractions/solver";
import {StorageService} from "../../services/storageService";
import {Settings} from "../../content/types/settings";
import {StorageKey} from "../../content/types/storage/storageKey";

export class ListenMatchSolver extends Solver {
    public getAnswer(): string {
        return "";
    }

    public async solve(): Promise<void> {
        const nodes = document.querySelectorAll("[data-test*='challenge-tap-token']");
        const groupedNodes: any = {};
        nodes.forEach(e => {
            const dataTestKey = e.getAttribute("data-test") as string;
            if (!groupedNodes[dataTestKey]) {
                groupedNodes[dataTestKey] = [];
            }

            groupedNodes[dataTestKey].push(e);
        });

        const settings = await StorageService.get<Settings>(StorageKey.settings);
        await this.executeListWithDelay(e => {
            e?.[0]?.click();
            e?.[1]?.click();
        }, Object.values(groupedNodes), settings?.solveDelay ?? 200);
    }
}