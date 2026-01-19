// 安全地轉義文本內容 - 全局函數
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;');
}

// 全局提示訊息函數
function showToast(message, type = 'info') {
    // 簡單的提示訊息
    const toast = document.createElement('div');
    toast.className = `toast ${type}-toast`;
    toast.textContent = message;
    
    const styles = {
        info: {
            background: '#0366d6',
            color: 'white'
        },
        error: {
            background: '#f85149',
            color: 'white'
        },
        warning: {
            background: '#fb8500',
            color: 'white'
        }
    };
    
    const styleConfig = styles[type] || styles.info;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${styleConfig.background};
        color: ${styleConfig.color};
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
        font-size: 14px;
        max-width: 300px;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 主應用程式入口點
class UserInterfaceApp {
    constructor() {
        this.contentConfig = null;
        this.quizData = null;
        this.init();
    }

    async init() {
        // 等待 DOM 完全載入
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        // 載入內容配置
        await this.loadContentConfig();
        
        // 初始化應用
        this.start();
    }

    async loadContentConfig() {
        try {
            // 載入內容配置
            this.contentConfig = await loadContentConfig();
            window.CONTENT_CONFIG = this.contentConfig;
            
            if (this.contentConfig) {
                // 更新頁面標題和文案
                this.updatePageContent();
                
            } else {
                console.warn('⚠️ Using fallback content');
            }
        } catch (error) {
            console.error('❌ Failed to load content config:', error);
        }
    }

    updatePageContent() {
        if (!this.contentConfig) return;

        // 更新頁面標題
        const titleElement = document.querySelector('.hero-title');
        if (titleElement && this.contentConfig.app?.title) {
            titleElement.textContent = this.contentConfig.app.title;
        }

        // 更新副標題
        const subtitleElement = document.querySelector('.hero-subtitle');
        if (subtitleElement && this.contentConfig.app?.subtitle) {
            subtitleElement.innerHTML = this.contentConfig.app.subtitle;
        }

        // 更新開始按鈕
        const startButton = document.querySelector('.cta-button');
        if (startButton && this.contentConfig.app?.startButton) {
            startButton.textContent = this.contentConfig.app.startButton;
        }

        // 更新功能特色
        const features = document.querySelectorAll('.feature-card');
        if (this.contentConfig.features && features.length > 0) {
            this.contentConfig.features.forEach((feature, index) => {
                if (features[index]) {
                    const icon = features[index].querySelector('.feature-icon');
                    const title = features[index].querySelector('.feature-title');
                    const desc = features[index].querySelector('.feature-description');
                    
                    if (icon) icon.textContent = feature.icon;
                    if (title) title.textContent = feature.title;
                    if (desc) desc.textContent = feature.description;
                }
            });
        }

        // 更新統計數據
        const stats = document.querySelectorAll('.stat-card');
        if (this.contentConfig.stats && stats.length > 0) {
            this.contentConfig.stats.forEach((stat, index) => {
                if (stats[index]) {
                    const number = stats[index].querySelector('.stat-number');
                    const label = stats[index].querySelector('.stat-label');
                    
                    if (number) number.textContent = stat.number;
                    if (label) label.textContent = stat.label;
                }
            });
        }
    }

    start() {
        
        // 初始化錯誤處理
        this.setupErrorHandling();
        
        // 初始化載入畫面
        this.initializeLoadingScreen();
        
        // 預載入關鍵資源
        this.preloadResources();
        
        // 設置性能監控
        this.setupPerformanceMonitoring();
        
        // 設置滾動體驗優化
        this.setupScrollExperience();
        
        // 應用程式就緒
        this.onReady();
    }

    setupScrollExperience() {
        // 優化滾動體驗
        let scrollTimer = null;
        
        // 平滑滾動到指定元素
        window.scrollToElement = (elementId, offset = 0) => {
            const element = document.getElementById(elementId);
            if (!element) return;
            
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        };
        
        // 平滑滾動到頂部
        window.scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
        
        // 優化選項卡片的滾動體驗
        document.addEventListener('click', (e) => {
            if (e.target.closest('.option-card')) {
                const card = e.target.closest('.option-card');
                
                // 清除之前的計時器
                if (scrollTimer) {
                    clearTimeout(scrollTimer);
                }
                
                // 延遲滾動，確保選擇動畫完成
                scrollTimer = setTimeout(() => {
                    const currentQuestion = card.closest('.quiz-page');
                    if (currentQuestion) {
                        // 輕微向上滾動，確保問題標題可見
                        const questionTitle = currentQuestion.querySelector('.question-title');
                        if (questionTitle) {
                            questionTitle.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                                inline: 'nearest'
                            });
                        }
                    }
                }, 300);
            }
        });
        
        // 改善移動端觸摸滾動
        if ('ontouchstart' in window) {
            document.body.style.webkitOverflowScrolling = 'touch';
        }
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('🚨 Global Error:', event.error);
            this.handleError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 Unhandled Promise Rejection:', event.reason);
            this.handleError(event.reason);
        });
    }

    handleError(error) {
        // 在開發模式下顯示錯誤
        if (CONFIG.ENVIRONMENT.DEBUG_MODE) {
            console.error('Error details:', error);
        }
        
        // 可以在這裡添加錯誤回報邏輯
        this.showErrorToast('系統發生錯誤，請重新整理頁面');
    }

    showErrorToast(message) {
        showToast(message, 'error');
    }

    initializeLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContent = document.getElementById('mainContent');
        
        if (loadingScreen && mainContent) {
            // 模擬載入時間
            setTimeout(() => {
                this.hideLoadingScreen();
            }, CONFIG.UI_SETTINGS.LOADING_MIN_TIME);
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContent = document.getElementById('mainContent');
        
        if (loadingScreen && mainContent) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContent.style.display = 'block';
                mainContent.style.opacity = '0';
                
                // 淡入動畫
                requestAnimationFrame(() => {
                    mainContent.style.transition = 'opacity 0.5s ease-in';
                    mainContent.style.opacity = '1';
                });
            }, 300);
        }
    }

    preloadResources() {
        // 預載入關鍵圖片
        const imagePreloads = [
            '../assets/favicon.ico',
            '../assets/favicon.svg'
        ];

        imagePreloads.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    setupPerformanceMonitoring() {
        // 性能監控（開發模式）
        if (CONFIG.ENVIRONMENT.DEBUG_MODE) {
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                
            });
        }
    }

    onReady() {
        
        // 添加全域快捷鍵
        this.setupKeyboardShortcuts();
        
        // 設置主題切換（預留）
        this.setupThemeToggle();
        
        // 初始化工具提示
        this.setupTooltips();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // ESC 鍵 - 重新開始問答
            if (event.key === 'Escape' && window.quizSystem) {
                window.quizSystem.restart();
            }
            
            // 空白鍵或Enter - 下一題（如果有選擇）
            if ((event.key === ' ' || event.key === 'Enter') && window.quizSystem) {
                event.preventDefault();
                const nextBtn = document.getElementById('nextBtn');
                if (nextBtn && !nextBtn.disabled) {
                    nextBtn.click();
                }
            }
            
            // 方向鍵 - 在選項間移動
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                this.handleOptionNavigation(event.key);
                event.preventDefault();
            }
        });
    }

    handleOptionNavigation(direction) {
        const options = document.querySelectorAll('.option-card');
        const currentSelected = document.querySelector('.option-card.selected');
        
        if (options.length === 0) return;
        
        let currentIndex = currentSelected ? 
            Array.from(options).indexOf(currentSelected) : -1;
        
        if (direction === 'ArrowDown') {
            currentIndex = (currentIndex + 1) % options.length;
        } else {
            currentIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
        }
        
        // 模擬點擊
        options[currentIndex].click();
    }

    setupThemeToggle() {
        // 預留主題切換功能
        // 可以在這裡添加深色/淺色主題切換
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    setupTooltips() {
        // 為所有有 data-tooltip 屬性的元素添加提示
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.getAttribute('data-tooltip'));
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });
        
        this.currentTooltip = tooltip;
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }
}

// 全域應用物件，便於除錯和外部存取
window.UserInterfaceApp = UserInterfaceApp;

// 啟動應用程式
const app = new UserInterfaceApp();

// 添加一些全域輔助函數
window.debugQuiz = () => {
    if (window.quizSystem) {
        
    }
};

window.skipToResults = () => {
    if (window.quizSystem) {
        // 填入測試答案
        window.quizSystem.answers = {
            question1: 'javascript',
            question2: 'fullstack',
            question3: 'productivity',
            question4: 'small_team',
            question5: 'coding'
        };
        window.quizSystem.completeQuiz();
    }
};

// 測驗系統變數
let currentQuestion = 1;
let totalQuestions = 6;
let answers = {};
let isProcessingTransition = false; // 防止快速點擊導致跳題的狀態管理

// 從內容配置獲取問題數據
function getQuizQuestions() {
    if (window.CONTENT_CONFIG && window.CONTENT_CONFIG.questions) {
        totalQuestions = window.CONTENT_CONFIG.questions.length;
        return window.CONTENT_CONFIG.questions;
    }
    
    // 備用問題數據（如果配置載入失敗）
    return [
    {
      "id": 1,
      "title": "你的開發旅程，目前在哪一站？",
      "subtitle": "別緊張，這裡沒有標準答案。選一個最貼近你現況的起手式，讓我們幫你配一套最強的火力！",
      "options": [
        {
          "id": "beginner",
          "emoji": "🌱",
          "title": "新手入門",
          "description": "剛接觸不久，熟悉基本語法"
        },
        {
          "id": "intermediate",
          "emoji": "⚡",
          "title": "潛力新秀",
          "description": "有幾個 side project，熟悉主流框架"
        },
        {
          "id": "advanced",
          "emoji": "🎯",
          "title": "獨當一面",
          "description": "能獨立開發，有實習或接案經驗"
        },
        {
          "id": "expert",
          "emoji": "👑",
          "title": "明日之星",
          "description": "具備解決複雜問題的能力，並有導入或改善架構的經驗"
        }
      ]
    },
    {
      "id": 2,
      "title": "你的技能樹，主修哪一系？",
      "subtitle": "前端、後端、AI... 每個領域都有專屬的神兵利器。告訴我們你的主攻方向，才能推薦最順手的裝備給你！",
      "options": [
        {
          "id": "frontend",
          "emoji": "💻",
          "title": "前端工程",
          "description": "React/Vue/Angular/UI/UX"
        },
        {
          "id": "backend",
          "emoji": "⚙️",
          "title": "後端工程",
          "description": "API/微服務/資料庫/伺服器"
        },
        {
          "id": "fullstack",
          "emoji": "🌐",
          "title": "全端開發",
          "description": "前後端都略懂，全都要掌握！"
        },
        {
          "id": "cloud_ai",
          "emoji": "🤖",
          "title": "AI / 資料科學",
          "description": "雲端/DevOps/機器學習/資料科學"
        }
      ]
    },
    {
      "id": 3,
      "title": "喜歡單人解副本，還是組隊打 Boss？",
      "subtitle": "一個人的神操作和一群人的神同步，需要的工具大不同。讓我們知道你的團隊規模，才能幫你配置團隊協作的最佳火力。",
      "options": [
        {
          "id": "personal",
          "emoji": "👤",
          "title": "個人專案",
          "description": "個人作品、Side Project、練功用"
        },
        {
          "id": "small_team",
          "emoji": "👥",
          "title": "小型團隊",
          "description": "Hackathon、敏捷開發團隊"
        },
        {
          "id": "medium_enterprise",
          "emoji": "🏢",
          "title": "中型專案",
          "description": "開源專案、公司部門協作"
        },
        {
          "id": "large_enterprise",
          "emoji": "🏭",
          "title": "大型團隊",
          "description": "企業級專案、跨國協作"
        }
      ]
    },
    {
      "id": 4,
      "title": "對於開發環境，你的信仰是？",
      "subtitle": "有些人喜歡 All-in-One 的安心感，有些人追求極致簡潔的速度。你的開發哲學，會決定這套裝備的核心風格。",
      "options": [
        {
          "id": "minimal",
          "emoji": "🧘",
          "title": "極簡專注派",
          "description": "介面乾淨，排除干擾，專心致志"
        },
        {
          "id": "comprehensive",
          "emoji": "🛠️",
          "title": "萬能工具箱",
          "description": "各種工具備齊，IDE般的強大體驗"
        },
        {
          "id": "customizable",
          "emoji": "⚙️",
          "title": "個人化魔術師",
          "description": "從主題到快捷鍵，都要獨一無二"
        },
        {
          "id": "enterprise",
          "emoji": "📋",
          "title": "團隊合作型",
          "description": "重視程式碼風格統一與團隊協作"
        }
      ]
    },
    {
      "id": 5,
      "title": "幫你的 VS Code 換個 Skin？",
      "subtitle": "寫 Code 也要有好心情！無論是低調質感還是賽博龐克，好看的主題和特效，能讓你的開發體驗更有趣、更個人化。",
      "options": [
        {
          "id": "subtle",
          "emoji": "🌙",
          "title": "低調質感風",
          "description": "精緻內斂，質感勝於一切"
        },
        {
          "id": "moderate",
          "emoji": "✨",
          "title": "個性主題風",
          "description": "適度點綴，華麗與實用兼具"
        },
        {
          "id": "flashy",
          "emoji": "💥",
          "title": "華麗特效風",
          "description": "極致特效，Coding也要萬眾矚目"
        },
        {
          "id": "cyberpunk",
          "emoji": "🌈",
          "title": "賽博龐克風",
          "description": "霓虹光影，未來科技感滿載"
        }
      ]
    },
    {
      "id": 6,
      "title": "想把屬性點數，加到哪裡？",
      "subtitle": "想寫得更快、Code 更穩，還是 Debug 更準？不同的套件組合能對應不同的能力加成，告訴我們你最想點滿的技能吧！",
      "options": [
        {
          "id": "coding_speed",
          "emoji": "⚡",
          "title": "開發速度",
          "description": "自動補全 / AI生成 / 快捷鍵"
        },
        {
          "id": "code_quality",
          "emoji": "🛡️",
          "title": "程式碼品質",
          "description": "語法檢查 / 格式化 / 重構"
        },
        {
          "id": "debugging",
          "emoji": "🔍",
          "title": "Debug 除錯力",
          "description": "問題定位 / 變數監控 / Log分析"
        },
        {
          "id": "integration",
          "emoji": "🔗",
          "title": "工具整合力",
          "description": "Git串接 / 資料庫 / API測試"
        }
      ]
    }
    ];
}

