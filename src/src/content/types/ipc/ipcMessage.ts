export interface IpcMessage<T> {
    id: string;
    type: string;
    data?: T | undefined;
}