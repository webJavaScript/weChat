//依赖 connect

var http = require('http')
  , express = require('express')
  , request = require('request')
  , bodyParser = require('body-parser');

//允许传送隐藏文件
var options = {hidden: true};

var app = express()

console.log('Server is starting, please goto this URL in a browser to run app: \nhttp://localhost:6320/editor-shell.xhtml');
http.createServer(app).listen(6050, () => {
    console.log('listening 6050 port');
});

// app.configure(() => {
    // app.use(express.bodyParser({ keepExtensions: true, uploadDir: '/tmp'}));
// })

app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));
   
app.get('/',(req, res, next) => {
    console.log('someone request');
    res.json({appid: '1234567890'})
});

app.post('/video/login', (req, res, next) => {
    console.log(req.params, req.query, req.body.code);
    const appid = 'wxb24ece1d8fe0a938';
    const secret = '59c43353a9e8f0a19a5534bcb290ba1d';
    const code = req.body.code;
    const jsons = getOpenid({appid, secret, code});
    res.json(jsons);
})

function getOpenid(obj) {
    if(!obj) return { code: 0, msg: '参数错误'};
    const { appid, secret, code } = obj;
    if(!appid) return { 'code': 0, 'msg': 'appid 错误' };
    if(!secret) return { 'code': 0, 'msg': 'secret 错误' };
    if(!code) return { 'code': 0, 'msg': 'code 错误' };
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code';
    var options = {
        headers: {"Connection": "close"},
        url,
        method: 'GET',
        json:true
    };
    http.request(options, res => {
        console.log('json2session: ', res);
        return res;
    })
}