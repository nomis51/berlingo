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

import {Component} from "./abstractions/component";

export class AlertComponent extends Component {
    /**
     * Members
     */
    private _text: string = "";
    private readonly _level: "success" | "info" | "error" | "warning" = "success";

    /**
     * Constructors
     */
    constructor(text: string, level: "success" | "info" | "error" | "warning", id: string = "") {
        super("alert", id);
        this._text = text;
        this._level = level;
    }

    /**
     * Public functions
     */
    public render(): HTMLDivElement {
        const color = this.getLevelColor();

        const [container, shadow] = this.create(
            `<div>${this._text}</div>`,
            `<style>
            .wrapper-content div {
                font-weight: 700;
                background: var(${color});
                color: #fff;
                border-radius: 13px;
                font-family: var(--duolingo-font-family);
                padding: 16px;
                width: 100%;
            }
            </style>`
        );

        return container;
    }

    public setText(text: string) {
        const div = this.contentContainer?.querySelector("div");
        if (!div) return;

        this._text = text;
        div.textContent = text;
    }

    /**
     * Private functions
     */
    private getLevelColor(): string {
        switch (this._level) {
            case "success":
                return "--duolingo-green";
            case "info":
                return "--duolingo-blue";
            case "error":
                return "--duolingo-red";
            case "warning":
                return "--duolingo-yellow";
            default:
                return "--duolingo-green";
        }
    }
}