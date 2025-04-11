(function () {
    const frame = document.createElement("frame");
    frame.style.display = "none";
    document.body.appendChild(frame);
    console.log = frame.contentWindow.console.log.bind(frame.contentWindow.console);

    const SCAN_REPORT_KEY_NAME = "scanReport";
    window[SCAN_REPORT_KEY_NAME] = {};
    const PREFIXES = [
        "__reactInternalInstance$",
        "__reactFiber$",
        "__reactEventHandlers$",
        "__reactProps$",
    ];
    const CONTAINERS_NAMES = ["#root"];

    for (const name of CONTAINERS_NAMES) {
        const container = document.querySelector(name);
        scanContainer(container, name);
    }

    function scanContainer(container, name) {
        window[SCAN_REPORT_KEY_NAME][name] = {};
        const elements = container.querySelectorAll("*");
        elements.forEach(element => {
            scanNode(element, window[SCAN_REPORT_KEY_NAME][name]);
        });
    }

    function scanNode(element, list) {
        if (element === null || element === undefined) return;

        const keys = Object.keys(element);
        const values = {};

        for (const key of keys) {
            if (!PREFIXES.some(prefix => key.startsWith(prefix))) continue;

            values[key] = element[key];
        }

        list[element.className] = values;
    }

    function findCourseData() {
        for (const containerName of CONTAINERS_NAMES) {
            for (const name of Object.keys(window.scanReport[containerName])) {
                const container = window.scanReport[containerName];
                for (const key of Object.keys(container[name])) {
                    if (!key.startsWith("__reactFiber$")) continue;
                    if (!container[name][key].return) continue;
                    if (!container[name][key].return.memoizedProps) continue;
                    // if (!container[name][key].return.memoizedProps.courses) continue;

                    console.log(name, container[name][key].return.memoizedProps);
                }
            }
        }
    }

    console.log(window.scanReport);
    findCourseData();
})();