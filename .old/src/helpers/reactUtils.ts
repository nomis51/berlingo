import {ReactFiber} from "../types";

class ReactUtilsImpl {
    public getReactFiber(element: Element | null): ReactFiber | null {
        if (!element) return null;

        return this.getReactInternalKey(element, "__reactFiber$");
    }

    public findReactFiberWithProp(propName: string): any | null {
        const allElements = document.querySelectorAll('*');
        for (const allElement of allElements) {
            const fiber = this.getReactFiber(allElement);
            if (!fiber) continue;

            const result = this.findPropInFiberTree(fiber, propName);
            if (result) return result;
        }

        return null;
    }

    private getReactInternalKey(element: any, reactKey: string): any | null {
        if (!element) return null;

        const keys = Object.keys(element);
        for (const key of keys) {
            if (!key.startsWith(reactKey)) continue;

            return element[key];
        }

        return null;
    }

    private findPropInFiberTree(fiber: ReactFiber, propName: string): any {
        const visited = new Set();

        function walk(node: ReactFiber | null): any {
            if (!node || visited.has(node)) return null;
            visited.add(node);

            const props = node.pendingProps || node.memoizedProps;
            if (props && props[propName] !== undefined) {
                return props;
            }

            return walk(node.child) || walk(node.sibling);
        }

        return walk(fiber);
    }
}

export const reactUtils = new ReactUtilsImpl();
