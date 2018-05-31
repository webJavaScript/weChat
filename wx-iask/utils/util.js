function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function isArray(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
}

function isObject(o) {
    return Object.prototype.toString.call(o) == '[object Object]';
}

function isFunction(o) {
    return Object.prototype.toString.call(o) == '[object Function]';
}

let parentObjects = [];

function copy(o) {

    if (!o || (typeof o) != 'object') return o;

    let dc = isArray(o) ? [] : {};

    let keys = Object.keys(o);

    parentObjects.push(o);

    for (let k of keys) {

        let v = o[k];

        if (parentObjects.indexOf(v) > -1) {
            throw Error("检测到属性循环引用");
        }

        dc[k] = copy(v);
    }

    parentObjects.pop();

    return dc;
};

function formatTimePlus(timestamp = new Date().getTime()) {

    var date = new Date(timestamp);

    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    let start = [year - 100, month, day].map(formatNumber).join('-');

    let end = [year, month, day].map(formatNumber).join('-');
    let YmdHM = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
    let Ymd = [year, month, day].map(formatNumber).join('-');

    return {
        start,
        end,
        year,
        month,
        day,
        hour,
        minute,
        YmdHM,
        Ymd,
        second
    }
};

module.exports = {
    formatTime,
    isArray,
    isObject,
    isFunction,
    copy,
    formatTimePlus
}
