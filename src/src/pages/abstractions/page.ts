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

import {Component} from "../../components/abstractions/component";
import {LoggerService} from "../../content/services/loggerService";

export abstract class Page {
    /**
     * Members
     */
    private readonly _components: Component[] = [];

    /**
     * Public functions
     */
    public render(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.isReady()) {
                return setTimeout(() => this.render(), 200);
            }

            resolve();
        });
    }


    public dispose() {
        LoggerService.debug("Disposing page");
        this._components.forEach(component => component.dispose());
    }

    public addComponent<T extends Component>(component: T): T {
        this._components.push(component);
        return component;
    }

    /**
     * Protected functions
     */
    protected abstract isReady(): boolean;
}