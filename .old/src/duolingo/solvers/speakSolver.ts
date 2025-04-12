import {Solver} from "./abstractions/solver";

export class SpeakSolver extends Solver {
    public getAnswer(): string {
        return "";
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            // @ts-ignore
            document.querySelector("[data-test='player-skip']")?.click();
            resolve();
        });
    }
}