// 8大巔峰套裝資料
const packages = {
    "1": {
        "name": "萌寵開發夥伴包",
        "emoji": "🐱",
        "description": "讓超萌的虛擬寵物與 AI 夥伴，陪你溫馨寫下每一行好程式。",
        "extensions": [
            {
                "name": "VSCode Pets",
                "icon": "🐱",
                "description": "在編輯器視窗中飼養一隻可愛的虛擬寵物！牠會在你寫程式時跑來跑去，程式碼順暢時開心跳躍，出錯時則會擔心地看著你。",
                "reason": "為你的開發日常注入滿滿活力與療癒感，從此寫 Code 再也不孤單！"
            },
            {
                "name": "Live Preview",
                "icon": "🌐",
                "description": "一鍵啟動本地伺服器與即時預覽瀏覽器，每次存檔就自動刷新，提供零延遲的網頁預覽體驗。",
                "reason": "為前端開發者打造最直覺的回饋，每一次存檔都是一次驚喜，大幅提升成就感與樂趣。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "你的 AI 程式設計夥伴，能根據上下文和註解，即時生成程式碼、函式，甚至是完整的解決方案。",
                "reason": "當 AI 夥伴的智慧建議，搭配 Live Preview 的即時預覽，再加上萌寵打氣，這就是最暖心的開發體驗！"
            }
        ]
    },
    "2": {
        "name": "視覺系狂歡特效包",
        "emoji": "💥",
        "description": "引爆你的腎上腺素，讓每一次敲擊鍵盤都像在開一場狂歡派對！",
        "extensions": [
            {
                "name": "Power Mode",
                "icon": "💥",
                "description": "終極視覺爽感體驗！每次按鍵都會炸出華麗的粒子特效，打字越快，爆炸越猛烈，螢幕還會隨之震動。",
                "reason": "這不只是特效，更是你進入「心流」狀態的視覺化戰吼，讓高效工作變成一場華麗的個人秀。"
            },
            {
                "name": "Code Runner",
                "icon": "⚡",
                "description": "輕量級的多語言程式碼執行引擎，支援超過 40 種主流語言，能一鍵執行整個檔案或選取的程式碼片段。",
                "reason": "搭配 Power Mode，當你秒速執行成功的程式碼時，視覺特效就像慶功煙火，爽度破表！"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "在漫天飛舞的粒子特效中，Copilot 如同你的靈感繆斯，動態生成充滿戲劇性的程式碼。",
                "reason": "AI 生成程式碼，透過 Code Runner 瞬間執行，再由 Power Mode 引爆視覺特效，完美實現「想到、看到、炸到」的極致開發爽感。"
            }
        ]
    },
    "3": {
        "name": "賽博龐克駭客包",
        "emoji": "🌈",
        "description": "立即化身未來世界的頂尖駭客，沉浸在霓虹光影與資訊流的科幻體驗中。",
        "extensions": [
            {
                "name": "Synthwave '84 Theme",
                "icon": "🌈",
                "description": "一套完整的 Cyberpunk 視覺主題，以霓虹粉紫配色、輝光效果，讓你的 VS Code 變成《銀翼殺手》中的駭客終端。",
                "reason": "為你打造極致沉浸的 Cyberpunk 編碼氛圍，讓每一行程式碼都自帶霓虹濾鏡。"
            },
            {
                "name": "WakaTime",
                "icon": "📊",
                "description": "專業的開發者時間追蹤與生產力分析平台，自動記錄你的編碼活動，並生成詳細的視覺化統計報告。",
                "reason": "在駭客般的介面下，WakaTime 就是你的作戰情報中心，將開發行為資料化，讓你用上帝視角分析自己的工作模式。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "在 Cyberpunk 氛圍中，Copilot 就像是來自未來的 AI 夥伴，能理解你充滿未來感的程式碼。",
                "reason": "當來自未來的 AI 夥伴，遇上你的個人資料中心，Copilot 的建議將更貼合你的習慣，實現真正由資料驅動的人機協作！"
            }
        ]
    },
    "4": {
        "name": "完美程式碼守護包",
        "emoji": "🛡️",
        "description": "讓可愛的程式碼管家，陪你優雅地把關每一處細節，打造完美無瑕的專案。",
        "extensions": [
            {
                "name": "VSCode Pets",
                "icon": "🐱",
                "description": "你的程式碼品質監督員！當你寫出高品質程式時，小寵物會開心鼓勵；當牠發現問題時，也會提醒你注意。",
                "reason": "將枯燥的品質檢查，變成一場與萌寵的溫馨互動，用正向激勵取代冰冷的錯誤提示。"
            },
            {
                "name": "TODO Highlight",
                "icon": "📝",
                "description": "強大的註解高亮與追蹤工具，能自動識別並標示出 TODO、FIXME 等關鍵字，再也不怕忘記待辦事項。",
                "reason": "它就像你的數位便條紙和記憶管家，系統化管理所有待辦事項與技術債，確保專案的健康度。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "AI 不僅能生成高品質程式，還能智慧地在你需要的地方，加上適當的 TODO 標記和註解。",
                "reason": "AI 助你寫出好 Code，更會在你需要標記待辦事項時自動生成註解，再由 TODO Highlight 追蹤，形成完美的品質監控循環。"
            }
        ]
    },
    "5": {
        "name": "視覺系除錯達人包",
        "emoji": "🔍",
        "description": "把惱人的 Debug 變成一場刺激的視覺風暴，讓你用最炫砲的方式揪出每一個 Bug。",
        "extensions": [
            {
                "name": "Power Mode",
                "icon": "💥",
                "description": "讓除錯也充滿爆炸美學！每次設定中斷點、單步執行或跳過時，都會產生獨特的粒子爆炸特效。",
                "reason": "當你快速定位和修復 Bug 時，華麗的視覺回饋，讓除錯過程變得像動作片一樣刺激！"
            },
            {
                "name": "GitLens",
                "icon": "🔍",
                "description": "最強大的 Git 版本控制視覺化工具，能顯示每行程式碼的作者、提交時間，並提供豐富的歷史紀錄圖表。",
                "reason": "將冰冷的 Git 指令，變成一目了然的視覺化資訊，讓你像偵探一樣，輕鬆追蹤程式碼的每一次變動。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "除錯過程中的智慧軍師，當你透過 GitLens 追蹤程式歷史時，Copilot 能分析其脈絡並建議修復方案。",
                "reason": "AI 能結合 Git blame 資訊，理解程式的演進過程，提供更具歷史脈絡的修改建議，讓 Bug 無所遁形。"
            }
        ]
    },
    "6": {
        "name": "萌系團隊協作包",
        "emoji": "👥",
        "description": "用超萌的元素與零距離的溝通，為你的團隊注入滿滿活力，讓遠端協作變得溫馨又有趣。",
        "extensions": [
            {
                "name": "VSCode Pets",
                "icon": "🐱",
                "description": "團隊協作也能毛茸茸！每個團隊成員都能在 Live Share 中，展示自己獨一無二的可愛寵物。",
                "reason": "當團隊一起 Pair Programming 時，看到大家的小寵物在螢幕上玩耍，工作氣氛瞬間變得輕鬆愉快！"
            },
            {
                "name": "Live Share",
                "icon": "🤝",
                "description": "微軟官方的即時協作平台，支援多人同時編輯、共享終端機、語音通話、共同除錯等強大功能。",
                "reason": "讓遠端協作的延遲感降到最低，就像所有人都坐在同一台電腦前，是現代遠端團隊的核心工具。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "團隊協作中的最強外援，所有成員都可以透過 Live Share，即時看到並使用 Copilot 的 AI 建議。",
                "reason": "當團隊卡關時，Copilot 能成為破冰的關鍵，讓 AI 成為團隊的共同助理，激發更多靈感與可能。"
            }
        ]
    },
    "7": {
        "name": "雲端架構師傳說包",
        "emoji": "☁️",
        "description": "賦予你駕馭複雜雲端服務的霸主之力，像個未來架構師般優雅地擘劃企業級藍圖。",
        "extensions": [
            {
                "name": "Synthwave '84 Theme",
                "icon": "🌈",
                "description": "在充滿未來科技感的視覺下，複雜的雲端服務與微服務架構，彷彿都變得優雅了起來。",
                "reason": "當你的 ARM 模板和雲端設定檔都散發著 Cyberpunk 魅力時，設計大型專案架構也能充滿藝術感。"
            },
            {
                "name": "Azure Tools",
                "icon": "☁️",
                "description": "微軟官方的雲端開發工具套件，無縫整合 Docker、Kubernetes、Azure DevOps CI/CD 管線、無伺服器架構等功能。",
                "reason": "提供一站式的企業級雲端開發平台，讓你專注於架構設計，而非繁瑣的部署細節。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "架構師等級的 AI 助理，能理解複雜的 API 設計、IaC (基礎架構即程式碼) 與容器化架構。",
                "reason": "AI 能協助你設計 API 藍圖、生成部署腳本、建議最佳的容器化實務，打造最專業的企業級開發平台。"
            }
        ]
    },
    "8": {
        "name": "AI 煉金術師神裝",
        "emoji": "🤖",
        "description": "化身次世代的 AI 煉金術師，在雲端實驗室中，讓 AI 開發 AI 不再是科幻情節。",
        "extensions": [
            {
                "name": "Synthwave '84 Theme",
                "icon": "🌈",
                "description": "在霓虹賽博龐克氛圍中進行 AI 模型開發，讓機器學習工作區和認知服務都散發著未來科技的光芒。",
                "reason": "讓每一次的模型訓練與部署，都像在進行一場未來感十足的 AI 實驗，營造最頂級的科幻 AI 氛圍。"
            },
            {
                "name": "Azure Machine Learning",
                "icon": "🧠",
                "description": "微軟官方機器學習整合工具，提供 AutoML、模型註冊與部署、MLOps 管線等完整的企業級 AI 開發環境。",
                "reason": "將龐大且複雜的機器學習工作流程，全部整合在 VS Code 中，提供雲端原生的無限擴充性。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "你的雲端 AI 架構師，能幫你生成 ML 管線、AutoML 設定、認知服務整合程式，甚至建議最佳的 AI 服務組合。",
                "reason": "Copilot 能大幅簡化與雲端 AI 服務的互動，讓你專注於模型與演算法，真正實現「讓 AI 開發 AI」的次世代開發體驗。"
            }
        ]
    }
};

// 頁面滑動函數
function scrollToNextPage() {
    const pageContainer = document.getElementById('pageContainer');
    const scrollUpIndicator = document.getElementById('scrollUpIndicator');
    if (pageContainer && scrollUpIndicator) {
        pageContainer.classList.add('slide-up');
        pageContainer.classList.remove('slide-down');
        
        setTimeout(() => {
            scrollUpIndicator.classList.add('show');
        }, 800);
    }
}

function scrollToPrevPage() {
    const pageContainer = document.getElementById('pageContainer');
    const scrollUpIndicator = document.getElementById('scrollUpIndicator');
    if (pageContainer && scrollUpIndicator) {
        pageContainer.classList.remove('slide-up');
        pageContainer.classList.add('slide-down');
        
        scrollUpIndicator.classList.remove('show');
    }
}

