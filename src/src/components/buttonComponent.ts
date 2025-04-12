import {Component} from "./abstractions/component";

export class ButtonComponent extends Component {
    /**
     * Members
     */
    private _text: string;
    private readonly _onClick: () => void;

    /**
     * Constructors
     */
    constructor(text: string, onClick: () => void, id: string = "") {
        super("button", id);

        this._text = text;
        this._onClick = onClick;
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
                border-radius: 12px;
                cursor: pointer;
                height: 46px;
                max-height: 46px;
            }
            
            button:active {
                box-shadow: none;
                transform: translate(0, 4px);
            }
            </style>`
        );

        shadow.addEventListener("click", this._onClick);

        return container;
    }
}