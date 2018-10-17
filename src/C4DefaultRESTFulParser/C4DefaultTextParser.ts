import C4RESTFulParser from '../C4RESTFulParser';
import Request = require('request');
import { ParsedMediaType } from 'content-type';
import { ContentDisposition } from 'content-disposition';
import { TypeUtils } from 'c4utils';
import iconv = require('iconv-lite');

export default class C4DefaultTextParser implements C4RESTFulParser {
    public name : string                            = "text";
    public isStream : boolean                       = false;
    public logger : any                             = null;
    public contentTypes ?: string[]                 = [ "text/html", "text/xml" ];

    constructor(logger : any) {
        this.logger = logger;
    }

    parse(response : Request.Response, byteBuffer : Buffer, ContentType : ParsedMediaType | ContentDisposition, parsedCallback : any) {
        let Charset = "";
        let data : string = "";
        if (ContentType.parameters && ContentType.parameters.charset) {
            Charset = ContentType.parameters.charset;
        }
        if (!TypeUtils.isEmptyStr(Charset)) {
            // 转码
            data = iconv.decode(byteBuffer, Charset);
        } else {
            data = byteBuffer.toString('utf8');
        }

        parsedCallback(data);
    }
};
