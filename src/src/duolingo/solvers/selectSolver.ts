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

import {Solver} from "./abstractions/solver";

export class SelectSolver extends Solver {
    public getAnswer(): string {
        return `Choose #${this.correctIndex + 1}`
    }

    public solve(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.chooseIndex("[data-test*='challenge-choice']", this.correctIndex);
            resolve();
        })
    }
}