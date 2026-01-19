// 星球展示動畫控制器
if (typeof window.AnimationController === 'undefined') {
    class AnimationController {
    constructor() {
        this.isPlaying = true;
        this.autoRotate = false;
        this.meteors = [];
        this.stars = [];
        this.meteorInterval = null;
        this.starInterval = null;
        
        this.init();
    }

    init() {
        // 檢查必要的 DOM 元素是否存在，避免在不需要時創建動畫
        const starField = document.getElementById('starField');
        const meteorContainer = document.getElementById('meteorContainer');
        
        if (starField) {
            this.createStarField();
        }
        
        if (meteorContainer && typeof CONFIG !== 'undefined' && CONFIG.VISUAL_EFFECTS) {
            this.startMeteorShower();
        }
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 暫停/播放動畫
        document.getElementById('pauseBtn')?.addEventListener('click', () => {
            this.toggleAnimation();
        });

        // 自動旋轉
        document.getElementById('autoRotateBtn')?.addEventListener('click', () => {
            this.toggleAutoRotate();
        });

        // 全螢幕
        document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
            this.toggleFullscreen();
        });
    }

    // 創建星空背景
    createStarField() {
        const starField = document.getElementById('starField');
        if (!starField) {
            console.warn('🌌 找不到 starField 元素，跳過星空創建');
            return;
        }

        // 檢查 CONFIG 是否存在
        if (typeof CONFIG === 'undefined' || !CONFIG.VISUAL_EFFECTS) {
            console.warn('🌌 CONFIG 未定義，使用預設星星數量');
            var starCount = 200; // 預設值
        } else {
            var starCount = CONFIG.VISUAL_EFFECTS.STARS_COUNT;
        }

        // 完全隨機分佈星星，不使用星團
        this.createRandomStars(starField, starCount);
    }

    // 創建完全隨機分佈的星星
    createRandomStars(starField, starCount) {
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // 隨機星星大小
            const size = Math.random();
            if (size < 0.7) {
                star.classList.add('small');
            } else if (size < 0.9) {
                star.classList.add('medium');
            } else {
                star.classList.add('large');
            }

            // 完全隨機位置，避免任何模式
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            star.style.left = x + '%';
            star.style.top = y + '%';
            
            // 隨機動畫延遲和持續時間
            star.style.setProperty('--duration', (Math.random() * 4 + 2) + 's');
            star.style.animationDelay = Math.random() * 6 + 's';

            starField.appendChild(star);
            this.stars.push(star);
        }
    }

    // 開始流星雨
    startMeteorShower() {
        // 檢查 CONFIG 和設定
        if (typeof CONFIG === 'undefined' || !CONFIG.VISUAL_EFFECTS || !CONFIG.VISUAL_EFFECTS.METEORS_ENABLED) {
            console.warn('🌌 流星雨已停用或 CONFIG 未定義');
            return;
        }

        this.meteorInterval = setInterval(() => {
            this.createMeteor();
        }, CONFIG.VISUAL_EFFECTS.METEOR_FREQUENCY);
    }

    // 創建單個流星
    createMeteor() {
        const meteorContainer = document.getElementById('meteorContainer');
        if (!meteorContainer) return;

        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        // 隨機起始位置（從畫面邊緣）
        const side = Math.floor(Math.random() * 4);
        switch (side) {
            case 0: // 從頂部
                meteor.style.left = Math.random() * 100 + '%';
                meteor.style.top = '-10px';
                break;
            case 1: // 從右側
                meteor.style.left = '110%';
                meteor.style.top = Math.random() * 100 + '%';
                break;
            case 2: // 從左側
                meteor.style.left = '-10px';
                meteor.style.top = Math.random() * 100 + '%';
                break;
            case 3: // 從左上角
                meteor.style.left = '-10px';
                meteor.style.top = '-10px';
                break;
        }

        meteorContainer.appendChild(meteor);
        this.meteors.push(meteor);

        // 3秒後移除流星
        setTimeout(() => {
            meteor.remove();
            const index = this.meteors.indexOf(meteor);
            if (index > -1) {
                this.meteors.splice(index, 1);
            }
        }, 3000);
    }

    // 切換動畫播放狀態
    toggleAnimation() {
        this.isPlaying = !this.isPlaying;
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (this.isPlaying) {
            document.body.style.animationPlayState = 'running';
            pauseBtn.textContent = '暫停動畫';
            this.startMeteorShower();
        } else {
            document.body.style.animationPlayState = 'paused';
            pauseBtn.textContent = '播放動畫';
            if (this.meteorInterval) {
                clearInterval(this.meteorInterval);
                this.meteorInterval = null;
            }
        }
    }

    // 切換自動旋轉
    toggleAutoRotate() {
        this.autoRotate = !this.autoRotate;
        const autoRotateBtn = document.getElementById('autoRotateBtn');
        const galaxyContainer = document.querySelector('.galaxy-container');
        
        if (this.autoRotate) {
            autoRotateBtn.textContent = '停止旋轉';
            autoRotateBtn.classList.add('active');
            if (galaxyContainer) {
                galaxyContainer.style.animationDuration = '60s';
            }
        } else {
            autoRotateBtn.textContent = '自動旋轉';
            autoRotateBtn.classList.remove('active');
            if (galaxyContainer) {
                galaxyContainer.style.animationPlayState = 'paused';
            }
        }
    }

    // 切換全螢幕
    toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.warn('🌌 全螢幕請求失敗:', err.message);
                        // 添加用戶友好的錯誤處理
                        if (typeof updateAPIStatus === 'function') {
                            updateAPIStatus('全螢幕請求失敗: 瀏覽器不支援或被拒絕', 'warning');
                        }
                    });
                } else {
                    console.warn('🌌 瀏覽器不支援全螢幕 API');
                    if (typeof updateAPIStatus === 'function') {
                        updateAPIStatus('瀏覽器不支援全螢幕功能', 'warning');
                    }
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(err => {
                        console.warn('🌌 退出全螢幕失敗:', err.message);
                    });
                }
            }
        } catch (error) {
            console.error('🌌 全螢幕操作錯誤:', error);
            if (typeof updateAPIStatus === 'function') {
                updateAPIStatus(`全螢幕錯誤: ${error.message}`, 'error');
            }
        }
    }

    // 更新動畫速度
    setAnimationSpeed(speed) {
        CONFIG.DISPLAY_SETTINGS.ANIMATION_SPEED = speed;
        
        // 更新所有動畫的速度
        document.documentElement.style.setProperty('--animation-speed', speed);
        
        // 更新流星頻率
        if (this.meteorInterval) {
            clearInterval(this.meteorInterval);
            this.meteorInterval = setInterval(() => {
                this.createMeteor();
            }, CONFIG.VISUAL_EFFECTS.METEOR_FREQUENCY / speed);
        }
    }

    // 清理動畫
    cleanup() {
        if (this.meteorInterval) {
            clearInterval(this.meteorInterval);
            this.meteorInterval = null;
        }
        
        if (this.starInterval) {
            clearInterval(this.starInterval);
            this.starInterval = null;
        }
        
        // 清理所有流星
        this.meteors.forEach(meteor => meteor.remove());
        this.meteors = [];
    }

    // 重置動畫
    reset() {
        this.cleanup();
        this.init();
    }
}

