import {SelectTranscriptionSolver} from "./selectTranscriptionSolver";

export class DialogueSolver extends SelectTranscriptionSolver {
    override async solve(): Promise<void> {
        for (let i = 0; i < 2; ++i) {
            await this.clickNext();
        }
       
        return super.solve();
    }
}