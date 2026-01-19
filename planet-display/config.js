// 大螢幕星球展示配置
if (typeof CONFIG === 'undefined') {
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
    
    // 根據環境自動選擇配置
    const envConfig = getEnvironmentConfig();
    const CONFIG = {
    // 動態 API 配置
    API_BASE_URL: envConfig.API_BASE_URL,
    
    // 動態 WebSocket 配置
    WS_URL: envConfig.WS_URL,
    
    // 展示設定
    DISPLAY_SETTINGS: {
        MAX_PLANETS: 50,
        ANIMATION_SPEED: 1.0,
        AUTO_ROTATE_SPEED: 0.5,
        REFRESH_INTERVAL: 30000, // 30秒
        FULLSCREEN_ENABLED: true
    },
    
    // 視覺效果設定
    VISUAL_EFFECTS: {
        STARS_COUNT: 200,
        METEORS_ENABLED: true,
        METEOR_FREQUENCY: 5000, // 5秒
        PARTICLE_EFFECTS: true,
        GLOW_INTENSITY: 0.8
    },
    
    // 行星主題配置
    PLANET_THEMES: {
        popular: {
            gradient: 'radial-gradient(circle at 30% 30%, #FFD700, #FF8C00)',
            glow: '0 0 30px #FFD700, 0 0 60px #FF8C00',
            color: '#FFD700'
        },
        trending: {
            gradient: 'radial-gradient(circle at 30% 30%, #FF6B6B, #FF1744)',
            glow: '0 0 30px #FF6B6B, 0 0 60px #FF1744',
            color: '#FF6B6B'
        },
        stable: {
            gradient: 'radial-gradient(circle at 30% 30%, #4CAF50, #2E7D32)',
            glow: '0 0 30px #4CAF50, 0 0 60px #2E7D32',
            color: '#4CAF50'
        },
        new: {
            gradient: 'radial-gradient(circle at 30% 30%, #9C27B0, #6A1B9A)',
            glow: '0 0 30px #9C27B0, 0 0 60px #6A1B9A',
            color: '#9C27B0'
        },
        productivity: {
            gradient: 'radial-gradient(circle at 30% 30%, #2196F3, #1565C0)',
            glow: '0 0 30px #2196F3, 0 0 60px #1565C0',
            color: '#2196F3'
        },
        themes: {
            gradient: 'radial-gradient(circle at 30% 30%, #E91E63, #AD1457)',
            glow: '0 0 30px #E91E63, 0 0 60px #AD1457',
            color: '#E91E63'
        },
        languages: {
            gradient: 'radial-gradient(circle at 30% 30%, #FF9800, #F57C00)',
            glow: '0 0 30px #FF9800, 0 0 60px #F57C00',
            color: '#FF9800'
        },
        debugging: {
            gradient: 'radial-gradient(circle at 30% 30%, #F44336, #C62828)',
            glow: '0 0 30px #F44336, 0 0 60px #C62828',
            color: '#F44336'
        }
    },
    
    // 軌道配置
    ORBIT_CONFIG: {
        rings: [
            { radius: 200, speed: 30, planets: 6 },
            { radius: 320, speed: 45, planets: 8 },
            { radius: 450, speed: 60, planets: 10 },
            { radius: 580, speed: 90, planets: 12 },
            { radius: 720, speed: 120, planets: 14 }
        ]
    },
    
    // 環境設定
    ENVIRONMENT: {
        IS_LOCALHOST: false,
        IS_PRODUCTION: true,
        DEBUG_MODE: false,
        PERFORMANCE_MONITORING: true
    },
    
    // 離線模式設定（預設為線上模式）
    OFFLINE_MODE: {
        ENABLED: false,  // 預設為線上模式
        FALLBACK_DATA: true,
        MOCK_REALTIME: true
    }
};

// 全域配置物件
window.CONFIG = CONFIG;

// 除錯模式輸出
if (CONFIG.ENVIRONMENT.DEBUG_MODE) {
    
}

// 總是輸出環境配置信息

}
