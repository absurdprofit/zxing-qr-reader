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

        //clear canvas to black
        this._output_render_context.fillStyle = "black";
        this._output_render_context.fillRect(0, 0, this._output_render_context.canvas.width, this._output_render_context.canvas.height);
    }

    private async _read() {
        const data : Uint8Array = new Uint8Array(this._output_render_context.getImageData(0, 0, this._output_render_context.canvas.width, this._output_render_context.canvas.height).data.buffer);


        if (data && this._callbacks.found) {
            const start : number = Date.now();
            const result : IResult = await this.readBarCode(data, this._output_render_context.canvas.width, this._output_render_context.canvas.height);     
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
        //scale to cover
        var originalRatios = {
            width: this._output_render_context.canvas.width / this._video.videoWidth,
            height: this._output_render_context.canvas.height / this._video.videoHeight
        };
        
        // formula for cover:
        var coverRatio = Math.max(originalRatios.width, originalRatios.height); 
        
        // result:
        var newImageWidth = this._video.videoWidth * coverRatio;
        var newImageHeight = this._video.videoHeight * coverRatio;

        // // get the top left position of the image
        var x = (this._output_render_context.canvas.width / 2) - (this._video.videoWidth / 2) * coverRatio;
        var y = (this._output_render_context.canvas.height / 2) - (this._video.videoHeight / 2) * coverRatio;


        this._output_render_context.drawImage(this._video, x, y, newImageWidth, newImageHeight);
        

        if (this._is_scanning) {
            this._anim_id = window.requestAnimationFrame(this._render.bind(this));
        } else {
            window.cancelAnimationFrame(this._anim_id);
        }
        
    }

    public print(text : string, x : number, y : number, lineHeight : number) {
        const maxWidth : number = this._output_render_context.canvas.getBoundingClientRect().width;
        let words : string[] = text.split(' ');
        let line : string = '';

        //write error message to canvas
        this._output_render_context.font = "20px Arial";
        this._output_render_context.fillStyle = "white";
        this._output_render_context.textAlign = "center";

        for(let n = 0; n < words.length; n++) {
          let testLine : string = line + words[n] + ' ';
          let metrics : TextMetrics = this._output_render_context.measureText(testLine);
          let testWidth : number = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            this._output_render_context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        this._output_render_context.fillText(line, x, y);
    }

    public scan() : Promise<void> {
        return new Promise(async (resolve, reject) => {
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

                        resolve();
    
                    } else {
                        const error : Error = new Error("Stream already initialised.");
                        if (this._callbacks.error) {
                            this._callbacks.error(error);
                        }

                        reject(error);
                    }
                } catch(e) {
                    if (this._callbacks.error) {
                        this._callbacks.error(e);
                    }

                    
                    this.print("Error. Permission denied. Please update browser permissions to access camera.", this._output_render_context.canvas.width / 2, this._output_render_context.canvas.height / 2, 25);

                    reject(e);
                }
            
            } else {
                const error : Error = new Error("Browser does not support getUserMedia.");
                if (this._callbacks.error) {
                    this._callbacks.error(error);
                }

                //write error message to canvas
                this.print("Error. Your browser does not support camera access. Use a modern browser or update your browser.", this._output_render_context.canvas.width / 2, this._output_render_context.canvas.height / 2, 25);

                reject(error);
            }
        })
    }

    public stop() : Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this._stream) {
                //stop scanning
                this._is_scanning = false;
                //stop camera
                this._video.pause();
                this._video.src = "";
                this._stream.getTracks().forEach(function(track) {
                    track.stop();
                });
    
                //clear canvas to black
                this._output_render_context.fillStyle = "black";
                this._output_render_context.fillRect(0, 0, this._output_render_context.canvas.width, this._output_render_context.canvas.height);
                resolve(true);
            } else {
                reject(new Error("Stream was not initialised."));
            }
        })
    }

    async readBarCode(file: File) : Promise<IResult>;
    async readBarCode(data : Uint8Array, width : number, height : number) : Promise<IResult>;
    async readBarCode(data: File | Uint8Array, width?: number, height?: number) {
        try {
            if (data instanceof File) {
                data = await this._getFileData(data);
            }
            if (this._reader) {
                const buffer = this._reader._malloc(data.length);
                this._reader.HEAPU8.set(data, buffer);

                
                if (data instanceof File) {
                    const result : IResult = await this._reader.readBarcode(buffer, data.length, true, "QR_CODE");
                    this._reader._free(buffer);
                    return result;
                } else if (data instanceof Uint8Array && width && height) {
                    const result : IResult = await this._reader.readBarcodeFromPixmap(buffer, width, height, true, "QR_CODE");
                    this._reader._free(buffer);
                    return result;
                }
                
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

            return new Result({error: (e as Error).message});
        }
    }

    // async readBarCodeFile(file : File) : Promise<IResult>{
    //     try {
    //         const file_data = await this._getFileData(file);
    //         if (this._reader) {
    //             const buffer = this._reader._malloc(file_data.length);
    //             this._reader.HEAPU8.set(file_data, buffer);

    //             const result : IResult = await this._reader.readBarcode(buffer, file_data.length, true, "QR_CODE");
    //             this._reader._free(buffer);

    //             return result
    //         } else {
    //             const error : Error = new Error("Reader isn't initialised.");
    //             if (this._callbacks.error) {
    //                 this._callbacks.error(error);
    //             }

    //             return new Result({error: error.message});
    //         }
    //     } catch (e) {
    //         if (this._callbacks.error) {
    //             this._callbacks.error(e)
    //         }

    //         return new Result({error: e.message});
    //     }
    // }

    // async readBarCodeData(data : Uint8Array, width : number, height : number) : Promise<IResult> {
    //     try {
    //         if (this._reader) {
    //             const buffer = this._reader._malloc(data.byteLength);
    //             this._reader.HEAPU8.set(data, buffer);

    //             const result : IResult = await this._reader.readBarcodeFromPixmap(buffer, width, height, true, "QR_CODE");
    //             this._reader._free(buffer);


    //             return result
    //         } else {
    //             const error : Error = new Error("Reader isn't initialised.");
    //             if (this._callbacks.error) {
    //                 this._callbacks.error(error);
    //             }

    //             return new Result({error: error.message});
    //         }
    //     } catch (e) {
    //         if (this._callbacks.error) {
    //             this._callbacks.error(e);
    //         }

    //         return new Result({error: e.message});
    //     }
    // }
}