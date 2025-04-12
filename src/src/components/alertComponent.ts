import {Component} from "./abstractions/component";

export class AlertComponent extends Component {
    /**
     * Members
     */
    private _text: string = "";

    /**
     * Constructors
     */
    constructor(text: string, id: string = "") {
        super("alert", id);
        this._text = text;
    }

    /**
     * Public functions
     */
    public render(): HTMLDivElement {
        const [container, shadow] = this.create(
            `<div>${this._text}</div>`,
            `<style>
            .wrapper-content div {
                font-weight: 700;
                background: var(--duolingo-green);
                color: #fff;
                border-radius: 13px;
                font-family: var(--duolingo-font-family);
                padding: 16px;
            }
            </style>`
        );

        // TODO: add event listeners to shadow

        return container;
    }
}