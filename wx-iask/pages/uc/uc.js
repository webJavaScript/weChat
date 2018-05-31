let app = getApp();
let passport = app.passport;
let config = require('../../utils/config');
let {NO: version, DESC: versionDesc} =config.VERSION

Page({
    data: {
        ucLinks: [
            {
                name: '1',
                children: [
                    {
                        name: '我的咨询',
                        icon: '../../assets/images/wodezixun@2x.png',
                        path: '/pages/uc-iask/uc-iask',
                        authorize: true
                    },
                    {
                        name: '我的收藏',
                        icon: '../../assets/images/wodeshoucang@2x.png',
                        path: '/pages/uc-favo/uc-favo',
                        authorize: true
                    }
                ]
            },
            {
                name: '2',
                children: [
                    {
                        name: '推荐给朋友',
                        icon: '../../assets/images/tuijianpengyou@2x.png',
                        path: '/pages/uc-fh/uc-fh',
                        buttonEnabled: true
                    },
                    {
                        name: '关于飞华',
                        icon: '../../assets/images/guanyufeihua@2x.png',
                        path: '/pages/uc-fh/uc-fh'
                    }
                ]
            }
        ],
        version,
        versionDesc,
    },
    bindLogin() {
        app.showLoading();
        passport.init(app.hideLoading, app.hideLoading);
    },
    bindShare() {
        let canIUseShare = false;
        if (wx.canIUse) {
            canIUseShare = wx.canIUse('button.open-type.share');
        }

        if (!canIUseShare) {
            app.showToast({
                title: '分享提示',
                content: '当前微信版本过低，无法使用该功能，请点击右上角分享转发或者升级到最新微信版本后重试。',
                showCancel: true
            });
        }
    },
    onShareAppMessage() {
        let {title} = config.APP_NAME + config.APP_NAME_TAIL;

        return {
            title: title,
            path: '/pages/index/index'
        }
    },
    onLoad() {
        let ucLinks = this.data.ucLinks;
        app.showLoading();

        passport.init((userInfo) => {
            app.hideLoading();
            if (!userInfo.avatarUrl) {
                userInfo.avatarUrl = '/assets/images/wodetouxiang@2x.png';
            }

            this.setData({
                userInfo
            });
        }, () => {
            app.hideLoading();
            ucLinks.forEach((v) => {
                v.children.forEach((item) => {
                    if (item.authorize) {
                        item.path = '/pages/uc/uc';
                    }
                });
            });

            this.setData({
                ucLinks
            });
        });
    }
});
