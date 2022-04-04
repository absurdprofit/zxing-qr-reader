import {ZXing, IResult} from './zxing';

export default class Reader extends ZXing {
    private _errorHandler: Function | null = null;
    constructor() {
        super();
    }

    onError(e: Error) {
        if (this._errorHandler) {
            this._errorHandler(e);
        }
    }

    set errorHandler(_errorHandler: Function) {
        this._errorHandler = _errorHandler;
    }

    async readBarCode(file: File) : Promise<IResult>;
    async readBarCode(data : Uint8Array, width : number, height : number) : Promise<IResult>;
    async readBarCode(data: File | Uint8Array, width?: number, height?: number) {
        try {
            if (data instanceof File) {
                data = await this._getFileData(data);
            }
            if (ZXing._reader) {
                const buffer = ZXing._reader._malloc(data.length);
                ZXing._reader.HEAPU8.set(data, buffer);

                
                if (data instanceof File) {
                    const result : IResult = await ZXing._reader.readBarcode(buffer, data.length, true, "QR_CODE");
                    ZXing._reader._free(buffer);
                    return result;
                } else if (data instanceof Uint8Array && width && height) {
                    const result : IResult = await ZXing._reader.readBarcodeFromPixmap(buffer, width, height, true, "QR_CODE");
                    ZXing._reader._free(buffer);
                    return result;
                }
                
            } else {
                const error : Error = new Error("Reader isn't initialised.");
                throw(error);
            }
        } catch (e) {
            throw(e);
        }
    }
}