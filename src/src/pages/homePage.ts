import {Page} from "./abstractions/page";
import {AlertComponent} from "../components/alertComponent";
import {LoggerService} from "../content/services/loggerService";
import {DuolingoService} from "../services/duolingoService";
import {ButtonComponent} from "../components/buttonComponent";
import {IconButtonComponent} from "../components/iconButtonComponent";

export class HomePage extends Page {
    /**
     * Public functions
     */
    public async render(): Promise<void> {
        await super.render();

        LoggerService.debug("Rendering home page");

        if (await DuolingoService.loadProfileData()) {
            LoggerService.debug("Profile data refreshed");
        }

        const versionAlert = this.addComponent(new AlertComponent("Berlingo v${version}", "success"));
        const practiceButton = this.addComponent(new IconButtonComponent("practice"));

        const divFlex = document.createElement("div");
        divFlex.style.display = "flex";
        divFlex.style.flexDirection = "row";
        divFlex.style.alignItems = "center";
        divFlex.style.gap = "80px";
        divFlex.style.position = "fixed";
        divFlex.style.bottom = "1rem";
        divFlex.style.left = "1rem";
        divFlex.style.zIndex = "999999";
        divFlex.appendChild(versionAlert.render());
        divFlex.appendChild(practiceButton.render());

        const root = document.querySelector("#root") as HTMLDivElement;
        root.appendChild(divFlex);

        practiceButton.addEventListener("click", this.gotoPractice.bind(this));
    }

    /**
     * Protected functions
     */
    protected isReady(): boolean {
        return !!document.getElementById("root") &&
            !!document.querySelector("[data-test='skill-path']");
    }

    /**
     * Private functions
     */
    private gotoPractice() {
        location.href = "/practice";
    }
}