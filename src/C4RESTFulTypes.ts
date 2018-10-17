
export interface Multipart {
    chunked?: boolean;
    data?: Array<{
        'content-type'?: string,
        body: string
    }>;
}

export interface RequestPart {
    headers?: Headers;
    body: any;
}

export interface Headers {
    [key: string]: any;
}

export interface ClientOption {
    baseURL ?: string,                      // 基地址
    sslOption ?: {                          // SSL的配置项
        cert : Buffer;                      // 证书
        key  : Buffer;                      // 私钥
        passphrase ?: string;               // 证书的密码
        ca ?: string | Buffer | string[] | Buffer[];    // CA
    },
    rejectUnauthorized ?: boolean;          // 是否对证书进行校验（双向验证时需要）
    preambleCRLF ?: boolean;                // 在multipart/form-data请求的边界之前追加/CRLF
    postambleCRLF ?: boolean;               // 在multipart/form-data请求的边界尾部追加/CRLF
    timeout ?: number;                      // 请求超时时间，单位毫秒
    gzip ?: boolean;                        // 是否使用gzip
    cookiesOption ?: {                      // cookie的配置项
        enabled : boolean;                  // 是否开启
        store ?: any;                       // 存储引擎
    };
    downloadPath ?: string;                 // 下载文件的保存目录
};

export interface RequestOption {
    qs ?: { [key : string] : any };             // 请求的查询字符串
    body ?: any;                                // PATCH、POST和PUT请求的实体，必须是Buffer、string或者ReadSteam，如果json项是true，body不许是可序列化的JSON对象
    json ?: boolean;                            // 设置请求实体是否为JSON，会自动在header中增加application/json的Content-Type
    form ?: { [key : string] : any} | string;   // 当传递一个对象或查询字符串时，将body设置为querystring表示的值，并在header中添加application/x-www-form-urlencoded的content-type
    formData ?: { [key : string] : any};        // 传递给multpart/form-data的请求数据
    multipart ?: RequestPart[] | Multipart;     // 用于发送multipart/related的请求数据
    headers ?: Headers;                         // http的headers
    gzip ?: boolean;                            // 是否使用gzip
    cookiesOption ?: {                          // cookie的配置项
        enabled : boolean;                      // 是否开启
        store ?: any;                           // 存储引擎
    };

    // https双向认证
    rejectUnauthorized ?: boolean;              // 是否对证书进行校验（双向验证时需要）
    key ?: Buffer;                              // 私钥
    cert ?: Buffer;                             // 证书
    passphrase ?: string;                       // 证书的密码
    ca?: string | Buffer | string[] | Buffer[]; // CA

    // downloadFileName
    downloadFileName ?: string;                 // 下载文件的保存文件名
}
