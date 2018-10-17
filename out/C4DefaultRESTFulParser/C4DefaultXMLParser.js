"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c4utils_1 = require("c4utils");
const iconv = require("iconv-lite");
const xml2js_1 = require("xml2js");
class C4DefaultXMLParser {
    constructor(logger) {
        this.name = "xml";
        this.isStream = false;
        this.logger = null;
        this.contentTypes = ["application/xml"];
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
        xml2js_1.parseString(data, {
            explicitArray: false
        }, (err, result) => {
            if (err) {
                if (this.logger) {
                    this.logger.err ? this.logger.err(err) : this.logger.error(err);
                }
                return parsedCallback(null);
            }
            parsedCallback(result);
        });
    }
}
exports.default = C4DefaultXMLParser;
;
//# sourceMappingURL=C4DefaultXMLParser.js.map