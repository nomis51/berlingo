/*
 * This file is part of Berlingo
 *
 * Copyright (C) 2025 nomis51
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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