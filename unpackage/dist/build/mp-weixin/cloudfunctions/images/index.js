// 产品图片云函数
const cloudbase = require('@cloudbase/node-sdk');

const ENV_ID = 'cloud1-d2g6k45v21dd52696';
const app = cloudbase.init({ env: ENV_ID });

const PREFIX = 'cloud://cloud1-d2g6k45v21dd52696.636c-cloud1-d2g6k45v21dd52696-1441744670/images/';

const SERIES_NAMES = [
  'QB系列', 'QC系列', 'QCA系列', 'QCB系列', 'QCG系列', 'QD系列',
  'QH系列', 'QJ系列', 'QMB系列', 'QMC系列', 'QMDY系列', 'QMG系列',
  'QP系列', 'QS系列', 'QU系列', 'QUP系列', 'QV系列', 'QVY系列',
  'QW系列', 'QWF系列', 'QWL系列', 'QWLY系列', 'QWY系列', 'QY系列', 'QYA系列'
];

exports.main = async (event, context) => {
  try {
    // 文件名去掉"系列"后缀：QB系列 → QB.png
    const fileIDs = SERIES_NAMES.map(name => PREFIX + name.replace('系列', '') + '.png');
    console.log('[images] 请求文件数: ' + fileIDs.length);
    console.log('[images] 前3个fileID: ' + JSON.stringify(fileIDs.slice(0, 3)));

    const res = await app.getTempFileURL({ fileList: fileIDs });
    console.log('[images] 返回: ' + JSON.stringify(res));

    const imageMap = {};
    const errors = [];
    if (res.fileList) {
      for (let i = 0; i < res.fileList.length; i++) {
        const item = res.fileList[i];
        if (item.tempFileURL) {
          imageMap[SERIES_NAMES[i]] = item.tempFileURL;
        } else {
          errors.push({ name: SERIES_NAMES[i], fileID: fileIDs[i], errMsg: item.errMsg || 'no tempFileURL' });
        }
      }
    }
    if (errors.length > 0) {
      console.log('[images] 失败列表(前5): ' + JSON.stringify(errors.slice(0, 5)));
    }

    return { success: true, data: imageMap };
  } catch (error) {
    console.error('[images] 错误:', error);
    return { success: false, message: '获取图片失败: ' + error.message };
  }
};
