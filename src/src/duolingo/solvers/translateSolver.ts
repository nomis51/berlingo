import {Solver} from "./abstractions/solver";
import {StorageService} from "../../services/storageService";
import {Settings} from "../../content/types/settings";
import {StorageKey} from "../../content/types/storage/storageKey";

export class TranslateSolver extends Solver {
    public getAnswer(): string {
        return this.correctTokens.join(' ');
    }

    public async solve(): Promise<void> {
        if (this.isToggleToTyping) {
            if (this.correctSolutions.length === 0) return;

            this.insertTranslation(this.correctSolutions[0])
        } else {
            const tapTokenNodes = document.querySelectorAll('[data-test="challenge-tap-token-text"]');
            const tapTokens: any = {};

            Array.from(tapTokenNodes)
                .forEach(e => {
                    const content = e.childNodes[0].textContent as string;
                    if (!tapTokens[content]) {
                        tapTokens[content] = [];
                    }

                    tapTokens[content].push(e);
                });

            const settings = await StorageService.get<Settings>(StorageKey.settings);
            await this.executeListWithDelay(e => {
                if (!tapTokens[e] || tapTokens[e].length === 0) return;

                tapTokens[e].shift().click();
            }, this.correctTokens, settings?.solveDelay ?? 200);
        }
    }


}