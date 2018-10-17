<h1>C4RESTFulClient 说明</h1>

<h2>简介</h2>

C4RESTFulClient是基于request的封装：

* 支持Http、Http协议；
* 支持Cookie；
* response的stream处理；
* 支持对Content-Type和Content-Disposition进行Parser的定义，并在接收response时自动选定；
* 支持GET、POST、PUT、PATCH、DELETE这些METHOD。

<h2>配置</h2>

配置分为ClientOption和RequestOption：

<h3>ClientOption</h3>

<code>

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

</code>

<h3>RequestOption</h3>

<code>

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

</code>

<h2>类s</h2>

* C4RESTFulClient

  * 说明：RESTFul客户端
  * 路径：./src/C4RESTFulClient.ts
  * 成员变量：

    * m_DefaultOption，Client的配置，作为请求的默认配置；
    * m_Logger，日志对象；
    * m_Jar，Cookie；
    * m_ContentTypeParsers，处理特定ContentType的Parser的存储字典，key为Content-Type，value为Parser；
    * m_ContentDispositionParsers，处理特定ContentDisposition的Parser的存储字典，key为ContentDisposition，value为Parser；
    * m_DownloadPath，下载文件保存的目录的路径。

  * 成员方法：

    * init
    
    <code>
    
        /**
        * 初始化
        * @param option ClientOption
        */
        async init(option ?: ClientOption)
    
    </code>

    <hr>

    * addParser
    
    <code>
    
        /**
        * 增加Parser
        * @param parser C4RESTFulParser
        */
        addParser(parser : C4RESTFulParser)
    
    </code>

    <hr>

    * removeParser
    
    <code>
    
        /**
        * 移除Parser
        * @param name 要移除的Parser的名字
        */
        removeParser(name : string) 
    
    </code>

    <hr>

    * request
    
    <code>
    
        /**
        * 请求
        * @param url 请求的URL
        * @param method 请求的METHOD
        * @param option RequestOption
        */
        request(url : string, method : string, option : RequestOption) : Promise<Request.Response>
    
    </code>

    <hr>

    * get
    
    <code>
    
        /**
        * GET Method
        * @param url 请求的URL 
        * @param option RequestOption
        */
        get(url : string, option : RequestOption)
    
    </code>

    <hr>

    * post
    
    <code>
    
        /**
        * post Method
        * @param url 请求的URL 
        * @param option RequestOption
        */
        post(url : string, option : RequestOption)
    
    </code>

    <hr>

    * put
    
    <code>
    
        /**
        * put Method
        * @param url 请求的URL 
        * @param option RequestOption
        */
        put(url : string, option : RequestOption)
    
    </code>

    <hr>

    * patch
    
    <code>
    
        /**
        * patch Method
        * @param url 请求的URL 
        * @param option RequestOption
        */
        patch(url : string, option : RequestOption)
    
    </code>

    <hr>

    * delete
    
    <code>
    
        /**
        * delete Method
        * @param url 请求的URL 
        * @param option RequestOption
        */
        delete(url : string, option : RequestOption)
    
    </code>

  <hr>

* C4RESTFulParser

  * 说明：Parser的接口类
  * 路径：./src/C4RESTFulParser.ts
  * 成员变量：
    
    * name，Parser的名字；
    * isStream，是否是流式解析器；
    * logger，日志类；
    * contentTypes，对应的Content-Type，可以是数组；
    * contentDispositionTypes，对应的Content-Disposition，可以是数组

  * 成员方法：

    * beforeStream，在请求开始调用，用来开始一些stream处理的准备工作；
    * afterStream，在请求结束时调用，用来处理一些stream的收尾工作；
    * parse，进行数据处理

  <hr>

* C4DefaultJSONParser

  * 说明：JSON解析器
  * 路径：./src/C4DefaultRESTFulParser/C4DefaultJSONParser.ts
  * 成员变量：
    
    * name，Parser的名字；
    * isStream，是否是流式解析器；
    * logger，日志类；
    * contentTypes，对应的Content-Type，可以是数组；

  * 成员方法：

    * parse，进行数据处理

  <hr>

* C4DefaultTextParser

  * 说明：Text解析器
  * 路径：./src/C4DefaultRESTFulParser/C4DefaultTextParser.ts
  * 成员变量：
    
    * name，Parser的名字；
    * isStream，是否是流式解析器；
    * logger，日志类；
    * contentTypes，对应的Content-Type，可以是数组；

  * 成员方法：

    * parse，进行数据处理

  <hr>

* C4DefaultXMLParser

  * 说明：XML解析器
  * 路径：./src/C4DefaultRESTFulParser/C4DefaultXMLParser.ts
  * 成员变量：
    
    * name，Parser的名字；
    * isStream，是否是流式解析器；
    * logger，日志类；
    * contentTypes，对应的Content-Type，可以是数组；

  * 成员方法：

    * parse，进行数据处理

  <hr>

* C4DefaultFileStreamParser

  * 说明：文件下载解析器
  * 路径：./src/C4DefaultRESTFulParser/C4DefaultFileStreamParser.ts
  * 成员变量：
    
    * name，Parser的名字；
    * isStream，是否是流式解析器；
    * logger，日志类；
    * downloadPath，下载文件的保存路径；
    * contentDispositionTypes，对应的Content-Disposition，可以是数组

  * 成员方法：

    * beforeStream，在请求开始调用，用来开始一些stream处理的准备工作；
    * afterStream，在请求结束时调用，用来处理一些stream的收尾工作；
    * parse，进行数据处理

  <hr>

* C4CSVFileStreamParser

  * 说明：CSV文件下载解析器
  * 路径：./src/C4DefaultRESTFulParser/C4CSVFileStreamParser.ts
  * 成员变量：
    
    * name，Parser的名字；
    * isStream，是否是流式解析器；
    * logger，日志类；
    * downloadPath，下载文件的保存路径；
    * contentTypes，对应的Content-Type，可以是数组；

  * 成员方法：

    * beforeStream，在请求开始调用，用来开始一些stream处理的准备工作；
    * afterStream，在请求结束时调用，用来处理一些stream的收尾工作；
    * parse，进行数据处理

  <hr>
