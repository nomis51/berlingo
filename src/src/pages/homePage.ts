import {Page} from "./abstractions/page";
import {AlertComponent} from "../components/alertComponent";
import {LoggerService} from "../content/services/loggerService";
import {DuolingoService} from "../services/duolingoService";

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

        const testAlert = this.addComponent(new AlertComponent("Berlingo v${version}", "success"));
        testAlert.customStyle = `<style>
        .wrapper {
           position: fixed;
           bottom: 1rem;
           left: 1rem; 
           z-index: 999999;
        }
        </style>`;

        const root = document.querySelector("#root") as HTMLDivElement;
        root.appendChild(testAlert.render());
    }

    /**
     * Protected functions
     */
    protected isReady(): boolean {
        return !!document.getElementById("root");
    }
}