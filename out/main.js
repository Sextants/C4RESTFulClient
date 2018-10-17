"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const C4RESTFulClient_1 = __importDefault(require("./C4RESTFulClient"));
const FS = require("fs");
const Path = require("path");
const c4utils_1 = require("c4utils");
const C4CSVFileStreamParser_1 = __importDefault(require("./C4DefaultRESTFulParser/C4CSVFileStreamParser"));
function Output(methodName, rep) {
    if (rep && (rep.body || rep.filePath)) {
        if (Buffer.isBuffer(rep.body)) {
            console.log(`Request ${methodName}, response result : ${rep ? rep.body.toString('') : 'null'}`);
        }
        else if (c4utils_1.TypeUtils.isString(rep.body)) {
            console.log(`Request ${methodName}, response result : ${rep ? rep.body : 'null'}`);
        }
        else if (rep.filePath) {
            console.log(`Request ${methodName}, download file path : ${rep ? rep.filePath : 'null'}`);
        }
        else {
            console.log(`Request ${methodName}, response result : ${rep ? JSON.stringify(rep.body, null, 4) : 'null'}`);
        }
    }
}
function Launch() {
    return __awaiter(this, void 0, void 0, function* () {
        let Client = new C4RESTFulClient_1.default(console);
        let Res = yield Client.init({
            timeout: 30000,
            gzip: true,
            downloadPath: "./download"
        }).catch((err) => {
            console.log(err);
            process.exit(-1);
        });
        Client.addParser(new C4CSVFileStreamParser_1.default(console, Path.join(process.cwd(), "./download")));
        let Method00Res = yield Client.get("http://localhost:9001/method00", {
            qs: {
                arg0: 0,
                arg1: 112
            },
            headers: {
                'content-type': 'text/plain',
                "test-header": "abc"
            },
            json: true,
        }).catch((err) => {
            console.log(err);
            return null;
        });
        Output('method00', Method00Res);
        let Method01Res = yield Client.post("http://localhost:9001/method01", {
            qs: {
                arg0: 1
            },
            headers: {
                'content-type': 'application/json',
                'authorization': '123'
            },
            body: {
                prop0: "abc",
                prop1: "efg"
            },
            json: true
        }).catch((err) => {
            console.log(err);
            return null;
        });
        Output('method01', Method01Res);
        let Method02Res = yield Client.post("http://localhost:9001/method02", {
            qs: {
                arg0: 2
            },
            headers: {
                'authorization': '123'
            },
            formData: {
                "file1": [
                    FS.createReadStream(Path.join(__dirname, '../tsconfig.json')),
                    FS.createReadStream(Path.join(__dirname, '../package.json'))
                ],
                "file2": FS.createReadStream(Path.join(__dirname, '../package.json')),
                user: "admin",
                password: "12345"
            },
            json: true,
        }).catch((err) => {
            console.log(err);
            return null;
        });
        Output('method02', Method02Res);
        let Method03Res = yield Client.get("http://localhost:9001/method03", {
            qs: {
                arg0: 1
            },
            headers: {
                'authorization': '123'
            },
            json: true,
            downloadFileName: "test.iso"
        }).catch((err) => {
            console.log(err);
            return null;
        });
        Output('method03', Method03Res);
        let Method04Res = yield Client.get('http://localhost:9001/method04', {}).catch((err) => {
            console.log(err);
            return null;
        });
        Output('method04', Method04Res);
    });
}
Launch();
//# sourceMappingURL=main.js.map