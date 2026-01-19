// 星球展示頁面視圖管理器
if (typeof PlanetViews === 'undefined') {
    class PlanetViews {
    constructor() {
        this.currentView = 'welcome';
        this.views = new Map();
        this.transitionDuration = 1000;
        this.isTransitioning = false;
        
        this.init();
    }

    // 初始化視圖系統
    init() {
        this.registerViews();
        this.setupEventListeners();
        this.showInitialView();
    }

    // 註冊所有視圖
    registerViews() {
        // 歡迎視圖
        this.views.set('welcome', {
            name: '歡迎',
            template: this.createWelcomeView,
            onEnter: this.onWelcomeEnter.bind(this),
            onExit: this.onWelcomeExit.bind(this)
        });

        // 星球展示視圖
        this.views.set('planets', {
            name: '星球展示', 
            template: this.createPlanetsView,
            onEnter: this.onPlanetsEnter.bind(this),
            onExit: this.onPlanetsExit.bind(this)
        });

        // 擴充套件詳情視圖
        this.views.set('extension', {
            name: '擴充套件詳情',
            template: this.createExtensionView,
            onEnter: this.onExtensionEnter.bind(this),
            onExit: this.onExtensionExit.bind(this)
        });

        // 統計視圖
        this.views.set('stats', {
            name: '統計資訊',
            template: this.createStatsView,
            onEnter: this.onStatsEnter.bind(this),
            onExit: this.onStatsExit.bind(this)
        });

        // 設定視圖
        this.views.set('settings', {
            name: '顯示設定',
            template: this.createSettingsView,
            onEnter: this.onSettingsEnter.bind(this),
            onExit: this.onSettingsExit.bind(this)
        });
    }

    // 設置事件監聽器
    setupEventListeners() {
        // 鍵盤控制
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });

        // 觸控控制
        this.setupTouchControls();

        // 視窗大小變化
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // 全螢幕變化
        document.addEventListener('fullscreenchange', () => {
            this.handleFullscreenChange();
        });
    }

    // 設置觸控控制
    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // 滑動手勢偵測
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousView();
                } else {
                    this.nextView();
                }
            }
        });
    }

    // 鍵盤事件處理
    handleKeyPress(e) {
        if (this.isTransitioning) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousView();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextView();
                break;
            case 'Home':
                e.preventDefault();
                this.switchView('welcome');
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.handleEnterKey();
                break;
            case 'Escape':
                e.preventDefault();
                this.handleEscapeKey();
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 's':
            case 'S':
                e.preventDefault();
                this.switchView('settings');
                break;
        }
    }

    // 切換視圖
    async switchView(viewName, data = null) {
        if (this.isTransitioning || !this.views.has(viewName)) return;
        
        if (this.currentView === viewName) return;

        this.isTransitioning = true;

        try {
            // 執行當前視圖的退出邏輯
            const currentViewData = this.views.get(this.currentView);
            if (currentViewData && currentViewData.onExit) {
                await currentViewData.onExit();
            }

            // 視圖轉場動畫
            await this.performTransition(this.currentView, viewName);

            // 更新當前視圖
            this.currentView = viewName;

            // 載入新視圖
            const newViewData = this.views.get(viewName);
            if (newViewData) {
                const content = newViewData.template(data);
                this.renderView(content);
                
                if (newViewData.onEnter) {
                    await newViewData.onEnter(data);
                }
            }

            // 更新導航狀態
            this.updateNavigation();

        } catch (error) {
            console.error('視圖切換失敗:', error);
        } finally {
            this.isTransitioning = false;
        }
    }

    // 執行轉場動畫
    async performTransition(fromView, toView) {
        const container = document.getElementById('main-container');
        if (!container) return;

        // 淡出效果
        container.style.transition = `opacity ${this.transitionDuration / 2}ms ease-out`;
        container.style.opacity = '0';

        // 等待淡出完成
        await new Promise(resolve => setTimeout(resolve, this.transitionDuration / 2));

        // 淡入效果
        container.style.opacity = '1';
        
        // 等待淡入完成
        await new Promise(resolve => setTimeout(resolve, this.transitionDuration / 2));
        
        // 清除轉場樣式
        container.style.transition = '';
    }

    // 渲染視圖
    renderView(content) {
        const container = document.getElementById('main-container');
        if (container) {
            container.innerHTML = content;
        }
    }

    // 顯示初始視圖
    showInitialView() {
        const urlParams = new URLSearchParams(window.location.search);
        const initialView = urlParams.get('view') || 'welcome';
        this.switchView(initialView);
    }

    // 上一個視圖
    previousView() {
        const viewNames = Array.from(this.views.keys());
        const currentIndex = viewNames.indexOf(this.currentView);
        const previousIndex = currentIndex > 0 ? currentIndex - 1 : viewNames.length - 1;
        this.switchView(viewNames[previousIndex]);
    }

    // 下一個視圖
    nextView() {
        const viewNames = Array.from(this.views.keys());
        const currentIndex = viewNames.indexOf(this.currentView);
        const nextIndex = currentIndex < viewNames.length - 1 ? currentIndex + 1 : 0;
        this.switchView(viewNames[nextIndex]);
    }

    // 處理 Enter 鍵
    handleEnterKey() {
        switch (this.currentView) {
            case 'welcome':
                this.switchView('planets');
                break;
            case 'planets':
                // 選擇當前聚焦的星球
                this.selectFocusedPlanet();
                break;
        }
    }

    // 處理 Escape 鍵
    handleEscapeKey() {
        if (this.currentView !== 'welcome') {
            this.switchView('welcome');
        }
    }

    // 切換全螢幕
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    // 創建歡迎視圖
    createWelcomeView() {
        return `
            <div class="welcome-view">
                <div class="welcome-content">
                    <h1 class="welcome-title">探索擴充套件星球</h1>
                    <p class="welcome-subtitle">發現適合你的開發工具</p>
                    <div class="welcome-actions">
                        <button class="btn btn-primary btn-lg" onclick="planetViews.switchView('planets')">
                            開始探索
                        </button>
                    </div>
                    <div class="welcome-hints">
                        <div class="hint">
                            <span class="hint-key">Enter</span>
                            <span class="hint-text">開始探索</span>
                        </div>
                        <div class="hint">
                            <span class="hint-key">F</span>
                            <span class="hint-text">全螢幕</span>
                        </div>
                        <div class="hint">
                            <span class="hint-key">S</span>
                            <span class="hint-text">設定</span>
                        </div>
                    </div>
                </div>
                <div class="welcome-background">
                    <div class="stars-container" id="welcome-stars"></div>
                </div>
            </div>
        `;
    }

    // 創建星球展示視圖
    createPlanetsView(data) {
        return `
            <div class="planets-view">
                <div class="universe-container" id="universe">
                    <div class="stars-layer" id="stars-layer"></div>
                    <div class="meteors-layer" id="meteors-layer"></div>
                    <div class="planets-layer" id="planets-layer"></div>
                </div>
                <div class="ui-overlay">
                    <div class="navigation-hints">
                        <div class="hint">
                            <span class="hint-key">←→</span>
                            <span class="hint-text">導航</span>
                        </div>
                        <div class="hint">
                            <span class="hint-key">Enter</span>
                            <span class="hint-text">選擇</span>
                        </div>
                        <div class="hint">
                            <span class="hint-key">Esc</span>
                            <span class="hint-text">返回</span>
                        </div>
                    </div>
                    <div class="planet-info" id="planet-info">
                        <div class="info-content">
                            <h3 class="planet-name">選擇一個星球</h3>
                            <p class="planet-description">探索不同類型的擴充套件</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 創建擴充套件詳情視圖
    createExtensionView(extensionData) {
        if (!extensionData) {
            return '<div class="error-view">找不到擴充套件資料</div>';
        }

        return `
            <div class="extension-view">
                <div class="extension-hero">
                    <div class="extension-image">
                        <img src="${extensionData.image || '/assets/placeholder.jpg'}" 
                             alt="${extensionData.name}">
                    </div>
                    <div class="extension-info">
                        <h1 class="extension-name">${extensionData.name}</h1>
                        <p class="extension-description">${extensionData.description}</p>
                        <div class="extension-stats">
                            <div class="stat">
                                <span class="stat-value">${extensionData.downloads?.toLocaleString() || '0'}</span>
                                <span class="stat-label">下載數</span>
                            </div>
                            <div class="stat">
                                <span class="stat-value">★ ${extensionData.rating || '0.0'}</span>
                                <span class="stat-label">評分</span>
                            </div>
                        </div>
                        <div class="extension-tags">
                            ${extensionData.tags?.map(tag => `<span class="tag">${tag}</span>`).join('') || ''}
                        </div>
                    </div>
                </div>
                <div class="extension-actions">
                    <button class="btn btn-primary" onclick="planetViews.downloadExtension('${extensionData.id}')">
                        下載
                    </button>
                    <button class="btn btn-secondary" onclick="planetViews.switchView('planets')">
                        返回星球
                    </button>
                </div>
            </div>
        `;
    }

    // 創建統計視圖
    createStatsView() {
        return `
            <div class="stats-view">
                <h2>星球統計</h2>
                <div class="stats-grid" id="stats-grid">
                    <div class="stat-card">
                        <h3>總擴充套件數</h3>
                        <div class="stat-value" id="total-extensions">載入中...</div>
                    </div>
                    <div class="stat-card">
                        <h3>總下載數</h3>
                        <div class="stat-value" id="total-downloads">載入中...</div>
                    </div>
                    <div class="stat-card">
                        <h3>熱門分類</h3>
                        <div class="stat-value" id="popular-category">載入中...</div>
                    </div>
                </div>
                <div class="stats-actions">
                    <button class="btn btn-secondary" onclick="planetViews.switchView('welcome')">
                        返回首頁
                    </button>
                </div>
            </div>
        `;
    }

    // 創建設定視圖
    createSettingsView() {
        return `
            <div class="settings-view">
                <h2>顯示設定</h2>
                <div class="settings-form">
                    <div class="setting-group">
                        <label>動畫效果</label>
                        <select id="animation-setting">
                            <option value="full">完整動畫</option>
                            <option value="reduced">減少動畫</option>
                            <option value="off">關閉動畫</option>
                        </select>
                    </div>
                    <div class="setting-group">
                        <label>星球數量</label>
                        <input type="range" id="planet-count" min="5" max="50" value="20">
                        <span id="planet-count-value">20</span>
                    </div>
                    <div class="setting-group">
                        <label>背景星星</label>
                        <input type="checkbox" id="show-stars" checked>
                    </div>
                    <div class="setting-group">
                        <label>流星效果</label>
                        <input type="checkbox" id="show-meteors" checked>
                    </div>
                </div>
                <div class="settings-actions">
                    <button class="btn btn-primary" onclick="planetViews.saveSettings()">
                        儲存設定
                    </button>
                    <button class="btn btn-secondary" onclick="planetViews.switchView('welcome')">
                        返回
                    </button>
                </div>
            </div>
        `;
    }

    // 視圖進入事件
    async onWelcomeEnter() {
        // 初始化歡迎頁面的星空背景
        if (window.planetAnimations) {
            const starsContainer = document.getElementById('welcome-stars');
            if (starsContainer) {
                window.planetAnimations.createStars(starsContainer, 100);
            }
        }
    }

    async onWelcomeExit() {
        // 清理歡迎頁面資源
    }

    async onPlanetsEnter() {
        // 初始化星球展示
        if (window.planetAnimations) {
            await window.planetAnimations.initializeUniverse();
        }
    }

    async onPlanetsExit() {
        // 清理星球展示資源
    }

    async onExtensionEnter(data) {
        // 載入擴充套件詳細資料
        if (data && data.id) {
            try {
                const api = new PlanetAPI();
                const extensionData = await api.getExtensionDetails(data.id);
                // 更新視圖內容
            } catch (error) {
                console.error('載入擴充套件詳情失敗:', error);
            }
        }
    }

    async onExtensionExit() {
        // 清理擴充套件詳情資源
    }

    async onStatsEnter() {
        // 載入統計資料
        this.loadStatsData();
    }

    async onStatsExit() {
        // 清理統計資源
    }

    async onSettingsEnter() {
        // 載入目前設定
        this.loadCurrentSettings();
    }

    async onSettingsExit() {
        // 清理設定資源
    }

    // 載入統計資料
    async loadStatsData() {
        try {
            const api = new PlanetAPI();
            const stats = await api.getStatistics();
            
            document.getElementById('total-extensions').textContent = stats.totalExtensions || '0';
            document.getElementById('total-downloads').textContent = (stats.totalDownloads || 0).toLocaleString();
            document.getElementById('popular-category').textContent = stats.popularCategory || '未知';
        } catch (error) {
            console.error('載入統計資料失敗:', error);
        }
    }

    // 載入目前設定
    loadCurrentSettings() {
        const settings = PlanetConfig.display;
        
        document.getElementById('animation-setting').value = settings.animations || 'full';
        document.getElementById('planet-count').value = settings.planetCount || 20;
        document.getElementById('show-stars').checked = settings.showStars !== false;
        document.getElementById('show-meteors').checked = settings.showMeteors !== false;
        
        // 更新計數器顯示
        document.getElementById('planet-count-value').textContent = settings.planetCount || 20;
        
        // 綁定變更事件
        document.getElementById('planet-count').addEventListener('input', (e) => {
            document.getElementById('planet-count-value').textContent = e.target.value;
        });
    }

    // 儲存設定
    saveSettings() {
        const settings = {
            animations: document.getElementById('animation-setting').value,
            planetCount: parseInt(document.getElementById('planet-count').value),
            showStars: document.getElementById('show-stars').checked,
            showMeteors: document.getElementById('show-meteors').checked
        };

        // 儲存到本地存儲
        localStorage.setItem('planetDisplaySettings', JSON.stringify(settings));
        
        // 更新全域配置
        Object.assign(PlanetConfig.display, settings);
        
        // 應用設定
        if (window.planetAnimations) {
            window.planetAnimations.applySettings(settings);
        }
        
        alert('設定已儲存！');
    }

    // 更新導航狀態
    updateNavigation() {
        // 更新 URL
        const url = new URL(window.location);
        url.searchParams.set('view', this.currentView);
        window.history.replaceState({}, '', url);
    }

    // 處理視窗大小變化
    handleResize() {
        // 響應式布局調整
        if (window.planetAnimations) {
            window.planetAnimations.handleResize();
        }
    }

    // 處理全螢幕變化
    handleFullscreenChange() {
        const isFullscreen = !!document.fullscreenElement;
        document.body.classList.toggle('fullscreen', isFullscreen);
    }

    // 選擇聚焦的星球
    selectFocusedPlanet() {
        if (window.planetAnimations) {
            const focusedPlanet = window.planetAnimations.getFocusedPlanet();
            if (focusedPlanet) {
                this.switchView('extension', focusedPlanet);
            }
        }
    }

    // 下載擴充套件
    downloadExtension(extensionId) {
        // 實作下載邏輯
        console.log('下載擴充套件:', extensionId);
        alert('下載功能開發中...');
    }

    // 獲取當前視圖
    getCurrentView() {
        return this.currentView;
    }

    // 檢查是否正在轉場
    isTransitionActive() {
        return this.isTransitioning;
    }
}

// 導出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlanetViews;
} else {
    window.PlanetViews = PlanetViews;
}
}
