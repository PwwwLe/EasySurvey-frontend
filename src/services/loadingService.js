import {ElLoading} from 'element-plus';

let loadingInstance;

const showLoading = (text = '加载中...') => {
    loadingInstance = ElLoading.service({
        lock: true,
        text: text,
        background: 'rgba(0, 0, 0, 0.5)',
    });
};

const hideLoading = () => {
    if (loadingInstance) {
        loadingInstance.close();
    }
};

export default {
    showLoading,
    hideLoading,
};
