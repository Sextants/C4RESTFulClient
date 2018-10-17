/// <reference types="node" />
import C4RESTFulParser from '../C4RESTFulParser';
import Request = require('request');
import { ParsedMediaType } from 'content-type';
import { ContentDisposition } from 'content-disposition';
export default class C4CSVFileStreamParser implements C4RESTFulParser {
    name: string;
    isStream: boolean;
    logger: any;
    downloadPath?: string;
    contentTypes?: string[];
    constructor(logger: any, downloadPath: string);
    beforeStream(response: Request.Response, ContentType: ParsedMediaType | ContentDisposition, data?: any): void;
    parse(response: Request.Response, byteBuffer: Buffer, ContentType: ParsedMediaType | ContentDisposition, parsedCallback: any): void;
    afterStream(response: Request.Response, ContentType: ParsedMediaType | ContentDisposition, data?: any): void;
}