// 測驗系統函數
function startQuiz() {
    
    // 記錄測驗開始時間
    window.quizStartTime = Date.now();
    
    // 確保內容配置已載入
    if (!window.CONTENT_CONFIG) {
        console.warn('⚠️ 內容配置尚未載入，正在嘗試載入...');
        setTimeout(startQuiz, 500);
        return;
    }
    
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) {
        console.error('❌ 找不到測驗容器');
        return;
    }
    
    // 隱藏主頁面
    const pageOne = document.querySelector('.page-one');
    if (pageOne) {
        pageOne.style.display = 'none';
    }
    
    // 顯示測驗容器
    quizContainer.classList.add('active');
    quizContainer.style.display = 'block';
    
    // 重置測驗狀態
    currentQuestion = 1;
    answers = {};
    isProcessingTransition = false; // 重置處理狀態
    
    // 生成問題頁面
    generateQuizPages();
    
    // 確保第一題顯示
    setTimeout(() => {
        const firstQuestion = document.getElementById('question1');
        if (firstQuestion) {
            firstQuestion.classList.add('active');
            
        } else {
            console.error('❌ 找不到第一題');
        }
        
        updateProgress();
        updateNavigation();
        
        // 滾動到測驗容器
        quizContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
}

function generateQuizPages() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;

    // 獲取問題數據
    const quizQuestions = getQuizQuestions();
    totalQuestions = quizQuestions.length;

    // 清除現有問題頁面
    const existingPages = quizContainer.querySelectorAll('.quiz-page');
    existingPages.forEach(page => page.remove());

    // 生成問題頁面
    quizQuestions.forEach((question, index) => {
        const page = document.createElement('div');
        page.className = `quiz-page ${index === 0 ? 'active' : ''}`;
        page.id = `question${question.id}`;
        
        page.innerHTML = `
            <div class="question-container">
                <h2 class="question-title">${question.title}</h2>
                <p class="question-subtitle">${question.subtitle}</p>
                <div class="options-container">
                    ${question.options.map(option => `
                        <div class="option-card" data-question="${question.id}" data-value="${option.id}">
                            <span class="option-emoji">${option.emoji}</span>
                            <div class="option-content">
                                <h3 class="option-title">${option.title}</h3>
                                <p class="option-description">${option.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        quizContainer.appendChild(page);
    });

    // 生成結果頁面
    const resultPage = document.createElement('div');
    resultPage.className = 'quiz-page';
    resultPage.id = 'results';
    
    const restartButton = getContent('results.restartButton', '重新戰鬥');
    
    resultPage.innerHTML = `
        <div class="result-container">
            <h2 class="result-title" id="resultTitle">🎉 您的專屬巔峰套裝！</h2>
            <p class="result-subtitle" id="resultSubtitle">根據您的戰鬥力分析，為您推薦最適合的VS Code套裝</p>
            <div class="extensions-grid" id="extensionsGrid">
                <!-- 推薦結果會動態生成 -->
            </div>
            <div class="results-actions">
                <button class="browse-packages-button" data-action="browse-packages">🔍 查看所有套裝</button>
                <button class="restart-button" data-action="restart">${restartButton}</button>
            </div>
        </div>
    `;
    quizContainer.appendChild(resultPage);
    
    // 為重新開始按鈕添加事件監聽器
    const restartBtn = resultPage.querySelector('.restart-button');
    if (restartBtn) {
        restartBtn.addEventListener('click', restartQuiz);
    }

    // 為查看所有套裝按鈕添加事件監聽器
    const browseBtn = resultPage.querySelector('.browse-packages-button');
    if (browseBtn) {
        browseBtn.addEventListener('click', showAllPackages);
    }

    // 為選項添加點擊事件，並改善滾動體驗
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            // 防止快速點擊導致跳題
            if (isProcessingTransition) {
                
                return;
            }
            
            const questionId = this.dataset.question;
            const value = this.dataset.value;
            
            // 重置連擊計數（切換到測驗選項時）
            comboCount = 0;
            if (comboTimer) clearTimeout(comboTimer);
            lastVoteTime = 0;
            lastVotedExtension = null;
            
            // 允許修改答案，移除重複回答限制
            
            // 設置處理狀態，防止重複點擊
            isProcessingTransition = true;
            
            // 禁用所有選項卡片並添加視覺回饋
            document.querySelectorAll(`[data-question="${questionId}"]`).forEach(option => {
                option.style.pointerEvents = 'none';
                option.classList.add('processing');
            });
            
            // 移除同組其他選項的選中狀態
            document.querySelectorAll(`[data-question="${questionId}"]`).forEach(option => {
                option.classList.remove('selected');
                option.style.transform = '';
            });
            
            // 選中當前選項
            this.classList.add('selected');
            
            // 添加選擇回饋效果
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            }, 100);
            
            // 儲存答案
            answers[`question${questionId}`] = value;
            
            // 延遲處理下一步，確保動畫完成和答案正確儲存
            setTimeout(() => {
                // 再次驗證答案是否已保存
                if (!answers[`question${questionId}`]) {
                    console.error(`❌ 答案儲存失敗: 問題${questionId}`);
                    showToast('答案儲存失敗，請重試', 'error');
                    
                    // 重新啟用選項
                    document.querySelectorAll(`[data-question="${questionId}"]`).forEach(option => {
                        option.style.pointerEvents = 'auto';
                        option.classList.remove('processing');
                    });
                    isProcessingTransition = false;
                    return;
                }
                
                if (parseInt(questionId) < totalQuestions) {
                    nextQuestion();
                } else {
                    // 檢查是否已設定使用者資訊
                    if (!window.currentUserInfo || !window.currentUserInfo.isSet) {
                        // 先完成問卷邏輯（自動填充未回答的問題）
                        const answeredQuestions = Object.keys(answers).length;
                        if (answeredQuestions < totalQuestions) {
                            
                            // 為每個未回答的問題隨機選擇一個選項
                            for (let i = 1; i <= totalQuestions; i++) {
                                if (!answers[i]) {
                                    // 獲取該問題的所有選項
                                    const questionElement = document.getElementById(`question${i}`);
                                    if (questionElement) {
                                        const options = questionElement.querySelectorAll('.option-card');
                                        if (options.length > 0) {
                                            // 隨機選擇一個選項
                                            const randomIndex = Math.floor(Math.random() * options.length);
                                            const randomOption = options[randomIndex];
                                            const optionIndex = Array.from(options).indexOf(randomOption);
                                            
                                            // 記錄答案
                                            answers[i] = optionIndex;
                                        }
                                    }
                                }
                            }
                        }
                        
                        // 顯示職位選擇彈窗
                        window.showUserInfoModal();
                        
                        // 監聽使用者資訊設定完成事件
                        const checkUserInfoSet = setInterval(() => {
                            if (window.currentUserInfo && window.currentUserInfo.isSet) {
                                clearInterval(checkUserInfoSet);
                                showResults();
                            }
                        }, 100);
                    } else {
                        showResults();
                    }
                }
                
                // 重新啟用處理狀態（在轉場完成後）
                setTimeout(() => {
                    isProcessingTransition = false;
                }, 500);
            }, 600); // 增加延遲確保動畫完成
            
            // 更新導航
            updateNavigation();
        });

        // 添加 hover 效果優化
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            }
        });
    });
}

function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        // 隱藏當前問題 - 純左右滑動
        const currentQuestionEl = document.getElementById(`question${currentQuestion}`);
        if (currentQuestionEl) {
            currentQuestionEl.classList.remove('active');
            currentQuestionEl.classList.add('prev');
        }
        
        currentQuestion++;
        
        // 顯示下一題 - 純左右滑動，不使用滾動
        setTimeout(() => {
            const nextQuestionEl = document.getElementById(`question${currentQuestion}`);
            if (nextQuestionEl) {
                nextQuestionEl.classList.add('active');
                nextQuestionEl.classList.remove('prev');
                
                // 重新啟用新問題的選項卡片
                const newQuestionOptions = nextQuestionEl.querySelectorAll('.option-card');
                newQuestionOptions.forEach(option => {
                    option.style.pointerEvents = 'auto';
                    option.classList.remove('processing', 'disabled');
                });
            }
            updateProgress();
            updateNavigation();
        }, 100); // 減少延遲，讓動畫更流暢
    } else {
        // 檢查是否已設定使用者資訊
        if (!window.currentUserInfo || !window.currentUserInfo.isSet) {
            // 先完成問卷邏輯（自動填充未回答的問題）
            const answeredQuestions = Object.keys(answers).length;
            if (answeredQuestions < totalQuestions) {
                
                // 為每個未回答的問題隨機選擇一個選項
                for (let i = 1; i <= totalQuestions; i++) {
                    if (!answers[i]) {
                        // 獲取該問題的所有選項
                        const questionElement = document.getElementById(`question${i}`);
                        if (questionElement) {
                            const options = questionElement.querySelectorAll('.option-card');
                            if (options.length > 0) {
                                // 隨機選擇一個選項
                                const randomIndex = Math.floor(Math.random() * options.length);
                                const randomOption = options[randomIndex];
                                const optionIndex = Array.from(options).indexOf(randomOption);
                                
                                // 記錄答案
                                answers[i] = optionIndex;
                            }
                        }
                    }
                }
            }
            
            // 顯示職位選擇彈窗
            window.showUserInfoModal();
            
            // 監聽使用者資訊設定完成事件
            const checkUserInfoSet = setInterval(() => {
                if (window.currentUserInfo && window.currentUserInfo.isSet) {
                    clearInterval(checkUserInfoSet);
                    showResults();
                }
            }, 100);
        } else {
            showResults();
        }
    }
}

function previousQuestion() {
    if (currentQuestion > 1) {
        // 隱藏當前問題 - 純左右滑動
        const currentQuestionEl = document.getElementById(`question${currentQuestion}`);
        if (currentQuestionEl) {
            currentQuestionEl.classList.remove('active');
        }
        
        currentQuestion--;
        
        // 顯示上一題 - 純左右滑動，不使用滾動
        setTimeout(() => {
            const prevQuestionEl = document.getElementById(`question${currentQuestion}`);
            if (prevQuestionEl) {
                prevQuestionEl.classList.add('active');
                prevQuestionEl.classList.remove('prev');
            }
            updateProgress();
            updateNavigation();
        }, 100); // 減少延遲，讓動畫更流暢
    }
}

function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn && nextBtn) {
        // 上一題按鈕
        if (currentQuestion === 1) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.pointerEvents = 'none';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.pointerEvents = 'all';
        }
        
        // 下一題按鈕
        const currentQuestionId = `question${currentQuestion}`;
        if (answers[currentQuestionId]) {
            nextBtn.classList.add('enabled');
            if (currentQuestion === totalQuestions) {
                nextBtn.innerHTML = '查看結果 →';
            } else {
                nextBtn.innerHTML = '下一題 →';
            }
        } else {
            nextBtn.classList.remove('enabled');
            nextBtn.innerHTML = currentQuestion === totalQuestions ? '查看結果 →' : '下一題 →';
        }
    }
}

function showResults() {
    
    // 計算完成時間
    const completedAt = new Date().toISOString();
    const timeTaken = window.quizStartTime ? Math.round((Date.now() - window.quizStartTime) / 1000) : null;
    
    // 提交測驗結果到後端
    submitQuizResults(answers, completedAt, timeTaken);
    
    // 隱藏當前問題
    document.getElementById(`question${currentQuestion}`).classList.remove('active');
    document.getElementById(`question${currentQuestion}`).classList.add('prev');
    
    // 隱藏導航按鈕
    const navigation = document.querySelector('.quiz-navigation');
    if (navigation) {
        navigation.style.display = 'none';
    }
    
    // 顯示結果頁面
    setTimeout(() => {
        generateRecommendations();
        document.getElementById('results').classList.add('active');
    }, 300);
}

// 提交測驗結果到後端
async function submitQuizResults(answers, completedAt, timeTaken) {
    try {
        // 獲取用戶信息
        const userInfo = window.currentUserInfo || { name: 'Anonymous', jobPosition: 'Unknown' };
        
        // 計算推薦套裝
        const bestPackageId = getBestPackageId(answers);
        
        const payload = {
            answers: answers,
            userInfo: userInfo,
            completedAt: completedAt,
            timeTaken: timeTaken,
            recommendedPackage: bestPackageId
        };
        
        
        // 使用配置中的 API URL 或相對路徑
        const apiUrl = window.CONFIG?.API_BASE_URL ? 
            `${window.CONFIG.API_BASE_URL}/quiz/submit` : 
            '/api/quiz/submit';
            
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            const result = await response.json();
            
        } else {
            const error = await response.json();
            console.error('❌ Failed to submit quiz results:', error);
            
            // 顯示錯誤訊息
            if (typeof showToast === 'function') {
                showToast('測驗結果保存失敗，但不影響您的推薦結果', 'warning');
            }
        }
    } catch (error) {
        console.error('❌ Error submitting quiz results:', error);
        
        // 顯示錯誤訊息
        if (typeof showToast === 'function') {
            showToast('網路連線問題，測驗結果保存失敗', 'warning');
        }
    }
}

