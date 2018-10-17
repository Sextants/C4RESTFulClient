/// <reference types="node" />
export interface Multipart {
    chunked?: boolean;
    data?: Array<{
        'content-type'?: string;
        body: string;
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
    baseURL?: string;
    sslOption?: {
        cert: Buffer;
        key: Buffer;
        passphrase?: string;
        ca?: string | Buffer | string[] | Buffer[];
    };
    rejectUnauthorized?: boolean;
    preambleCRLF?: boolean;
    postambleCRLF?: boolean;
    timeout?: number;
    gzip?: boolean;
    cookiesOption?: {
        enabled: boolean;
        store?: any;
    };
    downloadPath?: string;
}
export interface RequestOption {
    qs?: {
        [key: string]: any;
    };
    body?: any;
    json?: boolean;
    form?: {
        [key: string]: any;
    } | string;
    formData?: {
        [key: string]: any;
    };
    multipart?: RequestPart[] | Multipart;
    headers?: Headers;
    gzip?: boolean;
    cookiesOption?: {
        enabled: boolean;
        store?: any;
    };
    rejectUnauthorized?: boolean;
    key?: Buffer;
    cert?: Buffer;
    passphrase?: string;
    ca?: string | Buffer | string[] | Buffer[];
    downloadFileName?: string;
}
