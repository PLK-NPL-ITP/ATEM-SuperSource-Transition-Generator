/**
 * Internationalization and Theme Management
 * 
 * Author: Jason Yang Jiepeng, NPL ITP Infrastructure (Development) Group
 * Date: 2024-12-06
 * Copyright (c) 2024 NPL ITP Infrastructure (Development) Group
 * All rights reserved.
 */

// ============== Translation Database ==============

const translations = {
    en: {
        header: {
            title: 'SuperSource Transition',
            subtitle: 'ATEM SuperSource Transition XML Generator'
        },
        preview: {
            title: 'Position Preview',
            dragPrecision: 'Drag Precision',
            precisionPrecise: 'Precise',
            precisionMedium: 'Medium',
            precisionCoarse: 'Coarse',
            initialPosition: 'Initial Position',
            transforming: 'Transforming',
            finalPosition: 'Final Position',
            visibleArea: 'Visible Area: X [-16, 16] | Y [-9, 9] (16:9)',
            prevFrame: 'Previous Frame',
            playPause: 'Play/Pause',
            nextFrame: 'Next Frame'
        },
        boxControl: {
            title: 'Box Parameter Control',
            loadSample: 'Load Sample',
            dragPrecision: 'Drag Precision',
            initialPosition: 'Initial Position',
            transforming: 'Transforming',
            finalPosition: 'Final Position',
            box: 'Box',
            copyBox: 'Copy entire Box',
            resetBox: 'Reset Box',
            size: 'Size',
            xPos: 'X Pos',
            yPos: 'Y Pos',
            maskCrop: 'Mask/Crop',
            left: 'Left',
            right: 'Right',
            top: 'Top',
            bottom: 'Bottom',
            copy: 'Copy',
            linkLR: 'Link Left/Right',
            linkTB: 'Link Top/Bottom',
            copyParam: 'Copy',
            cancelCopy: 'Cancel Copy',
            paste: 'Paste'
        },
        params: {
            frames: 'Transition Frames',
            fps: 'Frames Per Second (FPS)',
            easingCategory: 'Easing Category',
            easingType: 'Easing Curve',
            curvePreview: 'Curve Preview',
            basic: 'Basic',
            quadratic: 'Quadratic',
            cubic: 'Cubic',
            quartic: 'Quartic',
            quintic: 'Quintic',
            sine: 'Sine',
            exponential: 'Exponential',
            circular: 'Circular',
            back: 'Back',
            elastic: 'Elastic',
            bounce: 'Bounce'
        },
        io: {
            initialXml: 'Initial Position XML',
            finalXml: 'Final Position XML',
            copy: 'Copy',
            save: 'Save',
            clear: 'Clear',
            format: 'Format',
            swap: 'Swap Positions',
            initialPlaceholder: 'Paste initial position SuperSource XML...',
            finalPlaceholder: 'Paste final position SuperSource XML...'
        },
        output: {
            title: 'Output Preview',
            copy: 'Copy',
            save: 'Save',
            placeholder: '<!-- Generated XML will be displayed here -->'
        },
        footer: {
            title: 'SuperSource Transition Generator | NPL ITP Infrastructure (Development) Group',
            copyright: '© 2025 Jason Yang Jiepeng. All rights reserved.'
        },
        toast: {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info',
            copied: 'Copied',
            saved: 'Saved',
            loaded: 'Loaded',
            cleared: 'Cleared',
            formatted: 'Formatted',
            swapped: 'Swapped',
            generated: 'Generated',
            reset: 'Reset',
            cancelled: 'Cancelled',
            pasted: 'Pasted',
            noContent: 'No Content',
            parseError: 'Parse Error',
            generateError: 'Generate Error',
            invalidParameter: 'Invalid Parameter',
            missingInput: 'Missing Input',
            emptyXml: 'XML content is empty',
            noValidOps: 'No valid SuperSource Box operations found',
            copiedSuccess: 'Copied to clipboard successfully',
            savedSuccess: 'File saved successfully',
            loadedSuccess: 'Sample data loaded',
            clearedSuccess: 'Cleared successfully',
            formattedSuccess: 'XML formatted and all parameters filled',
            formattedWithRemoved: 'XML formatted, {0} invalid lines removed',
            swappedSuccess: 'Initial ↔ Final swapped',
            generatedSuccess: 'Transition animation generated',
            resetSuccess: 'Reset to default values',
            cancelledSuccess: 'Copy cancelled',
            pastedSuccess: 'Pasted successfully',
            noContentWarning: 'No content to copy',
            noContentToSave: 'No content to save',
            parseErrorMsg: 'Failed to parse XML',
            formatErrorMsg: 'Invalid XML format',
            generateErrorMsg: 'Failed to generate',
            invalidFrames: 'Frame count must be greater than 0',
            missingXml: 'Please enter initial and final position XML',
            dragPrecisionChanged: 'Drag Precision',
            precisionPrecise: 'Precise (No limit)',
            precisionMedium: 'Medium (Position 1/6, Size 1/18)',
            precisionCoarse: 'Coarse (Position 1/3, Size 1/9)',
            boxInfo: 'Box',
            enabledBoxes: 'enabled boxes',
            paramInfo: 'Parameter',
            frames: 'Frames',
            easing: 'Easing',
            activeBoxes: 'Active Boxes',
            initialEmpty: 'Initial position is empty',
            finalEmpty: 'Final position is empty',
            languageSwitched: 'Language switched to English',
            themeSwitched: 'Theme switched',
            lightMode: 'Light Mode',
            darkMode: 'Dark Mode',
            // Additional toast messages for app.js
            boxUnlocked: 'Box Unlocked',
            boxUnlockedMsg: 'Now you can interact with any box',
            boxLocked: 'Box Locked',
            boxLockedMsg: 'Locked to Box {0}, double-click or click empty area to unlock',
            allParams: 'All parameters',
            pasteToBox: 'Pasted to Box {0}',
            copiedParam: 'Copied: {0}: {1}',
            pastedParam: '{0} → Box {1}',
            copiedBox: 'Copied all parameters of Box {0}',
            pastedBox: 'All parameters → Box {0}',
            copyAction: 'Copy',
            pasteAction: 'Paste',
            previewSuccess: 'Preview Success',
            initialPreview: 'Initial: {0} enabled boxes',
            finalPreview: 'Final: {0} enabled boxes',
            parseInitialError: 'Failed to parse Initial XML: {0}',
            parseFinalError: 'Failed to parse Final XML: {0}',
            initialCleared: 'Initial position cleared',
            finalCleared: 'Final position cleared',
            generatedFrames: 'Generated {0} frames transition',
            copyFailed: 'Copy failed',
            saveFailed: 'Save failed',
            fileDownloaded: 'File downloaded',
            initialXmlCopied: 'Initial position XML copied to clipboard',
            finalXmlCopied: 'Final position XML copied to clipboard',
            outputInfo: 'Frames: {0} | Easing: {1} | Active Boxes: [{2}]'
        }
    },
    zh: {
        header: {
            title: 'SuperSource Transition',
            subtitle: 'ATEM SuperSource 过渡动画 XML 生成器'
        },
        preview: {
            title: '位置预览',
            dragPrecision: 'Drag Precision',
            precisionPrecise: 'Precise',
            precisionMedium: 'Medium',
            precisionCoarse: 'Coarse',
            initialPosition: 'Initial Position',
            transforming: 'Transforming',
            finalPosition: 'Final Position',
            visibleArea: '可视区域: X [-16, 16] | Y [-9, 9] (16:9)',
            prevFrame: '上一帧',
            playPause: '播放/暂停',
            nextFrame: '下一帧'
        },
        boxControl: {
            title: 'Box 参数控制',
            loadSample: '加载示例',
            dragPrecision: 'Drag Precision',
            initialPosition: 'Initial Position',
            transforming: 'Transforming',
            finalPosition: 'Final Position',
            box: 'Box',
            copyBox: '复制整个 Box',
            resetBox: '重置 Box',
            size: 'Size',
            xPos: 'X Pos',
            yPos: 'Y Pos',
            maskCrop: 'Mask/Crop',
            left: 'Left',
            right: 'Right',
            top: 'Top',
            bottom: 'Bottom',
            copy: '复制',
            linkLR: '链接 Left/Right',
            linkTB: '链接 Top/Bottom',
            copyParam: '复制',
            cancelCopy: '取消复制',
            paste: '粘贴'
        },
        params: {
            frames: '过渡帧数',
            fps: '每秒帧数 (FPS)',
            easingCategory: '缓动分类',
            easingType: '缓动曲线',
            curvePreview: '曲线预览',
            basic: '基础 (Basic)',
            quadratic: '二次方 (Quadratic)',
            cubic: '三次方 (Cubic)',
            quartic: '四次方 (Quartic)',
            quintic: '五次方 (Quintic)',
            sine: '正弦 (Sine)',
            exponential: '指数 (Exponential)',
            circular: '圆形 (Circular)',
            back: '回弹 (Back)',
            elastic: '弹性 (Elastic)',
            bounce: '弹跳 (Bounce)'
        },
        io: {
            initialXml: '初始位置 XML',
            finalXml: '最终位置 XML',
            copy: '复制',
            save: '保存',
            clear: '清空',
            format: '格式化',
            swap: '交换位置',
            initialPlaceholder: '粘贴初始位置的 SuperSource XML...',
            finalPlaceholder: '粘贴最终位置的 SuperSource XML...'
        },
        output: {
            title: '输出预览',
            copy: '复制',
            save: '保存',
            placeholder: '<!-- 生成的 XML 将在这里显示 -->'
        },
        footer: {
            title: 'SuperSource Transition Generator | NPL ITP Infrastructure (Development) Group',
            copyright: '© 2025 Jason Yang Jiepeng. All rights reserved.'
        },
        toast: {
            success: '成功',
            error: '错误',
            warning: '警告',
            info: '提示',
            copied: '已复制',
            saved: '已保存',
            loaded: '已加载',
            cleared: '已清空',
            formatted: '格式化完成',
            swapped: '交换完成',
            generated: '生成成功',
            reset: '已重置',
            cancelled: '已取消',
            pasted: '已粘贴',
            noContent: '无内容',
            parseError: '解析错误',
            generateError: '生成失败',
            invalidParameter: '参数错误',
            missingInput: '缺少输入',
            emptyXml: 'XML 内容为空',
            noValidOps: '未找到有效的 SuperSource Box 操作',
            copiedSuccess: '已复制到剪贴板',
            savedSuccess: '文件已保存',
            loadedSuccess: '示例数据已加载',
            clearedSuccess: '清空成功',
            formattedSuccess: 'XML 已格式化并补全所有参数',
            formattedWithRemoved: 'XML 已格式化，已移除 {0} 行无效内容',
            swappedSuccess: 'Initial ↔ Final 已交换',
            generatedSuccess: '已生成过渡动画',
            resetSuccess: '已恢复默认值',
            cancelledSuccess: '复制已取消',
            pastedSuccess: '粘贴成功',
            noContentWarning: '没有内容可复制',
            noContentToSave: '没有内容可保存',
            parseErrorMsg: '解析 XML 失败',
            formatErrorMsg: 'XML 格式无效',
            generateErrorMsg: '生成失败',
            invalidFrames: '帧数必须大于 0',
            missingXml: '请输入初始位置和最终位置的 XML',
            dragPrecisionChanged: '拖动精度',
            precisionPrecise: '精确 (无限制)',
            precisionMedium: '中等 (位置 1/6, 大小 1/18)',
            precisionCoarse: '粗略 (位置 1/3, 大小 1/9)',
            boxInfo: 'Box',
            enabledBoxes: '个启用的 Box',
            paramInfo: '参数',
            frames: '帧数',
            easing: '缓动',
            activeBoxes: '活动Box',
            initialEmpty: '初始位置为空',
            finalEmpty: '最终位置为空',
            languageSwitched: '语言已切换为中文',
            themeSwitched: '主题已切换',
            lightMode: '亮色模式',
            darkMode: '暗色模式',
            // Additional toast messages for app.js
            boxUnlocked: 'Box 解锁',
            boxUnlockedMsg: '现在可以与任意 Box 交互',
            boxLocked: 'Box 锁定',
            boxLockedMsg: '已锁定到 Box {0}，双击或点击空白解锁',
            allParams: '全部参数',
            pasteToBox: '全部参数 → Box {0}',
            copiedParam: '已复制: {0}: {1}',
            pastedParam: '{0} → Box {1}',
            copiedBox: '已复制 Box {0} 全部参数',
            pastedBox: '全部参数 → Box {0}',
            copyAction: '复制',
            pasteAction: '粘贴',
            previewSuccess: '预览成功',
            initialPreview: 'Initial: {0} 个启用的 Box',
            finalPreview: 'Final: {0} 个启用的 Box',
            parseInitialError: '解析初始位置 XML 失败: {0}',
            parseFinalError: '解析最终位置 XML 失败: {0}',
            initialCleared: '初始位置已清空',
            finalCleared: '最终位置已清空',
            generatedFrames: '已生成 {0} 帧过渡动画',
            copyFailed: '复制失败',
            saveFailed: '保存失败',
            fileDownloaded: '文件已下载',
            initialXmlCopied: '初始位置 XML 已复制到剪贴板',
            finalXmlCopied: '最终位置 XML 已复制到剪贴板',
            outputInfo: '帧数: {0} | 缓动: {1} | 活动Box: [{2}]'
        }
    }
};

