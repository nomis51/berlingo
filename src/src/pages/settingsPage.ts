import {Page} from "./abstractions/page";
import {LoggerService} from "../content/services/loggerService";

export class SettingsPage extends Page {
    /**
     * Public functions
     */
    public async render(): Promise<void> {
        await super.render();

        LoggerService.debug("Rendering settings page");

        const result = document.evaluate(
            "//h1[text()='Preferences']",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        const header = result.singleNodeValue as HTMLDivElement | undefined;
        if (!header) {
            LoggerService.error("Unable to find preferences page header");
            return;
        }

        const container = header!.parentElement;
        if (!container) {
            LoggerService.error("Unable to find preferences page container");
            return;
        }

        const section = document.createElement("section");
        const divHeader = document.createElement("div");
        const divDivHeader = document.createElement("div");
        const title = document.createElement("h2");
        title.textContent = "Berlingo settings";
        divDivHeader.appendChild(title);
        const hr = document.createElement("hr");
        divHeader.appendChild(divDivHeader);
        divHeader.appendChild(hr);
        section.appendChild(divHeader);

        const ul = document.createElement("ul");
        const li = document.createElement("li");
        const liDiv = document.createElement("div");
        const liTitle = document.createElement("span");
        liTitle.textContent = "Solve delay";
        liDiv.appendChild(liTitle)

        const input = document.createElement("input");
        input.type = "number";
        input.value = "500";
        input.placeholder = "Solve delay in ms";
        liDiv.appendChild(input);

        li.appendChild(liDiv);
        ul.appendChild(li);

        section.appendChild(ul);
        container.appendChild(section);
    }

    /**
     * Protected functions
     */
    protected isReady(): boolean {
        return !!document.querySelector("a[data-test='settings-account']");
    }
}