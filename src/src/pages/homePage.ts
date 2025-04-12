import {Page} from "./abstractions/page";
import {AlertComponent} from "../components/alertComponent";
import {LoggerService} from "../content/services/loggerService";

export class HomePage extends Page {
    /**
     * Public functions
     */
    public async render(): Promise<void> {
        await super.render();

        LoggerService.debug("Rendering home page");

        const testAlert = this.addComponent(new AlertComponent("Berlingo v0.1.0"));
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

    protected isReady(): boolean {
        return !!document.getElementById("root");
    }
}