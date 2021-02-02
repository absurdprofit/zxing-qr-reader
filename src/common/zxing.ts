type Dimension = {
    x: number;
    y: number;
}
interface IPosition {
    bottomLeft: Dimension;
    bottomRight: Dimension;
    topLeft: Dimension;
    topRight: Dimension;
}
interface ICallbacks {
    found?: Function;
    error?: Function;
}
enum Eevents {
    found,
    error
}
type events = keyof typeof Eevents;
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
    protected _reader : any;
    protected _callbacks : ICallbacks = {};
    constructor() {
        this._getReader();
    }

    public on(event : events, callback : Function) : void {
        switch(event) {
            case "found":
                this._callbacks.found = callback;
                break;
            
            case "error":
                this._callbacks.error = callback;
                break;
        }
    }

    private async _getReader() {
        const reader_proxy : any = await this._reader;
        if (!reader_proxy) {
            try {
                this._reader = await (window as any).ZXing();
            } catch(e) {
                if (this._callbacks.error) {
                    this._callbacks.error(new Error("Reader could not be initialised"));
                }
            }
        }
    }

    protected _getFileData(file : File) : Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            const file_reader = new FileReader();

            file_reader.onloadend = async (e) => {
                if (e.target && e.target.result && typeof e.target.result != 'string') {
                    const file_data = new Uint8Array(e.target.result);

                    resolve(file_data)

                    
                } else {
                    reject('File failed to load.');
                }
            }
            file_reader.readAsArrayBuffer(file);
        });
    }

    abstract readBarCodeFile(file : File) : Promise<IResult>;

    abstract readBarCodeData(data : Uint8Array, width : number, height : number) : Promise<IResult>;
}