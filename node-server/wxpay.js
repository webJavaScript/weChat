//微信小程序支付封装,暂支持md5加密，不支持sha1

var Q = require("q")  ;
var request = require("request")  ;
var crypto = require('crypto')  ;
var ejs = require('ejs');
var fs = require('fs')  ;
var key = 'tBjuMyxiVmNA1tSOQa171JJ4aDoIVHA9';
module.exports = {
  // 获取prepay_id
  getXMLNodeValue: function(node_name, xml) {  
    console.log('xml: ', xml);
    var tmp = xml.split("<" + node_name + ">")  
    var _tmp = tmp[1].split("</" + node_name + ">")  
    return _tmp[0]  
  },
  // object-->string
  raw: function(args) {  
    var keys = Object.keys(args)  
    keys = keys.sort()  
    var newArgs = {}  
    keys.forEach(function(key) {  
        newArgs[key] = args[key]  
    })  
    var string = ''  
    for (var k in newArgs) {  
        string += '&' + k + '=' + newArgs[k]  
    }  
    string = string.substr(1)  
    return string  
  },  
    // 随机字符串产生函数  
  createNonceStr: function() {  
      return Math.random().toString(36).substr(2, 15)  
  },  
  // 时间戳产生函数  
  createTimeStamp: function() {  
      return parseInt(new Date().getTime() / 1000) + ''  
  },
  // 支付md5加密获取sign
  paysignjs: function(appid, nonceStr, package, signType, timeStamp) {  
    var ret = {  
        appId: appid,  
        nonceStr: nonceStr,  
        package: package,  
        signType: signType,  
        timeStamp: timeStamp  
    }  
    var string = this.raw(ret)  
    string = string + '&key=' + key  
    var sign = crypto.createHash('md5').update(string, 'utf8').digest('hex')  
    return sign.toUpperCase()  
  },
  // 统一下单接口加密获取sign
  paysignjsapi: function(appid, attach, body, limit_pay, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) {  
    var ret = {  
      appid: appid,  
      attach: attach,  
      body: body,  
      limit_pay: limit_pay,
      mch_id: mch_id,  
      nonce_str: nonce_str,  
      notify_url: notify_url,  
      openid: openid,  
      out_trade_no: out_trade_no,  
      spbill_create_ip: spbill_create_ip,  
      total_fee: total_fee,  
      trade_type: trade_type  
    }  
    var string = this.raw(ret)  
    string = string + '&key=' + key  
    var crypto = require('crypto')  
    var sign = crypto.createHash('md5').update(string, 'utf8').digest('hex')  
    return sign.toUpperCase()  
  },
  // 下单接口
  order: function(attach, body, mch_id, openid, total_fee, notify_url) {
    var bookingNo = 'video' + this.createNonceStr() + this.createTimeStamp()
    var deferred = Q.defer()  
    var appid = 'wxb24ece1d8fe0a938';  
    var nonce_str = this.createNonceStr()  
    var timeStamp = this.createTimeStamp()  
    var url = "https://api.mch.weixin.qq.com/pay/unifiedorder"  
    var formData = "<xml>"  
    formData += "<appid>" + appid + "</appid>" //appid  
    formData += "<attach>" + attach + "</attach>" //附加数据  
    formData += "<body>" + body + "</body>"  
    formData += "<limit_pay>no_credit</limit_pay>"
    formData += "<mch_id>" + mch_id + "</mch_id>" //商户号  
    formData += "<nonce_str>" + nonce_str + "</nonce_str>" //随机字符串，不长于32位。  
    formData += "<notify_url>" + notify_url + "</notify_url>"  
    formData += "<openid>" + openid + "</openid>"  
    formData += "<out_trade_no>" + bookingNo + "</out_trade_no>"  
    formData += "<spbill_create_ip>61.50.221.43</spbill_create_ip>"  
    formData += "<total_fee>" + total_fee + "</total_fee>"  
    formData += "<trade_type>JSAPI</trade_type>"  
    formData += "<sign>" + this.paysignjsapi(appid, attach, body, 'no_credit', mch_id, nonce_str, notify_url, openid, bookingNo, '61.50.221.43', total_fee, 'JSAPI') + "</sign>"  
    formData += "</xml>"  
    var self = this
    request({  
      url: url,  
      method: 'POST',  
      body: formData  
    }, function(err, response, body) {  
      if (!err && response.statusCode == 200) {  
        var prepay_id = self.getXMLNodeValue('prepay_id', body.toString("utf-8")) 
        var tmp = prepay_id.split('[')
        var tmp1 = tmp[2].split(']')  
        //签名  
        var _paySignjs = self.paysignjs(appid, nonce_str, 'prepay_id=' + tmp1[0], 'MD5', timeStamp)  
        var args = {  
          appId: appid,  
          timeStamp: timeStamp,  
          nonceStr: nonce_str,  
          signType: "MD5",  
          package: tmp1[0],  
          paySign: _paySignjs,
          outTradeNo: bookingNo,
          totalFee: total_fee
        }
        deferred.resolve(args)  
      } else {  
        console.log(body)  
      } 
    })  
    return deferred.promise  
  }
}