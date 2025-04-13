import {Solver} from "./abstractions/solver";

export class MatchSolver extends Solver {
    public getAnswer(): string {
        return "";
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            const tapTokenNodes = document.querySelectorAll("[data-test='challenge-tap-token-text']");
            const tapTokens: any = {};

            Array.from(tapTokenNodes)
                .forEach(e => {
                    tapTokens[e.childNodes[0].textContent as string] = e;
                });

            this.pairs.forEach((e: any) => {
                tapTokens[e.learningToken]?.click();
                tapTokens[e.fromToken]?.click();
            });

            resolve();
        });
    }
}