importScripts("http://localhost:3000/zxing_reader.js");

const zxing = new ZXing();

onmessage = (async (e) => {
    const [data, width, height] = e.data;
    const zxing_proxy = await zxing;

    try {
        if (zxing_proxy) {
            const buffer = zxing_proxy._malloc(data.byteLength);
            zxing_proxy.HEAPU8.set(data, buffer);

            const result = zxing_proxy.readBarcodeFromPixmap(buffer, width, height, true, "QR_CODE");
            //zxing_proxy._free(buffer);

            //console.log(result)

            postMessage(result);
        } else {
            throw new Error("Reader isn't initialised.");
        }
    } catch (e) {
        throw e;
    }
    //const result = await zxing.readBarCodeData(data, width, height);
})