import {Solver} from "./abstractions/solver";

export class JudgeSolver extends Solver {
    public getAnswer(): string {
        return `Choose #${this.correctIndices[0] + 1}`
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this.correctIndices.length === 0) return resolve();

            this.chooseIndex("[data-test='challenge-judge-text']", this.correctIndices[0]);
            resolve();
        });
    }
}