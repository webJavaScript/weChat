/**
 * @author: laoono
 * @date:  2017-08-04
 * @time: 17:43
 * @contact: laoono.com
 * @description: #
 */

let WxParse = require('../../wxParse/wxParse');
let {getIndexBannerArticle} = require('../../action/get-indexbannerarticle');
let app = getApp();

Page({
    data: {},
    onLoad(options) {
        let {articleid, title} = options;

        app.showLoading();
        getIndexBannerArticle({articleid}).then(res => {
            app.hideLoading();

            let {article} = res;
            let {body, title: articleTitle} = article;
            let text = body.join('')

            this.setData({
                title,
                articleTitle,
                articleid
            });

            wx.setNavigationBarTitle({
                title
            });

            WxParse.wxParse('text', 'html', text, this);
        }).catch(() => {
            app.loadingError();
        });
    },

    onShareAppMessage() {
        let {articleTitle, title, articleid} = this.data;

        console.log(articleTitle, title, articleid);

        let path = '/pages/article-detail/article-detail?articleid=' + articleid + '&title=' + title;

        return {
            title: articleTitle,
            path
        }
    },
});
