/**
 * @author: laoono
 * @date:  2017-08-05
 * @time: 20:23
 * @contact: laoono.com
 * @description: #
 */

let systemInfo = {};

try {
    systemInfo = wx.getSystemInfoSync()
} catch (e) {
}

let {system} = systemInfo;

const iOSMasterVesrion = parseInt(system.replace(/^iOs\s*/gi, '')) || false;
const iOS = /iOs/gi.test(system);

export {systemInfo, iOSMasterVesrion, iOS};