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

        const observer = new MutationObserver(async () => {
            console.log("update")
            const blame = document.querySelector("[data-test~='blame']");
            if (!blame) {
                this._solveButton.setDisabled(false);
                this._showAnswerButton.setDisabled(false);
            } else {
                this._solveButton.setDisabled(true);
                this._showAnswerButton.setDisabled(true);
                this.hideAnswer();
            }

            if (!document.getElementById("button-solve") ||
                !document.getElementById("button-show-answer")) {
                console.log("re-render");
                observer.disconnect();
                await this.render();
                return;
            }
        });

        observer.observe(document, {
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

    /**
     * Protected functions
     */
    protected isReady(): boolean {
        return !!document.querySelector("[data-test='player-next']");
    }

    /**
     * Private functions
     */
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