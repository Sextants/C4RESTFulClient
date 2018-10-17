import Request = require("request");
import C4RESTFulParser from "./C4RESTFulParser";
import { ClientOption, RequestOption } from './C4RESTFulTypes';
export default class C4RESTFulClient {
    private m_DefaultOption;
    private m_Logger;
    private m_Jar;
    private m_ContentTypeParsers;
    private m_ContentDispositionParsers;
    private m_DownloadPath;
    constructor(logger?: any);
    /**
     * 初始化
     * @param option ClientOption
     */
    init(option?: ClientOption): Promise<void>;
    /**
     * 增加Parser
     * @param parser C4RESTFulParser
     */
    addParser(parser: C4RESTFulParser): void;
    /**
     * 移除Parser
     * @param name 要移除的Parser的名字
     */
    removeParser(name: string): void;
    /**
     * 请求
     * @param url 请求的URL
     * @param method 请求的METHOD
     * @param option RequestOption
     */
    request(url: string, method: string, option: RequestOption): Promise<Request.Response>;
    /**
     * GET Method
     * @param url 请求的URL
     * @param option RequestOption
     */
    get(url: string, option: RequestOption): Promise<Request.Response>;
    /**
     * post Method
     * @param url 请求的URL
     * @param option RequestOption
     */
    post(url: string, option: RequestOption): Promise<Request.Response>;
    /**
     * put Method
     * @param url 请求的URL
     * @param option RequestOption
     */
    put(url: string, option: RequestOption): Promise<Request.Response>;
    /**
     * patch Method
     * @param url 请求的URL
     * @param option RequestOption
     */
    patch(url: string, option: RequestOption): Promise<Request.Response>;
    /**
     * delete Method
     * @param url 请求的URL
     * @param option RequestOption
     */
    delete(url: string, option: RequestOption): Promise<Request.Response>;
}
