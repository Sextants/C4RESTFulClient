"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const C4RESTFulClient_1 = __importDefault(require("./C4RESTFulClient"));
exports.C4RESTFulClient = C4RESTFulClient_1.default;
const C4DefaultTextParser_1 = __importDefault(require("./C4DefaultRESTFulParser/C4DefaultTextParser"));
exports.C4DefaultTextParser = C4DefaultTextParser_1.default;
const C4DefaultJSONParser_1 = __importDefault(require("./C4DefaultRESTFulParser/C4DefaultJSONParser"));
exports.C4DefaultJSONParser = C4DefaultJSONParser_1.default;
const C4DefaultXMLParser_1 = __importDefault(require("./C4DefaultRESTFulParser/C4DefaultXMLParser"));
exports.C4DefaultXMLParser = C4DefaultXMLParser_1.default;
const C4DefaultFileStreamParser_1 = __importDefault(require("./C4DefaultRESTFulParser/C4DefaultFileStreamParser"));
exports.C4DefaultFileStreamParser = C4DefaultFileStreamParser_1.default;
const C4CSVFileStreamParser_1 = __importDefault(require("./C4DefaultRESTFulParser/C4CSVFileStreamParser"));
exports.C4CSVFileStreamParser = C4CSVFileStreamParser_1.default;
//# sourceMappingURL=index.js.map