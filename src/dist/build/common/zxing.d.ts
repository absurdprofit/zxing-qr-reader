export declare type Dimension = {
    x: number;
    y: number;
};
export interface IPosition {
    bottomLeft: Dimension;
    bottomRight: Dimension;
    topLeft: Dimension;
    topRight: Dimension;
}
export interface ICallbacks {
    found?: Function;
    error?: Function;
}
declare enum Eevents {
    found = 0,
    error = 1
}
export declare type events = keyof typeof Eevents;
export interface IResult {
    error: string;
    format: string;
    position: IPosition;
    text: string;
    profile_info: string;
}
export declare class Result implements IResult {
    error: string;
    format: string;
    position: IPosition;
    text: string;
    profile_info: string;
    constructor(result?: {
        error?: string;
        format?: string;
        position?: IPosition;
        text?: string;
        profile_info?: string;
    });
}
export declare abstract class ZXing {
    protected _reader: any;
    protected _callbacks: ICallbacks;
    constructor();
    on(event: events, callback: Function): void;
    private _getReader;
    protected _getFileData(file: File): Promise<Uint8Array>;
    abstract readBarCodeFile(file: File): Promise<IResult>;
    abstract readBarCodeData(data: Uint8Array, width: number, height: number): Promise<IResult>;
}
export {};
