import Reader from "./reader";

const reader = new Reader();
reader.errorHandler = (e: Error) => {
    self.postMessage({error: e.message});
}

export interface BufferTransfer {
    image_buffer: ArrayBuffer;
    height: number;
    width: number;
}

onmessage = async function(event: MessageEvent<BufferTransfer>) {
    try {
        const {image_buffer, width, height} = event.data;

        const data = new Uint8Array(image_buffer);
        const start = Date.now();
        const result = await reader.readBarCode(data, width, height);
        const end = Date.now();
        if (result.text.length) {
            this.postMessage({
                ...result,
                profile_info: {
                    fps: `${(1/((end-start)/1000)).toFixed(2)}`,
                    mspf: `${(end-start).toFixed(2)}`
                }
            });
        }
    } catch (e) {
        console.log(e);
        this.postMessage({error: (e as Error).message});
    }
}