function generateRecommendations() {
    // 計算最佳套裝ID
    const bestPackageId = getBestPackageId(answers);
    
    // 獲取推薦的擴充套件
    const recommendations = getRecommendations(answers);
    
    // 8大套裝資料（用於標題更新）
    const packageTitles = {
    "1": {
        "name": "萌寵開發夥伴包",
        "emoji": "🐱",
        "description": "讓超萌的虛擬寵物與 AI 夥伴，陪你溫馨寫下每一行好程式。",
        "extensions": [
            {
                "name": "VSCode Pets",
                "icon": "🐱",
                "description": "在編輯器視窗中飼養一隻可愛的虛擬寵物！牠會在你寫程式時跑來跑去，程式碼順暢時開心跳躍，出錯時則會擔心地看著你。",
                "reason": "為你的開發日常注入滿滿活力與療癒感，從此寫 Code 再也不孤單！"
            },
            {
                "name": "Live Preview",
                "icon": "🌐",
                "description": "一鍵啟動本地伺服器與即時預覽瀏覽器，每次存檔就自動刷新，提供零延遲的網頁預覽體驗。",
                "reason": "為前端開發者打造最直覺的回饋，每一次存檔都是一次驚喜，大幅提升成就感與樂趣。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "你的 AI 程式設計夥伴，能根據上下文和註解，即時生成程式碼、函式，甚至是完整的解決方案。",
                "reason": "當 AI 夥伴的智慧建議，搭配 Live Preview 的即時預覽，再加上萌寵打氣，這就是最暖心的開發體驗！"
            }
        ]
    },
    "2": {
        "name": "視覺系狂歡特效包",
        "emoji": "💥",
        "description": "引爆你的腎上腺素，讓每一次敲擊鍵盤都像在開一場狂歡派對！",
        "extensions": [
            {
                "name": "Power Mode",
                "icon": "💥",
                "description": "終極視覺爽感體驗！每次按鍵都會炸出華麗的粒子特效，打字越快，爆炸越猛烈，螢幕還會隨之震動。",
                "reason": "這不只是特效，更是你進入「心流」狀態的視覺化戰吼，讓高效工作變成一場華麗的個人秀。"
            },
            {
                "name": "Code Runner",
                "icon": "⚡",
                "description": "輕量級的多語言程式碼執行引擎，支援超過 40 種主流語言，能一鍵執行整個檔案或選取的程式碼片段。",
                "reason": "搭配 Power Mode，當你秒速執行成功的程式碼時，視覺特效就像慶功煙火，爽度破表！"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "在漫天飛舞的粒子特效中，Copilot 如同你的靈感繆斯，動態生成充滿戲劇性的程式碼。",
                "reason": "AI 生成程式碼，透過 Code Runner 瞬間執行，再由 Power Mode 引爆視覺特效，完美實現「想到、看到、炸到」的極致開發爽感。"
            }
        ]
    },
    "3": {
        "name": "賽博龐克駭客包",
        "emoji": "🌈",
        "description": "立即化身未來世界的頂尖駭客，沉浸在霓虹光影與資訊流的科幻體驗中。",
        "extensions": [
            {
                "name": "Synthwave '84 Theme",
                "icon": "🌈",
                "description": "一套完整的 Cyberpunk 視覺主題，以霓虹粉紫配色、輝光效果，讓你的 VS Code 變成《銀翼殺手》中的駭客終端。",
                "reason": "為你打造極致沉浸的 Cyberpunk 編碼氛圍，讓每一行程式碼都自帶霓虹濾鏡。"
            },
            {
                "name": "WakaTime",
                "icon": "📊",
                "description": "專業的開發者時間追蹤與生產力分析平台，自動記錄你的編碼活動，並生成詳細的視覺化統計報告。",
                "reason": "在駭客般的介面下，WakaTime 就是你的作戰情報中心，將開發行為資料化，讓你用上帝視角分析自己的工作模式。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "在 Cyberpunk 氛圍中，Copilot 就像是來自未來的 AI 夥伴，能理解你充滿未來感的程式碼。",
                "reason": "當來自未來的 AI 夥伴，遇上你的個人資料中心，Copilot 的建議將更貼合你的習慣，實現真正由資料驅動的人機協作！"
            }
        ]
    },
    "4": {
        "name": "完美程式碼守護包",
        "emoji": "🛡️",
        "description": "讓可愛的程式碼管家，陪你優雅地把關每一處細節，打造完美無瑕的專案。",
        "extensions": [
            {
                "name": "VSCode Pets",
                "icon": "🐱",
                "description": "你的程式碼品質監督員！當你寫出高品質程式時，小寵物會開心鼓勵；當牠發現問題時，也會提醒你注意。",
                "reason": "將枯燥的品質檢查，變成一場與萌寵的溫馨互動，用正向激勵取代冰冷的錯誤提示。"
            },
            {
                "name": "TODO Highlight",
                "icon": "📝",
                "description": "強大的註解高亮與追蹤工具，能自動識別並標示出 TODO、FIXME 等關鍵字，再也不怕忘記待辦事項。",
                "reason": "它就像你的數位便條紙和記憶管家，系統化管理所有待辦事項與技術債，確保專案的健康度。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "AI 不僅能生成高品質程式，還能智慧地在你需要的地方，加上適當的 TODO 標記和註解。",
                "reason": "AI 助你寫出好 Code，更會在你需要標記待辦事項時自動生成註解，再由 TODO Highlight 追蹤，形成完美的品質監控循環。"
            }
        ]
    },
    "5": {
        "name": "視覺系除錯達人包",
        "emoji": "🔍",
        "description": "把惱人的 Debug 變成一場刺激的視覺風暴，讓你用最炫砲的方式揪出每一個 Bug。",
        "extensions": [
            {
                "name": "Power Mode",
                "icon": "💥",
                "description": "讓除錯也充滿爆炸美學！每次設定中斷點、單步執行或跳過時，都會產生獨特的粒子爆炸特效。",
                "reason": "當你快速定位和修復 Bug 時，華麗的視覺回饋，讓除錯過程變得像動作片一樣刺激！"
            },
            {
                "name": "GitLens",
                "icon": "🔍",
                "description": "最強大的 Git 版本控制視覺化工具，能顯示每行程式碼的作者、提交時間，並提供豐富的歷史紀錄圖表。",
                "reason": "將冰冷的 Git 指令，變成一目了然的視覺化資訊，讓你像偵探一樣，輕鬆追蹤程式碼的每一次變動。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "除錯過程中的智慧軍師，當你透過 GitLens 追蹤程式歷史時，Copilot 能分析其脈絡並建議修復方案。",
                "reason": "AI 能結合 Git blame 資訊，理解程式的演進過程，提供更具歷史脈絡的修改建議，讓 Bug 無所遁形。"
            }
        ]
    },
    "6": {
        "name": "萌系團隊協作包",
        "emoji": "👥",
        "description": "用超萌的元素與零距離的溝通，為你的團隊注入滿滿活力，讓遠端協作變得溫馨又有趣。",
        "extensions": [
            {
                "name": "VSCode Pets",
                "icon": "🐱",
                "description": "團隊協作也能毛茸茸！每個團隊成員都能在 Live Share 中，展示自己獨一無二的可愛寵物。",
                "reason": "當團隊一起 Pair Programming 時，看到大家的小寵物在螢幕上玩耍，工作氣氛瞬間變得輕鬆愉快！"
            },
            {
                "name": "Live Share",
                "icon": "🤝",
                "description": "微軟官方的即時協作平台，支援多人同時編輯、共享終端機、語音通話、共同除錯等強大功能。",
                "reason": "讓遠端協作的延遲感降到最低，就像所有人都坐在同一台電腦前，是現代遠端團隊的核心工具。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "團隊協作中的最強外援，所有成員都可以透過 Live Share，即時看到並使用 Copilot 的 AI 建議。",
                "reason": "當團隊卡關時，Copilot 能成為破冰的關鍵，讓 AI 成為團隊的共同助理，激發更多靈感與可能。"
            }
        ]
    },
    "7": {
        "name": "雲端架構師傳說包",
        "emoji": "☁️",
        "description": "賦予你駕馭複雜雲端服務的霸主之力，像個未來架構師般優雅地擘劃企業級藍圖。",
        "extensions": [
            {
                "name": "Synthwave '84 Theme",
                "icon": "🌈",
                "description": "在充滿未來科技感的視覺下，複雜的雲端服務與微服務架構，彷彿都變得優雅了起來。",
                "reason": "當你的 ARM 模板和雲端設定檔都散發著 Cyberpunk 魅力時，設計大型專案架構也能充滿藝術感。"
            },
            {
                "name": "Azure Tools",
                "icon": "☁️",
                "description": "微軟官方的雲端開發工具套件，無縫整合 Docker、Kubernetes、Azure DevOps CI/CD 管線、無伺服器架構等功能。",
                "reason": "提供一站式的企業級雲端開發平台，讓你專注於架構設計，而非繁瑣的部署細節。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "架構師等級的 AI 助理，能理解複雜的 API 設計、IaC (基礎架構即程式碼) 與容器化架構。",
                "reason": "AI 能協助你設計 API 藍圖、生成部署腳本、建議最佳的容器化實務，打造最專業的企業級開發平台。"
            }
        ]
    },
    "8": {
        "name": "AI 煉金術師神裝",
        "emoji": "🤖",
        "description": "化身次世代的 AI 煉金術師，在雲端實驗室中，讓 AI 開發 AI 不再是科幻情節。",
        "extensions": [
            {
                "name": "Synthwave '84 Theme",
                "icon": "🌈",
                "description": "在霓虹賽博龐克氛圍中進行 AI 模型開發，讓機器學習工作區和認知服務都散發著未來科技的光芒。",
                "reason": "讓每一次的模型訓練與部署，都像在進行一場未來感十足的 AI 實驗，營造最頂級的科幻 AI 氛圍。"
            },
            {
                "name": "Azure Machine Learning",
                "icon": "🧠",
                "description": "微軟官方機器學習整合工具，提供 AutoML、模型註冊與部署、MLOps 管線等完整的企業級 AI 開發環境。",
                "reason": "將龐大且複雜的機器學習工作流程，全部整合在 VS Code 中，提供雲端原生的無限擴充性。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "你的雲端 AI 架構師，能幫你生成 ML 管線、AutoML 設定、認知服務整合程式，甚至建議最佳的 AI 服務組合。",
                "reason": "Copilot 能大幅簡化與雲端 AI 服務的互動，讓你專注於模型與演算法，真正實現「讓 AI 開發 AI」的次世代開發體驗。"
            }
        ]
    }
};
    
    // 更新結果頁面標題
    const resultTitle = document.getElementById('resultTitle');
    const resultSubtitle = document.getElementById('resultSubtitle');
    
    if (resultTitle && packageTitles[bestPackageId]) {
        resultTitle.innerHTML = `${packageTitles[bestPackageId].emoji} ${packageTitles[bestPackageId].name}`;
    }
    
    if (resultSubtitle && packageTitles[bestPackageId]) {
        resultSubtitle.innerHTML = `${packageTitles[bestPackageId].description}`;
    }
    
    // 更新擴充套件網格
    const grid = document.getElementById('extensionsGrid');
    if (grid && recommendations && Array.isArray(recommendations)) {
        
        grid.innerHTML = recommendations.map((ext, index) => `
            <div class="extension-card">
                <div class="extension-header">
                    <div class="extension-icon">${ext.icon}</div>
                    <div class="extension-name">${escapeHtml(ext.name)}</div>
                </div>
                <div class="extension-description">${escapeHtml(ext.description)}</div>
                <div class="extension-reason">"${escapeHtml(ext.reason)}"</div>
                <div class="extension-actions">
                    <button class="vote-button" data-extension-name="${escapeHtml(ext.name)}" data-extension-index="${index}">
                        <span>👍</span> 投票支持
                    </button>
                </div>
            </div>
        `).join('');
        
        // 移除舊的事件監聽器（如果存在）
        const oldHandler = grid._voteClickHandler;
        if (oldHandler) {
            grid.removeEventListener('click', oldHandler);
        }
        
        // 創建新的事件處理器並保存引用
        const newHandler = function(event) {
            if (event.target.closest('.vote-button')) {
                const button = event.target.closest('.vote-button');
                const extensionName = button.getAttribute('data-extension-name');
                if (extensionName) {
                    voteForExtension(extensionName, button);
                }
            }
        };
        
        // 添加新的事件監聽器並保存引用以便將來移除
        grid.addEventListener('click', newHandler);
        grid._voteClickHandler = newHandler;
    } else {
        console.error('❌ 無法獲取推薦結果或結果格式不正確:', recommendations);
        if (grid) {
            grid.innerHTML = '<div class="error-message">載入推薦結果時發生錯誤，請重新開始測驗。</div>';
        }
    }
}

