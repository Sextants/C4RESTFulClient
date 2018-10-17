"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c4utils_1 = require("c4utils");
const iconv = require("iconv-lite");
class C4DefaultTextParser {
    constructor(logger) {
        this.name = "text";
        this.isStream = false;
        this.logger = null;
        this.contentTypes = ["text/html", "text/xml"];
        this.logger = logger;
    }
    parse(response, byteBuffer, ContentType, parsedCallback) {
        let Charset = "";
        let data = "";
        if (ContentType.parameters && ContentType.parameters.charset) {
            Charset = ContentType.parameters.charset;
        }
        if (!c4utils_1.TypeUtils.isEmptyStr(Charset)) {
            // 转码
            data = iconv.decode(byteBuffer, Charset);
        }
        else {
            data = byteBuffer.toString('utf8');
        }
        parsedCallback(data);
    }
}
exports.default = C4DefaultTextParser;
;
//# sourceMappingURL=C4DefaultTextParser.js.map