// ============== I18n Manager ==============

class I18nManager {
    constructor() {
        this.currentLang = 'en'; // Default to English
        this.init();
    }
    
    init() {
        // Load saved language preference, default to English
        const savedLang = localStorage.getItem('language');
        this.currentLang = savedLang || 'en';
        this.applyTranslations();
    }
    
    switchLanguage(lang) {
        if (!translations[lang]) return;
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.applyTranslations();
        
        // Update language label in toggle button
        const languageLabel = document.querySelector('.language-label');
        if (languageLabel) {
            languageLabel.textContent = lang === 'en' ? 'EN' : 'ZH';
        }
        
        // Show toast notification
        const message = lang === 'en' ? 
            translations.en.toast.languageSwitched : 
            translations.zh.toast.languageSwitched;
        if (typeof toast !== 'undefined') {
            toast.info(translations[lang].toast.info, message);
        }
    }
    
    toggleLanguage() {
        const newLang = this.currentLang === 'en' ? 'zh' : 'en';
        this.switchLanguage(newLang);
    }
    
    applyTranslations() {
        const lang = this.currentLang;
        const t = translations[lang];
        
        // Apply translations to elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = this.getNestedValue(t, key);
            if (value) {
                if (element.tagName === 'INPUT' && element.placeholder !== undefined) {
                    element.placeholder = value;
                } else if (element.tagName === 'TEXTAREA' && element.placeholder !== undefined) {
                    element.placeholder = value;
                } else {
                    element.textContent = value;
                }
            }
        });
        
        // Apply translations to elements with data-i18n-title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const value = this.getNestedValue(t, key);
            if (value) {
                element.title = value;
            }
        });
        
        // Apply translations to elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const value = this.getNestedValue(t, key);
            if (value) {
                element.placeholder = value;
            }
        });
        
        // Update copy/paste button titles based on class
        document.querySelectorAll('.copy-param-btn').forEach(btn => {
            btn.title = t.boxControl.copyParam;
        });
        
        document.querySelectorAll('.copy-box-btn').forEach(btn => {
            btn.title = t.boxControl.copyBox;
        });
        
        document.querySelectorAll('.reset-box-btn').forEach(btn => {
            btn.title = t.boxControl.resetBox;
        });
        
        document.querySelectorAll('.link-btn[data-link="lr"]').forEach(btn => {
            btn.title = t.boxControl.linkLR;
        });
        
        document.querySelectorAll('.link-btn[data-link="tb"]').forEach(btn => {
            btn.title = t.boxControl.linkTB;
        });
        
        // Update select options for easing category
        const easingCategoryEl = document.getElementById('easingCategory');
        if (easingCategoryEl) {
            const options = easingCategoryEl.querySelectorAll('option');
            options.forEach(option => {
                const value = option.value;
                if (t.params[value]) {
                    option.textContent = t.params[value];
                }
            });
        }
    }
    
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    
    t(key) {
        return this.getNestedValue(translations[this.currentLang], key) || key;
    }
    
    // Format a translation string with placeholders {0}, {1}, etc.
    tf(key, ...args) {
        let text = this.t(key);
        args.forEach((arg, index) => {
            text = text.replace(new RegExp(`\\{${index}\\}`, 'g'), arg);
        });
        return text;
    }
}

