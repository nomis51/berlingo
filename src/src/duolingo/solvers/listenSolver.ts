import {Solver} from "./abstractions/solver";

export class ListenSolver extends Solver {
    public getAnswer(): string {
        return this.prompt ?? "";
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!this.prompt) return resolve();

            this.insertTranslation(this.prompt);
            resolve();
        });
    }
}