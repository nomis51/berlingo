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