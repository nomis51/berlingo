import {SelectTranscriptionSolver} from "./selectTranscriptionSolver";

export class DialogueSolver extends SelectTranscriptionSolver {
    override solve(): Promise<void> {
        for (let i = 0; i < 2; ++i) {
            this.clickNext();
        }
       
        return super.solve();
    }
}