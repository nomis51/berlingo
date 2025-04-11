export const BERLINGO_NAME = "berlingo";


export function setToWindow(key: string, value: any) {
    if (!window[BERLINGO_NAME]) {
        window[BERLINGO_NAME] = {};
    }

    window[BERLINGO_NAME][key] = value;
}

export function getFromWindow(key: string): any | undefined {
    if (!window[BERLINGO_NAME]) {
        window[BERLINGO_NAME] = {};
    }

    return window[BERLINGO_NAME][key];
}