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
import {ButtonComponent} from "../components/buttonComponent";
import {DuolingoService} from "../services/duolingoService";
import {AlertComponent} from "../components/alertComponent";

export class LessonPage extends Page {
    /**
     * Members
     */
    private _solveButton!: ButtonComponent;
    private _showAnswerButton!: ButtonComponent;
    private _answerAlert: AlertComponent | undefined;
    private _observer: MutationObserver | undefined;

    /**
     * Public functions
     */
    public async render(): Promise<void> {
        await super.render();

        LoggerService.debug("Rendering lesson page");

        const playerNextButton = document.querySelector("[data-test='player-next']");
        if (!playerNextButton) return;

        const container = playerNextButton.parentElement!;
        container.style.display = "flex";
        container.style.flexDirection = "row";
        container.style.alignItems = "center";
        container.style.gap = "4px";

        this._showAnswerButton = this.addComponent(new ButtonComponent("Show answer", "button-show-answer"));
        container.insertBefore(this._showAnswerButton.render(), playerNextButton);
        this._showAnswerButton.addEventListener("click", this.showAnswer.bind(this))

        this._solveButton = this.addComponent(new ButtonComponent("Solve", "button-solve"));
        container.insertBefore(this._solveButton.render(), playerNextButton);
        this._solveButton.addEventListener("click", this.solve.bind(this));

        this.hideIfSplashTitleVisible();

        this._observer = new MutationObserver(async () => {
            if (this.hideIfBlameVisible()) return;
            if (this.hideIfChallengeNotVisible()) return;
            if (this.hideIfSplashTitleVisible()) return;

            if (!document.getElementById("button-solve") ||
                !document.getElementById("button-show-answer")) {
                this.dispose();
                await this.render();
            } else {
                this._solveButton.setVisible(true);
                this._showAnswerButton.setVisible(true);
            }

            this.skipSuperAds();
            this.skipLegendaryScreen();
        });

        this._observer.observe(document, {
            childList: true,
            subtree: true
        });

        document.addEventListener("keyup", async e => {
            if (e.key === "Enter" && e.ctrlKey) {
                await this.solve()
            } else if (e.key === "Enter" && e.altKey) {
                this.showAnswer();
            }
        });
    }

    public dispose() {
        this._observer?.disconnect();
        super.dispose();
    }

    /**
     * Protected functions
     */
    protected isReady(): boolean {
        return !!document.querySelector("[data-test='player-next']");
    }

    /**
     * Private functions
     */
    private skipLegendaryScreen() {
        const legendaryButton = document.querySelector("[data-test='legendary-start-button']")
        if (!legendaryButton) return;

        LoggerService.debug("Detecting legendary screen");

        const noThanksButton = document.evaluate(
            "//button[contains(text(), 'No thanks')]",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue as HTMLButtonElement;
        if (!noThanksButton) return;

        LoggerService.debug("Skipping legendary screen");
        noThanksButton.click();
    }

    private hideIfChallengeNotVisible(): boolean {
        const challenge = document.querySelector("[data-test~='challenge']");
        if (!challenge) {
            this._solveButton.setVisible(false);
            this._showAnswerButton.setVisible(false);
            this.hideAnswer();
            return true;
        }

        return false;
    }

    private hideIfBlameVisible(): boolean {
        const blame = document.querySelector("[data-test~='blame']");
        if (!!blame) {
            this._solveButton.setVisible(false);
            this._showAnswerButton.setVisible(false);
            this.hideAnswer();
            return true;
        }

        return false;
    }

    private hideIfSplashTitleVisible(): boolean {
        const splashTitle = document.querySelector("[data-test='session-splash-title']");
        if (!!splashTitle) {
            this._solveButton.setVisible(false);
            this._showAnswerButton.setVisible(false);
            this.hideAnswer();
            return true;
        }

        return false;
    }

    private skipSuperAds() {
        const noThanksButton = document.querySelector("[data-test='plus-no-thanks']") as HTMLButtonElement;
        if (!!noThanksButton) {
            LoggerService.debug("Saying 'no thanks' to Super ads");
            noThanksButton.click();
            return;
        }

        const superVideo = document.querySelector("video");
        if (!!superVideo) {
            LoggerService.debug("Detected Super ads video");
            const closeButton = document.querySelector("[data-test='plus-close-x']") as HTMLButtonElement;
            if (!!closeButton) {
                LoggerService.debug("Closing Super ads video");
                closeButton.click();
                return;
            }
        }
    }

    private async solve() {
        await DuolingoService.solveChallenge();
    }

    private showAnswer() {
        if (this._answerAlert) {
            this.hideAnswer();
        } else {
            const answer = DuolingoService.getChallengeAnswer();

            const container = document.querySelector("#session\\/PlayerFooter > div > div:first-child") as HTMLDivElement | undefined;
            if (!container) return;

            container.style.display = "flex";
            container.style.flexDirection = "row";
            container.style.alignItems = "center";
            container.style.gap = "4px";

            this._answerAlert = this.addComponent(new AlertComponent(answer, "info"));
            this._answerAlert.customStyle = `<style>
                .wrapper-content div {
                   min-width: max-content;
                } 
            </style>`;
            container.appendChild(this._answerAlert.render());

            this._showAnswerButton.setText("Hide answer");
        }
    }

    private hideAnswer() {
        this._answerAlert?.dispose();
        this._answerAlert = undefined;
        this._showAnswerButton.setText("Show answer");
    }
}