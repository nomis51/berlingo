﻿/*
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

import {ReactService} from "../../../services/reactService";
import {StorageService} from "../../../services/storageService";
import {StorageKey} from "../../../content/types/storage/storageKey";
import {Settings} from "../../../content/types/settings";

export abstract class Solver {
    /**
     * Members
     */
    protected _internals: any | undefined;
    private _clickNextCount: number = 0;
    private _activeClickNext: any;
    private _clickNextInterval: any | undefined;

    /**
     * Props
     */
    protected get canToggleTyping(): boolean {
        return this._internals?.challengeToggleState?.canToggleTyping ?? false;
    }

    protected get isToggledToTyping(): boolean {
        return this._internals?.challengeToggleState?.isToggledToTyping ?? false;
    }

    protected get sourceLanguage(): string | undefined {
        return this.challenge?.sourceLanguage;
    }

    protected get targetLanguage(): string | undefined {
        return this.challenge?.targetLanguage;
    }

    protected get type(): string | undefined {
        return this.challenge?.type;
    }

    protected get id(): string | undefined {
        return this.challenge?.id;
    }

    protected get pairs(): any | undefined {
        return this.challenge?.pairs;
    }

    protected get correctSolutions(): string[] {
        return this.challenge?.correctSolutions ?? [];
    }

    protected get correctTokens(): string[] {
        return this.challenge?.correctTokens ?? [];
    }

    protected get correctIndex(): number {
        return this.challenge?.correctIndex ?? 0;
    }

    protected get correctIndices(): number[] {
        return this.challenge?.correctIndices ?? [];
    }

    protected get prompt(): string | undefined {
        return this.challenge?.prompt;
    }

    protected get articles(): string[] {
        return this.challenge?.articles ?? [];
    }

    protected get displayTableTokens(): any[] {
        return this.challenge?.displayTableTokens ?? [];
    }

    protected get displayTokens(): any[] {
        return this.challenge?.displayTokens ?? [];
    }

    protected get bestSolution(): string {
        return this.challengeResponseTrackingProperties?.best_solution ?? "";
    }

    private get challengeResponseTrackingProperties(): any {
        return this._internals?.challengeResponseTrackingProperties
    }

    private get challenge(): any {
        return this._internals?.challenge;
    }

    private get skill(): any {
        return this._internals?.skill;
    }

    /**
     * Constructors
     */
    constructor() {
        this.updateInternals();

        // if (this.canToggleTyping && !this.isToggledToTyping) {
        //     this.enableKeyboard();
        // }
    }

    /**
     * Functions
     */
    public abstract solve(): Promise<void>;

    public abstract getAnswer(): string;

    public async clickNext() {
        ++this._clickNextCount;

        if (this._activeClickNext) return;

        await this.setClickNextInterval();
        this._activeClickNext = true;
    }

    protected enableKeyboard() {
        // @ts-ignore
        document.querySelector('[data-test="player-toggle-keyboard"]')?.click()
    }

    protected updateInternals() {
        const element = ReactService.getReactFiber(document.querySelector('[data-test="challenge-header"]'));
        if (!element) return;

        this._internals = element.memoizedProps?.children?.props;
    }

    protected executeListWithDelay(callback: (item: any) => void, items: any[], delay: number) {
        return new Promise((resolve) => {
            items.forEach((e, i) => {
                setTimeout(() => {
                    callback(e);
                    if (i === items.length - 1) {
                        resolve(true);
                    }
                }, i * delay);
            });
        });
    }

    protected chooseIndex(querySelector: string, index: number, elementToSelectFrom: any | null = null) {
        if (!elementToSelectFrom) {
            elementToSelectFrom = document;
        }

        const choices = elementToSelectFrom.querySelectorAll(querySelector);
        if (index >= choices.length) {
            index = choices.length - 1;
        }

        choices[index].click();
    }

    protected async chooseIndices(querySelector: string, indices: number[], elementToSelectFrom: any | null = null) {
        if (!elementToSelectFrom) {
            elementToSelectFrom = document;
        }

        const choices = elementToSelectFrom.querySelectorAll(querySelector);

        const settings = await StorageService.get<Settings>(StorageKey.settings);
        await this.executeListWithDelay(e => {
            if (e >= choices.length) {
                e = choices.length - 1;
            }

            choices[e]?.click();
        }, indices, settings?.solveDelay ?? 200);
    }


    protected insertTranslation(translation: string) {
        let translateInput = document.querySelector("[data-test='challenge-translate-input']");
        if (!translateInput) return;

        ReactService.getReactFiber(translateInput)?.pendingProps?.onChange({target: {value: translation}})
    }

    private async setClickNextInterval() {
        const settings = await StorageService.get<Settings>(StorageKey.settings);

        this._clickNextInterval = setInterval(async () => {
            const playerNextButton = document.querySelector("[data-test='player-next']");
            if (!playerNextButton) return;
            // @ts-ignore
            if (playerNextButton.disabled) return;
            if (playerNextButton.getAttribute("aria-disabled") === "true") return;
            if (this._clickNextCount === 0) return;

            // @ts-ignore
            playerNextButton.click();
            --this._clickNextCount;

            clearInterval(this._clickNextInterval);

            if (this._clickNextCount > 0) {
                this._activeClickNext = true;
                await this.setClickNextInterval();
            } else {
                this._activeClickNext = false;
            }
        }, settings?.solveDelay ?? 200);
    }
}