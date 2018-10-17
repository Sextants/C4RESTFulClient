import Request = require("request");
import Content_Type = require('content-type');
import Content_Disposition = require('content-disposition');
import C4RESTFulParser from "./C4RESTFulParser";
import {ClientOption, RequestOption } from './C4RESTFulTypes';
import { TypeUtils, PathUtils, FSP } from 'c4utils';
import FS = require('fs');
import C4DefaultTextParser from "./C4DefaultRESTFulParser/C4DefaultTextParser";
import C4DefaultJSONParser from "./C4DefaultRESTFulParser/C4DefaultJSONParser";
import C4DefaultXMLParser from "./C4DefaultRESTFulParser/C4DefaultXMLParser";
import C4DefaultFileStreamParser from "./C4DefaultRESTFulParser/C4DefaultFileStreamParser";

var CloneDeep = require('clone-deep');

export default class C4RESTFulClient {

    private m_DefaultOption     : Request.Options;
    private m_Logger            : any;
    private m_Jar               : Request.CookieJar | null;
    private m_ContentTypeParsers: { [key : string] : C4RESTFulParser };
    private m_ContentDispositionParsers : { [key : string] : C4RESTFulParser };
    private m_DownloadPath      : string;

    constructor(logger ?: any) {
        this.m_DefaultOption = {
            url : ""
        };
        this.m_Logger               = logger;
        this.m_Jar                  = null;
        this.m_ContentTypeParsers   = {};
        this.m_ContentDispositionParsers = {};
        this.m_DownloadPath         = "";
    }

    /**
     * 初始化
     * @param option ClientOption
     */
    async init(option ?: ClientOption) {
        if (option) {
            if (option.baseURL) {
                this.m_DefaultOption.baseUrl    = option.baseURL;
            }

            if (option.sslOption) {
                this.m_DefaultOption.cert   = option.sslOption.cert;
                this.m_DefaultOption.key    = option.sslOption.key;
                if (option.sslOption.passphrase) {
                    this.m_DefaultOption.passphrase = option.sslOption.passphrase;
                }
                if (option.sslOption.ca) {
                    this.m_DefaultOption.ca = option.sslOption.ca
                }
            }

            if (TypeUtils.isNumber(option.timeout)) {
                this.m_DefaultOption.timeout    = option.timeout;
            }

            if (TypeUtils.isBoolean(option.gzip)) {
                this.m_DefaultOption.gzip   = option.gzip;
            }

            if (option.cookiesOption) {
                if (option.cookiesOption.enabled) {
                    if (option.cookiesOption.store) {
                        this.m_Jar  = Request.jar(option.cookiesOption.store);
                    } else {
                        this.m_Jar  = Request.jar();
                    }
                }
            }

            this.m_DefaultOption.rejectUnauthorized = option.rejectUnauthorized === undefined ? false : option.rejectUnauthorized;

            if (option.downloadPath) {
                this.m_DownloadPath = await PathUtils.GetAbsolutePath(option.downloadPath);
            }
            if (this.m_DownloadPath === "")
                this.m_DownloadPath = await PathUtils.GetAbsolutePath("./download");

            let IsInside = PathUtils.PathInside(process.cwd(), this.m_DownloadPath);
            if (IsInside === false) {
                throw new Error(`C4RESTFulClient set download path ${this.m_DownloadPath}, not in process run path.`);
            }

            await FSP.Access(this.m_DownloadPath, FS.constants.F_OK | FS.constants.W_OK).catch((err) => {
                if (this.m_Logger) {
                    this.m_Logger.err ? this.m_Logger.err(err) : this.m_Logger.error(err);
                    throw err;
                }
            });
        }

        // 添加默认的Content-type的处理方法
        let Self = this;
        this.addParser(new C4DefaultTextParser(this.m_Logger));     // 默认的text/html, text/xml解析器
        this.addParser(new C4DefaultJSONParser(this.m_Logger));     // 默认的application/json解析器
        this.addParser(new C4DefaultXMLParser(this.m_Logger));      // 默认的application/xml解析器
        this.addParser(new C4DefaultFileStreamParser(this.m_Logger, this.m_DownloadPath));  // 默认的content-disposition解析器
    }

    /**
     * 增加Parser
     * @param parser C4RESTFulParser
     */
    addParser(parser : C4RESTFulParser) {
        if (parser.contentTypes) {
            for (let i = 0; i < parser.contentTypes.length; i++) {
                this.m_ContentTypeParsers[parser.contentTypes[i]] = parser;
            }
        }
        if (parser.contentDispositionTypes) {
            for (let i = 0; i < parser.contentDispositionTypes.length; i++) {
                this.m_ContentDispositionParsers[parser.contentDispositionTypes[i]] = parser;
            }
        }
    }

