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

import {LoggerService} from "../content/services/loggerService";
import {ReactService} from "./reactService";
import {Course, ProfileData} from "../types/duolingo/ProfileData";
import {DuolingoSolver} from "../duolingo/duolingoSolver";
import {StorageService} from "./storageService";
import {StorageKey} from "../content/types/storage/storageKey";
import {IpcService} from "../content/services/ipcService";
import {IpcMessageType} from "../content/types/ipc/ipcMessageType";
import {IpcMessageProtocol} from "../content/types/ipc/ipcMessageProtocol";

class DuolingoServiceImpl {
    /**
     * Members
     */
    private _profileData: ProfileData | undefined;
    private readonly _solver: DuolingoSolver = new DuolingoSolver();
    private _isSolving: boolean = false;

    /**
     * Props
     */
    public get hasProfileData(): boolean {
        return !!this._profileData;
    }

    public get username(): string {
        return this._profileData?.username ?? "";
    }

    public get courses(): Course[] {
        return this._profileData?.courses ?? [];
    }

    public get currentCourse(): Course | undefined {
        return this.courses.find(c => c.isCurrent);
    }

    /**
     *  Public functions
     */
    public async loadProfileData(): Promise<boolean> {
        LoggerService.debug("Getting profile data");

        this._profileData = ReactService.findReactFiberWithPropName<ProfileData>("username");
        if (this.hasProfileData && this.currentCourse) {
            await StorageService.set(StorageKey.language, this.currentCourse.learningLanguageName);
            await IpcService.sendMessage(IpcMessageType.languageUpdated, this.currentCourse.learningLanguageName, IpcMessageProtocol.Window).then();
        }

        return this.hasProfileData;
    }

    public async solveChallenge(): Promise<void> {
        if (this._isSolving) return;

        LoggerService.info("Solving challenge");
        this._isSolving = true;
        await this._solver.solve();
        this._isSolving = false;
    }

    public getChallengeAnswer(): string {
        const answer = this._solver.getAnswer();
        LoggerService.info("Answer: ", answer);
        return answer;
    }
}

export const DuolingoService = new DuolingoServiceImpl();