function getBestPackageId(answers) {
    // 根據新的決策樹邏輯生成推薦套裝
    const experience = answers.question1;       // 經驗等級
    const tech_field = answers.question2;       // 技術領域
    const project_scale = answers.question3;    // 專案規模
    const dev_style = answers.question4;        // 開發風格
    const visual_style = answers.question5;     // 視覺風格
    const focus_area = answers.question6;       // 戰鬥力焦點


    // 特殊規則篩選 - 減少強制規則，提升平衡性
    
    // 雲端專家通道（保留）
    if (tech_field === 'cloud_ai' && experience === 'expert') {
        return 8;
    }

    if (tech_field === 'cloud_ai' && experience === 'advanced') {
        return 7;
    }

    // 友善保護機制：只有非常特定條件才強制推薦套裝1（減少強制性）
    if (experience === 'beginner' && 
        visual_style === 'subtle' && 
        project_scale === 'personal' && 
        dev_style === 'minimal') {
        return 1;
    }

    // 增加賽博龐克強制通道，確保套裝3有合理出現機會
    if (visual_style === 'cyberpunk' && (experience === 'advanced' || experience === 'expert')) {
        return 3;
    }

    // 增加爆炸特效強制通道，確保套裝2和5有合理出現機會
    if (visual_style === 'flashy' && focus_area === 'coding_speed') {
        return 2;
    }

    if (visual_style === 'flashy' && focus_area === 'debugging') {
        return 5;
    }

    // 其他特殊規則已暫時隱藏，改用權重計算
    /*

    // 賽博龐克強制通道
    if (visual_style === 'cyberpunk' && (experience === 'advanced' || experience === 'expert')) {
        return 3;
    }

    // 爆炸特效路線
    if (visual_style === 'flashy' && focus_area === 'coding_speed') {
        return 2;
    }

    if (visual_style === 'flashy' && focus_area === 'debugging') {
        return 5;
    }

    // 大型企業協作優先
    if (project_scale === 'large_enterprise' && focus_area === 'integration') {
        return 6;
    }

    // 中型企業品質路線
    if (project_scale === 'medium_enterprise' && focus_area === 'code_quality') {
        return 4;
    }
    */

    // 修正後的備選條件判斷 - 確保所有套裝都有合理出現機會
    
    // 套裝1 備選條件 - 修正邏輯衝突，避免與強制規則重複
    if ((experience === 'beginner' && !(visual_style === 'subtle' && project_scale === 'personal' && dev_style === 'minimal')) || 
        (experience === 'intermediate' && tech_field === 'frontend' && visual_style === 'subtle')) {
        return 1;
    }

    // 套裝3 備選條件 - 新增，確保有備選機會
    if (dev_style === 'customizable' || 
        (visual_style === 'cyberpunk' && experience === 'intermediate') ||
        (experience === 'beginner' && visual_style === 'cyberpunk')) {
        return 3;
    }

    // 套裝4 備選條件 - 增強
    if ((dev_style === 'enterprise' && visual_style === 'subtle') ||
        (focus_area === 'code_quality' && visual_style === 'subtle')) {
        return 4;
    }

    // 套裝5 備選條件 - 新增
    if ((experience === 'advanced' && tech_field === 'backend' && focus_area === 'debugging') ||
        (visual_style === 'flashy' && tech_field === 'backend')) {
        return 5;
    }

    // 套裝6 備選條件 - 增强
    if (dev_style === 'enterprise' || 
        (project_scale === 'large_enterprise' && focus_area === 'integration') ||
        (visual_style === 'moderate' && project_scale !== 'personal')) {
        return 6;
    }

    // 套裝7 備選條件 - 新增，確保有備選機會
    if ((experience === 'expert' && tech_field !== 'cloud_ai') ||
        (dev_style === 'comprehensive' && experience === 'advanced') ||
        (tech_field === 'fullstack' && experience === 'expert')) {
        return 7;
    }

    // 套裝8 備選條件 - 增強
    if (tech_field === 'cloud_ai' || 
        (experience === 'expert' && dev_style === 'customizable') ||
        (focus_area === 'coding_speed' && experience === 'expert') ||
        (focus_area === 'coding_speed' && visual_style === 'cyberpunk')) {
        return 8;
    }

    // 權重計算回退機制 - 重新平衡所有套裝的權重
    let packageScore = {
        1: 0, // 暖心開發陪伴包
        2: 0, // 爆炸特效狂歡包
        3: 0, // 賽博龐克駭客包
        4: 0, // 溫馨品質守護包
        5: 0, // 爆炸除錯達人包
        6: 0, // 寵物協作天堂包
        7: 0, // 架構霸主包
        8: 0  // 機器學習神人包
    };

    // 經驗等級權重 (25%) - 降低權重，增加平衡性
    if (experience === 'beginner') {
        packageScore[1] += 25; packageScore[4] += 15; // 降低套裝1的絕對優勢
    } else if (experience === 'intermediate') {
        packageScore[2] += 25; packageScore[6] += 20; packageScore[1] += 10;
    } else if (experience === 'advanced') {
        packageScore[5] += 25; packageScore[3] += 20; packageScore[7] += 15;
    } else if (experience === 'expert') {
        packageScore[7] += 25; packageScore[8] += 20; packageScore[5] += 10;
    }

    // 技術領域權重 (20%) - 增加套裝8的機會
    if (tech_field === 'cloud_ai') {
        packageScore[8] += 25; packageScore[7] += 15; // 提升套裝8權重
    } else if (tech_field === 'frontend') {
        packageScore[2] += 20; packageScore[1] += 15; packageScore[3] += 10;
    } else if (tech_field === 'backend') {
        packageScore[5] += 20; packageScore[7] += 15; packageScore[4] += 10;
    } else if (tech_field === 'fullstack') {
        packageScore[7] += 18; packageScore[5] += 15; packageScore[6] += 12;
    }

    // 視覺風格權重 (30%) - 保持重要性但降低絕對優勢
    if (visual_style === 'cyberpunk') {
        packageScore[3] += 30; packageScore[8] += 20; packageScore[7] += 10;
    } else if (visual_style === 'flashy') {
        packageScore[2] += 30; packageScore[5] += 20; packageScore[3] += 10;
    } else if (visual_style === 'subtle') {
        packageScore[4] += 30; packageScore[1] += 20; packageScore[6] += 10;
    } else if (visual_style === 'moderate') {
        packageScore[6] += 30; packageScore[4] += 20; packageScore[2] += 10;
    }

    // 專案規模權重 (15%) - 提升權重
    if (project_scale === 'large_enterprise') {
        packageScore[6] += 15; packageScore[7] += 12; packageScore[4] += 8;
    } else if (project_scale === 'medium_enterprise') {
        packageScore[4] += 15; packageScore[6] += 12; packageScore[5] += 8;
    } else if (project_scale === 'small_team') {
        packageScore[2] += 15; packageScore[5] += 12; packageScore[3] += 8;
    } else if (project_scale === 'personal') {
        packageScore[1] += 15; packageScore[3] += 12; packageScore[2] += 8;
    }

    // 開發風格權重 (15%) - 提升權重，增加平衡性
    if (dev_style === 'minimal') {
        packageScore[1] += 15; packageScore[4] += 12; packageScore[2] += 8;
    } else if (dev_style === 'comprehensive') {
        packageScore[6] += 15; packageScore[7] += 12; packageScore[5] += 8;
    } else if (dev_style === 'customizable') {
        packageScore[3] += 15; packageScore[8] += 12; packageScore[5] += 8;
    } else if (dev_style === 'enterprise') {
        packageScore[4] += 15; packageScore[6] += 12; packageScore[7] += 8;
    }

    // 戰鬥力焦點權重 (15%) - 提升權重
    if (focus_area === 'coding_speed') {
        packageScore[2] += 15; packageScore[8] += 12; packageScore[3] += 8;
    } else if (focus_area === 'code_quality') {
        packageScore[4] += 15; packageScore[5] += 12; packageScore[1] += 8;
    } else if (focus_area === 'debugging') {
        packageScore[5] += 15; packageScore[3] += 12; packageScore[7] += 8;
    } else if (focus_area === 'integration') {
        packageScore[6] += 15; packageScore[7] += 12; packageScore[8] += 8;
    }

    // 找出得分最高的套裝
    let bestPackageId = 1;
    let highestScore = packageScore[1];
    
    for (let id = 2; id <= 8; id++) {
        if (packageScore[id] > highestScore) {
            highestScore = packageScore[id];
            bestPackageId = id;
        }
    }

    
    return bestPackageId;
}

