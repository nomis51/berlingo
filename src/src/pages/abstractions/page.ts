import {Component} from "../../components/abstractions/component";

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