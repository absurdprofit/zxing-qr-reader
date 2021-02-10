var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { ZXing, Result } from './zxing';
var QrReader = /** @class */ (function (_super) {
    __extends(QrReader, _super);
    function QrReader(context) {
        var _this = _super.call(this) || this;
        _this._stream = new MediaStream();
        _this._is_scanning = false;
        _this._anim_id = 0;
        _this._interval_id = 0;
        _this._output_render_context = context;
        _this._video = document.createElement('video');
        //clear canvas to black
        _this._output_render_context.fillStyle = "black";
        _this._output_render_context.fillRect(0, 0, _this._output_render_context.canvas.width, _this._output_render_context.canvas.height);
        return _this;
    }
    QrReader.prototype._read = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, start, result, end;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = new Uint8Array(this._output_render_context.getImageData(0, 0, this._output_render_context.canvas.width, this._output_render_context.canvas.height).data.buffer);
                        if (!(data && this._callbacks.found)) return [3 /*break*/, 2];
                        start = Date.now();
                        return [4 /*yield*/, this.readBarCodeData(data, this._output_render_context.canvas.width, this._output_render_context.canvas.height)];
                    case 1:
                        result = _a.sent();
                        end = Date.now();
                        if (result.text.length) {
                            this._callbacks.found(__assign(__assign({}, result), { profile_info: (end - start).toFixed(2) + "ms / " + (1 / ((end - start) / 1000)).toFixed(2) + "fps" }));
                        }
                        _a.label = 2;
                    case 2:
                        if (this._is_scanning) {
                            this._interval_id = window.setTimeout(this._read.bind(this), 80);
                        }
                        else {
                            clearTimeout(this._interval_id);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    QrReader.prototype._render = function () {
        return __awaiter(this, void 0, void 0, function () {
            var originalRatios, coverRatio, newImageWidth, newImageHeight, x, y;
            return __generator(this, function (_a) {
                originalRatios = {
                    width: this._output_render_context.canvas.width / this._video.videoWidth,
                    height: this._output_render_context.canvas.height / this._video.videoHeight
                };
                coverRatio = Math.max(originalRatios.width, originalRatios.height);
                newImageWidth = this._video.videoWidth * coverRatio;
                newImageHeight = this._video.videoHeight * coverRatio;
                x = (this._output_render_context.canvas.width / 2) - (this._video.videoWidth / 2) * coverRatio;
                y = (this._output_render_context.canvas.height / 2) - (this._video.videoHeight / 2) * coverRatio;
                this._output_render_context.drawImage(this._video, x, y, newImageWidth, newImageHeight);
                if (this._is_scanning) {
                    this._anim_id = window.requestAnimationFrame(this._render.bind(this));
                }
                else {
                    window.cancelAnimationFrame(this._anim_id);
                }
                return [2 /*return*/];
            });
        });
    };
    QrReader.prototype.print = function (text, x, y, lineHeight) {
        var maxWidth = this._output_render_context.canvas.getBoundingClientRect().width;
        var words = text.split(' ');
        var line = '';
        //write error message to canvas
        this._output_render_context.font = "20px Arial";
        this._output_render_context.fillStyle = "white";
        this._output_render_context.textAlign = "center";
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = this._output_render_context.measureText(testLine);
            var testWidth = metrics.width;
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
    };
    QrReader.prototype.scan = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _a, error, e_1, error;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) return [3 /*break*/, 7];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        if (!!this._is_scanning) return [3 /*break*/, 3];
                        _a = this;
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
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
                            })];
                    case 2:
                        _a._stream = _c.sent();
                        this._video.srcObject = this._stream;
                        (_b = this._video) === null || _b === void 0 ? void 0 : _b.play();
                        this._is_scanning = true;
                        this._render();
                        this._read();
                        resolve();
                        return [3 /*break*/, 4];
                    case 3:
                        error = new Error("Stream already initialised.");
                        if (this._callbacks.error) {
                            this._callbacks.error(error);
                        }
                        reject(error);
                        _c.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _c.sent();
                        if (this._callbacks.error) {
                            this._callbacks.error(e_1);
                        }
                        this.print("Error. Permission denied. Please update browser permissions to access camera.", this._output_render_context.canvas.width / 2, this._output_render_context.canvas.height / 2, 25);
                        reject(e_1);
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error = new Error("Browser does not support getUserMedia.");
                        if (this._callbacks.error) {
                            this._callbacks.error(error);
                        }
                        //write error message to canvas
                        this.print("Error. Your browser does not support camera access. Use a modern browser or update your browser.", this._output_render_context.canvas.width / 2, this._output_render_context.canvas.height / 2, 25);
                        reject(error);
                        _c.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    };
    QrReader.prototype.stop = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._stream) {
                //stop scanning
                _this._is_scanning = false;
                //stop camera
                _this._video.pause();
                _this._video.src = "";
                _this._stream.getTracks().forEach(function (track) {
                    track.stop();
                });
                //clear canvas to black
                _this._output_render_context.fillStyle = "black";
                _this._output_render_context.fillRect(0, 0, _this._output_render_context.canvas.width, _this._output_render_context.canvas.height);
                resolve(true);
            }
            else {
                reject(new Error("Stream was not initialised."));
            }
        });
    };
    QrReader.prototype.readBarCodeFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var file_data, buffer, result, error, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this._getFileData(file)];
                    case 1:
                        file_data = _a.sent();
                        if (!this._reader) return [3 /*break*/, 3];
                        buffer = this._reader._malloc(file_data.length);
                        this._reader.HEAPU8.set(file_data, buffer);
                        return [4 /*yield*/, this._reader.readBarcode(buffer, file_data.length, true, "QR_CODE")];
                    case 2:
                        result = _a.sent();
                        this._reader._free(buffer);
                        return [2 /*return*/, result];
                    case 3:
                        error = new Error("Reader isn't initialised.");
                        if (this._callbacks.error) {
                            this._callbacks.error(error);
                        }
                        return [2 /*return*/, new Result({ error: error.message })];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        if (this._callbacks.error) {
                            this._callbacks.error(e_2);
                        }
                        return [2 /*return*/, new Result({ error: e_2.message })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    QrReader.prototype.readBarCodeData = function (data, width, height) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer, result, error, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!this._reader) return [3 /*break*/, 2];
                        buffer = this._reader._malloc(data.byteLength);
                        this._reader.HEAPU8.set(data, buffer);
                        return [4 /*yield*/, this._reader.readBarcodeFromPixmap(buffer, width, height, true, "QR_CODE")];
                    case 1:
                        result = _a.sent();
                        this._reader._free(buffer);
                        return [2 /*return*/, result];
                    case 2:
                        error = new Error("Reader isn't initialised.");
                        if (this._callbacks.error) {
                            this._callbacks.error(error);
                        }
                        return [2 /*return*/, new Result({ error: error.message })];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        e_3 = _a.sent();
                        if (this._callbacks.error) {
                            this._callbacks.error(e_3);
                        }
                        return [2 /*return*/, new Result({ error: e_3.message })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return QrReader;
}(ZXing));
export { QrReader };
