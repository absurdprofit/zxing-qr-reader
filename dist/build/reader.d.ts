import { ZXing, IResult } from './zxing';
export declare class QrReader extends ZXing {
    private _output_render_context;
    private _video;
    private _stream;
    private _is_scanning;
    private _anim_id;
    private _interval_id;
    constructor(context: CanvasRenderingContext2D);
    private _read;
    private _render;
    scan(): Promise<void>;
    stop(): Promise<boolean>;
    readBarCodeFile(file: File): Promise<IResult>;
    readBarCodeData(data: Uint8Array, width: number, height: number): Promise<IResult>;
}