    /**
     * 移除Parser
     * @param name 要移除的Parser的名字
     */
    removeParser(name : string) {
        let keys = Object.keys(this.m_ContentTypeParsers);
        for (let i = 0; i < keys.length; i++) {
            if (this.m_ContentTypeParsers[keys[i]].name === name) {
                delete this.m_ContentTypeParsers[keys[i]]
            }
        }

        keys = Object.keys(this.m_ContentDispositionParsers);
        for (let i = 0; i < keys.length; i++) {
            if (this.m_ContentDispositionParsers[keys[i]].name === name) {
                delete this.m_ContentDispositionParsers[keys[i]]
            }
        }
    }

    /**
     * 请求
     * @param url 请求的URL
     * @param method 请求的METHOD
     * @param option RequestOption
     */
    request(url : string, method : string, option : RequestOption) : Promise<Request.Response> {
        // NOTE: 不传递Callback，数据由外部处理

        // 先将multipart、formData、form从option中移除
        // 因为包含stream的部分CloneDeep会出问题
        // 后面为了保证输入参数包含的内容不变，在配置完毕后会设置回来
        let CurMultipart    = option.multipart;
        let CurFormData     = option.formData;
        let CurForm         = option.form;
        if (CurForm)        option.form     = undefined;            // 不要使用delete，可能有性能问题
        if (CurFormData)    option.formData = undefined;            // 不要使用delete，可能有性能问题
        if (CurMultipart)   option.multipart= undefined;            // 不要使用delete，可能有性能问题

        // 复制一下
        let RequestOption : Request.CoreOptions = CloneDeep(option);

        // 优先级Multipart > FormData > Form
        RequestOption.method = method;
        if (CurMultipart) {
            RequestOption.multipart = CurMultipart;
        } else if (CurFormData) {
            RequestOption.formData = CurFormData;
        } else if (CurForm) {
            RequestOption.form = CurForm;
        }
        // 恢复输入参数
        if (CurMultipart)   option.multipart= CurMultipart;
        if (CurFormData)    option.formData = CurFormData;
        if (CurForm)        option.form     = CurForm;

        if (option.cookiesOption) {
            if (option.cookiesOption.enabled) {
                if (option.cookiesOption.store) {
                    RequestOption.jar = Request.jar(option.cookiesOption.store);
                } else {
                    if (this.m_Jar) {
                        RequestOption.jar = this.m_Jar
                    } else {
                        RequestOption.jar = Request.jar();
                    }
                }
            }
            // 实际的配置中是不会出现cookiesOption的
            delete (<any>RequestOption).cookiesOption
        } else {
            // 使用默认的Cookie配置
            if (this.m_Jar)
                RequestOption.jar = this.m_Jar;
        }

        let downloadFileName = "";
        if (option.downloadFileName) {
            downloadFileName = option.downloadFileName;
            delete (<any>RequestOption).downloadFileName;
        }

        let Req = Request(url, RequestOption);

        let Self            = this;
        let MIMEType        = "";
        let Charset         = "";
        let Parser : C4RESTFulParser | null   = null;
        let ContentType : Content_Type.ParsedMediaType = <Content_Type.ParsedMediaType>{};
        let ContentDisposition : Content_Disposition.ContentDisposition = <Content_Disposition.ContentDisposition>{};
        let Rep : Request.Response;
        let Data : Buffer = new Buffer(0);
        let StrData : string = "";
        return new Promise((resolve, reject) => {
            Req.on('response', (rep : Request.Response) => {
                // 接收到response，还没有开始传输数据
                Rep = rep;
                if (rep.headers) {
                    if ((<any>rep.headers)['content-type']) {
                        try {
                            ContentType = Content_Type.parse((<any>rep.headers)['content-type']);
                            // MIMEType
                            if (ContentType.type) {
                                MIMEType  = ContentType.type;
                                let CurParser = Self.m_ContentTypeParsers[MIMEType];
                                if (CurParser) {
                                    Parser   = CurParser;
                                    if (Parser.isStream) {
                                        if (Parser.beforeStream) {
                                            Parser.beforeStream(rep, ContentType, downloadFileName);
                                        }
                                    }
                                }
                            }

                            // Charset
                            if (ContentType.parameters && ContentType.parameters.charset) {
                                Charset = ContentType.parameters.charset;
                            }
                        } catch (error) {
                            if (Self.m_Logger) {
                                Self.m_Logger.err ? Self.m_Logger.err(error) : Self.m_Logger.error(error);
                            }
                            rep.destroy(error);
                            return;
                        }
                    }
                    if ((<any>rep.headers)['content-disposition']) {
                        try {
                            ContentDisposition  = Content_Disposition.parse((<any>rep.headers)['content-disposition']);
                            let CurParser = Self.m_ContentDispositionParsers[ContentDisposition.type];
                            if (CurParser) {
                                Parser  = CurParser;
                                if (Parser.isStream) {
                                    if (Parser.beforeStream)
                                        Parser.beforeStream(rep, ContentDisposition, downloadFileName);
                                }
                            }
                        } catch (error) {
                            if (Self.m_Logger) {
                                Self.m_Logger.err ? Self.m_Logger.err(error) : Self.m_Logger.error(error);
                            }
                            rep.destroy(error);
                            return;
                        }
                    }
                }
            });
            Req.on('data', (data : Buffer) => {
                // 如果是压缩过，这里的数据已经解压缩了
                // 但是没有进行编码转换
                if (Parser && Parser.isStream) {
                    try {
                        // 需要进行流式解析的解析器需要在接收到data后进行处理
                        Parser.parse(Rep, data, ContentDisposition, (result : any) => {
                            if (null !== result) {
                                if (Buffer.isBuffer(result)) {
                                    Data = Buffer.concat([Data, result], Data.length + result.length)
                                } else if (TypeUtils.isString(result)) {
                                    StrData += result;
                                }
                            }
                        });
                    } catch (error) {
                        if (Self.m_Logger) {
                            Self.m_Logger.err ? Self.m_Logger.err(error) : Self.m_Logger.error(error);
                        }
                        if (Rep)
                            Rep.destroy(error);
                    }
                    
                } else {
                    if (data) {
                        Data = Buffer.concat([Data, data], Data.length + data.length);
                    }
                }

                // 可以做数据流式输出，并限速
            });
            Req.on('end', (data : Buffer) => {
                //
                if (Parser) {
                    let CurData = data;
                    if (!Parser.isStream) {
                        if (data) {
                            Data = Buffer.concat([Data, data], Data.length + data.length);
                        }
                        CurData = Data;
                    }
                    try {
                        let CurContentInfo = ContentDisposition;
                        if (TypeUtils.isEmptyObj(ContentDisposition)) {
                            CurContentInfo = ContentType;
                        }
                        // 非流式处理在end时进行全部数据的处理，流式处理在这里处理最后剩余的数据
                        Parser.parse(Rep, CurData, CurContentInfo, (result : any) => {
                            if (null !== result) {
                                if (Buffer.isBuffer(result)) {
                                    Data = Buffer.concat([Data, result], Data.length + result.length);
                                    if (Rep) Rep.body = Data;
                                } else if (TypeUtils.isString(result)) {
                                    StrData += result;
                                    if (Rep) Rep.body = StrData;
                                } else {
                                    if (Rep) Rep.body = result;
                                }
                            }
                        });
                    } catch (error) {
                        if (Self.m_Logger) {
                            Self.m_Logger.err ? Self.m_Logger.err(error) : Self.m_Logger.error(error);
                        }
                        if (Rep)
                            Rep.destroy(error);
                    }

                    // 流式处理的扫尾工作
                    if (Parser.isStream) {
                        if (Parser.afterStream) {
                            try {
                                Parser.afterStream(Rep, ContentDisposition);
                            } catch (error) {
                                if (Self.m_Logger) {
                                    Self.m_Logger.err ? Self.m_Logger.err(error) : Self.m_Logger.error(error);
                                }
                                if (Rep)
                                    Rep.destroy(error);
                            }
                        }
                    }
                } else {
                    // 没有对应的解析器，直接输出Buffer
                    if (data)
                        Data = Buffer.concat([Data, data], Data.length + data.length);
                    if (Rep) Rep.body = Data;
                }
            });
            Req.on('error', (err : Error) => {
                //
                reject(err);
            })
            Req.on('complete', (rep : Request.Response, body ?: string | Buffer) => {
                // 完整的body，如果encoding设置为null，这里的body为Buffer，否则是string
                resolve(rep);
            })
    
            return Req;
        });
    }

    /**
     * GET Method
     * @param url 请求的URL 
     * @param option RequestOption
     */
    get(url : string, option : RequestOption) {
        return this.request(url, "get", option);
    }

    /**
     * post Method
     * @param url 请求的URL 
     * @param option RequestOption
     */
    post(url : string, option : RequestOption) {
        //
        return this.request(url, "post", option);
    }

    /**
     * put Method
     * @param url 请求的URL 
     * @param option RequestOption
     */
    put(url : string, option : RequestOption) {
        //
        return this.request(url, "put", option);
    }

    /**
     * patch Method
     * @param url 请求的URL 
     * @param option RequestOption
     */
    patch(url : string, option : RequestOption) {
        //
        return this.request(url, "patch", option);
    }

    /**
     * delete Method
     * @param url 请求的URL 
     * @param option RequestOption
     */
    delete(url : string, option : RequestOption) {
        //
        return this.request(url, "delete", option);
    }
}
