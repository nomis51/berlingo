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