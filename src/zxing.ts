
import ZXing_cpp, {Reader} from "./zxing_reader";

export type Dimension = {
    x: number;
    y: number;
}
export interface IPosition {
    bottomLeft: Dimension;
    bottomRight: Dimension;
    topLeft: Dimension;
    topRight: Dimension;
}

export interface IResult {
    error: string;
    format: string;
    position: IPosition;
    text: string;
    profile_info: string;
}

export class Result implements IResult {
    public error: string;
    public format: string;
    public position: IPosition;
    public text: string;
    public profile_info: string;
    constructor(result? : {error?: string, format?: string, position?: IPosition, text?: string, profile_info?: string}) {
        if (result) {
            this.error = result.error ? result.error : '';
            this.format = result.format ? result.format : '';
            this.position = result.position ? result.position : {
                bottomRight: {x: 0, y: 0},
                bottomLeft: {x: 0, y: 0},
                topRight: {x: 0, y: 0},
                topLeft: {x: 0, y: 0},
            };
            this.text = result.text ? result.text : '';
            this.profile_info = result.profile_info ? result.profile_info : '';
        } else {
            this.error = '';
            this.format = '';
            this.position = {
                bottomRight: {x: 0, y: 0},
                bottomLeft: {x: 0, y: 0},
                topRight: {x: 0, y: 0},
                topLeft: {x: 0, y: 0},
            };
            this.text = '';
            this.profile_info = '';
        }
    }
}


export abstract class ZXing {
    protected static _reader : Reader | undefined;
    constructor() {
        this._getReader();
    }

    private async _getReader() {
        if (!ZXing._reader) {
            try {
                ZXing._reader = await ZXing_cpp();
            } catch(e) {
                this.onError(e as Error);
            }
        }
    }

    protected _getFileData(file : File) : Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            const file_reader = new FileReader();

            file_reader.onloadend = async (e) => {
                if (e.target && e.target.result && typeof e.target.result !== 'string') {
                    const file_data = new Uint8Array(e.target.result);

                    resolve(file_data)

                    
                } else {
                    reject('File failed to load.');
                }
            }
            file_reader.readAsArrayBuffer(file);
        });
    }

    abstract onError(e: Error): void;
    abstract readBarCode(file: File): Promise<IResult>;
    abstract readBarCode(data: Uint8Array, width: number, height: number): Promise<IResult>;
    abstract readBarCode(data: File | Uint8Array, width?: number, height?: number): Promise<IResult>;
}