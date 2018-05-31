var formatDate = (dateInfo) => {
    var date = dateInfo.data || new Date();
    var type = dateInfo.dateType || '-';
    var notFullTime = dateInfo.notFullTime || false;

    const fullYear = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    var fd = [fullYear, parseNumber(month + 1), parseNumber(day)].join(type) +
            ' ' + [parseNumber(hour), parseNumber(minute), parseNumber(second)].join(':');
    if(notFullTime) {
        fd = [fullYear, parseNumber(month + 1), parseNumber(day)].join(type);
    }
    return fd;
}

var parseNumber = num => {
    if(!Number(num)) return Number(num);
    if(num < 10) {
        num = '0' + num;
    }
    return num;
}

var loadingToast = (duration) => {
    wx.showToast({
        title: '正在加载',
        duration: duration || 5000,
        icon: "loading"
    })
}
var failToast = (duration) => {
    wx.showToast({
        title: '加载失败',
        duration: duration || 5000,
        icon: 'none'
    })
}
var moreToast = duration => {
    wx.showToast({
        title: '没有更多了！',
        duration: duration || 1000,
        icon: 'success'
    })
}

var getNetworkType = type => {
    console.log('networkType: ', type);
    if(type == 'wifi') {
        
    } else if (['2g', '3g', '4g'].indexOf(type) > -1) {
        wx.showToast({
            title: '处于移动数据网络',
            duration: 2000,
            icon: 'none'
        })
    } else if(type == 'unknown') {
        wx.showToast({
            title: '网络环境未知',
            duration: 2000,
            icon: 'none'
        })
    } else if(type == 'none') {
        wx.showToast({
            title: '当前无网络',
            duration: 2000,
            icon: 'none'
        })
    }
}

var getSystemInfo = () => {
    try {
        var systemInfo = wx.getSystemInfoSync();
        console.log('获取设备数据：', systemInfo);
        return systemInfo;
    } catch(err) {
        console.log('获取设备数据失败：', err);
        return {}
    }
}

module.exports = {
    formatDate,
    loadingToast,
    failToast,
    moreToast,
    getNetworkType,
    ...getSystemInfo()
}