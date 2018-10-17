import { ParsedMediaType } from 'content-type';
import { ContentDisposition } from 'content-disposition';
import Request = require('request');

export default interface C4RESTFulParser {
    name : string;
    isStream : boolean;
    logger : any;
    contentTypes ?: string[];
    contentDispositionTypes ?: string[];
    beforeStream ?: (response : Request.Response, ContentType : ParsedMediaType | ContentDisposition, data ?: any) => void;
    afterStream ?: (response : Request.Response, ContentType : ParsedMediaType | ContentDisposition, data ?: any) => void;
    parse : (response : Request.Response, byteBuffer : Buffer, ContentType : ParsedMediaType | ContentDisposition, parsedCallback : any) => void
}
