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
                for (let i = 0; i < tapTokenNodes.length; ++i) {
                    const tapTokenNode = tapTokenNodes[i];

                    if (tapTokenNode.childNodes[0].textContent === pair.learningToken) {
                        // @ts-ignore
                        tapTokenNode?.click();
                        tapTokenNodes.splice(i, 1);
                        --i;
                        ++nbTapTokensTapped;
                        continue;
                    }

                    if (tapTokenNode.childNodes[0].textContent === pair.fromToken) {
                        // @ts-ignore
                        tapTokenNode?.click();
                        tapTokenNodes.splice(i, 1);
                        --i;
                        ++nbTapTokensTapped;
                    }

                    if (nbTapTokensTapped === 2) break;
                }
            }

            resolve();
        });
    }
}