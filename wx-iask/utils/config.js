/**
 * @author: laoono
 * @date:  2017-07-17
 * @time: 15:10
 * @contact: laoono.com
 * @description: #
 */

const ENV = 'PROD';

const VERSION = {
    NO: '0.1.4',
    DESC: '内测体验版'
};

const APP_NAME = '飞华问医生';
const APP_NAME_TAIL = '-微信小程序';
const API_DOMAIN = ENV == 'PROD' ? 'https://iask.fh21.com.cn' : 'http://iask.dev.fh21.com.cn';
const API_HOSPITAL = ENV == 'PROD' ? 'https://yyk.fh21.com.cn' : 'http://yyk.dev.fh21.com.cn';
const API_PASSPORT = ENV == 'PROD' ? 'https://passport.fh21.com.cn' : 'http://passport.dev.fh21.com.cn';

const UC_FAVO_TABS = [
    {
        name: '问答',
        value: 'iask'
    },
    {
        name: '医生',
        value: 'doctor'
    }
];

const DEPARTMENT = {
    '1': 'nk@2x.png',
    '2': 'fck@2x.png',
    '6': 'neike@2x.png',
    '47': 'waike@2x.png',
    '54': 'pfxbk@2x.png',
    '68': 'guke@2x.png',
    '94': 'ganbk@2x.png',
    '112': 'wugk@2x.png',
    '122': 'erke@2x.png',
    '142': 'zxmr@2x.png',
    '149': 'zhonglk@2x.png',
    '173': 'baojian@2x.png',
    '183': 'zhongyk@2x.png',
    '206': 'tijian@2x.png',
    '208': 'jianfei@2x.png',
    '211': 'xinli@2x.png',
    '305': 'yuer@2x.png',
    '359': 'byby@2x.png',
    '580': 'yjk@2x.png',
};

const APPID = 'miniapps';

export {
    ENV,
    APP_NAME,
    API_DOMAIN,
    UC_FAVO_TABS,
    API_HOSPITAL,
    API_PASSPORT,
    DEPARTMENT,
    APPID,
    APP_NAME_TAIL,
    VERSION
}