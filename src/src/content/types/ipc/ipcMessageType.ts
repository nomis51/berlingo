export const IpcMessageType = {
    getStorage: createIpcMessageType("getStorage"),
    setStorage: createIpcMessageType("setStorage")
};

const IPC_MESSAGE_TYPE_PREFIX = "berlingo";

function createIpcMessageType(name: string): IpcMessageTypeValue {
    return {
        request: `${IPC_MESSAGE_TYPE_PREFIX}.request.${name}`,
        response: `${IPC_MESSAGE_TYPE_PREFIX}.response.${name}`,
    }
}

interface IpcMessageTypeValue {
    request: string;
    response: string;
}