import {Page} from "./abstractions/page";
import {LoggerService} from "../content/services/loggerService";
import {ButtonComponent} from "../components/buttonComponent";
import {DuolingoService} from "../services/duolingoService";

export class LessonPage extends Page {
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
        container.style.gap = "4px";

        const showAnswer = this.addComponent(new ButtonComponent("Show answer", this.showAnswer.bind(this)));
        container.insertBefore(showAnswer.render(), playerNextButton);

        const solveButton = this.addComponent(new ButtonComponent("Solve", this.solve.bind(this)));
        container.insertBefore(solveButton.render(), playerNextButton);
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

    private async showAnswer() {

    }
}