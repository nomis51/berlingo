import {Solver} from "./abstractions/solver";
import {ReactService} from "../../services/reactService";

export class CompleteReverseTranslationSolver extends Solver {
    public getAnswer(): string {
        return this.displayTokens.join(' ');
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            const inputs = Array.from(document.querySelectorAll("[data-test='challenge-text-input']"));

            this.displayTokens.forEach(e => {
                if (e.isBlank) return;

                const input = inputs.shift() as HTMLInputElement;
                ReactService.getReactFiber(input)
                    ?.return
                    ?.stateNode
                    ?.props
                    ?.onChange({target: {value: e.text}});
            })
            resolve();
        });
    }
}