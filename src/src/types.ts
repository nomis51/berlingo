export interface ChromeMessage {
    action: string;
    data: any | undefined;
}

export interface ReactFiber {
    memoizedProps: any;
    pendingProps: any;
    child: ReactFiber | null;
    sibling: ReactFiber | null;
    return: any;
}

const BERLINGO_MESSAGE_TYPE_PREFIX = "berlingo:";
export const WindowMessageType = {
    SetStorage: {
        request: `${BERLINGO_MESSAGE_TYPE_PREFIX}set_storage:request`,
        response: `${BERLINGO_MESSAGE_TYPE_PREFIX}set_storage:response`,
    },
    GetStorage: {
        request: `${BERLINGO_MESSAGE_TYPE_PREFIX}get_storage:request`,
        response: `${BERLINGO_MESSAGE_TYPE_PREFIX}get_storage:response`,
    },
    DownloadLogs: {
        request: `${BERLINGO_MESSAGE_TYPE_PREFIX}download_logs:request`,
        response: `${BERLINGO_MESSAGE_TYPE_PREFIX}download_logs:response`,
    },
    ShowAnswer: {
        request: `${BERLINGO_MESSAGE_TYPE_PREFIX}show_answer:request`,
        response: `${BERLINGO_MESSAGE_TYPE_PREFIX}show_answer:response`,
    },
}

export interface WindowMessage {
    id: string;
    type: string;
    data: any | undefined
}

export const StorageKey = {
    Settings: "settings",
    Course: "course",
}