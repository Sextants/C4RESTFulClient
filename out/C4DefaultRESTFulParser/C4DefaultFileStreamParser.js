"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c4utils_1 = require("c4utils");
const uuidv1 = require("uuid/v1");
const Path = require("path");
const FS = require("fs");
class C4DefaultFileStreamParser {
    constructor(logger, downloadPath) {
        this.name = "file";
        this.isStream = true;
        this.logger = null;
        this.downloadPath = "";
        this.contentDispositionTypes = ["attachment", "inline"];
        this.logger = logger;
        this.downloadPath = downloadPath;
    }
    beforeStream(response, ContentType, data) {
        // 打开文件
        let fileName = "";
        if (data && c4utils_1.TypeUtils.isString(data) && !c4utils_1.TypeUtils.isEmptyStr(data)) {
            // 文件名
            fileName = data;
        }
        else {
            if (ContentType.parameters && ContentType.parameters.filename) {
                fileName = ContentType.parameters.filename;
            }
            else {
                fileName = uuidv1() + ".raw";
            }
        }
        let FullPath = Path.join(this.downloadPath ? this.downloadPath : process.cwd(), fileName);
        let IsInside = c4utils_1.PathUtils.PathInside(this.downloadPath ? this.downloadPath : process.cwd(), FullPath);
        if (!IsInside) {
            return;
        }
        let fsstream = FS.createWriteStream(FullPath, {
            flags: "w+",
            encoding: undefined,
            mode: 0o666,
            autoClose: true
        });
        response.filePath = FullPath;
        response.writeFileStream = fsstream;
        fsstream.on('drain', () => {
            response.resume();
        });
    }
    parse(response, byteBuffer, ContentType, parsedCallback) {
        //
        if (response.writeFileStream && byteBuffer) {
            //
            if (response.writeFileStream.write(byteBuffer, (err) => {
                if (err) {
                    response.writeFileStream.end();
                }
                parsedCallback(null);
            }) === false) {
                response.pause();
            }
        }
    }
    afterStream(response, ContentType, data) {
        // 关闭文件
        if (response.writeFileStream) {
            response.writeFileStream.end();
            delete response.writeFileStream;
        }
    }
}
exports.default = C4DefaultFileStreamParser;
//# sourceMappingURL=C4DefaultFileStreamParser.js.map