// 行星動畫控制器
if (typeof window.PlanetAnimator === 'undefined') {
    class PlanetAnimator {
    constructor() {
        this.planets = [];
        this.animationFrameId = null;
    }

    // 添加行星動畫
    addPlanet(element, config = {}) {
        const planet = {
            element,
            x: config.x || 0,
            y: config.y || 0,
            vx: config.vx || (Math.random() - 0.5) * 0.5,
            vy: config.vy || (Math.random() - 0.5) * 0.5,
            rotation: 0,
            rotationSpeed: config.rotationSpeed || (Math.random() * 2 + 1),
            scale: 1,
            scaleDirection: 1,
            scaleSpeed: config.scaleSpeed || 0.01,
            hovered: false
        };
        
        this.planets.push(planet);
        return planet;
    }

    // 移除行星動畫
    removePlanet(element) {
        this.planets = this.planets.filter(planet => planet.element !== element);
    }

    // 開始動畫循環
    startAnimation() {
        if (this.animationFrameId) return;
        
        const animate = () => {
            this.updatePlanets();
            this.animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    // 停止動畫循環
    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    // 更新所有行星
    updatePlanets() {
        this.planets.forEach(planet => {
            // 旋轉動畫
            planet.rotation += planet.rotationSpeed;
            planet.element.style.transform = `rotate(${planet.rotation}deg)`;
            
            // 懸浮縮放動畫
            if (!planet.hovered) {
                planet.scale += planet.scaleDirection * planet.scaleSpeed;
                if (planet.scale >= 1.05 || planet.scale <= 0.95) {
                    planet.scaleDirection *= -1;
                }
                
                const sphere = planet.element.querySelector('.planet-sphere');
                if (sphere) {
                    sphere.style.transform = `scale(${planet.scale})`;
                }
            }
        });
    }

    // 設置行星懸停狀態
    setPlanetHover(element, hovered) {
        const planet = this.planets.find(p => p.element === element);
        if (planet) {
            planet.hovered = hovered;
            
            const sphere = element.querySelector('.planet-sphere');
            if (sphere) {
                if (hovered) {
                    sphere.style.transform = 'scale(1.2)';
                    sphere.style.transition = 'transform 0.3s ease';
                } else {
                    sphere.style.transition = 'transform 0.3s ease';
                    setTimeout(() => {
                        sphere.style.transition = '';
                    }, 300);
                }
            }
        }
    }

    // 清理所有動畫
    cleanup() {
        this.stopAnimation();
        this.planets = [];
    }

    // 創建星星（為了兼容 views.js）
    createStars(container, count) {
        if (window.animationController && window.animationController.createStarField) {
            window.animationController.createStarField();
        }
    }

    // 初始化宇宙（為了兼容 views.js）
    async initializeUniverse() {
        // 初始化動畫系統
        this.startAnimation();
        console.log('🌌 動畫宇宙初始化完成');
    }

    // 應用設置（為了兼容 views.js）
    applySettings(settings) {
        // 應用動畫設置
        console.log('🌌 應用動畫設置:', settings);
    }

    // 處理視窗大小變更（為了兼容 views.js）
    handleResize() {
        // 處理視窗大小變更
        console.log('🌌 處理動畫系統視窗大小變更');
        // 重新計算行星位置
        this.planets.forEach(planet => {
            // 可以在這裡重新計算位置
        });
    }

    // 獲取焦點行星（為了兼容 views.js）
    getFocusedPlanet() {
        return this.planets.find(p => p.hovered) || null;
    }

    // 創建星球點擊效果
    createPlanetClickEffect(planetElement, event) {
        const rect = planetElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 星球縮放和發光效果
        planetElement.style.transition = 'all 0.3s ease-out';
        planetElement.style.transform += ' scale(1.15)';
        planetElement.style.filter = 'brightness(1.4)';
        
        // 創建點擊波紋效果
        this.createClickRipple(centerX, centerY);
        
        // 創建點擊粒子效果
        this.createClickParticles(centerX, centerY);
        
        // 恢復星球狀態
        setTimeout(() => {
            planetElement.style.transform = planetElement.style.transform.replace(' scale(1.15)', '');
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
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            const angle = (360 / 6) * i;
            const distance = 30 + Math.random() * 20;
            const finalX = x + Math.cos(angle * Math.PI / 180) * distance;
            const finalY = y + Math.sin(angle * Math.PI / 180) * distance;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 6px;
                height: 6px;
                background: linear-gradient(45deg, #58a6ff, #007acc);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 999;
                box-shadow: 0 0 8px #58a6ff;
                transition: all 0.5s ease-out;
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
            }, 550);
        }
    }

    // ...existing code...
}

// 軌道動畫控制器
if (typeof window.OrbitAnimator === 'undefined') {
    class OrbitAnimator {
    constructor() {
        this.orbits = [];
    }

    // 創建軌道動畫
    createOrbit(container, config) {
        const orbit = document.createElement('div');
        orbit.className = 'orbit';
        orbit.style.width = config.radius * 2 + 'px';
        orbit.style.height = config.radius * 2 + 'px';
        orbit.style.setProperty('--orbit-duration', config.speed + 's');
        
        container.appendChild(orbit);
        
        // 添加軌道上的行星
        config.planets.forEach((planetData, index) => {
            const planet = this.createOrbitPlanet(planetData, index, config.planets.length, config.radius);
            orbit.appendChild(planet);
        });
        
        this.orbits.push(orbit);
        return orbit;
    }

    // 創建軌道行星
    createOrbitPlanet(planetData, index, total, radius) {
        const planet = document.createElement('div');
        planet.className = 'orbit-planet';
        planet.style.setProperty('--orbit-radius', radius + 'px');
        planet.style.setProperty('--orbit-duration', (30 + Math.random() * 30) + 's');
        planet.style.animationDelay = (index / total * 100) + '%';
        
        const sphere = document.createElement('div');
        sphere.className = 'planet-sphere medium';
        sphere.style.setProperty('--planet-gradient', CONFIG.PLANET_THEMES[planetData.type]?.gradient || CONFIG.PLANET_THEMES.stable.gradient);
        sphere.style.boxShadow = CONFIG.PLANET_THEMES[planetData.type]?.glow || CONFIG.PLANET_THEMES.stable.glow;
        sphere.textContent = planetData.icon;
        
        planet.appendChild(sphere);
        
        // 添加點擊事件
        planet.addEventListener('click', (event) => {
            // 創建星球點擊落地效果
            createPlanetClickEffect(event.target, event);
            
            if (window.planetDisplay) {
                window.planetDisplay.showExtensionDetails(planetData);
            }
        });
        
        return planet;
    }

    // 清理軌道
    cleanup() {
        this.orbits.forEach(orbit => orbit.remove());
        this.orbits = [];
    }
}

// 立即導出類別到全域
window.OrbitAnimator = OrbitAnimator;

} // 結束 if (typeof window.OrbitAnimator === 'undefined') 條件區塊

// 立即導出類別到全域
window.AnimationController = AnimationController;

} // 結束 if (typeof window.AnimationController === 'undefined') 主要條件區塊

// 立即導出類別到全域
window.PlanetAnimator = PlanetAnimator;

} // 結束 if (typeof window.PlanetAnimator === 'undefined') 條件區塊

// 全域動畫控制器實例 - 延遲初始化以避免性能問題
if (typeof window.animationController === 'undefined') {
    // 只註冊類別，不自動創建實例
    console.log('🌌 動畫系統類別已註冊（延遲初始化）');
    
    // 提供手動初始化方法
    window.initAnimationSystem = function() {
        if (typeof window.animationController === 'undefined') {
            window.animationController = new AnimationController();
            window.planetAnimator = new PlanetAnimator();
            // 為了向後兼容，也設置別名
            window.planetAnimations = window.planetAnimator;
            window.orbitAnimator = new OrbitAnimator();
            
            console.log('🌌 動畫系統已手動初始化');
            return true;
        }
        return false;
    };
}
