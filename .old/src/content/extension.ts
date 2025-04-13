import {reactUtils} from "../helpers/reactUtils";
import {WindowMessageType, StorageKey, WindowMessage} from "../types";
import {debug, enableConsole, log, welcomeLog} from "../helpers/logger";
import {DuolingoSolver} from "../duolingo/duolingoSolver";
import {getFromWindow} from "../helpers/windowUtils";
import {generateRandomId} from "../helpers/randomId";

const BERLINGO_CONTAINER_ID: string = "berlingo-container";
const BUTTONS_CONTAINER_CLASSNAME: string = "buttons-container";
const BUTTON_SOLVE_ID: string = "button-solve";
const BUTTON_HINT_ID: string = "button-hint";
const BUTTON_SHOW_HINT_ID: string = "button-show-hint";
const BUTTON_SHOW_ANSWER_ID: string = "button-show-answer";
export const ANSWER_TEXT_ID: string = "answer-text";

class Extension {
    private _initialized: boolean = false;

    private _container: HTMLDivElement | null = null;
    private _buttonSolve: HTMLButtonElement | null = null;
    private _buttonHint: HTMLButtonElement | null = null;
    private _buttonShowHint: HTMLButtonElement | null = null;
    private _buttonShowAnswer: HTMLButtonElement | null = null;
    private _answerText: HTMLParagraphElement | null = null;
    private _buttonsContainer: HTMLDivElement | null = null;

    constructor() {
        enableConsole();
        welcomeLog();

        this.initialize();
    }

    private async solve() {
        if (!this._initialized) return;

        log("Solving challenge");
        const solver = new DuolingoSolver();
        await solver.solve();
    }

    private async hint() {
        if (!this._initialized) return;

        // TODO: basically do the next step, word, translation only
    }

    private async showHint() {
        if (!this._initialized) return;

        // TODO: same as hint, but only show the hint, don't do it
    }

    private async showAnswer() {
        if (!this._initialized) return;

        log("Getting answer");
        const solver = new DuolingoSolver();
        const text = await solver.getAnswer();
        if (!text) {
            log("No answer found");
            return;
        }

        log("Answer:", text);
        this._answerText!.textContent = text;
        this._answerText!.style.display = "block";

        const playerNextButton = document.querySelector("[data-test='player-next']");
        if (!playerNextButton) return;

        const _this = this;

        function f() {
            _this._answerText!.style.display = "none";
            playerNextButton?.removeEventListener("click", f);
        }

        playerNextButton.addEventListener("click", f.bind(this));
    }

    private initialize() {
        if (this._initialized) return;

        debug("Initializing extension");
        this.setHandlers();

        if (!this.findCourseData()) return;
        this.injectHtml();
        this.setHotkeys();

        this._initialized = true;
    }

    private setHandlers() {
        document.addEventListener(WindowMessageType.DownloadLogs.request, () => {
            getFromWindow("downloadLogs")();
        });
    }

    private findCourseData(): boolean {
        debug("Finding course data");

        const props = reactUtils.findReactFiberWithProp("username");
        log("props:", props);
        if (!props) return false;

        const currentCourse = props.courses.find((e: any) => e.isCurrent);
        if (!currentCourse) return false;

        debug("Language:", currentCourse.learningLanguageName);

        window.postMessage({
            type: WindowMessageType.SetStorage.request,
            data: {
                key: StorageKey.Course,
                value: {
                    courseId: currentCourse.courseId,
                    fromLanguageId: currentCourse.fromLanguageId,
                    learningLanguageId: currentCourse.learningLanguageId,
                    learningLanguageName: currentCourse.learningLanguageName
                }
            }
        } as WindowMessage);

        return true;
    }

    private injectHtml() {
        if (document.getElementById(BERLINGO_CONTAINER_ID)) {
            debug("HTML already injected, skipping");
            return;
        }

        debug("Injecting HTML");
        this._container = document.createElement("div");
        this._container.setAttribute("id", BERLINGO_CONTAINER_ID);
        document.body.appendChild(this._container);

        this._answerText = document.createElement("p");
        this._answerText.setAttribute("id", ANSWER_TEXT_ID);
        this._container.appendChild(this._answerText);

        this._buttonsContainer = document.createElement("div");
        this._buttonsContainer.setAttribute("class", BUTTONS_CONTAINER_CLASSNAME);
        this._container.appendChild(this._buttonsContainer);

        // this._buttonShowHint = document.createElement("button");
        // this._buttonShowHint.setAttribute("id", BUTTON_SHOW_HINT_ID);
        // this._buttonShowHint.textContent = "Show Hint";
        // this._container.appendChild(this._buttonShowHint);
        //
        this._buttonShowAnswer = document.createElement("button");
        this._buttonShowAnswer.setAttribute("id", BUTTON_SHOW_ANSWER_ID);
        this._buttonShowAnswer.textContent = "Show Answer";
        this._buttonShowAnswer.addEventListener("click", this.showAnswer.bind(this));
        this._buttonsContainer.appendChild(this._buttonShowAnswer);
        //
        // this._buttonHint = document.createElement("button");
        // this._buttonHint.setAttribute("id", BUTTON_HINT_ID);
        // this._buttonHint.textContent = "Hint";
        // this._container.appendChild(this._buttonHint);

        this._buttonSolve = document.createElement("button");
        this._buttonSolve.setAttribute("id", BUTTON_SOLVE_ID);
        this._buttonSolve.textContent = "Solve";
        this._buttonSolve.addEventListener("click", this.solve.bind(this));
        this._buttonsContainer.appendChild(this._buttonSolve);

        const observer = new MutationObserver(() => {
            const sessionFooter = document.getElementById("session/PlayerFooter");
            this._container!.style.display = sessionFooter ? "flex" : "none";
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    private setHotkeys() {
        debug("Setting hotkeys");

        document.addEventListener("keyup", async e => {
            if (e.key === "Enter" && e.ctrlKey) {
                // const challenge = new DuolingoChallenge();
                // challenge.solve()
                //     .then(() => {
                //         challenge.clickNext();
                //         window.berlingo.solving = false;
                //     })
                //     .catch(err => {
                //         logger.error(err);
                //     });
            }

            if (e.key === "Enter" && e.altKey) {
                // const challenge = new DuolingoChallenge();
                // challenge.solve()
                //     .then(() => {
                //         window.berlingo.solving = false;
                //     })
                //     .catch(err => {
                //         logger.error(err);
                //     });
            }

            if (e.key === "s" && e.altKey) {
                // @ts-ignore
                document.querySelector("[data-test='player-skip']")?.click();
            }
        });
    }
}

new Extension();
