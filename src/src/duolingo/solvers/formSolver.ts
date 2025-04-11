import {Solver} from "./abstractions/solver";

export class FormSolver extends Solver {
    public getAnswer(): string {
        return `Choose #${this.correctIndex + 1}`
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.chooseIndex("[data-test='challenge-choice']", this.correctIndex);
            resolve();
        });
    }
} 