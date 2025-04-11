import {Solver} from "./abstractions/solver";
import {StorageKey} from "../../types";
import {getStorage} from "../../helpers/storage";

export class ListenMatchSolver extends Solver {
    public getAnswer(): string {
        return "";
    }

    public async solve(): Promise<void> {
        const nodes = document.querySelectorAll("[data-test*='challenge-tap-token']");
        const groupedNodes: any = {};
        nodes.forEach(e => {
            const dataTestKey = e.getAttribute("data-test") as string;
            if (!groupedNodes[dataTestKey]) {
                groupedNodes[dataTestKey] = [];
            }

            groupedNodes[dataTestKey].push(e);
        });

        const settings = await getStorage<any>(StorageKey.Settings);
        await this.executeListWithDelay(e => {
            e?.[0]?.click();
            e?.[1]?.click();
        }, Object.values(groupedNodes), settings.solveDelay ?? 200);
    }
}