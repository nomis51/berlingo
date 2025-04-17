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

export class TranslateSolver extends Solver {
    public getAnswer(): string {
        return this.correctTokens.join(' ');
    }

    public async solve(): Promise<void> {
        if (this.isToggledToTyping) {
            if (this.correctSolutions.length === 0) return;

            this.insertTranslation(this.correctSolutions[0])
        } else {
            const tapTokenNodes = document.querySelectorAll('[data-test="challenge-tap-token-text"]');
            const tapTokens: any = {};

            Array.from(tapTokenNodes)
                .forEach(e => {
                    const content = e.childNodes[0].textContent as string;
                    if (!tapTokens[content]) {
                        tapTokens[content] = [];
                    }

                    tapTokens[content].push(e);
                });

            const settings = await StorageService.get<Settings>(StorageKey.settings);
            await this.executeListWithDelay(e => {
                if (!tapTokens[e] || tapTokens[e].length === 0) return;

                tapTokens[e].shift().click();
            }, this.correctTokens, settings?.solveDelay ?? 200);
        }
    }
}