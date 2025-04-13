import {Page} from "./abstractions/page";
import {LoggerService} from "../content/services/loggerService";
import {TextFieldComponent} from "../components/textFieldComponent";
import {StorageService} from "../services/storageService";
import {StorageKey} from "../content/types/storage/storageKey";
import {Settings} from "../content/types/settings";

export class SettingsPage extends Page {
    /**
     * Members
     */
    private _solveDelayTextField!: TextFieldComponent;

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

        this._solveDelayTextField = this.addComponent(new TextFieldComponent(
            "e.g. 500",
            "Solve delay",
            "",
            "number",
        ));
        container.appendChild(this._solveDelayTextField.render());

        this._solveDelayTextField.onChange(async (value) => {
            const iValue = parseInt(value);
            if (isNaN(iValue)) return;

            let settings = await StorageService.get<Settings>(StorageKey.settings);
            if (!settings) {
                settings = {
                    solveDelay: 200
                };
            }

            settings.solveDelay = iValue;
            await StorageService.set(StorageKey.settings, settings);
        });

        const settings = await StorageService.get<Settings>(StorageKey.settings);
        this._solveDelayTextField.setValue(settings?.solveDelay.toString() ?? "200");
    }

    /**
     * Protected functions
     */
    protected isReady(): boolean {
        return !!document.querySelector("a[data-test='settings-account']");
    }
}