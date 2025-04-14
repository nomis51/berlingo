import {DuolingoService} from "./services/duolingoService";
import {LoggerService} from "./content/services/loggerService";
import {UiService} from "./services/uiService";

LoggerService.initialize();
boostrap().then();

async function boostrap() {
    LoggerService.debug("Bootstrapping");

    if (location.pathname === "/learn") {
        if (!await DuolingoService.loadProfileData()) {
            LoggerService.error("Failed to acquire profile data");
        }
    } else {
        LoggerService.warn("Language cannot be detected outside of the home page")
    }

    await UiService.initialize();
    LoggerService.info("Initialized");
}