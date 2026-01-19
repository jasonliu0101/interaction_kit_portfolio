// 內容配置 - 從 content-config.json 載入
let CONTENT_CONFIG = null;

// 動態配置 - 根據環境自動選擇
function getEnvironmentConfig() {
    const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '';

    if (isLocalhost) {
        // 本地開發環境配置
        return {
            API_BASE_URL: null, // 使用相對路徑
            WS_URL: `ws://${window.location.host}/ws`,
        };
    } else {
        // Azure 生產環境配置
        return {
            API_BASE_URL: 'https://ca-dev-backend-qomwbbchmqcjy.purpleflower-f1dc6fb5.eastasia.azurecontainerapps.io/api',
            WS_URL: 'wss://ca-dev-backend-qomwbbchmqcjy.purpleflower-f1dc6fb5.eastasia.azurecontainerapps.io/ws',
        };
    }
}

// 雲端配置 - 根據環境自動選擇
const envConfig = getEnvironmentConfig();
const CONFIG = {
    // 動態 API 配置
    API_BASE_URL: envConfig.API_BASE_URL,

    // 動態 WebSocket 配置
    WS_URL: envConfig.WS_URL,

    // 問答系統設定
    QUIZ_SETTINGS: {
        TOTAL_QUESTIONS: 6,
        AUTO_ADVANCE_DELAY: 500,
        ANIMATION_DURATION: 600
    },

    // UI設定
    UI_SETTINGS: {
        SCROLL_THRESHOLD: 50,
        LOADING_MIN_TIME: 1000,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000,
        SCROLL_BEHAVIOR: 'smooth',
        SCROLL_PADDING: 20
    },

    // 環境設定
    ENVIRONMENT: {
        IS_LOCALHOST: false,
        IS_PRODUCTION: true,
        ENABLE_ANALYTICS: true,
        DEBUG_MODE: false
    },

    // 離線模式設定
    OFFLINE_MODE: {
        ENABLED: true,
        FALLBACK_DATA: true
    }
};

// 載入內容配置
async function loadContentConfig() {
    try {
        const response = await fetch('../content-config.json');
        if (!response.ok) {
            throw new Error(`Failed to load content config: ${response.status}`);
        }
        CONTENT_CONFIG = await response.json();

        // 更新問題數量
        CONFIG.QUIZ_SETTINGS.TOTAL_QUESTIONS = CONTENT_CONFIG.questions?.length || 6;

        if (CONFIG.ENVIRONMENT.DEBUG_MODE) {

        }

        return CONTENT_CONFIG;
    } catch (error) {

        return null;
    }
}

// 獲取內容的輔助函數
function getContent(path, defaultValue = '') {
    if (!CONTENT_CONFIG) return defaultValue;

    const keys = path.split('.');
    let value = CONTENT_CONFIG;

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }

    return value;
}

// 全域配置物件
window.CONFIG = CONFIG;
window.CONTENT_CONFIG = CONTENT_CONFIG;
window.getContent = getContent;
window.loadContentConfig = loadContentConfig;

// 除錯模式輸出
if (CONFIG.ENVIRONMENT.DEBUG_MODE) {

}

// 總是輸出環境配置信息
