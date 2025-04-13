import {DuolingoService} from "./services/duolingoService";
import {LoggerService} from "./content/services/loggerService";
import {UiService} from "./services/uiService";

LoggerService.initialize();
let bootstrapTries = 3;
boostrap().then();

async function boostrap() {
    LoggerService.debug("Bootstrapping");

    if (location.pathname !== "/learn") {
        LoggerService.debug("Navigating to duolingo.com/learn");
        location.href = "https://www.duolingo.com/learn";
        return;
    }

    if (!await DuolingoService.loadProfileData()) {
        if (--bootstrapTries === 0) {
            LoggerService.error("Failed to initialize");
            return;
        }

        LoggerService.warn("Failed to initialize, retrying...");
        return setTimeout(boostrap, 1000);
    }

    await UiService.initialize();
    LoggerService.info("Initialized");
}