function getRecommendations(answers) {
    const bestPackageId = getBestPackageId(answers);

    // 8大套裝資料
    const packages = {
    "1": {
        "name": "萌寵開發夥伴包",
        "emoji": "🐱",
        "description": "讓超萌的虛擬寵物與 AI 夥伴，陪你溫馨寫下每一行好程式。",
        "extensions": [
            {
                "name": "VSCode Pets",
                "icon": "🐱",
                "description": "在編輯器視窗中飼養一隻可愛的虛擬寵物！牠會在你寫程式時跑來跑去，程式碼順暢時開心跳躍，出錯時則會擔心地看著你。",
                "reason": "為你的開發日常注入滿滿活力與療癒感，從此寫 Code 再也不孤單！"
            },
            {
                "name": "Live Preview",
                "icon": "🌐",
                "description": "一鍵啟動本地伺服器與即時預覽瀏覽器，每次存檔就自動刷新，提供零延遲的網頁預覽體驗。",
                "reason": "為前端開發者打造最直覺的回饋，每一次存檔都是一次驚喜，大幅提升成就感與樂趣。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "你的 AI 程式設計夥伴，能根據上下文和註解，即時生成程式碼、函式，甚至是完整的解決方案。",
                "reason": "當 AI 夥伴的智慧建議，搭配 Live Preview 的即時預覽，再加上萌寵打氣，這就是最暖心的開發體驗！"
            }
        ]
    },
    "2": {
        "name": "視覺系狂歡特效包",
        "emoji": "💥",
        "description": "引爆你的腎上腺素，讓每一次敲擊鍵盤都像在開一場狂歡派對！",
        "extensions": [
            {
                "name": "Power Mode",
                "icon": "💥",
                "description": "終極視覺爽感體驗！每次按鍵都會炸出華麗的粒子特效，打字越快，爆炸越猛烈，螢幕還會隨之震動。",
                "reason": "這不只是特效，更是你進入「心流」狀態的視覺化戰吼，讓高效工作變成一場華麗的個人秀。"
            },
            {
                "name": "Code Runner",
                "icon": "⚡",
                "description": "輕量級的多語言程式碼執行引擎，支援超過 40 種主流語言，能一鍵執行整個檔案或選取的程式碼片段。",
                "reason": "搭配 Power Mode，當你秒速執行成功的程式碼時，視覺特效就像慶功煙火，爽度破表！"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "在漫天飛舞的粒子特效中，Copilot 如同你的靈感繆斯，動態生成充滿戲劇性的程式碼。",
                "reason": "AI 生成程式碼，透過 Code Runner 瞬間執行，再由 Power Mode 引爆視覺特效，完美實現「想到、看到、炸到」的極致開發爽感。"
            }
        ]
    },
    "3": {
        "name": "賽博龐克駭客包",
        "emoji": "🌈",
        "description": "立即化身未來世界的頂尖駭客，沉浸在霓虹光影與資訊流的科幻體驗中。",
        "extensions": [
            {
                "name": "Synthwave '84 Theme",
                "icon": "🌈",
                "description": "一套完整的 Cyberpunk 視覺主題，以霓虹粉紫配色、輝光效果，讓你的 VS Code 變成《銀翼殺手》中的駭客終端。",
                "reason": "為你打造極致沉浸的 Cyberpunk 編碼氛圍，讓每一行程式碼都自帶霓虹濾鏡。"
            },
            {
                "name": "WakaTime",
                "icon": "📊",
                "description": "專業的開發者時間追蹤與生產力分析平台，自動記錄你的編碼活動，並生成詳細的視覺化統計報告。",
                "reason": "在駭客般的介面下，WakaTime 就是你的作戰情報中心，將開發行為資料化，讓你用上帝視角分析自己的工作模式。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "在 Cyberpunk 氛圍中，Copilot 就像是來自未來的 AI 夥伴，能理解你充滿未來感的程式碼。",
                "reason": "當來自未來的 AI 夥伴，遇上你的個人資料中心，Copilot 的建議將更貼合你的習慣，實現真正由資料驅動的人機協作！"
            }
        ]
    },
    "4": {
        "name": "完美程式碼守護包",
        "emoji": "🛡️",
        "description": "讓可愛的程式碼管家，陪你優雅地把關每一處細節，打造完美無瑕的專案。",
        "extensions": [
            {
                "name": "VSCode Pets",
                "icon": "🐱",
                "description": "你的程式碼品質監督員！當你寫出高品質程式時，小寵物會開心鼓勵；當牠發現問題時，也會提醒你注意。",
                "reason": "將枯燥的品質檢查，變成一場與萌寵的溫馨互動，用正向激勵取代冰冷的錯誤提示。"
            },
            {
                "name": "TODO Highlight",
                "icon": "📝",
                "description": "強大的註解高亮與追蹤工具，能自動識別並標示出 TODO、FIXME 等關鍵字，再也不怕忘記待辦事項。",
                "reason": "它就像你的數位便條紙和記憶管家，系統化管理所有待辦事項與技術債，確保專案的健康度。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "AI 不僅能生成高品質程式，還能智慧地在你需要的地方，加上適當的 TODO 標記和註解。",
                "reason": "AI 助你寫出好 Code，更會在你需要標記待辦事項時自動生成註解，再由 TODO Highlight 追蹤，形成完美的品質監控循環。"
            }
        ]
    },
    "5": {
        "name": "視覺系除錯達人包",
        "emoji": "🔍",
        "description": "把惱人的 Debug 變成一場刺激的視覺風暴，讓你用最炫砲的方式揪出每一個 Bug。",
        "extensions": [
            {
                "name": "Power Mode",
                "icon": "💥",
                "description": "讓除錯也充滿爆炸美學！每次設定中斷點、單步執行或跳過時，都會產生獨特的粒子爆炸特效。",
                "reason": "當你快速定位和修復 Bug 時，華麗的視覺回饋，讓除錯過程變得像動作片一樣刺激！"
            },
            {
                "name": "GitLens",
                "icon": "🔍",
                "description": "最強大的 Git 版本控制視覺化工具，能顯示每行程式碼的作者、提交時間，並提供豐富的歷史紀錄圖表。",
                "reason": "將冰冷的 Git 指令，變成一目了然的視覺化資訊，讓你像偵探一樣，輕鬆追蹤程式碼的每一次變動。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "除錯過程中的智慧軍師，當你透過 GitLens 追蹤程式歷史時，Copilot 能分析其脈絡並建議修復方案。",
                "reason": "AI 能結合 Git blame 資訊，理解程式的演進過程，提供更具歷史脈絡的修改建議，讓 Bug 無所遁形。"
            }
        ]
    },
    "6": {
        "name": "萌系團隊協作包",
        "emoji": "👥",
        "description": "用超萌的元素與零距離的溝通，為你的團隊注入滿滿活力，讓遠端協作變得溫馨又有趣。",
        "extensions": [
            {
                "name": "VSCode Pets",
                "icon": "🐱",
                "description": "團隊協作也能毛茸茸！每個團隊成員都能在 Live Share 中，展示自己獨一無二的可愛寵物。",
                "reason": "當團隊一起 Pair Programming 時，看到大家的小寵物在螢幕上玩耍，工作氣氛瞬間變得輕鬆愉快！"
            },
            {
                "name": "Live Share",
                "icon": "🤝",
                "description": "微軟官方的即時協作平台，支援多人同時編輯、共享終端機、語音通話、共同除錯等強大功能。",
                "reason": "讓遠端協作的延遲感降到最低，就像所有人都坐在同一台電腦前，是現代遠端團隊的核心工具。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "團隊協作中的最強外援，所有成員都可以透過 Live Share，即時看到並使用 Copilot 的 AI 建議。",
                "reason": "當團隊卡關時，Copilot 能成為破冰的關鍵，讓 AI 成為團隊的共同助理，激發更多靈感與可能。"
            }
        ]
    },
    "7": {
        "name": "雲端架構師傳說包",
        "emoji": "☁️",
        "description": "賦予你駕馭複雜雲端服務的霸主之力，像個未來架構師般優雅地擘劃企業級藍圖。",
        "extensions": [
            {
                "name": "Synthwave '84 Theme",
                "icon": "🌈",
                "description": "在充滿未來科技感的視覺下，複雜的雲端服務與微服務架構，彷彿都變得優雅了起來。",
                "reason": "當你的 ARM 模板和雲端設定檔都散發著 Cyberpunk 魅力時，設計大型專案架構也能充滿藝術感。"
            },
            {
                "name": "Azure Tools",
                "icon": "☁️",
                "description": "微軟官方的雲端開發工具套件，無縫整合 Docker、Kubernetes、Azure DevOps CI/CD 管線、無伺服器架構等功能。",
                "reason": "提供一站式的企業級雲端開發平台，讓你專注於架構設計，而非繁瑣的部署細節。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "架構師等級的 AI 助理，能理解複雜的 API 設計、IaC (基礎架構即程式碼) 與容器化架構。",
                "reason": "AI 能協助你設計 API 藍圖、生成部署腳本、建議最佳的容器化實務，打造最專業的企業級開發平台。"
            }
        ]
    },
    "8": {
        "name": "AI 煉金術師神裝",
        "emoji": "🤖",
        "description": "化身次世代的 AI 煉金術師，在雲端實驗室中，讓 AI 開發 AI 不再是科幻情節。",
        "extensions": [
            {
                "name": "Synthwave '84 Theme",
                "icon": "🌈",
                "description": "在霓虹賽博龐克氛圍中進行 AI 模型開發，讓機器學習工作區和認知服務都散發著未來科技的光芒。",
                "reason": "讓每一次的模型訓練與部署，都像在進行一場未來感十足的 AI 實驗，營造最頂級的科幻 AI 氛圍。"
            },
            {
                "name": "Azure Machine Learning",
                "icon": "🧠",
                "description": "微軟官方機器學習整合工具，提供 AutoML、模型註冊與部署、MLOps 管線等完整的企業級 AI 開發環境。",
                "reason": "將龐大且複雜的機器學習工作流程，全部整合在 VS Code 中，提供雲端原生的無限擴充性。"
            },
            {
                "name": "GitHub Copilot",
                "icon": "🤖",
                "description": "你的雲端 AI 架構師，能幫你生成 ML 管線、AutoML 設定、認知服務整合程式，甚至建議最佳的 AI 服務組合。",
                "reason": "Copilot 能大幅簡化與雲端 AI 服務的互動，讓你專注於模型與演算法，真正實現「讓 AI 開發 AI」的次世代開發體驗。"
            }
        ]
    }
};

    // 返回推薦套裝的擴充套件
    const recommendedPackage = packages[bestPackageId];
    
    // 顯示套裝資訊
    const resultPackage = document.getElementById('resultPackage');
    if (resultPackage) {
        resultPackage.innerHTML = `
            <div class="package-header">
                <span class="package-emoji">${recommendedPackage.emoji}</span>
                <div class="package-info">
                    <h3 class="package-name">${recommendedPackage.name}</h3>
                    <p class="package-description">${recommendedPackage.description}</p>
                </div>
            </div>
        `;
    }
    
    return recommendedPackage.extensions;
}

function restartQuiz() {
    currentQuestion = 1;
    answers = {};
    isProcessingTransition = false; // 重置處理狀態
    
    // 重置 UI
    document.querySelectorAll('.quiz-page').forEach(page => {
        page.classList.remove('active', 'prev');
    });
    
    document.getElementById('question1').classList.add('active');
    document.querySelector('.quiz-navigation').style.display = 'flex';
    
    // 清除選項狀態並重新啟用所有選項
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected', 'processing', 'disabled');
        card.style.pointerEvents = 'auto'; // 重新啟用所有選項
    });
    
    updateProgress();
    updateNavigation();
}

function closeQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    if (quizContainer) {
        quizContainer.classList.remove('active');
    }
}

// 連擊計數器和效果系統
let comboCount = 0;
let comboTimer = null;
let lastVoteTime = 0;
let lastVotedExtension = null; // 追蹤上次投票的擴展
let voteQueue = [];

// 投票功能 - 發送投票到後端並觸发 planet display 頁面的火箭 (支援狂按模式)
async function voteForExtension(extensionName, button) {
    try {
        // 檢查使用者是否已設定資訊
        if (!window.currentUserInfo || !window.currentUserInfo.isSet) {
            if (window.checkUserInfoBeforeVote && !window.checkUserInfoBeforeVote()) {
                return; // 如果彈窗出現，停止投票流程
            }
        }

        // 移除投票冷卻限制，支援狂按
        const now = Date.now();
        const timeSinceLastVote = now - lastVoteTime;
        
        // 更新連擊計數
        if (timeSinceLastVote < 2000 && lastVotedExtension === extensionName) { 
            // 2秒內且投票同一個擴展才算連擊
            comboCount++;
        } else {
            comboCount = 1;
        }
        lastVoteTime = now;
        lastVotedExtension = extensionName; // 記錄當前投票的擴展
        
        // 重設連擊計時器
        if (comboTimer) clearTimeout(comboTimer);
        comboTimer = setTimeout(() => {
            comboCount = 0;
        }, 3000);
        
        // 獲取連擊效果文字 (不顯示大型連擊)
        const comboText = comboCount > 1 ? showComboEffect(comboCount, button) : null;
        
        // 立即更新按鈕視覺效果
        if (button) {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
            
            // 狂按模式：快速視覺回饋，不禁用按鈕
            button.innerHTML = '<span>🚀</span> 發射中...';
            button.style.background = 'linear-gradient(135deg, #ff6b6b, #feca57)';
            
            setTimeout(() => {
                button.innerHTML = '<span>👍</span> 投票支持';
                button.style.background = 'linear-gradient(135deg, #238636, #2ea043)';
            }, 300);

            // 觸發最小震動回饋 (支援裝置上才有效)
            triggerHapticFeedback();
        }

        // 將 extension 名稱轉換為對應的 ID
        const extensionMap = {
            'VSCode Pets': 'vscode-pets',
            'Live Preview': 'live-preview', 
            'GitHub Copilot': 'github-copilot',
            'Power Mode': 'power-mode',
            'Code Runner': 'code-runner',
            "Synthwave '84 Theme": 'synthwave-theme',
            "Synthwave Theme": 'synthwave-theme', // 保留舊的映射以相容性
            'WakaTime': 'wakatime',
            'TODO Highlight': 'todo-highlight',
            'GitLens': 'gitlens',
            'Live Share': 'live-share',
            'Azure Tools': 'azure-tools',
            'Azure ML': 'azure-ml',
            // 修正: 添加完整名稱映射，避免 fallback 產生 'azure-machine-learning' 導致星球端忽略
            'Azure Machine Learning': 'azure-ml'
        };

        const extensionId = extensionMap[extensionName] || extensionName.toLowerCase().replace(/\s+/g, '-');
        
        // 使用選擇的投票者名稱，如果沒有則使用隨機名稱
        let voterName, jobPosition = '';
        if (window.currentUserInfo && window.currentUserInfo.isSet) {
            voterName = window.currentUserInfo.name;
            jobPosition = window.currentUserInfo.jobPosition;
        } else {
            // 生成隨機投票者名稱 (備用)
            const voterNames = [
                '前端工程師小明', '後端開發者阿華', 'DevOps小強', '全端工程師美美', 
                '資深開發者大雄', 'UI設計師靜香', '專案經理志明', '測試工程師春嬌',
                '架構師阿傑', '產品經理小琪', '系統管理員阿豪', '資料科學家雅婷',
                '移動開發者建國', 'QA工程師淑芬', '技術主管志偉', '前端架構師美玲',
                'Cloud工程師俊宏', 'AI工程師怡君', '安全專家世傑', '區塊鏈開發者佩君'
            ];
            voterName = voterNames[Math.floor(Math.random() * voterNames.length)];
        }

        
        // 將投票加入批次隊列以優化性能 - 修正連擊邏輯
        const voteData = {
            extensionId: extensionId,
            voterName: voterName,
            jobPosition: jobPosition,
            comboCount: comboCount, // 使用實際的連擊數
            timestamp: now
        };
        
        // 立即處理投票（不等待）
        const displayName = jobPosition ? `${voterName} (${jobPosition})` : voterName;
        processVoteImmediate(voteData, extensionName, displayName, comboText, button);
        
        // 發送火箭發射事件到WebSocket服務器
        sendRocketLaunchEvent(extensionId, voterName, jobPosition);
        
        // 批次處理隊列中的投票
        voteQueue.push(voteData);
        debounceVoteQueue();
        
    } catch (error) {
        console.error('❌ 投票失敗:', error);
        showVoteError(error.message);
    }
}

// 最小化震動回饋：單一 30ms 震動，若瀏覽器/裝置不支援則靜默跳過
function triggerHapticFeedback() {
    try {
        if (navigator && typeof navigator.vibrate === 'function') {
            // 30ms 是一個幾乎不干擾但能被感知的安全值
            navigator.vibrate(30);
        }
    } catch (e) {
        // 忽略：某些瀏覽器可能在權限/政策下拋錯
    }
}

// 立即處理投票 - 提供即時回饋
function processVoteImmediate(voteData, extensionName, voterName, comboText, button) {
    // 顯示即時成功提示
    showVoteSuccess(extensionName, voterName, voteData.comboCount, comboText);
    
    // 添加粒子效果
    createVoteParticles(button || document.querySelector('.vote-button'));
}

// 批次處理投票隊列
let voteQueueTimeout = null;
function debounceVoteQueue() {
    if (voteQueueTimeout) clearTimeout(voteQueueTimeout);
    
    voteQueueTimeout = setTimeout(async () => {
        if (voteQueue.length === 0) return;
        
        const votesToProcess = [...voteQueue];
        voteQueue = [];
        
        try {
            // 構建 API URL
            const batchApiUrl = window.CONFIG?.API_BASE_URL ? 
                `${window.CONFIG.API_BASE_URL}/extensions/vote/batch` : 
                '/api/extensions/vote/batch';
            
            // 批次發送投票
            const response = await fetch(batchApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    votes: votesToProcess
                })
            });
            
            if (!response.ok) {
                // 如果批次 API 不存在，回退到單個投票
                const singleApiUrl = window.CONFIG?.API_BASE_URL ? 
                    `${window.CONFIG.API_BASE_URL}/extensions/vote` : 
                    '/api/extensions/vote';
                    
                for (const vote of votesToProcess) {
                    await fetch(singleApiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(vote)
                    });
                }
            }
            
        } catch (error) {
            console.error('❌ 批次投票處理失敗:', error);
        }
    }, 100); // 100ms 批次延遲
}

