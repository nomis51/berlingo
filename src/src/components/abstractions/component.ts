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

export const BERLINGO_CLASS_NAME = "berlingo";

export abstract class Component {
    /**
     * Members
     */
    public readonly name: string;
    protected readonly _id: string | undefined;
    private _container: HTMLDivElement | undefined;
    private _shadow: ShadowRoot | undefined;
    public customStyle: string = "";

    public get contentContainer(): HTMLDivElement | undefined {
        return this._shadow?.querySelector(".wrapper-content") ?? undefined;
    }

    /**
     * Constructor
     */
    protected constructor(name: string, id: string | undefined) {
        this.name = name;
        this._id = id;
    }

    /**
     * Public functions
     */
    public abstract render(): HTMLDivElement;

    public dispose() {
        this._container?.remove();
    }

    /**
     * Protected functions
     */
    protected create(html: string, style: string = ""): [HTMLDivElement, ShadowRoot] {
        this._container = document.createElement("div");
        this._container.classList.add(BERLINGO_CLASS_NAME);
        this._container.classList.add(this.name);
        this._container.id = this._id ?? "";

        this._shadow = this._container.attachShadow({mode: "open"});
        const wrapper = document.createElement("div");
        wrapper.classList.add("wrapper");
        wrapper.innerHTML = `
            <style>
                :host {
                    all: initial;
                }
                ${style.replace(/^<style>|<\/style>$/gi, "")}${this.customStyle.replace(/^<style>|<\/style>$/gi, "")}
            </style>
            <div class="wrapper-content">${html}</div>
            `;

        this._shadow.appendChild(wrapper);
        return [this._container, this._shadow];
    }
}