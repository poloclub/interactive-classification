"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var dl = require("deeplearn");
var model_util = require("./util");
var imagenet_classes_1 = require("./imagenet_classes");
var GOOGLE_CLOUD_STORAGE_DIR = 'https://storage.googleapis.com/learnjs-data/checkpoint_zoo/';
var MobileNet = (function () {
    function MobileNet() {
        this.PREPROCESS_DIVISOR = dl.scalar(255.0 / 2);
        this.ONE = dl.scalar(1);
    }
    MobileNet.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var checkpointLoader, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        checkpointLoader = new dl.CheckpointLoader(GOOGLE_CLOUD_STORAGE_DIR + 'mobilenet_v1_1.0_224/');
                        _a = this;
                        return [4, checkpointLoader.getAllVariables()];
                    case 1:
                        _a.variables = _b.sent();
                        return [2];
                }
            });
        });
    };

    MobileNet.prototype.predictWithActivation = function (input, activationName) {
        var _this = this;
        return dl.tidy(function () {
            var activation; 
            var preprocessedInput = input.div(_this.PREPROCESS_DIVISOR).sub(_this.ONE);
            var x1 = _this.convBlock(preprocessedInput, 2);
            var x2 = _this.depthwiseConvBlock(x1, 1, 1);
            var x3 = _this.depthwiseConvBlock(x2, 2, 2);
            var x4 = _this.depthwiseConvBlock(x3, 1, 3);
            var x5 = _this.depthwiseConvBlock(x4, 2, 4);
            var x6 = _this.depthwiseConvBlock(x5, 1, 5);
            var x7 = _this.depthwiseConvBlock(x6, 2, 6);
            var x8 = _this.depthwiseConvBlock(x7, 1, 7);
            var x9 = _this.depthwiseConvBlock(x8, 1, 8);
            var x10 = _this.depthwiseConvBlock(x9, 1, 9);
            var x11 = _this.depthwiseConvBlock(x10, 1, 10);
            var x12 = _this.depthwiseConvBlock(x11, 1, 11);
            var x13 = _this.depthwiseConvBlock(x12, 2, 12);
            var x14 = _this.depthwiseConvBlock(x13, 1, 13);
            activation = x14;
            var x15 = x14.avgPool(7, 2, 'valid');
            // activation = x15;
            var x16Filter = _this.variables['MobilenetV1/Logits/Conv2d_1c_1x1/weights'];
            var x16Bias = _this.variables['MobilenetV1/Logits/Conv2d_1c_1x1/biases'];
            var x16 = x15.conv2d(x16Filter, 1, 'same').add(x16Bias);
            // activation = x15;
            return {
                logits: x16.as1D(),
                activation: activation
            };
        });
    };

    MobileNet.prototype.predict = function (input) {
        var _this = this;
        return dl.tidy(function () {
            var preprocessedInput = input.div(_this.PREPROCESS_DIVISOR).sub(_this.ONE);
            var x1 = _this.convBlock(preprocessedInput, 2);
            var x2 = _this.depthwiseConvBlock(x1, 1, 1);
            var x3 = _this.depthwiseConvBlock(x2, 2, 2);
            var x4 = _this.depthwiseConvBlock(x3, 1, 3);
            var x5 = _this.depthwiseConvBlock(x4, 2, 4);
            var x6 = _this.depthwiseConvBlock(x5, 1, 5);
            var x7 = _this.depthwiseConvBlock(x6, 2, 6);
            var x8 = _this.depthwiseConvBlock(x7, 1, 7);
            var x9 = _this.depthwiseConvBlock(x8, 1, 8);
            var x10 = _this.depthwiseConvBlock(x9, 1, 9);
            var x11 = _this.depthwiseConvBlock(x10, 1, 10);
            var x12 = _this.depthwiseConvBlock(x11, 1, 11);
            var x13 = _this.depthwiseConvBlock(x12, 2, 12);
            var x14 = _this.depthwiseConvBlock(x13, 1, 13);
            var x15 = x14.avgPool(7, 2, 'valid');
            var x16Filter = _this.variables['MobilenetV1/Logits/Conv2d_1c_1x1/weights'];
            var x16Bias = _this.variables['MobilenetV1/Logits/Conv2d_1c_1x1/biases'];
            var x16 = x15.conv2d(x16Filter, 1, 'same').add(x16Bias);
            return x16.as1D();
        });
    };
    MobileNet.prototype.convBlock = function (inputs, stride) {
        var convPadding = 'MobilenetV1/Conv2d_0';
        var x1 = inputs.conv2d(this.variables[convPadding + '/weights'], stride, 'same');
        var x2 = x1.batchNormalization(this.variables[convPadding + '/BatchNorm/moving_mean'], this.variables[convPadding + '/BatchNorm/moving_variance'], .001, this.variables[convPadding + '/BatchNorm/gamma'], this.variables[convPadding + '/BatchNorm/beta']);
        var res = x2.clipByValue(0, 6);
        return res;
    };
    MobileNet.prototype.depthwiseConvBlock = function (inputs, stride, blockID) {
        var dwPadding = 'MobilenetV1/Conv2d_' + String(blockID) + '_depthwise';
        var pwPadding = 'MobilenetV1/Conv2d_' + String(blockID) + '_pointwise';
        var x1 = inputs.depthwiseConv2D(this.variables[dwPadding + '/depthwise_weights'], stride, 'same');
        var x2 = x1.batchNormalization(this.variables[dwPadding + '/BatchNorm/moving_mean'], this.variables[dwPadding + '/BatchNorm/moving_variance'], .001, this.variables[dwPadding + '/BatchNorm/gamma'], this.variables[dwPadding + '/BatchNorm/beta']);
        var x3 = x2.clipByValue(0, 6);
        var x4 = x3.conv2d(this.variables[pwPadding + '/weights'], [1, 1], 'same');
        var x5 = x4.batchNormalization(this.variables[pwPadding + '/BatchNorm/moving_mean'], this.variables[pwPadding + '/BatchNorm/moving_variance'], .001, this.variables[pwPadding + '/BatchNorm/gamma'], this.variables[pwPadding + '/BatchNorm/beta']);
        return x5.clipByValue(0, 6);
    };
    MobileNet.prototype.getTopKClasses = function (logits, topK) {
        return __awaiter(this, void 0, void 0, function () {
            var predictions, topk, _a, _b, topkIndices, topkValues, topClassesToProbability, i;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log(_c.label);
                        predictions = logits.softmax().asType('float32');
                        _b = (_a = model_util).topK;
                        return [4, predictions.data()];
                    case 1:
                        console.log(_c.label);
                        console.log(_b);
                        topk = _b.apply(_a, [_c.sent(), topK]);
                        topkIndices = topk.indices;
                        topkValues = topk.values;
                        topClassesToProbability = {};
                        for (i = 0; i < topkIndices.length; i++) {
                            topClassesToProbability[imagenet_classes_1.IMAGENET_CLASSES[topkIndices[i]]] = topkValues[i];
                        }
                        return [2, topClassesToProbability];
                }
            });
        });
    };
    // For CAM functionality
    MobileNet.prototype.getLastWeights = function () {
        return dl.squeeze(this.variables['MobilenetV1/Conv2d_13_pointwise/weights']);
    };
    MobileNet.prototype.CAM = function (softmaxWeights, lastActivation, classX) {
        var softMaxW = dl.transpose(softmaxWeights).gather(dl.tensor1d([classX]));
        var lastAct = dl.transpose(lastActivation.reshape([64, 1024]));
        var cam = dl.matMul(softMaxW, lastAct);
        cam = cam.reshape([8, 8]);
        cam = cam.sub(dl.min(cam));
        cam = cam.div(dl.max(cam));
        cam = dl.squeeze(dl.image.resizeBilinear(cam.expandDims(2), [227, 227]));
        return cam;
    };

    MobileNet.prototype.dispose = function () {
        for (var varName in this.variables) {
            this.variables[varName].dispose();
        }
    };
    return MobileNet;
}());
exports.MobileNet = MobileNet;
