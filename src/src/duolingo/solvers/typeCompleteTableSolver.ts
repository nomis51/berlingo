import {Solver} from "./abstractions/solver";
import {ReactService} from "../../services/reactService";

export class TypeCompleteTableSolver extends Solver {
    public getAnswer(): string {
        return "";
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            const blankInputs = document.querySelectorAll("input[type=text]");
            blankInputs.forEach(e => {
                const fiber = ReactService.getReactFiber(e);
                if (!fiber) return;

                const answerToken = fiber.return?.return?.return?.return?.pendingProps;
                if (!answerToken) return;

                fiber?.pendingProps?.onChange({target: {value: answerToken?.fullText?.substring(answerToken?.damageStart)}});
            });

            resolve();
        });
    }
}