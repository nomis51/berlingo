import {ReactFiber} from "../types/react/ReactFiber";

const REACT_FIBER_KEY = "__reactFiber$";

class ReactServiceImpl {
    /**
     * Public functions
     */
    public getReactFiber(element: Element | null): ReactFiber | undefined {
        if (!element) return;

        return this.getReactInternalKey(element, REACT_FIBER_KEY);
    }

    public findReactFiberWithPropName<T>(propName: string): T | undefined {
        const allElements = document.querySelectorAll('*');
        for (const allElement of allElements) {
            const fiber = this.getReactFiber(allElement);
            if (!fiber) continue;

            const result = this.findPropInFiberTree<T>(fiber, propName);
            if (result !== undefined) return result;
        }
    }

    /**
     * Private functions
     */
    private getReactInternalKey(element: any, reactKey: string): ReactFiber | undefined {
        if (!element) return;

        const keys = Object.keys(element);
        for (const key of keys) {
            if (!key.startsWith(reactKey)) continue;

            return element[key];
        }
    }

    private findPropInFiberTree<T>(fiber: ReactFiber, propName: string): T | undefined {
        const visited = new Set();

        function walk(node: ReactFiber | null): T | undefined {
            if (!node || visited.has(node)) return;
            visited.add(node);

            const props = node.pendingProps || node.memoizedProps;
            if (props && props[propName] !== undefined) return props;

            return walk(node.child) || walk(node.sibling);
        }

        return walk(fiber);
    }
}

export const ReactService = new ReactServiceImpl();