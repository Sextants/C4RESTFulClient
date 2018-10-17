/// <reference types="node" />
import C4RESTFulParser from '../C4RESTFulParser';
import Request = require('request');
import { ParsedMediaType } from 'content-type';
import { ContentDisposition } from 'content-disposition';
export default class C4DefaultTextParser implements C4RESTFulParser {
    name: string;
    isStream: boolean;
    logger: any;
    contentTypes?: string[];
    constructor(logger: any);
    parse(response: Request.Response, byteBuffer: Buffer, ContentType: ParsedMediaType | ContentDisposition, parsedCallback: any): void;
}