// 顯示連擊效果 (僅返回文字，不顯示中間正方形)
function showComboEffect(combo, button) {
    if (combo < 2) return null;
    
    // 連擊音效（如果支援）
    playComboSound(combo);
    
    // 按鈕震動效果
    if (button) {
        button.style.animation = 'buttonShake 0.5s ease';
        setTimeout(() => {
            button.style.animation = '';
        }, 500);
    }
    
    // 加入連擊動畫樣式
    addComboStyles();
    
    // 只返回連擊文字，不創建視覺元素
    return `🔥 ${combo}x 連擊!`;
}

// 創建投票粒子效果
function createVoteParticles(button) {
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: 10px;
            height: 10px;
            background: #feca57;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: particleExplosion 0.8s ease-out forwards;
        `;
        
        // 隨機方向
        const angle = (i / 8) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        particle.style.setProperty('--end-x', endX + 'px');
        particle.style.setProperty('--end-y', endY + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 800);
    }
}

// 播放連擊音效
function playComboSound(combo) {
    try {
        // 創建音效（使用 Web Audio API 或者簡單的音頻檔案）
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // 創建簡單的嗶聲
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 根據連擊數調整音調
        const frequency = 400 + (combo * 50);
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        
    } catch (error) {
        // 音效失敗時靜默處理
        console.debug('音效播放失敗:', error);
    }
}

// 添加連擊和粒子動畫樣式
function addComboStyles() {
    if (document.getElementById('combo-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'combo-styles';
    styleElement.innerHTML = `
        @keyframes buttonShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes particleExplosion {
            0% { 
                opacity: 1; 
                transform: scale(1) translate(0, 0); 
            }
            100% { 
                opacity: 0; 
                transform: scale(0) translate(
                    calc(var(--end-x) - ${window.innerWidth/2}px), 
                    calc(var(--end-y) - ${window.innerHeight/2}px)
                ); 
            }
        }
        
        .vote-button:active {
            transform: scale(0.95);
            transition: transform 0.1s ease;
        }
    `;
    
    document.head.appendChild(styleElement);
}

// 添加提示框動畫樣式
function addToastStyles() {
    if (document.getElementById('toast-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'toast-styles';
    styleElement.innerHTML = `
        @keyframes toastPulse {
            0% { transform: translateX(0) scale(1); }
            50% { transform: translateX(0) scale(1.05); }
            100% { transform: translateX(0) scale(1); }
        }
        
        @keyframes comboFirePulse {
            0% { transform: scale(1); }
            25% { transform: scale(1.02); }
            50% { transform: scale(1.05); }
            75% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        @keyframes comboWiggle {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.02) rotate(0.5deg); }
            50% { transform: scale(1.04) rotate(0deg); }
            75% { transform: scale(1.02) rotate(-0.5deg); }
        }
        
        @keyframes comboBounceIn {
            0% { 
                transform: scale(0);
                opacity: 0;
            }
            50% { 
                transform: scale(1.06);
                opacity: 0.8;
            }
            70% { 
                transform: scale(0.98);
                opacity: 1;
            }
            100% { 
                transform: scale(1);
                opacity: 1;
            }
        }
        
        @keyframes comboGlow {
            0% { 
                box-shadow: 0 8px 32px rgba(255, 69, 0, 0.4), 0 4px 16px rgba(255, 140, 0, 0.3), 0 0 20px rgba(255, 165, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2);
            }
            50% { 
                box-shadow: 0 12px 48px rgba(255, 69, 0, 0.6), 0 6px 24px rgba(255, 140, 0, 0.5), 0 0 30px rgba(255, 165, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.3);
            }
            100% { 
                box-shadow: 0 16px 64px rgba(255, 69, 0, 0.8), 0 8px 32px rgba(255, 140, 0, 0.7), 0 0 40px rgba(255, 165, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.4);
            }
        }
        
        @keyframes textFlicker {
            0%, 100% { 
                text-shadow: 0 0 5px rgba(255, 215, 0, 0.8), 0 1px 2px rgba(0,0,0,0.5);
                color: #FFD700; 
            }
            25% { 
                text-shadow: 0 0 8px rgba(255, 215, 0, 1.0), 0 0 12px rgba(255, 69, 0, 0.6), 0 1px 2px rgba(0,0,0,0.5);
                color: #FFEB3B; 
            }
            50% { 
                text-shadow: 0 0 10px rgba(255, 215, 0, 1.2), 0 0 15px rgba(255, 69, 0, 0.8), 0 1px 2px rgba(0,0,0,0.5);
                color: #FFF; 
            }
            75% { 
                text-shadow: 0 0 8px rgba(255, 215, 0, 1.0), 0 0 12px rgba(255, 69, 0, 0.6), 0 1px 2px rgba(0,0,0,0.5);
                color: #FFEB3B; 
            }
        }
        
        @keyframes textFlickerSlow {
            0%, 100% { 
                text-shadow: 0 0 6px rgba(255, 140, 0, 0.6), 0 1px 2px rgba(0,0,0,0.5);
                color: #FFF; 
            }
            50% { 
                text-shadow: 0 0 10px rgba(255, 140, 0, 0.8), 0 0 8px rgba(255, 69, 0, 0.4), 0 1px 2px rgba(0,0,0,0.5);
                color: #FFEB3B; 
            }
        }
        
        @keyframes comboShake {
            0%, 100% { transform: translateX(0) scale(1); }
            10% { transform: translateX(-3px) scale(1.02); }
            20% { transform: translateX(3px) scale(0.98); }
            30% { transform: translateX(-2px) scale(1.01); }
            40% { transform: translateX(2px) scale(0.99); }
            50% { transform: translateX(-1px) scale(1.005); }
            60% { transform: translateX(1px) scale(0.995); }
            70% { transform: translateX(0) scale(1); }
        }
    `;
    
    document.head.appendChild(styleElement);
}

// 顯示投票成功提示 (支援連擊顯示，防止重疊)
function showVoteSuccess(extensionName, voterName, comboCount = 1, comboText = null) {
    // 移除現有的提示框以防止重疊 - 縮短重疊時間
    const existingToasts = document.querySelectorAll('.vote-success-toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = 'vote-success-toast'; // 添加 class 方便識別
    
    // 根據連擊數調整顏色和樣式
    const isCombo = comboCount > 1;
    const bgColor = isCombo ? 'linear-gradient(135deg, #FF4500 0%, #FF6600 25%, #FF8C00 50%, #FFB84D 75%, #FFA500 100%)' : 'linear-gradient(135deg, #28a745, #20c997)';
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: fit-content;
        max-width: calc(100vw - 40px);
        transform: translateY(-100%);
        background: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: ${isCombo ? '0 4px 12px rgba(255, 69, 0, 0.3)' : '0 4px 12px rgba(40, 167, 69, 0.3)'};
        transition: transform 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
        text-align: center;
        opacity: 0;
        visibility: hidden;
        opacity: 0;
        visibility: hidden;
    `;
    
    const displayComboText = comboText || (isCombo ? `🔥 ${comboCount}x 連擊!` : '');
    const comboDisplay = displayComboText ? `<div style="color: #FFD700; font-size: 0.8rem; margin-bottom: 3px; font-weight: bold;">${escapeHtml(displayComboText)}</div>` : '';
    toast.innerHTML = `
        ${comboDisplay}
        <div>
            🚀 ${escapeHtml(voterName)} 為 ${escapeHtml(extensionName)} 投票成功！
        </div>
        <div style="font-size: 0.8rem; margin-top: 4px; opacity: 0.9;">火箭已發射到星球展示頁面</div>
    `;
    
    document.body.appendChild(toast);
    
    // 使用 requestAnimationFrame 確保動畫時機正確
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.style.visibility = 'visible';
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });
    });
    
    // 連擊時顯示更久，讓用戶有時間欣賞效果
    const duration = isCombo ? 2400 : 2800;
    setTimeout(() => {
        toast.style.visibility = 'hidden';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
    
    // 添加脈衝動畫樣式
    addToastStyles();
}

// 顯示投票錯誤提示
function showVoteError(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #dc3545, #c82333);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    toast.innerHTML = `❌ 投票失敗: ${escapeHtml(message)}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2500);
}

// WebSocket實例
let socket;
let isSocketInitialized = false;

// 初始化WebSocket連接
function initializeWebSocket() {
    if (isSocketInitialized) return;
    
    try {
        // 設定標頭以標識為user-interface客戶端
        const wsUrl = CONFIG.WS_URL;
        
        // 添加路徑參數來標識這是user-interface客戶端
        const wsUrlWithIdentifier = wsUrl + '?clientType=user-interface';
        socket = new WebSocket(wsUrlWithIdentifier);
        
        socket.onopen = function() {
            isSocketInitialized = true;
        };
        
        socket.onmessage = function(event) {
            try {
                const data = JSON.parse(event.data);
                
                if (data.type === 'stats_update' || data.type === 'connection_count') {
                    // 顯示參與人數
                }
            } catch (error) {
                console.error('🚀 解析WebSocket訊息失敗:', error);
            }
        };
        
        socket.onclose = function() {
            isSocketInitialized = false;
            
            // 嘗試重新連接
            setTimeout(() => {
                initializeWebSocket();
            }, 5000);
        };
        
        socket.onerror = function(error) {
            console.error('🚀 WebSocket錯誤:', error);
        };
        
        // 連接建立後請求最新統計數據
        setTimeout(() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                const message = {
                    type: 'request_stats',
                    timestamp: new Date().toISOString()
                };
                socket.send(JSON.stringify(message));
            }
        }, 1000);
    } catch (error) {
        console.error('🚀 初始化WebSocket失敗:', error);
    }
}

// 發送火箭發射事件
function sendRocketLaunchEvent(extensionId, voterName, jobPosition) {
    try {
        if (!isSocketInitialized) {
            initializeWebSocket();
            // 如果WebSocket未初始化，延遲發送
            setTimeout(() => sendRocketLaunchEvent(extensionId, voterName, jobPosition), 1000);
            return;
        }
        
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                type: 'launch_rocket', // 使用與服務器匹配的小寫類型
                extensionId: extensionId || 'unknown', // 確保有 extensionId
                voterName: voterName || 'Anonymous', // 添加投票者名稱
                jobPosition: jobPosition || '', // 添加職位資訊
                timestamp: new Date().toISOString()
            };
            
            socket.send(JSON.stringify(message));
        }
    } catch (error) {
        console.error('🚀 發送火箭發射事件失敗:', error);
    }
}

// 初始化WebSocket連接
initializeWebSocket();

// 顯示所有套裝瀏覽頁面
function showAllPackages() {
    
    // 隱藏結果頁面
    const resultsPage = document.getElementById('results');
    if (resultsPage) {
        resultsPage.classList.remove('active');
        resultsPage.classList.add('prev');
    }
    
    // 創建所有套裝瀏覽頁面
    createAllPackagesPage();
    
    // 顯示所有套裝頁面
    setTimeout(() => {
        const allPackagesPage = document.getElementById('allPackages');
        if (allPackagesPage) {
            allPackagesPage.classList.add('active');
        }
    }, 300);
}