// ============== Theme Manager ==============

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }
    
    init() {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            // Detect system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.currentTheme = 'dark';
            } else {
                this.currentTheme = 'light';
            }
        }
        
        this.applyTheme(this.currentTheme);
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('theme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.switchTheme(newTheme);
    }
    
    switchTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme(theme);
        
        // Show toast notification
        const i18n = window.i18nManager;
        if (i18n && typeof toast !== 'undefined') {
            const themeName = theme === 'light' ? i18n.t('toast.lightMode') : i18n.t('toast.darkMode');
            toast.info(i18n.t('toast.themeSwitched'), themeName);
        }
    }
    
    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme toggle button icon
        const lightIcon = document.querySelector('.theme-icon-light');
        const darkIcon = document.querySelector('.theme-icon-dark');
        
        if (lightIcon && darkIcon) {
            if (theme === 'dark') {
                lightIcon.style.display = 'none';
                darkIcon.style.display = 'block';
            } else {
                lightIcon.style.display = 'block';
                darkIcon.style.display = 'none';
            }
        }
        
        // Redraw all canvases if they exist
        if (window.App && window.App.previewCanvas) {
            window.App.previewCanvas.redraw();
        }
        
        // Redraw easing preview canvas
        if (window.App && window.App.mainApp && window.App.mainApp.easingPreviewCanvas) {
            const easingType = document.getElementById('easingType')?.value || 'linear';
            window.App.mainApp.easingPreviewCanvas.draw(easingType);
        }
    }
}

// ============== Initialize ==============

// Create global instances
window.i18nManager = new I18nManager();
window.themeManager = new ThemeManager();

// Bind toggle buttons
document.addEventListener('DOMContentLoaded', () => {
    const languageToggle = document.getElementById('languageToggle');
    const themeToggle = document.getElementById('themeToggle');
    
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            window.i18nManager.toggleLanguage();
        });
        
        // Set initial language label
        const languageLabel = document.querySelector('.language-label');
        if (languageLabel) {
            languageLabel.textContent = window.i18nManager.currentLang === 'en' ? 'EN' : '中文';
        }
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            window.themeManager.toggleTheme();
        });
    }
});
