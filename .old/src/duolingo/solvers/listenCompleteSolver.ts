import {Solver} from "./abstractions/solver";
import {reactUtils} from "../../helpers/reactUtils";

export class ListenCompleteSolver extends Solver {
    public getAnswer(): string {
        return this.displayTokens.join(' ');
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            const translateInputs = Array.from(document.querySelectorAll("[data-test='challenge-text-input']"));
            this.displayTokens.forEach(e => {
                if (!e.isBlank) return;

                // @ts-ignore
                const input = translateInputs.shift() as HTMLInputElement;
                reactUtils.getReactFiber(input)
                    ?.return
                    ?.stateNode
                    ?.props
                    ?.onChange({target: {value: e.text}});
            });

            resolve();
        });
    }
}