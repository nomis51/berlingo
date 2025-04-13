import {Solver} from "./abstractions/solver";
import {ReactService} from "../../services/reactService";

export class NameSolver extends Solver {
    public getAnswer(): string {
        return this.correctSolutions[0];
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            const correctSolution = this.correctSolutions[0];
            let answer = "";

            if (this.articles.length > 0) {
                const correctArticle = this.articles.find(e => correctSolution.startsWith(e));
                if (!correctArticle) return resolve();

                Array.from(document.querySelectorAll("[data-test='challenge-judge-text']"))
                    .find(e => {
                        return e.innerHTML === correctArticle;
                    })
                    // @ts-ignore
                    ?.click();

                answer = correctSolution.replace(correctArticle, "");
            } else {
                answer = correctSolution;
            }

            const translateInput = document.querySelector("[data-test='challenge-text-input']");
            if (!translateInput) return resolve();

            ReactService.getReactFiber(translateInput)?.return?.stateNode?.onChange({target: {value: answer}});
        });
    }
}