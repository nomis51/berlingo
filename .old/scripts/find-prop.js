(function () {
    const frame = document.createElement("frame");
    frame.style.display = "none";
    document.body.appendChild(frame);
    console.log = frame.contentWindow.console.log.bind(frame.contentWindow.console);

    function getReactFiber(dom) {
        if (!dom) return null;
        const keys = Object.keys(dom);
        for (const key of keys) {
            if (key.startsWith('__reactFiber$')) {
                return dom[key];
            }
        }
        return null;
    }

    function findPropInFiberTree(fiber, propName) {
        const visited = new Set();

        function walk(node) {
            if (!node || visited.has(node)) return null;
            visited.add(node);

            const props = node.pendingProps || node.memoizedProps;
            if (props && props[propName] !== undefined) {
                return {value: props[propName], node};
            }

            return walk(node.child) || walk(node.sibling);
        }

        return walk(fiber);
    }

    function getComponentName(fiber) {
        if (!fiber || typeof fiber.type === 'string') return null;
        return fiber.type?.name || fiber.type?.displayName || '(anonymous component)';
    }

    function getDomClassName(fiber) {
        let current = fiber;
        while (current) {
            if (current.stateNode instanceof HTMLElement) {
                return current.stateNode.className || '(no class)';
            }
            current = current.child;
        }
        return '(not a DOM element)';
    }

    function scanForProp(propName) {
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
            const fiber = getReactFiber(el);
            if (fiber) {
                const result = findPropInFiberTree(fiber, propName);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    const result = scanForProp('username');

    if (result) {
        const {value, node} = result;
        const componentName = getComponentName(node);
        const domClass = getDomClassName(node);

        console.log('Found `username` prop!');
        console.log('Value:', value);
        console.log('Component:', componentName);
        console.log('DOM Class:', domClass);
        console.log('Fiber node:', node);
    } else {
        console.log('`username` prop not found in any fiber tree');
    }
})();
