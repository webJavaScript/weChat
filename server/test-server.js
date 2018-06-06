//依赖 connect

var http = require('http'),
    https = require('https'),
    express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    crypto = require('crypto'),
    wxpay = require('./wxpay.js');

//允许传送隐藏文件
var options = {
    hidden: true
};
var app = express();

const appid = 'wxb24ece1d8fe0a938';
const secret = '59c43353a9e8f0a19a5534bcb290ba1d';
var code = '';
var totalFee = 88;
var openid = null;
var unifiedorder = 'https://api.mch.weixin.qq.com/pay/unifiedorder';

console.log('Server is starting, please goto this URL in a browser to run app: \nhttp://localhost:6320/editor-shell.xhtml');
http.createServer(app).listen(6050, () => {
    console.log('listening 6050 port');
});

// app.configure(() => {
// app.use(express.bodyParser({ keepExtensions: true, uploadDir: '/tmp'}));
// })

app.use(bodyParser.json({
    limit: '1mb'
})); //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({ //此项必须在 bodyParser.json 下面,为参数编码
    extended: true
}));

app.get('/', (req, res, next) => {
    console.log('someone request');
    res.json({
        appid: '1234567890'
    });
});

app.post('/video/login', (req, res, next) => {
    console.log(req.body.code, req.method);
    const appid = 'wxb24ece1d8fe0a938';
    const secret = '59c43353a9e8f0a19a5534bcb290ba1d';
    const code = req.body.code;
    getOpenid({
        appid,
        secret,
        code
    }, (jsons) => {
        console.log('getOpenid >> jsons: ', jsons);
        var resJSON = JSON.parse(`{
            "openid":null,
            "appid":"video",
            "logid":1923664258,
            "errno":0,
            "servertime":1528082701,
            "errmsg":"success"
        }`);
        if (!jsons) {
            res.send(500, {
                code: 0,
                error: 'something blew up'
            });
        }
        resJSON.logid = setLogid();
        resJSON.servertime = (+new Date()).toString().slice(0, -3);
        resJSON.openid = openid = JSON.parse(jsons).openid || null;
        res.send(resJSON);
    });
});

function getOpenid(obj, cb) {
    if (!obj) return {
        code: 0,
        msg: '参数错误'
    };
    const {
        appid,
        secret,
        code
    } = obj;
    if (!appid) return {
        'code': 0,
        'msg': 'appid 错误'
    };
    if (!secret) return {
        'code': 0,
        'msg': 'secret 错误'
    };
    if (!code) return {
        'code': 0,
        'msg': 'code 错误'
    };
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code';
    console.log('url: ', url);
    var jsons = {};
    var req = https.get(url, (res) => {
        console.log('STATUS:' + res.statusCode);
        res.setEncoding('utf-8');
        res.on('data', chunk => {
            console.log('chunk: ', chunk);
            jsons = chunk;
        });
        res.on('end', () => {
            console.log('响应结束********');
            cb && cb(jsons);
            return jsons;
        });
    });
    req.on('error', err => {
        console.log('err: ', err);
        cb && cb(err);
    })
    req.end();
}

app.post('/unifiedorder', (req, res, next) => {
    console.log(req.body.code, req.method);
    code = req.body.code;
    totalFee = parseInt(req.body.total_fee) || 88;
    getOpenid({
        appid,
        secret,
        code
    }, (jsons) => {
        console.log('getOpenid >> jsons: ', jsons);
        var resJSON = JSON.parse(`{
            "openid":null,
            "appid":"video",
            "logid":1923664258,
            "errno":0,
            "servertime":1528082701,
            "errmsg":"success"
        }`);
        if (!jsons) {
            res.send(500, {
                code: 0,
                error: 'something blew up'
            });
        }
        resJSON.logid = setLogid();
        resJSON.servertime = (+new Date()).toString().slice(0, -3);
        resJSON.openid = openid = JSON.parse(jsons).openid || null;

        if (!openid) {
            res.send(resJSON);
            return;
        }
        var body = "飞华微视网，小程序视频详情页 - 支持一下";
        var openid = openid;
        var total_fee = totalFee;
        var notify_url = "http://localhost/notify";
        var mch_id = '1505368241';
        var attach = "飞华微视-小程序";
        wxpay.order(attach, body, mch_id, openid, total_fee, notify_url)
            .then(function (data) {
                console.log('data--->', data);
                resJSON = extendObj(resJSON, data);
                console.log('resJSON--->', resJSON);
                res.send(resJSON);
            })
    });
});

function setLogid() {
    const codes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz';
    var str = '';
    for (var i = 0; i < 32; i++) {
        var rd = parseInt(Math.random() * codes.length);
        str += codes[rd];
    }
    return str;
}

function extendObj(target) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.forEach(arg => {
        for(var key in arg) {
            if(arg.hasOwnProperty(key) && !!arg[key]) {
                target[key] = arg[key];
            }
        }
    });
    return target;
}