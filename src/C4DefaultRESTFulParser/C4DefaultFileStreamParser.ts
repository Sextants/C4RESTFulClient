import C4RESTFulParser from '../C4RESTFulParser';
import Request = require('request');
import { ParsedMediaType } from 'content-type';
import { ContentDisposition } from 'content-disposition';
import { TypeUtils, PathUtils } from 'c4utils';
import uuidv1 = require('uuid/v1');
import Path = require('path');
import FS   = require('fs');

export default class C4DefaultFileStreamParser implements C4RESTFulParser {
    public name : string                            = "file";
    public isStream : boolean                       = true;
    public logger : any                             = null;
    public downloadPath ?: string                   = "";
    public contentDispositionTypes ?: string[]      = ["attachment", "inline"];

    constructor(logger : any, downloadPath : string) {
        this.logger         = logger;
        this.downloadPath   = downloadPath;
    }

    beforeStream(response : Request.Response, ContentType : ParsedMediaType | ContentDisposition, data ?: any) {
        // 打开文件
        let fileName = "";
        if (data && TypeUtils.isString(data) && !TypeUtils.isEmptyStr(data)) {
            // 文件名
            fileName = data;
        } else {
            if (ContentType.parameters && ContentType.parameters.filename) {
                fileName = ContentType.parameters.filename;
            } else {
                fileName = uuidv1() + ".raw";
            }
        }
        let FullPath = Path.join(this.downloadPath ? <string>this.downloadPath : process.cwd(), fileName);
        let IsInside = PathUtils.PathInside(this.downloadPath ? <string>this.downloadPath : process.cwd(), FullPath);
        if (!IsInside) {
            return;
        }

        let fsstream = FS.createWriteStream(FullPath, {
            flags : "w+",
            encoding : undefined,
            mode: 0o666,
            autoClose : true
        });

        (<any>response).filePath = FullPath;
        (<any>response).writeFileStream = fsstream;
        fsstream.on('drain', () => {
            response.resume();
        })
    }

    parse(response : Request.Response, byteBuffer : Buffer, ContentType : ParsedMediaType | ContentDisposition, parsedCallback : any) {
        //
        if ((<any>response).writeFileStream && byteBuffer) {
            //
            if ((<FS.WriteStream>(<any>response).writeFileStream).write(byteBuffer, (err : any) => {
                if (err) {
                    (<any>response).writeFileStream.end();
                }
                parsedCallback(null);
            }) === false) {
                response.pause();
            }
        }
    }

    afterStream(response : Request.Response, ContentType : ParsedMediaType | ContentDisposition, data ?: any) {
        // 关闭文件
        if ((<any>response).writeFileStream) {
            (<any>response).writeFileStream.end();
            delete (<any>response).writeFileStream;
        }
    }
}