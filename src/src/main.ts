import {DuolingoService} from "./services/duolingoService";
import {LoggerService} from "./content/services/loggerService";
import {UiService} from "./services/uiService";

LoggerService.initialize();
let bootstrapTries = 3;
boostrap().then();

async function boostrap() {
    LoggerService.debug("Bootstrapping");

    if (location.pathname !== "/learn") {
        if (!await DuolingoService.loadProfileData()) {
            if (--bootstrapTries === 0) {
                LoggerService.error("Failed to acquire profile data");
                return;
            }

            LoggerService.warn("Failed to acquire profile data, retrying...");
            return setTimeout(boostrap, 1000);
        }
    } else {
        LoggerService.warn("Language cannot be detected outside of the home page")
    }

    await UiService.initialize();
    LoggerService.info("Initialized");
}