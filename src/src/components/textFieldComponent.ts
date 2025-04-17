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

export class TextFieldComponent extends Component {
    /**
     * Members
     */
    private _placeholder: string = "";
    private _label: string = "";
    private _value: string = "";
    private readonly _inputType: "text" | "number" = "text";
    private readonly _min: number = 0;
    private readonly _max: number = Number.MAX_SAFE_INTEGER;
    private _input!: HTMLInputElement;

    /**
     * Constructors
     */
    constructor(placeholder: string, label: string, value: string = "", type: "text" | "number" = "text", min: number = 0, max: number = Number.MAX_SAFE_INTEGER, id: string = "") {
        super("text-field", id);

        this._placeholder = placeholder;
        this._label = label;
        this._value = value;
        this._inputType = type;
    }


    /**
     * Public funtions
     */
    public render(): HTMLDivElement {
        const [container, shadow] = this.create(
            `<div class="container">
                <label>${this._label}</label>
                <input type="${this._inputType}" placeholder="${this._placeholder}" value="${this._value}" ${this._inputType === "number" ? `min="${this._min}" max="${this._max}"` : ""}>
            </div>`,
            `<style>
                .container {
                    display: flex;
                    flex-direction: column;
                } 
                
               label {
                   font-weight: 700;
                   font-family: var(--duolingo-font-family);
                   text-wrap: nowrap;
                   color: var(--duolingo-button-text-light);
                   font-size: 20px;
               } 
               
               input {
                    font-family: var(--duolingo-font-family);
                    border-style: solid;
                    border-color: var(--duolingo-border-dark);
                    border-width: 2px 2px 0 2px;
                    padding: 15px 16px;
                    box-shadow: 0 4px 0 var(--duolingo-border-dark);
                    background-color: transparent;
                    border-radius: 16px;
                    color: var(--duolingo-button-text-light);
                    font-size: 16px;
               }
            </style>`
        );

        this._input = shadow.querySelector("input") as HTMLInputElement;

        return container;
    }

    public onChange(callback: (value: string) => void) {
        this._input.oninput = () => callback(this._input.value);
    }

    public setValue(value: string) {
        this._input.value = value;
    }
}