import {Solver} from "./abstractions/solver";

export class TapCompleteSolver extends Solver {
    public getAnswer(): string {
        return `Choose ${this.correctIndices.map(e => `#${e + 1}`)}`;
    }

    public async solve(): Promise<void> {
        return await this.chooseIndices(
            "[data-test='challenge-tap-token-text']",
            this.correctIndices,
            document.querySelector("[data-test='word-bank']")
        )
    }
}