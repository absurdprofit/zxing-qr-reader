export interface Reader {
    HEAPU8: Uint8Array;
    _malloc(size_t: number): number;
    readBarcode(buffer: number, size_t: number, _ :boolean, format: string): Promise<IResult>;
    readBarcodeFromPixmap(buffer: number, width: number, height: number, _ :boolean, format: string): Promise<IResult>;
    _free(buffer: number): void;
}

export default function Zxing(): Promise<Reader>;