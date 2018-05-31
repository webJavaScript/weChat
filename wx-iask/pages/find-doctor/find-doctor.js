let {
    getHotDepartment
} = require('../../action/get-gethotdepartment');
let app = getApp();

Page({
    data: {
        hot: []
    },
    onReady() {
        
        app.showLoading();

        getHotDepartment().then((res) => {

            this.setData({
                hot: res.department
            });

            app.hideLoading();

        }).catch(()=>{

            app.hideLoading();
            app.loadingError();

        });
    }
});