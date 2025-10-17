// 学園祭Instagramまとめサイト - メインJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // ページ読み込み時のアニメーション
    initPageAnimations();
    
    // ボタンのクリック効果
    initButtonEffects();
    
    // アクセス解析（簡易版）
    trackPageView();
    
    // パフォーマンス最適化
    optimizeImages();
});

/**
 * ページ読み込み時のアニメーション初期化
 */
function initPageAnimations() {
    // カードの順次表示アニメーション
    const cards = document.querySelectorAll('.account-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
    });
    
    // ヘッダーのフェードイン
    const header = document.querySelector('.header');
    header.style.opacity = '0';
    setTimeout(() => {
        header.style.transition = 'opacity 1s ease';
        header.style.opacity = '1';
    }, 100);
}

/**
 * ボタンのクリック効果初期化
 */
function initButtonEffects() {
    const buttons = document.querySelectorAll('.instagram-button');
    
    buttons.forEach(button => {
        // クリック時のリップル効果
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
            
            // アナリティクス（簡易版）
            const accountName = this.closest('.account-card').querySelector('.account-name').textContent;
            console.log(`Instagram link clicked: ${accountName}`);
            
            // フィードバック効果
            showClickFeedback(this);
        });
        
        // ホバー効果の最適化
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
}

/**
 * リップル効果の作成
 */
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 10;
    `;
    
    // リップルアニメーションのCSS
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * クリックフィードバック表示
 */
function showClickFeedback(button) {
    const originalText = button.innerHTML;
    
    // 短時間フィードバックを表示
    button.innerHTML = '<i class="fas fa-check"></i> 開いています...';
    button.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 1500);
}

/**
 * 簡易アクセス解析
 */
function trackPageView() {
    const viewData = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        screenSize: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`
    };
    
    console.log('Page view tracked:', viewData);
    
    // ローカルストレージに保存（デバッグ用）
    try {
        const visits = JSON.parse(localStorage.getItem('festivalSiteVisits') || '[]');
        visits.push(viewData);
        localStorage.setItem('festivalSiteVisits', JSON.stringify(visits));
    } catch (e) {
        console.log('Cannot store visit data:', e);
    }
}

/**
 * 画像最適化
 */
function optimizeImages() {
    // 遅延読み込み対応（将来の画像追加に備えて）
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * パフォーマンス監視
 */
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perf = performance.getEntriesByType('navigation')[0];
                console.log('Page load performance:', {
                    loadTime: perf.loadEventEnd - perf.loadEventStart,
                    domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
                    totalTime: perf.loadEventEnd - perf.fetchStart
                });
            }, 0);
        });
    }
}

/**
 * エラーハンドリング
 */
window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
});

// パフォーマンス監視開始
monitorPerformance();

/**
 * PWA対応のための基礎設定
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // サービスワーカーは実装していませんが、将来の拡張に備えて準備
        console.log('Service Worker support detected');
    });
}

/**
 * アクセシビリティの向上
 */
document.addEventListener('keydown', (event) => {
    // Enterキーでのボタン操作
    if (event.key === 'Enter' && event.target.classList.contains('instagram-button')) {
        event.target.click();
    }
});

/**
 * モバイル向けのタッチ最適化
 */
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // タッチデバイス用の追加スタイル
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `
        .touch-device .instagram-button {
            min-height: 48px;
            min-width: 48px;
        }
        
        .touch-device .account-card:hover {
            transform: none;
        }
        
        .touch-device .account-card:active {
            transform: scale(0.98);
        }
    `;
    document.head.appendChild(touchStyle);
}

console.log('🎉 学園祭Instagramまとめサイトが正常に読み込まれました！');