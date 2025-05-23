﻿import {Solver} from "./abstractions/solver";
import {reactUtils} from "../../helpers/reactUtils";

export class PartialReverseTranslateSolver extends Solver {
    public getAnswer(): string {
        return this.displayTokens
            .filter(e => !e.isBlank)
            .map(e => e.text)
            .join('');
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            const textToFill = this.displayTokens
                .filter(e => e.isBlank)
                .map(e => e.text)
                .join('');
            const translateInput = document.querySelector("[contenteditable='true']") as HTMLInputElement;
            reactUtils.getReactFiber(translateInput)
                ?.pendingProps
                ?.onInput({currentTarget: {innerText: textToFill}})

            resolve();
        });
    }
}