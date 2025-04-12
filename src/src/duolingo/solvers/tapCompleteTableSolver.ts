import {Solver} from "./abstractions/solver";

export class TapCompleteTableSolver extends Solver {
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

            this.displayTableTokens.forEach(row => {
                row.forEach((cell: any) => {
                    if (!cell.isBlank) return;

                    const matchingChoice = tapTokens[cell.text];
                    if (!matchingChoice) return;

                    matchingChoice.click();
                });
            });

            resolve();
        });
    }
}