import {Solver} from "./abstractions/solver";

export class TapClozeSolver extends Solver {
    public getAnswer(): string {
        return this.displayTokens
            .filter(e => e !== undefined)
            .map(e => e?.text.substring(e.damageStart, e.damageEnd))
            .join("");
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            const tapTokenNodes = document.querySelectorAll("[data-test='challenge-tap-token-text']");
            const tapTokens: any = {};

            Array.from(tapTokenNodes)
                .forEach(e => {
                    tapTokens[e.childNodes[0].textContent as string] = e;
                });

            this.displayTokens.forEach(e => {
                if (e === undefined) return;

                const answer = e.text.substring(e.damageStart);
                tapTokens[answer]?.click();
            });

            resolve();
        });
    }
}