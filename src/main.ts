import C4RESTFulClient from './C4RESTFulClient';
import Request = require("request");
import FS = require('fs');
import Path = require('path');
import { TypeUtils } from 'c4utils';
import C4CSVFileStreamParser from './C4DefaultRESTFulParser/C4CSVFileStreamParser';

function Output(methodName : String, rep : Request.Response | null) {
    if (rep && (rep.body || (<any>rep).filePath)) {
        if (Buffer.isBuffer(rep.body)) {
            console.log(`Request ${methodName}, response result : ${rep ? rep.body.toString('') : 'null'}`)
        } else if (TypeUtils.isString(rep.body)) {
            console.log(`Request ${methodName}, response result : ${rep ? rep.body : 'null'}`);
        } else if ((<any>rep).filePath ){
            console.log(`Request ${methodName}, download file path : ${rep ? (<any>rep).filePath : 'null'}`)
        } else {
            console.log(`Request ${methodName}, response result : ${rep ? JSON.stringify(rep.body, null, 4) : 'null'}`)
        }
    }
}

async function Launch() {

    let Client = new C4RESTFulClient(console);
    let Res = await Client.init({
        timeout : 30000,
        gzip : true,
        downloadPath : "./download"
    }).catch((err) => {
        console.log(err);
        process.exit(-1);
    });

    Client.addParser(new C4CSVFileStreamParser (console, Path.join(process.cwd(), "./download")));

    let Method00Res = await Client.get("http://localhost:9001/method00", {
        qs : {
            arg0 : 0,
            arg1 : 112
        },
        headers : {
            'content-type' : 'text/plain',
            "test-header" : "abc"
        },
        json : true,
    }).catch((err) => {
        console.log(err);
        return null;
    });
    
    Output('method00', Method00Res);

    let Method01Res = await Client.post("http://localhost:9001/method01", {
        qs : {
            arg0 : 1
        },
        headers : {
            'content-type' : 'application/json',
            'authorization' : '123'
        },
        body : {
            prop0 : "abc",
            prop1 : "efg"
        },
        json : true
    }).catch((err) => {
        console.log(err);
        return null;
    });

    Output('method01', Method01Res);

    let Method02Res = await Client.post("http://localhost:9001/method02", {
        qs : {
            arg0 :2
        },
        headers : {
            'authorization' : '123'
        },
        formData : {
            "file1" : [
                FS.createReadStream(Path.join(__dirname, '../tsconfig.json')),
                FS.createReadStream(Path.join(__dirname, '../package.json'))
            ],
            "file2" : FS.createReadStream(Path.join(__dirname, '../package.json')),
            user : "admin",
            password : "12345"
        },
        json : true,
    }).catch((err) => {
        console.log(err);
        return null;
    });

    Output('method02', Method02Res);

    let Method03Res = await Client.get("http://localhost:9001/method03", {
        qs : {
            arg0 :1
        },
        headers : {
            'authorization' : '123'
        },
        json : true,
        downloadFileName : "test.iso"
    }).catch((err) => {
        console.log(err);
        return null;
    });

    Output('method03', Method03Res);

    let Method04Res = await Client.get('http://localhost:9001/method04', {}).catch((err) => {
        console.log(err);
        return null;
    });

    Output('method04', Method04Res)
}

Launch();