// 創建所有套裝瀏覽頁面
function createAllPackagesPage() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;

    // 檢查是否已存在頁面，如果存在則移除
    const existingPage = document.getElementById('allPackages');
    if (existingPage) {
        existingPage.remove();
    }

    // 獲取所有套裝資料
    const allPackages = getAllPackagesData();
    
    // 創建頁面元素
    const allPackagesPage = document.createElement('div');
    allPackagesPage.className = 'quiz-page';
    allPackagesPage.id = 'allPackages';
    
    // 生成頁面HTML
    allPackagesPage.innerHTML = `
        <div class="all-packages-container">
            <h2 class="all-packages-title">🎯 所有巔峰套裝</h2>
            <p class="all-packages-subtitle">探索8大巔峰套裝，為您喜愛的套裝投票支持！</p>
            <div class="packages-grid">
                ${Object.entries(allPackages).map(([packageId, packageData]) => `
                    <div class="package-card" data-package-id="${packageId}">
                        <div class="package-header">
                            <span class="package-emoji">${packageData.emoji}</span>
                            <h3 class="package-name">${escapeHtml(packageData.name)}</h3>
                        </div>
                        <p class="package-description">${escapeHtml(packageData.description)}</p>
                        <div class="package-extensions">
                            ${packageData.extensions.map((ext, index) => `
                                <div class="extension-card-full">
                                    <div class="extension-header">
                                        <div class="extension-icon">${ext.icon}</div>
                                        <div class="extension-name">${escapeHtml(ext.name)}</div>
                                    </div>
                                    <div class="extension-description">${escapeHtml(ext.description)}</div>
                                    <div class="extension-reason">"${escapeHtml(ext.reason)}"</div>
                                    <div class="extension-actions">
                                        <button class="vote-button" data-extension-name="${escapeHtml(ext.name)}" data-package-id="${packageId}" data-extension-index="${index}">
                                            <span>👍</span> 投票支持
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="all-packages-actions">
                <button class="back-to-results-button">⬅️ 返回我的推薦結果</button>
                <button class="restart-button" data-action="restart">🔄 重新開始測驗</button>
            </div>
        </div>
    `;
    
    quizContainer.appendChild(allPackagesPage);
    
    // 添加事件監聽器
    setupAllPackagesEventListeners(allPackagesPage);
}

// 設置所有套裝頁面的事件監聽器
function setupAllPackagesEventListeners(page) {
    // 投票按鈕事件
    const voteButtons = page.querySelectorAll('.vote-button');
    voteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const extensionName = this.getAttribute('data-extension-name');
            if (extensionName) {
                voteForExtension(extensionName, this);
            }
        });
    });
    
    // 返回結果按鈕
    const backButton = page.querySelector('.back-to-results-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // 隱藏所有套裝頁面
            page.classList.remove('active');
            page.classList.add('prev');
            
            // 顯示結果頁面
            setTimeout(() => {
                const resultsPage = document.getElementById('results');
                if (resultsPage) {
                    resultsPage.classList.remove('prev');
                    resultsPage.classList.add('active');
                }
            }, 300);
        });
    }
    
    // 重新開始測驗按鈕
    const restartButton = page.querySelector('.restart-button');
    if (restartButton) {
        restartButton.addEventListener('click', restartQuiz);
    }
}

// 獲取所有套裝資料
function getAllPackagesData() {
    return {
        "1": {
            "name": "萌寵開發夥伴包",
            "emoji": "🐱",
            "description": "讓超萌的虛擬寵物與 AI 夥伴，陪你溫馨寫下每一行好程式。",
            "extensions": [
                {
                    "name": "VSCode Pets",
                    "icon": "🐱",
                    "description": "在編輯器視窗中飼養一隻可愛的虛擬寵物！牠會在你寫程式時跑來跑去，程式碼順暢時開心跳躍，出錯時則會擔心地看著你。",
                    "reason": "為你的開發日常注入滿滿活力與療癒感，從此寫 Code 再也不孤單！"
                },
                {
                    "name": "Live Preview",
                    "icon": "🌐",
                    "description": "一鍵啟動本地伺服器與即時預覽瀏覽器，每次存檔就自動刷新，提供零延遲的網頁預覽體驗。",
                    "reason": "為前端開發者打造最直覺的回饋，每一次存檔都是一次驚喜，大幅提升成就感與樂趣。"
                },
                {
                    "name": "GitHub Copilot",
                    "icon": "🤖",
                    "description": "你的 AI 程式設計夥伴，能根據上下文和註解，即時生成程式碼、函式，甚至是完整的解決方案。",
                    "reason": "當 AI 夥伴的智慧建議，搭配 Live Preview 的即時預覽，再加上萌寵打氣，這就是最暖心的開發體驗！"
                }
            ]
        },
        "2": {
            "name": "視覺系狂歡特效包",
            "emoji": "💥",
            "description": "引爆你的腎上腺素，讓每一次敲擊鍵盤都像在開一場狂歡派對！",
            "extensions": [
                {
                    "name": "Power Mode",
                    "icon": "💥",
                    "description": "終極視覺爽感體驗！每次按鍵都會炸出華麗的粒子特效，打字越快，爆炸越猛烈，螢幕還會隨之震動。",
                    "reason": "這不只是特效，更是你進入「心流」狀態的視覺化戰吼，讓高效工作變成一場華麗的個人秀。"
                },
                {
                    "name": "Code Runner",
                    "icon": "⚡",
                    "description": "輕量級的多語言程式碼執行引擎，支援超過 40 種主流語言，能一鍵執行整個檔案或選取的程式碼片段。",
                    "reason": "搭配 Power Mode，當你秒速執行成功的程式碼時，視覺特效就像慶功煙火，爽度破表！"
                },
                {
                    "name": "GitHub Copilot",
                    "icon": "🤖",
                    "description": "在漫天飛舞的粒子特效中，Copilot 如同你的靈感繆斯，動態生成充滿戲劇性的程式碼。",
                    "reason": "AI 生成程式碼，透過 Code Runner 瞬間執行，再由 Power Mode 引爆視覺特效，完美實現「想到、看到、炸到」的極致開發爽感。"
                }
            ]
        },
        "3": {
            "name": "賽博龐克駭客包",
            "emoji": "🌈",
            "description": "立即化身未來世界的頂尖駭客，沉浸在霓虹光影與資訊流的科幻體驗中。",
            "extensions": [
                {
                    "name": "Synthwave '84 Theme",
                    "icon": "🌈",
                    "description": "一套完整的 Cyberpunk 視覺主題，以霓虹粉紫配色、輝光效果，讓你的 VS Code 變成《銀翼殺手》中的駭客終端。",
                    "reason": "為你打造極致沉浸的 Cyberpunk 編碼氛圍，讓每一行程式碼都自帶霓虹濾鏡。"
                },
                {
                    "name": "WakaTime",
                    "icon": "📊",
                    "description": "專業的開發者時間追蹤與生產力分析平台，自動記錄你的編碼活動，並生成詳細的視覺化統計報告。",
                    "reason": "在駭客般的介面下，WakaTime 就是你的作戰情報中心，將開發行為資料化，讓你用上帝視角分析自己的工作模式。"
                },
                {
                    "name": "GitHub Copilot",
                    "icon": "🤖",
                    "description": "在 Cyberpunk 氛圍中，Copilot 就像是來自未來的 AI 夥伴，能理解你充滿未來感的程式碼。",
                    "reason": "當來自未來的 AI 夥伴，遇上你的個人資料中心，Copilot 的建議將更貼合你的習慣，實現真正由資料驅動的人機協作！"
                }
            ]
        },
        "4": {
            "name": "完美程式碼守護包",
            "emoji": "🛡️",
            "description": "讓可愛的程式碼管家，陪你優雅地把關每一處細節，打造完美無瑕的專案。",
            "extensions": [
                {
                    "name": "VSCode Pets",
                    "icon": "🐱",
                    "description": "你的程式碼品質監督員！當你寫出高品質程式時，小寵物會開心鼓勵；當牠發現問題時，也會提醒你注意。",
                    "reason": "將枯燥的品質檢查，變成一場與萌寵的溫馨互動，用正向激勵取代冰冷的錯誤提示。"
                },
                {
                    "name": "TODO Highlight",
                    "icon": "📝",
                    "description": "強大的註解高亮與追蹤工具，能自動識別並標示出 TODO、FIXME 等關鍵字，再也不怕忘記待辦事項。",
                    "reason": "它就像你的數位便條紙和記憶管家，系統化管理所有待辦事項與技術債，確保專案的健康度。"
                },
                {
                    "name": "GitHub Copilot",
                    "icon": "🤖",
                    "description": "AI 不僅能生成高品質程式，還能智慧地在你需要的地方，加上適當的 TODO 標記和註解。",
                    "reason": "AI 助你寫出好 Code，更會在你需要標記待辦事項時自動生成註解，再由 TODO Highlight 追蹤，形成完美的品質監控循環。"
                }
            ]
        },
        "5": {
            "name": "視覺系除錯達人包",
            "emoji": "🔍",
            "description": "把惱人的 Debug 變成一場刺激的視覺風暴，讓你用最炫砲的方式揪出每一個 Bug。",
            "extensions": [
                {
                    "name": "Power Mode",
                    "icon": "💥",
                    "description": "讓除錯也充滿爆炸美學！每次設定中斷點、單步執行或跳過時，都會產生獨特的粒子爆炸特效。",
                    "reason": "當你快速定位和修復 Bug 時，華麗的視覺回饋，讓除錯過程變得像動作片一樣刺激！"
                },
                {
                    "name": "GitLens",
                    "icon": "🔍",
                    "description": "最強大的 Git 版本控制視覺化工具，能顯示每行程式碼的作者、提交時間，並提供豐富的歷史紀錄圖表。",
                    "reason": "將冰冷的 Git 指令，變成一目了然的視覺化資訊，讓你像偵探一樣，輕鬆追蹤程式碼的每一次變動。"
                },
                {
                    "name": "GitHub Copilot",
                    "icon": "🤖",
                    "description": "除錯過程中的智慧軍師，當你透過 GitLens 追蹤程式歷史時，Copilot 能分析其脈絡並建議修復方案。",
                    "reason": "AI 能結合 Git blame 資訊，理解程式的演進過程，提供更具歷史脈絡的修改建議，讓 Bug 無所遁形。"
                }
            ]
        },
        "6": {
            "name": "萌系團隊協作包",
            "emoji": "👥",
            "description": "用超萌的元素與零距離的溝通，為你的團隊注入滿滿活力，讓遠端協作變得溫馨又有趣。",
            "extensions": [
                {
                    "name": "VSCode Pets",
                    "icon": "🐱",
                    "description": "團隊協作也能毛茸茸！每個團隊成員都能在 Live Share 中，展示自己獨一無二的可愛寵物。",
                    "reason": "當團隊一起 Pair Programming 時，看到大家的小寵物在螢幕上玩耍，工作氣氛瞬間變得輕鬆愉快！"
                },
                {
                    "name": "Live Share",
                    "icon": "🤝",
                    "description": "微軟官方的即時協作平台，支援多人同時編輯、共享終端機、語音通話、共同除錯等強大功能。",
                    "reason": "讓遠端協作的延遲感降到最低，就像所有人都坐在同一台電腦前，是現代遠端團隊的核心工具。"
                },
                {
                    "name": "GitHub Copilot",
                    "icon": "🤖",
                    "description": "團隊協作中的最強外援，所有成員都可以透過 Live Share，即時看到並使用 Copilot 的 AI 建議。",
                    "reason": "當團隊卡關時，Copilot 能成為破冰的關鍵，讓 AI 成為團隊的共同助理，激發更多靈感與可能。"
                }
            ]
        },
        "7": {
            "name": "雲端架構師傳說包",
            "emoji": "☁️",
            "description": "賦予你駕馭複雜雲端服務的霸主之力，像個未來架構師般優雅地擘劃企業級藍圖。",
            "extensions": [
                {
                    "name": "Synthwave '84 Theme",
                    "icon": "🌈",
                    "description": "在充滿未來科技感的視覺下，複雜的雲端服務與微服務架構，彷彿都變得優雅了起來。",
                    "reason": "當你的 ARM 模板和雲端設定檔都散發著 Cyberpunk 魅力時，設計大型專案架構也能充滿藝術感。"
                },
                {
                    "name": "Azure Tools",
                    "icon": "☁️",
                    "description": "微軟官方的雲端開發工具套件，無縫整合 Docker、Kubernetes、Azure DevOps CI/CD 管線、無伺服器架構等功能。",
                    "reason": "提供一站式的企業級雲端開發平台，讓你專注於架構設計，而非繁瑣的部署細節。"
                },
                {
                    "name": "GitHub Copilot",
                    "icon": "🤖",
                    "description": "架構師等級的 AI 助理，能理解複雜的 API 設計、IaC (基礎架構即程式碼) 與容器化架構。",
                    "reason": "AI 能協助你設計 API 藍圖、生成部署腳本、建議最佳的容器化實務，打造最專業的企業級開發平台。"
                }
            ]
        },
        "8": {
            "name": "AI 煉金術師神裝",
            "emoji": "🤖",
            "description": "化身次世代的 AI 煉金術師，在雲端實驗室中，讓 AI 開發 AI 不再是科幻情節。",
            "extensions": [
                {
                    "name": "Synthwave '84 Theme",
                    "icon": "🌈",
                    "description": "在霓虹賽博龐克氛圍中進行 AI 模型開發，讓機器學習工作區和認知服務都散發著未來科技的光芒。",
                    "reason": "讓每一次的模型訓練與部署，都像在進行一場未來感十足的 AI 實驗，營造最頂級的科幻 AI 氛圍。"
                },
                {
                    "name": "Azure Machine Learning",
                    "icon": "🧠",
                    "description": "微軟官方機器學習整合工具，提供 AutoML、模型註冊與部署、MLOps 管線等完整的企業級 AI 開發環境。",
                    "reason": "將龐大且複雜的機器學習工作流程，全部整合在 VS Code 中，提供雲端原生的無限擴充性。"
                },
                {
                    "name": "GitHub Copilot",
                    "icon": "🤖",
                    "description": "你的雲端 AI 架構師，能幫你生成 ML 管線、AutoML 設定、認知服務整合程式，甚至建議最佳的 AI 服務組合。",
                    "reason": "Copilot 能大幅簡化與雲端 AI 服務的互動，讓你專注於模型與演算法，真正實現「讓 AI 開發 AI」的次世代開發體驗。"
                }
            ]
        }
    };
}
