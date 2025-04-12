export const IpcMessageType = {
    getStorage: createIpcMessageType("getStorage"),
    setStorage: createIpcMessageType("setStorage")
};


function createIpcMessageType(name: string): IpcMessageTypeValue {
    const IPC_MESSAGE_TYPE_PREFIX = "berlingo";

    return {
        request: `${IPC_MESSAGE_TYPE_PREFIX}.request.${name}`,
        response: `${IPC_MESSAGE_TYPE_PREFIX}.response.${name}`,
    }
}

export interface IpcMessageTypeValue {
    request: string;
    response: string;
}