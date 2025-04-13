import {Solver} from "./abstractions/solver";

export class DefinitionSolver extends Solver {
    public getAnswer(): string {
        return `Choose #${this.correctIndex + 1}`
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.chooseIndex("[data-test*='challenge-judge-text']", this.correctIndex);
            resolve();
        });
    }
}