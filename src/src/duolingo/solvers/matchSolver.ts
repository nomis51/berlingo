import {Solver} from "./abstractions/solver";

export class MatchSolver extends Solver {
    public getAnswer(): string {
        return "";
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            const tapTokenNodes = Array.from(
                document.querySelectorAll("[data-test='challenge-tap-token-text']")
            );

            for (const pair of this.pairs) {
                let nbTapTokensTapped = 0;
                for (const tapTokenNode of tapTokenNodes) {
                    if (tapTokenNode.textContent === pair.learningToken) {
                        // @ts-ignore
                        tapTokenNode?.click();
                        ++nbTapTokensTapped;
                    }

                    if (tapTokenNode.textContent === pair.fromToken) {
                        // @ts-ignore
                        tapTokenNode?.click();
                        ++nbTapTokensTapped;
                    }

                    if (nbTapTokensTapped === 2) break;
                }
            }

            resolve();
        });
    }
}