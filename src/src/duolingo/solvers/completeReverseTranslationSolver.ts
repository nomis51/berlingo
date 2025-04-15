import {Solver} from "./abstractions/solver";
import {ReactService} from "../../services/reactService";

export class CompleteReverseTranslationSolver extends Solver {
    public getAnswer(): string {
        return this.displayTokens.join(' ');
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this.isToggledToTyping) {
                const inputs = Array.from(document.querySelectorAll("[data-test='challenge-translate-input']"));
                const input = inputs.shift() as HTMLInputElement;
                if (!input) return resolve();

                const answer = this.displayTokens.map(e => e.text).join('');
                this.insertTranslation(answer);
            } else {
                const inputs = Array.from(document.querySelectorAll("[data-test='challenge-text-input']"));
                this.displayTokens.forEach(e => {
                    if (!e.isBlank) return;

                    const input = inputs.shift() as HTMLInputElement;
                    if (!input) return;

                    const fiber = ReactService.getReactFiber(input);
                    if (!fiber) return;

                    fiber?.return
                        ?.stateNode
                        ?.props
                        ?.onChange({target: {value: e.text}});
                });
            }

            resolve();
        });
    }
}