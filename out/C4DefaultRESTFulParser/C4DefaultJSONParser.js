"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c4utils_1 = require("c4utils");
const iconv = require("iconv-lite");
class C4DefaultJSONParser {
    constructor(logger) {
        this.name = "json";
        this.isStream = false;
        this.logger = null;
        this.contentTypes = ["application/json"];
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
        let obj = null;
        try {
            obj = JSON.parse(data);
        }
        catch (error) {
            if (this.logger) {
                this.logger.err ? this.logger.err(error) : this.logger.error(error);
            }
        }
        parsedCallback(obj);
    }
}
exports.default = C4DefaultJSONParser;
;
//# sourceMappingURL=C4DefaultJSONParser.js.map