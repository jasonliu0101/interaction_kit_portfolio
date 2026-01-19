// 行星顯示 API 類
class PlanetDisplayAPI {
    constructor() {
        // 使用配置文件中的 API URL
        this.baseURL = CONFIG.API_BASE_URL || '';
    }
    
    async getExtensions() {
        try {
            console.log('🌌 API: 正在獲取擴展數據...');
            const apiUrl = this.baseURL ? `${this.baseURL}/api/extensions` : '/api/extensions';
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API 請求失敗: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            console.log('🌌 API: 擴展數據獲取成功:', data);
            return data.success ? data.data : data;
        } catch (error) {
            console.error('🌌 API: 獲取擴展數據失敗:', error);
            throw error;
        }
    }
    
    async getStatistics() {
        try {
            console.log('🌌 API: 正在獲取統計數據...');
            const apiUrl = this.baseURL ? `${this.baseURL}/api/stats` : '/api/stats';
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API 請求失敗: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            console.log('🌌 API: 統計數據獲取成功:', data);
            return data.success ? data.data : data;
        } catch (error) {
            console.error('🌌 API: 獲取統計數據失敗:', error);
            throw error;
        }
    }
}

// 星球展示主應用程式
if (typeof window.PlanetApp === 'undefined') {
    class PlanetApp {
    constructor() {
        this.config = CONFIG;
        this.api = new PlanetDisplayAPI(); // 修正 API 類別名稱
        this.animations = null;
        this.views = null;
        this.data = {
            extensions: [],
            planets: [],
            statistics: null
        };
        this.isInitialized = false;
        
        this.init();
    }

    // 初始化應用程式
    async init() {
        try {
            console.log('🌌 星球展示應用程式初始化中...');
            console.log('🌌 CONFIG狀態:', CONFIG);
            console.log('🌌 離線模式:', CONFIG?.OFFLINE_MODE?.ENABLED);
            
            // 顯示載入畫面
            console.log('🌌 顯示載入畫面...');
            this.showLoadingScreen();
            
            // 載入數據
            console.log('🌌 開始載入數據...');
            await this.loadData();
            console.log('🌌 數據載入完成');
            
            // 初始化動畫系統
            console.log('🌌 初始化動畫系統...');
            this.initAnimations();
            
            // 初始化視圖系統
            console.log('🌌 初始化視圖系統...');
            this.initViews();
            
            // 設置全域事件監聽器
            console.log('🌌 設置事件監聽器...');
            this.setupGlobalEventListeners();
            
            // 載入用戶設定
            console.log('🌌 載入用戶設定...');
            this.loadUserSettings();
            
            // 隱藏載入畫面
            console.log('🌌 隱藏載入畫面...');
            this.hideLoadingScreen();
            
            // 設置定期數據刷新（每30秒更新一次投票數據）
            this.startDataRefresh();
            
            this.isInitialized = true;
            console.log('🌌 星球展示應用程式初始化完成');
            
            // 觸發初始化完成事件
            this.dispatchEvent('app:initialized');
            
        } catch (error) {
            console.error('🌌 應用程式初始化失敗:', error);
            console.error('🌌 錯誤堆疊:', error.stack);
            
            // 確保載入畫面被隱藏
            this.hideLoadingScreen();
            
            // 顯示錯誤畫面
            this.showErrorScreen(error.message);
        }
    }

    // 載入數據
    async loadData() {
        try {
            console.log('🌌 開始載入數據...');
            
            // 載入擴充套件數據
            console.log('🌌 正在載入擴充套件數據...');
            const extensionsData = await this.api.getExtensions();
            console.log('🌌 擴充套件數據回應:', extensionsData);
            
            // 檢查回應格式並提取數據
            this.data.extensions = Array.isArray(extensionsData) ? extensionsData : (extensionsData.data || []);
            console.log('🌌 處理後的擴充套件數據:', this.data.extensions);
            
            // 載入統計數據
            console.log('🌌 正在載入統計數據...');
            const statsData = await this.api.getStatistics();
            this.data.statistics = statsData.data || statsData || {};
            console.log('🌌 統計數據:', this.data.statistics);
            
            // 基於擴充套件數據生成星球
            this.generatePlanets();
            
            console.log(`🌌 成功載入了 ${this.data.extensions.length} 個擴充套件`);
            
        } catch (error) {
            console.error('🌌 數據載入失敗:', error);
            console.warn('🌌 嘗試載入模擬數據並從後端獲取投票數據');
            await this.loadMockData();
        }
    }

    // 載入模擬數據
    async loadMockData() {
        console.log('🌌 正在載入模擬數據並嘗試獲取真實投票數據...');
        
        // 先建立模擬數據結構
        const mockExtensions = [
            // 套裝1：暖心新手友善包
            {
                id: 'vscode-pets',
                name: 'VSCode Pets',
                description: '在狀態列養隻可愛虛擬寵物，會根據你的編程狀況反應',
                category: 'entertainment',
                tags: ['pets', 'virtual', 'coding-companion'],
                downloads: 5000000,
                rating: 4.8,
                icon: '🐱',
                votes: 0
            },
            {
                id: 'live-preview',
                name: 'Live Preview',
                description: '一鍵啟動本地伺服器與預覽瀏覽器，每次存檔自動重整',
                category: 'tools',
                tags: ['preview', 'server', 'live-reload'],
                downloads: 8000000,
                rating: 4.6,
                icon: '🌐',
                votes: 0
            },
            {
                id: 'github-copilot',
                name: 'GitHub Copilot',
                description: 'AI程式夥伴，根據註解和脈絡自動建議程式碼',
                category: 'ai',
                tags: ['ai', 'assistant', 'coding-help'],
                downloads: 50000000,
                rating: 4.7,
                icon: '🤖',
                votes: 0
            },
            // 套裝2：爆炸特效狂歡包
            {
                id: 'power-mode',
                name: 'Power Mode',
                description: '每次按鍵都會炸出粒子特效，打字越快爆炸越猛烈',
                category: 'entertainment',
                tags: ['effects', 'particles', 'visual'],
                downloads: 3000000,
                rating: 4.5,
                icon: '�',
                votes: 0
            },
            {
                id: 'code-runner',
                name: 'Code Runner',
                description: '多語言程式碼執行引擎，支援40+種程式語言快速執行',
                category: 'tools',
                tags: ['execution', 'multi-language', 'runner'],
                downloads: 12000000,
                rating: 4.4,
                icon: '⚡',
                votes: 0
            },
            // 套裝3：賽博龐克駭客包
            {
                id: 'synthwave-theme',
                name: 'Synthwave \'84 Theme',
                description: '霓虹粉紫配色主題，讓VS Code變成《銀翼殺手》駭客終端',
                category: 'theme',
                tags: ['theme', 'synthwave', 'cyberpunk'],
                downloads: 2500000,
                rating: 4.9,
                icon: '🌈',
                votes: 0
            },
            {
                id: 'wakatime',
                name: 'WakaTime',
                description: '專業開發者時間追蹤與生產力分析平台',
                category: 'analytics',
                tags: ['tracking', 'analytics', 'productivity'],
                downloads: 6000000,
                rating: 4.6,
                icon: '📊',
                votes: 0
            },
            // 套裝4：溫馨品質守護包
            {
                id: 'todo-highlight',
                name: 'TODO Highlight',
                description: '通用程式任務管理與技術債務追蹤神器',
                category: 'productivity',
                tags: ['todo', 'highlight', 'task-management'],
                downloads: 4000000,
                rating: 4.5,
                icon: '📝',
                votes: 0
            },
            // 套裝5：爆炸除錯達人包
            {
                id: 'gitlens',
                name: 'GitLens',
                description: 'Git版本控制的視覺化增強工具',
                category: 'scm',
                tags: ['git', 'version-control', 'blame'],
                downloads: 18000000,
                rating: 4.8,
                icon: '🔍',
                votes: 0
            },
            // 套裝6：寵物協作天堂包
            {
                id: 'live-share',
                name: 'Live Share',
                description: '微軟官方即時協作工具',
                category: 'collaboration',
                tags: ['collaboration', 'sharing', 'real-time'],
                downloads: 15000000,
                rating: 4.7,
                icon: '🤝',
                votes: 0
            },
            // 套裝7：架構霸主包
            {
                id: 'azure-tools',
                name: 'Azure Tools',
                description: '微軟官方雲端開發工具套件',
                category: 'cloud',
                tags: ['azure', 'cloud', 'devops'],
                downloads: 7000000,
                rating: 4.3,
                icon: '☁️',
                votes: 0
            },
            // 套裝8：機器學習神人包
            {
                id: 'azure-ml',
                name: 'Azure Machine Learning',
                description: '微軟官方機器學習整合工具',
                category: 'ai',
                tags: ['machine-learning', 'ai', 'azure'],
                downloads: 3500000,
                rating: 4.4,
                icon: '🧠',
                votes: 0
            }
        ];

        // 嘗試從後端獲取真實的投票數據
        try {
            console.log('🌌 嘗試從後端API獲取真實投票數據...');
            const extensionsData = await this.api.getExtensions();
            const realExtensions = Array.isArray(extensionsData) ? extensionsData : (extensionsData.data || []);
            
            // 用真實投票數據更新模擬數據
            mockExtensions.forEach(mockExt => {
                const realExt = realExtensions.find(real => real.id === mockExt.id);
                if (realExt) {
                    mockExt.votes = realExt.rockets || realExt.votes || 0;
                    mockExt.rockets = realExt.rockets || 0;
                    console.log(`🌌 更新 ${mockExt.name} 投票數: ${mockExt.votes}`);
                }
            });
            
            console.log('🌌 成功獲取並更新投票數據');
        } catch (error) {
            console.warn('🌌 無法從後端獲取投票數據，使用預設值:', error);
        }

        // 設置擴展數據
        this.data.extensions = mockExtensions;

        this.data.statistics = {
            totalExtensions: this.data.extensions.length,
            totalDownloads: this.data.extensions.reduce((sum, ext) => sum + (ext.downloads || 0), 0),
            popularCategory: 'theme'
        };

        this.generatePlanets();
    }

    // 基於擴充套件生成星球
    generatePlanets() {
        const categoryColors = {
            entertainment: '#ff6b9d',  // VSCode Pets, Power Mode - 粉紅色
            tools: '#00d4aa',          // Live Preview, Code Runner - 青綠色
            ai: '#58a6ff',             // GitHub Copilot, Azure ML - 藍色
            theme: '#ff006e',          // Synthwave '84 Theme - 紫紅色
            analytics: '#0984e3',      // WakaTime - 藍色
            productivity: '#fdcb6e',   // TODO Highlight - 黃色
            scm: '#f78166',            // GitLens - 橘色
            collaboration: '#6c5ce7',  // Live Share - 紫色
            cloud: '#0078d4'           // Azure Tools - 微軟藍
        };

        this.data.planets = this.data.extensions.map((extension, index) => ({
            id: extension.id,
            name: extension.name,
            description: extension.description,
            category: extension.category,
            color: categoryColors[extension.category] || '#ddd',
            size: Math.min(Math.max(extension.downloads / 10000, 0.5), 3),
            position: this.generatePlanetPosition(index),
            rotationSpeed: 0.002 + Math.random() * 0.003,
            extension: {
                ...extension,
                // 確保包含火箭投票數（從後端 API 獲取）
                votes: extension.rockets || extension.votes || 0,
                rockets: extension.rockets || 0,
                // 添加默認圖片 URL（使用 extension ID 來生成圖片）
                image: extension.image || this.getExtensionImage(extension.id, extension.name)
            }
        }));

        console.log(`🌌 生成了 ${this.data.planets.length} 個星球數據`);
        
        // 直接渲染星球到DOM
        this.renderPlanetsToDOM();
    }

    // 獲取 extension 的圖片 URL
    getExtensionImage(extensionId, extensionName) {
        console.log(`🔍 嘗試獲取圖片，extensionId: ${extensionId}, extensionName: ${extensionName || '未知'}`);
        
        // 修正相對路徑: 從 apps/planet-display 到 apps/assets/stars 需要返回兩層目錄
        const starsBasePath = '../../assets/stars';
        
        // 本地星球圖片映射（保留原有特殊對應）
        const localStarsMap = {
            'code-runner': `${starsBasePath}/code_runner.png`,
            'live-preview': `${starsBasePath}/live_preview.png`,
            'power-mode': `${starsBasePath}/power_mode.png`,
            'synthwave-theme': `${starsBasePath}/synthwave_84_theme.png`,
            'vscode-pets': `${starsBasePath}/vscode_pets.png`,
            'wakatime': `${starsBasePath}/wakatime.png`,
            'github-copilot': `${starsBasePath}/github_copilot.png`
        };
        
        // 檢查是否有預定義映射
        if (localStarsMap[extensionId]) {
            const imagePath = localStarsMap[extensionId];
            console.log(`✅ 使用預定義路徑: ${imagePath}, extensionName: ${extensionName || '未知'}`);
            return imagePath;
        }

        // 嘗試自動對應 assets/stars 目錄下的圖片（id 轉底線格式）
        const normalizedId = extensionId.replace(/-/g, '_');
        const autoPath = `${starsBasePath}/${normalizedId}.png`;
        
        console.log(`🔄 生成圖片路徑: ${autoPath}, extensionName: ${extensionName || '未知'}`);
        
        // 圖片載入時的處理會在 img 元素的 load/error 事件中處理
        return autoPath;

        // 若要保留 marketplaceImages fallback，可改為：
        /*
        const marketplaceImages = {
            'ms-python.python': 'https://ms-python.gallerycdn.vsassets.io/extensions/ms-python/python/2023.20.0/1698811377326/Microsoft.VisualStudio.Services.Icons.Default',
            'esbenp.prettier-vscode': 'https://esbenp.gallerycdn.vsassets.io/extensions/esbenp/prettier-vscode/10.1.0/1697404454527/Microsoft.VisualStudio.Services.Icons.Default',
            'ms-vscode.vscode-json': 'https://via.placeholder.com/64x64/2196F3/ffffff?text=JSON',
            'bradlc.vscode-tailwindcss': 'https://bradlc.gallerycdn.vsassets.io/extensions/bradlc/vscode-tailwindcss/0.10.5/1696234567890/Microsoft.VisualStudio.Services.Icons.Default',
            'eamodio.gitlens': 'https://eamodio.gallerycdn.vsassets.io/extensions/eamodio/gitlens/14.6.0/1699127079998/Microsoft.VisualStudio.Services.Icons.Default',
            'ms-vscode.live-server': 'https://via.placeholder.com/64x64/9C27B0/ffffff?text=LS',
            'pkief.material-icon-theme': 'https://pkief.gallerycdn.vsassets.io/extensions/pkief/material-icon-theme/4.32.0/1698765432100/Microsoft.VisualStudio.Services.Icons.Default'
        };
        return marketplaceImages[extensionId] || autoPath || `https://via.placeholder.com/64x64/58a6ff/ffffff?text=${encodeURIComponent(extensionName.charAt(0))}`;
        */
    }

    // 渲染星球到DOM
    renderPlanetsToDOM() {
        const container = document.getElementById('planetsContainer');
        if (!container) {
            console.error('🌌 找不到星球容器 #planetsContainer');
            return;
        }

        console.log(`🌌 開始渲染 ${this.data.planets.length} 個星球到DOM`);

        // 清除現有星球
        const existingPlanets = container.querySelectorAll('.planet');
        existingPlanets.forEach(planet => planet.remove());

        // 創建星球元素
        this.data.planets.forEach((planetData, index) => {
            const planet = this.createPlanetElement(planetData, index);
            container.appendChild(planet);
        });

        // 計算所需高度並調整容器
        const rows = Math.ceil(this.data.planets.length / 5);
        const neededHeight = Math.max(700, rows * 140 + 100); // 每排140px，加上邊距
        container.style.minHeight = `${neededHeight}px`;

        console.log(`🌌 完成渲染 ${this.data.planets.length} 個星球，容器高度: ${neededHeight}px`);
        
        // 更新統計數字
        this.updateStatistics();
        
        // 檢查星球圖片載入狀態（在渲染後延遲執行確保 DOM 已經加載）
        setTimeout(() => this.debugPlanetImages(), 500);
    }
    
    // 檢查並顯示所有星球的圖片載入狀態
    debugPlanetImages() {
        console.log('🔍 開始檢查星球圖片載入狀態...');
        
        const planets = document.querySelectorAll('.planet');
        planets.forEach(planet => {
            const id = planet.id;
            const imgLoader = planet.querySelector('.planet-image-loader');
            const planetImage = planet.querySelector('.planet-image');
            const planetIcon = planet.querySelector('.planet-icon');
            
            if (imgLoader) {
                const imgPath = imgLoader.getAttribute('src');
                console.log(`星球 ${id || 'unknown'} 的圖片路徑: ${imgPath || '未設置'}`);
                
                // 強制檢查圖片載入狀態
                if (imgLoader.complete) {
                    if (imgLoader.naturalWidth === 0 || imgLoader.naturalHeight === 0) {
                        console.error(`❌ 星球 ${id || 'unknown'} 的圖片載入失敗: ${imgPath || '未設置'}`);
                        if (planetImage) planetImage.style.backgroundImage = 'none';
                        if (planetIcon) planetIcon.style.display = 'block';
                    } else {
                        console.log(`✅ 星球 ${id || 'unknown'} 的圖片載入成功: ${imgPath || '未設置'}`);
                        if (planetIcon) planetIcon.style.display = 'none';
                    }
                } else {
                    console.log(`⏳ 星球 ${id || 'unknown'} 的圖片尚未完成載入: ${imgPath || '未設置'}`);
                }
            }
        });
        
        console.log('🔍 星球圖片載入狀態檢查完成');
    }

    // 更新統計數字顯示
    updateStatistics() {
        try {
            // 計算總投票數 (使用 rockets 數據，這是後端實際儲存的投票數)
            const totalVotes = this.data.extensions.reduce((sum, ext) => sum + (ext.rockets || 0), 0);
            console.log('🌌 計算總投票數:', totalVotes, '從擴展:', this.data.extensions.map(ext => ({ id: ext.id, rockets: ext.rockets || 0 })));
            
            // 更新DOM元素
            const totalVotesEl = document.getElementById('totalVotes');
            const totalExtensionsEl = document.getElementById('totalExtensions');
            const onlineUsersEl = document.getElementById('onlineUsers');
            
            if (totalVotesEl) {
                totalVotesEl.textContent = totalVotes.toLocaleString();
            }
            
            if (totalExtensionsEl) {
                totalExtensionsEl.textContent = this.data.extensions.length.toLocaleString();
            }
            
            if (onlineUsersEl) {
                // 模擬線上用戶數
                const onlineUsers = Math.floor(Math.random() * 1000) + 500;
                onlineUsersEl.textContent = onlineUsers.toLocaleString();
            }
            
            console.log(`🌌 統計更新完成: ${totalVotes.toLocaleString()} 票, ${this.data.extensions.length} 個擴充套件`);
            
        } catch (error) {
            console.error('🌌 統計更新失敗:', error);
        }
    }

    // 創建星球元素
    createPlanetElement(planetData, index) {
        const planet = document.createElement('div');
        planet.className = 'planet planet-3d';
        planet.id = `planet-${planetData.id}`;
        
        // 根據視窗大小計算星球大小
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const baseSize = Math.min(viewportWidth, viewportHeight) * 0.08; // 視窗大小的8%
        const size = Math.max(60, Math.min(120, baseSize)); // 限制在60-120px之間
        
        // 計算網格位置，考慮視窗大小
        const cols = Math.floor(viewportWidth / (size + 40)); // 每列星球數量
        const x = 50 + (index % cols) * (size + 40); // 網格佈局X
        const y = 100 + Math.floor(index / cols) * (size + 40); // 網格佈局Y
        
        // 設置 CSS 變量
        planet.style.setProperty('--planet-color', planetData.color);
        planet.style.setProperty('--planet-glow', planetData.color + '80');
        
        planet.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            cursor: pointer;
            transition: transform 0.3s ease;
            transform-style: preserve-3d;
        `;

        // 線上模式：使用 icon，離線模式：使用圖片
        const isOnlineMode = !CONFIG?.OFFLINE_MODE?.ENABLED;
        const iconSize = Math.max(20, size * 0.3);

        // 添加星球內容（圖片和 icon 同時存在，圖片載入失敗自動隱藏）
        planet.innerHTML = `
            <!-- 發光環（透明，只有邊緣微光） -->
            <div class="planet-gleam-ring" style="
                position: absolute;
                top: -10px;
                left: -10px;
                width: calc(100% + 20px);
                height: calc(100% + 20px);
                border-radius: 50%;
                border: 1px solid ${planetData.color}30;
                box-shadow: 0 0 15px ${planetData.color}40;
                animation: rotate-gleam 3s linear infinite;
                pointer-events: none;
                z-index: 1;
                background: none;
            "></div>
            <!-- 星球本體 - 完全透明背景，只有邊緣微光 -->
            <div class="planet-sphere" style="
                position: relative;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: none;
                box-shadow: 0 0 12px ${planetData.color}30;
                overflow: hidden;
                z-index: 2;
            ">
                <!-- 移除星球表面紋理，完全依賴圖片或 icon -->
                <!-- Extension 圖片作為背景 - 沒有任何背景顏色 -->
                <div class="planet-image" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: transparent;
                    background-image: url('${planetData.extension.image || ''}');
                    background-size: cover;
                    background-position: center;
                    opacity: 1;
                    z-index: 4;
                "></div>
                
                <!-- Extension 圖標 (在圖片上層) -->
                <div class="planet-icon" id="icon-${planetData.id}" style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: ${iconSize}px;
                    color: white;
                    text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
                    z-index: 6;
                    animation: float-icon 3s ease-in-out infinite;
                    display: block; /* 預設顯示，成功載入圖片時才隱藏 */
                ">${planetData.extension.icon || '⭐'}</div>
                
                <!-- 檢查圖片是否存在的隱藏圖片（事件會在JS中處理） -->
                <img src="${planetData.extension.image || ''}" alt="" style="display:none;" class="planet-image-loader" />
                <!-- Extension 名稱 (在星球底部) -->
                <div class="planet-name" style="
                    position: absolute;
                    bottom: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: ${Math.max(10, size * 0.12)}px;
                    color: #8b949e;
                    text-align: center;
                    white-space: nowrap;
                    pointer-events: none;
                    text-shadow: 0 0 3px rgba(0,0,0,0.8);
                ">${planetData.name}</div>
            </div>
            <!-- 星球資訊卡片 -->
            <div class="planet-info" style="
                position: absolute;
                bottom: -80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(22, 27, 34, 0.95);
                border: 1px solid ${planetData.color};
                border-radius: 12px;
                padding: 15px;
                min-width: 180px;
                text-align: center;
                backdrop-filter: blur(10px);
                opacity: 0;
                transition: all 0.3s ease;
                pointer-events: none;
                box-shadow: 0 0 20px ${planetData.color}40;
                z-index: 100;
            ">
                <div class="name" style="
                    font-size: 1rem;
                    font-weight: 600;
                    color: #f0f6fc;
                    margin-bottom: 6px;
                ">${planetData.name}</div>
                <div class="votes" style="
                    font-size: 0.9rem;
                    color: ${planetData.color};
                    margin-bottom: 8px;
                ">${planetData.extension.rockets || 0} 票</div>
                <div class="description" style="
                    font-size: 0.75rem;
                    color: #8b949e;
                ">${planetData.description}</div>
            </div>
        `;

        // 添加 CSS 動畫到頁面（如果還沒有的話）
        this.addPlanetStyles();

        // 設置圖片載入事件處理
        const imageLoader = planet.querySelector('.planet-image-loader');
        const planetImage = planet.querySelector('.planet-image');
        const planetIcon = planet.querySelector('.planet-icon');
        
        if (imageLoader && planetImage && planetIcon) {
            // 圖片載入成功
            imageLoader.addEventListener('load', () => {
                planetIcon.style.display = 'none';
                console.log(`🌌 圖片載入成功: ${planetData.extension.image || '未定義圖片路徑'}`);
            });
            
            // 圖片載入失敗
            imageLoader.addEventListener('error', () => {
                planetImage.style.backgroundImage = 'none';
                planetImage.style.background = 'transparent';
                planetIcon.style.display = 'block';
                console.error(`🌌 圖片載入失敗: ${planetData.extension.image || '未定義圖片路徑'}`);
            });
        }

        // 添加懸停效果
        planet.addEventListener('mouseenter', () => {
            planet.style.transform = 'translateY(-30px) rotateY(10deg) scale(1.15)';
            const info = planet.querySelector('.planet-info');
            if (info) {
                info.style.opacity = '1';
                info.style.bottom = '-70px';
            }
        });

        planet.addEventListener('mouseleave', () => {
            planet.style.transform = 'translateY(0) rotateY(0deg) scale(1)';
            const info = planet.querySelector('.planet-info');
            if (info) {
                info.style.opacity = '0';
                info.style.bottom = '-80px';
            }
        });

        // 添加點擊事件
        planet.addEventListener('click', (event) => {
            // 創建星球點擊落地效果
            this.createPlanetClickEffect(planet, event);
            this.handlePlanetSelection(planetData);
        });

        return planet;
    }

    // 添加星球相關的 CSS 樣式
    addPlanetStyles() {
        // 檢查是否已經添加過樣式
        if (document.getElementById('planet-styles')) return;

        const styleElement = document.createElement('style');
        styleElement.id = 'planet-styles';
        styleElement.innerHTML = `
            @keyframes rotate-gleam {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes float-icon {
                0%, 100% { transform: translate(-50%, -50%); }
                50% { transform: translate(-50%, -60%); }
            }
            
            .planet-3d:hover .planet-sphere {
                box-shadow: 0 0 25px var(--planet-color);
            }
            
            .planet-sphere {
                background: transparent !important;
            }
            
            .planet-image {
                background-color: transparent !important;
            }
        `;
        
        document.head.appendChild(styleElement);
    }

    // 生成星球位置
    generatePlanetPosition(index) {
        const angle = (index / this.data.extensions.length) * Math.PI * 2;
        const radius = 300 + Math.random() * 200;
        const height = (Math.random() - 0.5) * 100;
        
        return {
            x: Math.cos(angle) * radius,
            y: height,
            z: Math.sin(angle) * radius
        };
    }

    // 初始化動畫系統
    initAnimations() {
        console.log('🌌 檢查動畫類是否可用...');
        console.log('🌌 AnimationController 可用:', typeof AnimationController !== 'undefined');
        console.log('🌌 window.animationController 可用:', typeof window.animationController !== 'undefined');
        
        // 使用CSS動畫代替JavaScript動畫，較為順暢
        if (typeof AnimationController !== 'undefined') {
            this.animations = new AnimationController();
            window.planetAnimations = this.animations;
            console.log('🌌 動畫系統初始化成功');
        } else if (typeof window.animationController !== 'undefined') {
            this.animations = window.animationController;
            window.planetAnimations = this.animations;
            console.log('🌌 使用全域動畫控制器');
        } else {
            console.warn('🌌 動畫系統不可用');
        }
    }

    // 初始化視圖系統
    initViews() {
        console.log('🌌 檢查視圖類是否可用...');
        console.log('🌌 PlanetViews 可用:', typeof PlanetViews !== 'undefined');
        
        if (typeof PlanetViews !== 'undefined') {
            this.views = new PlanetViews();
            window.planetViews = this.views;
            console.log('🌌 視圖系統初始化成功');
        } else {
            console.warn('🌌 視圖系統不可用');
        }
    }

    // 設置全域事件監聽器
    setupGlobalEventListeners() {
        // 視窗載入和關閉事件
        window.addEventListener('beforeunload', () => {
            this.saveUserSettings();
        });

        // 能見度變化（頁面切換時暫停動畫以節省資源）
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });

        // 錯誤處理
        window.addEventListener('error', (e) => {
            console.error('全域錯誤:', e.error);
            this.handleError(e.error);
        });

        // 自定義事件監聽
        document.addEventListener('planet:selected', (e) => {
            this.handlePlanetSelection(e.detail);
        });

        document.addEventListener('extension:download', (e) => {
            this.handleExtensionDownload(e.detail);
        });
    }

    // 載入用戶設定
    loadUserSettings() {
        try {
            const savedSettings = localStorage.getItem('planetDisplaySettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                Object.assign(this.config.display, settings);
                
                if (this.animations) {
                    this.animations.applySettings(settings);
                }
            }
        } catch (error) {
            console.warn('載入用戶設定失敗:', error);
        }
    }

    // 儲存用戶設定
    saveUserSettings() {
        try {
            const settings = {
                animations: this.config.display.animations,
                planetCount: this.config.display.planetCount,
                showStars: this.config.display.showStars,
                showMeteors: this.config.display.showMeteors
            };
            localStorage.setItem('planetDisplaySettings', JSON.stringify(settings));
        } catch (error) {
            console.warn('儲存用戶設定失敗:', error);
        }
    }

    // 顯示載入畫面
    showLoadingScreen() {
        const loadingHTML = `
            <div id="loading-screen" class="loading-screen">
                <div class="loading-content">
                    <div class="loading-spinner">
                        <div class="planet-loader"></div>
                    </div>
                    <h2 class="loading-title">探索宇宙中...</h2>
                    <p class="loading-text">正在載入擴充套件星球</p>
                    <div class="loading-progress">
                        <div class="progress-bar" id="loading-progress-bar"></div>
                    </div>
                </div>
                <div class="loading-stars" id="loading-stars"></div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
        
        // 模擬載入進度
        this.simulateLoadingProgress();
    }

    // 模擬載入進度
    simulateLoadingProgress() {
        const progressBar = document.getElementById('loading-progress-bar');
        if (!progressBar) return;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressBar.style.width = `${progress}%`;
        }, 200);
    }

    // 隱藏載入畫面
    hideLoadingScreen() {
        console.log('🌌 隱藏載入畫面');
        
        // 隱藏動態創建的載入畫面
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            console.log('🌌 找到動態載入畫面，正在隱藏...');
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
                console.log('🌌 動態載入畫面已移除');
            }, 500);
        }
        
        // 隱藏 HTML 中的載入指示器
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            console.log('🌌 找到 HTML 載入指示器，正在隱藏...');
            loadingIndicator.style.display = 'none';
            console.log('🌌 HTML 載入指示器已隱藏');
        } else {
            console.log('🌌 未找到 HTML 載入指示器');
        }
        
        // 強制隱藏所有可能的載入元素
        const allLoadingElements = document.querySelectorAll('.loading-indicator, .loading-screen, [id*="loading"]');
        console.log('🌌 找到', allLoadingElements.length, '個載入相關元素');
        allLoadingElements.forEach((element, index) => {
            element.style.display = 'none';
            console.log('🌌 隱藏載入元素', index + 1, ':', element.id || element.className);
        });
    }

    // 顯示錯誤畫面
    showErrorScreen(message) {
        const errorHTML = `
            <div id="error-screen" class="error-screen">
                <div class="error-content">
                    <div class="error-icon">🌌</div>
                    <h2 class="error-title">星球連線中斷</h2>
                    <p class="error-message">${message}</p>
                    <div class="error-actions">
                        <button class="btn btn-primary" onclick="location.reload()">
                            重新連線
                        </button>
                        <button class="btn btn-secondary" onclick="planetApp.startOfflineMode()">
                            離線模式
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.innerHTML = errorHTML;
    }

    // 開始離線模式
    startOfflineMode() {
        console.log('切換到離線模式');
        this.config.local.enabled = true;
        this.loadMockData();
        document.getElementById('error-screen').remove();
        this.init();
    }

    // 暫停動畫
    pauseAnimations() {
        if (this.animations) {
            this.animations.pause();
        }
    }

    // 恢復動畫
    resumeAnimations() {
        if (this.animations) {
            this.animations.resume();
        }
    }

    // 處理星球選擇
    handlePlanetSelection(planetData) {
        console.log('選擇星球:', planetData);
        
        if (this.views) {
            this.views.switchView('extension', planetData.extension);
        }
    }

    // 處理擴充套件下載
    handleExtensionDownload(extensionData) {
        console.log('下載擴充套件:', extensionData);
        
        // 記錄下載統計
        this.trackDownload(extensionData.id);
        
        // 顯示下載提示
        this.showNotification(`開始下載 ${extensionData.name}`, 'success');
    }

    // 追蹤下載統計
    async trackDownload(extensionId) {
        try {
            await this.api.trackDownload(extensionId);
        } catch (error) {
            console.warn('下載統計記錄失敗:', error);
        }
    }

    // 顯示通知
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // 自動移除
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, duration);
        }

        // 淡入動畫
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
    }

    // 處理錯誤
    handleError(error) {
        console.error('應用程式錯誤:', error);
        this.showNotification('發生錯誤，請重試', 'error');
    }

    // 觸發自定義事件
    dispatchEvent(eventName, detail = null) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    // 獲取擴充套件數據
    getExtensions() {
        return this.data.extensions;
    }

    // 獲取星球數據
    getPlanets() {
        return this.data.planets;
    }

    // 獲取統計數據
    getStatistics() {
        return this.data.statistics;
    }

    // 搜尋擴充套件
    searchExtensions(query, category = null) {
        let results = this.data.extensions;
        
        if (query) {
            const searchQuery = query.toLowerCase();
            results = results.filter(ext => 
                ext.name.toLowerCase().includes(searchQuery) ||
                ext.description.toLowerCase().includes(searchQuery) ||
                ext.tags.some(tag => tag.toLowerCase().includes(searchQuery))
            );
        }
        
        if (category) {
            results = results.filter(ext => ext.category === category);
        }
        
        return results;
    }

    // 獲取推薦擴充套件
    getRecommendedExtensions(limit = 5) {
        return this.data.extensions
            .sort((a, b) => (b.rating * b.downloads) - (a.rating * a.downloads))
            .slice(0, limit);
    }

    // 獲取熱門擴充套件
    getPopularExtensions(limit = 10) {
        return this.data.extensions
            .sort((a, b) => b.downloads - a.downloads)
            .slice(0, limit);
    }

    // 檢查初始化狀態
    isReady() {
        return this.isInitialized;
    }

    // 重新載入數據
    async reload() {
        this.showLoadingScreen();
        await this.loadData();
        
        if (this.animations) {
            this.animations.updatePlanets(this.data.planets);
        }
        
        this.hideLoadingScreen();
        this.showNotification('數據已更新', 'success');
    }

    // 重設應用程式
    reset() {
        // 清除本地存儲
        localStorage.removeItem('planetDisplaySettings');
        
        // 重新載入頁面
        location.reload();
    }

    // 創建星球點擊落地效果
    createPlanetClickEffect(planetElement, event) {
        const rect = planetElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 星球縮放和發光效果
        planetElement.style.transition = 'all 0.3s ease-out';
        planetElement.style.transform += ' scale(1.1)';
        planetElement.style.filter = 'brightness(1.3)';
        
        // 創建點擊波紋效果
        this.createClickRipple(centerX, centerY);
        
        // 創建點擊粒子效果
        this.createClickParticles(centerX, centerY);
        
        // 恢復星球狀態
        setTimeout(() => {
            planetElement.style.transform = planetElement.style.transform.replace(' scale(1.1)', '');
            planetElement.style.filter = 'brightness(1)';
        }, 300);
    }

    // 創建點擊波紋效果
    createClickRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            border: 2px solid rgba(88, 166, 255, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 1000;
            animation: clickRipple 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // 創建點擊粒子效果
    createClickParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const angle = (360 / 8) * i;
            const distance = 25 + Math.random() * 15;
            const finalX = x + Math.cos(angle * Math.PI / 180) * distance;
            const finalY = y + Math.sin(angle * Math.PI / 180) * distance;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 5px;
                height: 5px;
                background: linear-gradient(45deg, #58a6ff, #007acc);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 999;
                box-shadow: 0 0 6px #58a6ff;
                transition: all 0.4s ease-out;
            `;
            
            document.body.appendChild(particle);
            
            // 粒子飛散動畫
            setTimeout(() => {
                particle.style.left = finalX + 'px';
                particle.style.top = finalY + 'px';
                particle.style.opacity = '0';
                particle.style.transform = 'translate(-50%, -50%) scale(0)';
            }, 50);
            
            setTimeout(() => {
                particle.remove();
            }, 450);
        }
    }

    // 開始定期數據刷新
    startDataRefresh() {
        console.log('🔄 啟動數據自動刷新 (每30秒)');
        
        // 設置定期刷新投票數據
        this.refreshInterval = setInterval(async () => {
            try {
                console.log('🔄 自動刷新投票數據...');
                
                // 重新載入擴展數據
                const extensionsData = await this.api.getExtensions();
                const newExtensions = Array.isArray(extensionsData) ? extensionsData : (extensionsData.data || []);
                
                // 檢查是否有變化
                let hasChanges = false;
                for (let i = 0; i < newExtensions.length; i++) {
                    const newExt = newExtensions[i];
                    const oldExt = this.data.extensions.find(ext => ext.id === newExt.id);
                    if (oldExt && oldExt.rockets !== newExt.rockets) {
                        hasChanges = true;
                        break;
                    }
                }
                
                if (hasChanges) {
                    console.log('🔄 檢測到投票數變化，更新顯示...');
                    
                    // 更新數據
                    this.data.extensions = newExtensions;
                    
                    // 重新生成星球數據（包含最新投票數）
                    this.generatePlanets();
                    
                    // 更新統計數字
                    this.updateStatistics();
                    
                    console.log('🔄 投票數據更新完成');
                } else {
                    console.log('🔄 投票數據無變化');
                }
                
            } catch (error) {
                console.error('🔄 自動刷新失敗:', error);
            }
        }, 30000); // 每30秒刷新一次
        
        // 頁面卸載時清理定時器
        window.addEventListener('beforeunload', () => {
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
                console.log('🔄 已清理數據刷新定時器');
            }
        });
    }
}

// 立即導出到全域
window.PlanetApp = PlanetApp;

} // 結束 if (typeof window.PlanetApp === 'undefined') 條件區塊

// 全域應用程式實例
let planetApp;

// 確保 PlanetApp 被正確導出到全域範圍
if (typeof window.PlanetApp !== 'undefined') {
    console.log('🌌 PlanetApp 類已導出到全域範圍');
} else {
    console.error('🌌 PlanetApp 類定義失敗');
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.PlanetApp !== 'undefined') {
        console.log('🌌 DOMContentLoaded: 創建 PlanetApp 實例');
        planetApp = new window.PlanetApp();
        window.planetApp = planetApp;
    } else {
        console.error('🌌 DOMContentLoaded: PlanetApp 類不可用');
    }
});

// 導出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.PlanetApp;
} else if (typeof window.PlanetApp !== 'undefined') {
    console.log('🌌 PlanetApp 模組導出完成');
}
