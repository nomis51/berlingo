import {
    AssistSolver,
    CharacterIntroSolver,
    CharacterMatchSolver,
    CharacterSelectSolver, CompleteReverseTranslationSolver, DefinitionSolver,
    DialogueSolver,
    FormSolver,
    GapFillSolver,
    JudgeSolver, ListenCompleteSolver, ListenIsolationSolver, ListenMatchSolver,
    ListenSolver,
    ListenTapSolver, MatchSolver,
    NameSolver, PartialReverseTranslateSolver,
    ReadComprehensionSolver,
    SelectPronunciationSolver,
    SelectSolver,
    SelectTranscriptionSolver,
    SpeakSolver,
    TapClozeSolver,
    TapClozeTableSolver,
    TapCompleteSolver,
    TapCompleteTableSolver,
    TranslateSolver,
    TypeClozeSolver,
    TypeClozeTableSolver,
    TypeCompleteTableSolver
} from "./solvers";
import {Solver} from "./solvers/abstractions/solver";
import {LoggerService} from "../content/services/loggerService";
import {ReactService} from "../services/reactService";

export class DuolingoSolver {
    private readonly _solvers: Map<string, any> = new Map([
        ["characterMatch", CharacterMatchSolver],
        ["translate", TranslateSolver],
        ["assist", AssistSolver],
        ["form", FormSolver],
        ["characterSelect", CharacterSelectSolver],
        ["judge", JudgeSolver],
        ["selectTranscription", SelectTranscriptionSolver],
        ["characterIntro", CharacterIntroSolver],
        ["select", SelectSolver],
        ["selectPronunciation", SelectPronunciationSolver],
        ["listen", ListenSolver],
        ["listenTap", ListenTapSolver],
        ["name", NameSolver],
        ["gapFill", GapFillSolver],
        ["tapCompleteTable", TapCompleteTableSolver],
        ["typeCompleteTable", TypeCompleteTableSolver],
        ["typeCloze", TypeClozeSolver],
        ["typeClozeTable", TypeClozeTableSolver],
        ["tapClozeTable", TapClozeTableSolver],
        ["tapCloze", TapClozeSolver],
        ["tapComplete", TapCompleteSolver],
        ["readComprehension", ReadComprehensionSolver],
        ["dialogue", DialogueSolver],
        ["speak", SpeakSolver],
        ["listenMatch", ListenMatchSolver],
        ["match", MatchSolver],
        ["definition", DefinitionSolver],
        ["listenIsolation", ListenIsolationSolver],
        ["completeReverseTranslation", CompleteReverseTranslationSolver],
        ["partialReverseTranslation", PartialReverseTranslateSolver],
        ["listenComplete", ListenCompleteSolver],
    ]);

    public async solve(moveNext: boolean = false): Promise<void> {
        const solver = this.getSolver();
        if (!solver) return;

        await solver.solve();
        if (!moveNext) return;

        LoggerService.debug("Moving to the next challenge")
        await solver.clickNext();
    }

    public getAnswer(): string {
        const solver = this.getSolver();
        if (!solver) return "";

        return solver.getAnswer();
    }

    private getSolver(): Solver | undefined {
        const challengeType = this.getChallengeType();
        if (!challengeType) {
            LoggerService.error("Challenge type not found");
            return;
        }

        const solverType = this._solvers.get(challengeType);
        if (!solverType) {
            LoggerService.error("Solver type not found");
            return;
        }

        return new solverType();
    }

    private getChallengeType(): string | undefined {
        const element = ReactService.getReactFiber(document.querySelector('[data-test="challenge-header"]'));
        if (!element) return;

        return element.memoizedProps?.children?.props?.challenge?.type;
    }
}