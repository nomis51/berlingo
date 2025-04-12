import {LoggerService} from "../content/services/loggerService";
import {HomePage} from "../pages/homePage";
import {Page} from "../pages/abstractions/page";
import {LessonPage} from "../pages/lessonPage";

class UiServiceImpl {
    /**
     * Members
     */
    private _currentPage: Page | undefined;

    /**
     * Public functions
     */
    public async initialize(): Promise<void> {
        LoggerService.debug("Initializing UI");
        this.setHotkeys();
        this.setObservers();
        await this.setPage();
    }

    /**
     * Private functions
     */
    private async setPage(): Promise<void> {
        this._currentPage?.dispose();

        if (location.pathname === "/learn") {
            this._currentPage = new HomePage();
        } else if (location.pathname.startsWith("/lesson")) {
            this._currentPage = new LessonPage();
        }

        await this._currentPage?.render();
    }

    private setPageObserver() {
        const pushState = history.pushState;
        history.pushState = async (...args: any) => {
            LoggerService.debug("pushState", args);
            pushState.apply(history, args);
            await this.setPage();
        };

        const replaceState = history.replaceState;
        history.replaceState = async (...args: any) => {
            LoggerService.debug("replaceState", args);
            replaceState.apply(history, args);
            await this.setPage();
        };
    }

    private setObservers() {
        this.setPageObserver();
    }

    private setHotkeys() {
        LoggerService.debug("Setting hotkeys");

        document.addEventListener("keyup", async e => {
            if (e.key === "Enter" && e.ctrlKey) {
                // TODO:
            }

            if (e.key === "Enter" && e.altKey) {
                // TODO:
            }
        });
    }
}

export const UiService = new UiServiceImpl();