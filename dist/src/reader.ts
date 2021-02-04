import {ZXing, IResult, Result} from './zxing';

export class QrReader extends ZXing {
    private _output_render_context : CanvasRenderingContext2D;
    private _video : HTMLVideoElement;
    private _stream : MediaStream = new MediaStream();
    private _is_scanning : boolean = false;
    private _anim_id : number = 0;
    private _interval_id : number = 0;
    
    constructor(context : CanvasRenderingContext2D) {
        super();
        this._output_render_context = context;
        this._video = document.createElement('video') as HTMLVideoElement;
    }

    private async _read() {
        const data : Uint8Array = new Uint8Array(this._output_render_context.getImageData(0, 0, this._output_render_context.canvas.width, this._output_render_context.canvas.height).data.buffer);


        if (data && this._callbacks.found) {
            const start : number = Date.now();
            const result : IResult = await this.readBarCodeData(data, this._output_render_context.canvas.width, this._output_render_context.canvas.height);     
            const end : number = Date.now();
            if (result.text.length) {
                this._callbacks.found({
                    ...result,
                    profile_info: `${(end-start).toFixed(2)}ms / ${(1/((end-start)/1000)).toFixed(2)}fps`
                });
            }
        }

        if (this._is_scanning) {
            this._interval_id = window.setTimeout(this._read.bind(this), 80);
        } else {
            clearTimeout(this._interval_id);
        }
    }

    private async _render() {
        this._output_render_context.drawImage(this._video, 0, 0);
        

        if (this._is_scanning) {
            this._anim_id = window.requestAnimationFrame(this._render.bind(this));
        } else {
            window.cancelAnimationFrame(this._anim_id);
        }
        
    }

    public async scan() : Promise<void> {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                if (!this._is_scanning) {
                    this._stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            width: {
                                ideal: this._output_render_context.canvas.width
                            }, 
                            height: {
                                ideal: this._output_render_context.canvas.height
                            },
                            facingMode: 'environment',
                            frameRate: {
                                ideal: 24
                            }
                        }
                    });
                  
                    this._video.srcObject = this._stream;
                    this._video?.play();
                    
                    this._is_scanning = true;
                    this._render();
                    this._read();

                } else {
                    if (this._callbacks.error) {
                        this._callbacks.error(new Error("Stream already initialised."));
                    }
                }
            } catch(e) {
                if (this._callbacks.error) {
                    this._callbacks.error(e);
                }
            }
        
        } else {
            if (this._callbacks.error) {
                this._callbacks.error(new Error("Browser does not support getUserMedia."));
            }
        }
    }

    public stop() : Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this._stream) {
                //add ended event listener to make method async
                this._video.addEventListener('ended', function (this : QrReader) {
                    //clear canvas to black
                    this._output_render_context.fillStyle = "black";
                    this._output_render_context.fillRect(0, 0, this._output_render_context.canvas.width, this._output_render_context.canvas.height);
                    
                    resolve(true);
                }.bind(this));
                //stop scanning
                this._is_scanning = false;
                //stop camera
                this._video.pause();
                this._video.src = "";
                this._stream.getTracks().forEach(function(track) {
                    track.stop();
                });
    
                
            } else {
                reject(false);
            }
        })
    }

    async readBarCodeFile(file : File) : Promise<IResult>{
        try {
            const file_data = await this._getFileData(file);
            if (this._reader) {
                const buffer = this._reader._malloc(file_data.length);
                this._reader.HEAPU8.set(file_data, buffer);

                const result : IResult = await this._reader.readBarcode(buffer, file_data.length, true, "QR_CODE");
                this._reader._free(buffer);

                return result
            } else {
                const error : Error = new Error("Reader isn't initialised.");
                if (this._callbacks.error) {
                    this._callbacks.error(error);
                }

                return new Result({error: error.message});
            }
        } catch (e) {
            if (this._callbacks.error) {
                this._callbacks.error(e)
            }

            return new Result({error: e.message});
        }
    }

    async readBarCodeData(data : Uint8Array, width : number, height : number) : Promise<IResult> {
        try {
            if (this._reader) {
                const buffer = this._reader._malloc(data.byteLength);
                this._reader.HEAPU8.set(data, buffer);

                const result : IResult = await this._reader.readBarcodeFromPixmap(buffer, width, height, true, "QR_CODE");
                this._reader._free(buffer);


                return result
            } else {
                const error : Error = new Error("Reader isn't initialised.");
                if (this._callbacks.error) {
                    this._callbacks.error(error);
                }

                return new Result({error: error.message});
            }
        } catch (e) {
            if (this._callbacks.error) {
                this._callbacks.error(e);
            }

            return new Result({error: e.message});
        }
    }
}