﻿/*
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

export class ButtonComponent extends Component {
    /**
     * Members
     */
    private _text: string;

    /**
     * Constructors
     */
    constructor(text: string, id: string = "") {
        super("button", id);

        this._text = text;
    }

    /**
     * Public methods
     */
    public render(): HTMLDivElement {
        const [container, shadow] = this.create(
            `<button>${this._text}</button>`,
            `<style>
              button {
                font-weight: 700;
                font-family: var(--duolingo-font-family);
                text-wrap: nowrap;
                text-transform: uppercase;
                align-items: center;
                color: var(--duolingo-button-text-dark);
                font-size: 17px;
                background: var(--duolingo-green);
                border: none !important;
                padding: 15px 16px;
                box-shadow: 0 4px 0 var(--duolingo-green-dark);
                border-radius: 16px;
                cursor: pointer;
                height: 46px;
                max-height: 46px;
            }
            
            button:active {
                box-shadow: none;
                transform: translate(0, 4px);
            }
            
            button:hover {
               filter: brightness(1.1); 
            }
            </style>`
        );

        return container;
    }

    public addEventListener(event: string, callback: () => void) {
        this.contentContainer?.querySelector("button")?.addEventListener(event, callback);
    }

    public removeEventListener(event: string, callback: () => void) {
        this.contentContainer?.querySelector("button")?.removeEventListener(event, callback);
    }

    public setVisible(visible: boolean) {
        const button = this.contentContainer?.querySelector("button");
        if (!button) return;

        button.style.display = visible ? "block" : "none";
    }

    public setDisabled(disabled: boolean) {
        const button = this.contentContainer?.querySelector("button");
        if (!button) return;

        button.disabled = disabled;

        if (disabled) {
            button.style.opacity = "0.5";
            button.style.cursor = "not-allowed";
        } else {
            button.style.opacity = "1";
            button.style.cursor = "pointer";
        }
    }

    public setText(text: string) {
        const button = this.contentContainer?.querySelector("button");
        if (!button) return;

        this._text = text;
        button.textContent = text;
    }
}