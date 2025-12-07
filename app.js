/**
 * SuperSource Transition Generator - Main Application
 * 
 * Author: Jason Yang Jiepeng, NPL ITP Infrastructure (Development) Group
 * Date: 2024-12-04
 * Copyright (c) 2025 NPL ITP Infrastructure (Development) Group
 * All rights reserved.
 */

// ============== Easing Functions ==============

const EasingFunctions = {
    linear: t => t,
    
    ease_in: t => t * t,
    ease_out: t => t * (2 - t),
    ease_in_out: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    
    ease_in_quad: t => t * t,
    ease_out_quad: t => t * (2 - t),
    ease_in_out_quad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    
    ease_in_cubic: t => t * t * t,
    ease_out_cubic: t => { t -= 1; return t * t * t + 1; },
    ease_in_out_cubic: t => t < 0.5 ? 4 * t * t * t : 0.5 * Math.pow(2 * t - 2, 3) + 1,
    
    ease_in_quart: t => t * t * t * t,
    ease_out_quart: t => { t -= 1; return 1 - t * t * t * t; },
    ease_in_out_quart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * Math.pow(t - 1, 4),
    
    ease_in_quint: t => t * t * t * t * t,
    ease_out_quint: t => { t -= 1; return t * t * t * t * t + 1; },
    ease_in_out_quint: t => t < 0.5 ? 16 * t * t * t * t * t : 16 * Math.pow(t - 1, 5) + 1,
    
    ease_in_sine: t => 1 - Math.cos(t * Math.PI / 2),
    ease_out_sine: t => Math.sin(t * Math.PI / 2),
    ease_in_out_sine: t => 0.5 * (1 - Math.cos(Math.PI * t)),
    
    ease_in_expo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
    ease_out_expo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    ease_in_out_expo: t => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
        return 1 - 0.5 * Math.pow(2, -20 * t + 10);
    },
    
    ease_in_circ: t => 1 - Math.sqrt(1 - t * t),
    ease_out_circ: t => { t -= 1; return Math.sqrt(1 - t * t); },
    ease_in_out_circ: t => t < 0.5 
        ? 0.5 * (1 - Math.sqrt(1 - 4 * t * t)) 
        : 0.5 * (Math.sqrt(1 - Math.pow(2 * t - 2, 2)) + 1),
    
    ease_in_back: t => {
        const c1 = 1.70158;
        return t * t * ((c1 + 1) * t - c1);
    },
    ease_out_back: t => {
        const c1 = 1.70158;
        t -= 1;
        return t * t * ((c1 + 1) * t + c1) + 1;
    },
    ease_in_out_back: t => {
        const c2 = 1.70158 * 1.525;
        if (t < 0.5) return 0.5 * (4 * t * t * ((c2 + 1) * 2 * t - c2));
        t = 2 * t - 2;
        return 0.5 * (t * t * ((c2 + 1) * t + c2) + 2);
    },
    
    ease_in_elastic: t => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const c4 = (2 * Math.PI) / 3;
        return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
    },
    ease_out_elastic: t => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const c4 = (2 * Math.PI) / 3;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
    ease_in_out_elastic: t => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const c5 = (2 * Math.PI) / 4.5;
        if (t < 0.5) return -0.5 * Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5);
        return 0.5 * Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5) + 1;
    },
    
    ease_out_bounce: t => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) return n1 * t * t;
        if (t < 2 / d1) { t -= 1.5 / d1; return n1 * t * t + 0.75; }
        if (t < 2.5 / d1) { t -= 2.25 / d1; return n1 * t * t + 0.9375; }
        t -= 2.625 / d1;
        return n1 * t * t + 0.984375;
    },
    ease_in_bounce: t => 1 - EasingFunctions.ease_out_bounce(1 - t),
    ease_in_out_bounce: t => t < 0.5 
        ? 0.5 * EasingFunctions.ease_in_bounce(2 * t) 
        : 0.5 * EasingFunctions.ease_out_bounce(2 * t - 1) + 0.5
};

// Easing categories mapping
const EasingCategories = {
    basic: ['linear', 'ease_in', 'ease_out', 'ease_in_out'],
    quadratic: ['ease_in_quad', 'ease_out_quad', 'ease_in_out_quad'],
    cubic: ['ease_in_cubic', 'ease_out_cubic', 'ease_in_out_cubic'],
    quartic: ['ease_in_quart', 'ease_out_quart', 'ease_in_out_quart'],
    quintic: ['ease_in_quint', 'ease_out_quint', 'ease_in_out_quint'],
    sine: ['ease_in_sine', 'ease_out_sine', 'ease_in_out_sine'],
    exponential: ['ease_in_expo', 'ease_out_expo', 'ease_in_out_expo'],
    circular: ['ease_in_circ', 'ease_out_circ', 'ease_in_out_circ'],
    back: ['ease_in_back', 'ease_out_back', 'ease_in_out_back'],
    elastic: ['ease_in_elastic', 'ease_out_elastic', 'ease_in_out_elastic'],
    bounce: ['ease_in_bounce', 'ease_out_bounce', 'ease_in_out_bounce']
};

// ============== Box State Class ==============

class BoxState {
    constructor(boxIndex, superSource = 0) {
        this.boxIndex = boxIndex;
        this.superSource = superSource;
        this.enable = false;
        this.size = 1.0;
        this.xPosition = 0.0;
        this.yPosition = 0.0;
        this.maskEnable = false;
        this.maskLeft = 0.0;
        this.maskTop = 0.0;
        this.maskRight = 0.0;
        this.maskBottom = 0.0;
    }
    
    // Clone this state
    clone() {
        const cloned = new BoxState(this.boxIndex, this.superSource);
        cloned.enable = this.enable;
        cloned.size = this.size;
        cloned.xPosition = this.xPosition;
        cloned.yPosition = this.yPosition;
        cloned.maskEnable = this.maskEnable;
        cloned.maskLeft = this.maskLeft;
        cloned.maskTop = this.maskTop;
        cloned.maskRight = this.maskRight;
        cloned.maskBottom = this.maskBottom;
        return cloned;
    }
    
    // Copy from another state
    copyFrom(other) {
        this.superSource = other.superSource || 0;
        this.enable = other.enable || false;
        this.size = other.size !== undefined ? other.size : 1.0;
        this.xPosition = other.xPosition !== undefined ? other.xPosition : 0;
        this.yPosition = other.yPosition !== undefined ? other.yPosition : 0;
        this.maskEnable = other.maskEnable || false;
        this.maskLeft = other.maskLeft !== undefined ? other.maskLeft : 0;
        this.maskRight = other.maskRight !== undefined ? other.maskRight : 0;
        this.maskTop = other.maskTop !== undefined ? other.maskTop : 0;
        this.maskBottom = other.maskBottom !== undefined ? other.maskBottom : 0;
    }
    
    // Reset to default
    reset() {
        this.superSource = 0;
        this.enable = false;
        this.size = 1.0;
        this.xPosition = 0.0;
        this.yPosition = 0.0;
        this.maskEnable = false;
        this.maskLeft = 0.0;
        this.maskTop = 0.0;
        this.maskRight = 0.0;
        this.maskBottom = 0.0;
    }
}

// ============== Macro Data Class ==============

class MacroData {
    constructor(index) {
        this.index = index;
        this.name = '';
        this.description = '';
        this.outputXML = ''; // Complete transition XML (output preview)
        this.isModified = false; // Has been modified since import/init
        this.isValid = true; // Can be parsed correctly
    }
    
    clone() {
        const cloned = new MacroData(this.index);
        cloned.name = this.name;
        cloned.description = this.description;
        cloned.outputXML = this.outputXML;
        cloned.isModified = this.isModified;
        cloned.isValid = this.isValid;
        return cloned;
    }
}

// ============== Global Application State ==============
// Pure data storage - single source of truth for all box data

const AppState = {
    // Box states - the ONLY source of truth
    initialStates: [new BoxState(0), new BoxState(1), new BoxState(2), new BoxState(3)],
    finalStates: [new BoxState(0), new BoxState(1), new BoxState(2), new BoxState(3)],
    
    // Current view mode: 'initial', 'final', 'transforming'
    viewMode: 'initial',
    
    // Drag precision: 'precise', 'medium', 'coarse'
    dragPrecision: 'medium',
    
    // Link states for mask controls
    linkStates: {
        0: { lr: true, tb: true },
        1: { lr: true, tb: true },
        2: { lr: true, tb: true },
        3: { lr: true, tb: true }
    },
    
    // Active box for canvas interaction (null = any)
    activeBoxIndex: null,
    
    // Transforming states for animation preview
    transformingStates: null,
    
    // MacroPool - array of 100 macros (indices 0-99)
    macroPool: Array.from({ length: 100 }, (_, i) => new MacroData(i)),
    
    // Current selected macro index in MacroPool
    currentMacroIndex: null,
    
    // Original MacroPool snapshot (for detecting modifications)
    originalMacroPool: null,
    
    // Get current editable states based on view mode
    getCurrentStates() {
        if (this.viewMode === 'transforming' && this.transformingStates) {
            return this.transformingStates;
        }
        return this.viewMode === 'initial' ? this.initialStates : this.finalStates;
    },
    
    // Get editable states (never transforming)
    getEditableStates() {
        return this.viewMode === 'initial' ? this.initialStates : this.finalStates;
    },
    
    // Snap value based on precision (for position)
    snapPosition(value) {
        if (this.dragPrecision === 'precise') return value;
        const step = this.dragPrecision === 'medium' ? 1/6 : 1/3;
        return Math.round(value / step) * step;
    },
    
    // Snap value based on precision (for size)
    snapSize(value) {
        if (this.dragPrecision === 'precise') return value;
        const step = this.dragPrecision === 'medium' ? 1/18 : 1/9;
        return Math.round(value / step) * step;
    },
    
    // Snap value based on precision (for mask)
    snapMask(value) {
        if (this.dragPrecision === 'precise') return value;
        const step = this.dragPrecision === 'medium' ? 1 : 2;
        return Math.round(value / step) * step;
    },
    
    // Generate XML from states
    generateXML(mode) {
        const states = mode === 'initial' ? this.initialStates : this.finalStates;
        const lines = [];
        
        for (let i = 0; i < 4; i++) {
            const box = states[i];
            const ss = box.superSource;
            
            lines.push(`<Op id="SuperSourceV2BoxEnable" superSource="${ss}" boxIndex="${i}" enable="${box.enable ? 'True' : 'False'}" />`);
            lines.push(`<Op id="SuperSourceV2BoxSize" superSource="${ss}" boxIndex="${i}" size="${box.size.toFixed(4)}"/>`);
            lines.push(`<Op id="SuperSourceV2BoxXPosition" superSource="${ss}" boxIndex="${i}" xPosition="${box.xPosition.toFixed(4)}"/>`);
            lines.push(`<Op id="SuperSourceV2BoxYPosition" superSource="${ss}" boxIndex="${i}" yPosition="${box.yPosition.toFixed(4)}"/>`);
            lines.push(`<Op id="SuperSourceV2BoxMaskEnable" superSource="${ss}" boxIndex="${i}" enable="${box.maskEnable ? 'True' : 'False'}"/>`);
            lines.push(`<Op id="SuperSourceV2BoxMaskLeft" superSource="${ss}" boxIndex="${i}" left="${box.maskLeft.toFixed(2)}"/>`);
            lines.push(`<Op id="SuperSourceV2BoxMaskTop" superSource="${ss}" boxIndex="${i}" top="${box.maskTop.toFixed(2)}"/>`);
            lines.push(`<Op id="SuperSourceV2BoxMaskRight" superSource="${ss}" boxIndex="${i}" right="${box.maskRight.toFixed(2)}"/>`);
            lines.push(`<Op id="SuperSourceV2BoxMaskBottom" superSource="${ss}" boxIndex="${i}" bottom="${box.maskBottom.toFixed(2)}"/>`);
        }
        
        return lines.join('\n');
    }
};

// ============== Global App Controller ==============
// Single point of control for all UI updates

const App = {
    // References to UI components (set during init)
    previewCanvas: null,
    boxControlPanel: null,
    initialXmlEl: null,
    finalXmlEl: null,
    mainApp: null, // SuperSourceTransitionApp instance
    
    // Initialize references
    init(mainApp) {
        this.mainApp = mainApp;
        this.previewCanvas = mainApp.previewCanvas;
        this.boxControlPanel = mainApp.boxControlPanel;
        this.initialXmlEl = mainApp.initialXmlEl;
        this.finalXmlEl = mainApp.finalXmlEl;
    },
    
    /**
     * UNIFIED UPDATE FUNCTION
     * All data changes should eventually call this function
     * 
     * @param {string} source - What triggered the update (for debugging/optimization)
     *                          'canvas' | 'panel' | 'xml' | 'mode' | 'load' | 'reset' | 'swap'
     * @param {object} options - Optional parameters
     *                          { boxIndex, skipCanvas, skipPanel, skipXml, skipAutoGenerate }
     */
    update(source = 'unknown', options = {}) {
        const { 
            boxIndex = null,        // Specific box that changed (null = all)
            skipCanvas = false,     // Skip canvas redraw
            skipPanel = false,      // Skip control panel update
            skipXml = false,        // Skip XML textarea update
            skipAutoGenerate = false // Skip auto-generate
        } = options;
        
        // 1. Redraw canvas preview
        if (!skipCanvas && this.previewCanvas) {
            this.previewCanvas.redraw();
        }
        
        // 2. Update control panel UI
        if (!skipPanel && this.boxControlPanel && AppState.viewMode !== 'transforming') {
            if (boxIndex !== null) {
                this.boxControlPanel.updateBoxUI(boxIndex, AppState.getCurrentStates()[boxIndex]);
            } else {
                this.boxControlPanel.updateUI();
            }
        }
        
        // 3. Update XML textareas
        if (!skipXml && AppState.viewMode !== 'transforming') {
            this.syncXmlTextareas();
        }
        
        // 4. Try auto-generate transition
        if (!skipAutoGenerate && this.mainApp) {
            this.mainApp.tryAutoGenerate();
        }
    },
    
    // Sync XML textareas with current state
    syncXmlTextareas() {
        if (this.initialXmlEl) {
            this.initialXmlEl.value = AppState.generateXML('initial');
        }
        if (this.finalXmlEl) {
            this.finalXmlEl.value = AppState.generateXML('final');
        }
    },
    
    // ====== High-level state change methods ======
    // These modify AppState and then call update()
    
    // Update a box property
    setBoxProperty(boxIndex, property, value) {
        if (AppState.viewMode === 'transforming') return;
        
        const states = AppState.getEditableStates();
        states[boxIndex][property] = value;
        
        // Handle linked mask properties
        if (property.startsWith('mask')) {
            this.handleLinkedMask(boxIndex, property, value);
        }
        
        this.update('panel', { boxIndex });
    },
    
    // Handle linked mask values
    handleLinkedMask(boxIndex, property, value) {
        const states = AppState.getEditableStates();
        const links = AppState.linkStates[boxIndex];
        
        if (property === 'maskLeft' && links.lr) {
            states[boxIndex].maskRight = value;
        } else if (property === 'maskRight' && links.lr) {
            states[boxIndex].maskLeft = value;
        } else if (property === 'maskTop' && links.tb) {
            states[boxIndex].maskBottom = value;
        } else if (property === 'maskBottom' && links.tb) {
            states[boxIndex].maskTop = value;
        }
    },
    
    // Toggle link state
    toggleLink(boxIndex, linkType) {
        AppState.linkStates[boxIndex][linkType] = !AppState.linkStates[boxIndex][linkType];
        
        // Sync values if linking
        if (AppState.linkStates[boxIndex][linkType]) {
            const states = AppState.getEditableStates();
            if (linkType === 'lr') {
                states[boxIndex].maskRight = states[boxIndex].maskLeft;
            } else if (linkType === 'tb') {
                states[boxIndex].maskBottom = states[boxIndex].maskTop;
            }
            this.update('panel', { boxIndex });
        }
    },
    
    // Load states from parsed XML
    loadStates(mode, parsedStates) {
        const states = mode === 'initial' ? AppState.initialStates : AppState.finalStates;
        for (let i = 0; i < 4; i++) {
            if (parsedStates[i]) {
                states[i].copyFrom(parsedStates[i]);
            } else {
                states[i].reset();
            }
        }
        this.update('load', { skipXml: true }); // Don't regenerate XML we just loaded
    },
    
    // Clear states for a mode
    clearStates(mode) {
        const states = mode === 'initial' ? AppState.initialStates : AppState.finalStates;
        for (let i = 0; i < 4; i++) {
            states[i].reset();
        }
        this.update('reset', { skipXml: true } );
    },
    
    // Reset single box
    resetBox(boxIndex) {
        if (AppState.viewMode === 'transforming') return;
        
        const states = AppState.getEditableStates();
        states[boxIndex].reset();
        AppState.linkStates[boxIndex] = { lr: true, tb: true };
        
        this.update('reset', { boxIndex });
    },
    
    // Swap initial and final states
    swapStates() {
        for (let i = 0; i < 4; i++) {
            const temp = AppState.initialStates[i].clone();
            AppState.initialStates[i].copyFrom(AppState.finalStates[i]);
            AppState.finalStates[i].copyFrom(temp);
        }
        this.update('swap');
    },
    
    // Set view mode
    setViewMode(mode) {
        AppState.viewMode = mode;
        this.update('mode', { skipXml: true, skipAutoGenerate: true });
    },
    
    // Set drag precision
    setDragPrecision(precision) {
        AppState.dragPrecision = precision;
        // Precision change doesn't need full update
    },
    
    // Set transforming states for animation preview
    setTransformingStates(states) {
        AppState.transformingStates = states;
        AppState.viewMode = 'transforming';
        
        // Update canvas transforming states
        if (this.previewCanvas) {
            this.previewCanvas.transformingStates = states;
        }
        
        // Redraw canvas
        this.update('mode', { skipXml: true, skipAutoGenerate: true, skipPanel: true });
        
        // Update panel with transforming display
        if (this.boxControlPanel) {
            this.boxControlPanel.updateTransformingDisplay(states);
        }
    }
};

// ============== XML Parser ==============

class XMLParser {
    // Known Op IDs that we support
    static KNOWN_OP_IDS = new Set([
        'SuperSourceV2BoxEnable',
        'SuperSourceV2BoxSize',
        'SuperSourceV2BoxXPosition',
        'SuperSourceV2BoxYPosition',
        'SuperSourceV2BoxMaskEnable',
        'SuperSourceV2BoxCropEnable',
        'SuperSourceV2BoxMaskLeft',
        'SuperSourceV2BoxCropLeft',
        'SuperSourceV2BoxMaskTop',
        'SuperSourceV2BoxCropTop',
        'SuperSourceV2BoxMaskRight',
        'SuperSourceV2BoxCropRight',
        'SuperSourceV2BoxMaskBottom',
        'SuperSourceV2BoxCropBottom',
        'MacroSleep'
    ]);
    
    /**
     * Validate and parse XML with strict error checking
     * @param {string} xmlText - The XML text to parse
     * @param {boolean} strict - If true, throws on any invalid line
     * @returns {object} - Parsed box states
     * @throws {Error} - If strict mode and invalid lines found
     */
    static parseOps(xmlText, strict = false) {
        const boxes = {};
        const lines = xmlText.split('\n');
        const errors = [];
        
        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
            const line = lines[lineNum].trim();
            
            // Skip empty lines
            if (!line) continue;
            
            // Skip comments
            if (line.startsWith('<!--') || line.startsWith('<!') || line.includes('-->')) continue;
            
            // Skip Macro tag lines
            if (line.startsWith('<Macro') || line.startsWith('</Macro>')) continue;
            
            // Skip XML declaration and Profile tags
            if (line.startsWith('<?xml') || line.startsWith('<Profile') || line.startsWith('</Profile>') ||
                line.startsWith('<MacroPool') || line.startsWith('</MacroPool>') || line.startsWith('<MacroControl')) continue;
            
            // Check if it's an Op line
            if (line.startsWith('<Op ')) {
                const opMatch = line.match(/<Op\s+([^>]+)\/>/);
                if (!opMatch) {
                    errors.push(`Line ${lineNum + 1}: Invalid Op format - ${line}`);
                    if (strict) continue;
                }
                
                const attrsStr = opMatch ? opMatch[1] : '';
                const attrs = {};
                const attrPattern = /(\w+)="([^"]*)"/g;
                let attrMatch;
                
                while ((attrMatch = attrPattern.exec(attrsStr)) !== null) {
                    attrs[attrMatch[1]] = attrMatch[2];
                }
                
                const opId = attrs.id || '';
                
                // Check if this is a known Op ID
                if (!this.KNOWN_OP_IDS.has(opId)) {
                    errors.push(`Line ${lineNum + 1}: Unknown Op ID "${opId}"`);
                    if (strict) continue;
                }
                
                // Skip MacroSleep as it doesn't affect box states
                if (opId === 'MacroSleep') continue;
                
                const boxIndex = parseInt(attrs.boxIndex || '0');
                const superSource = parseInt(attrs.superSource || '0');
                
                if (!(boxIndex in boxes)) {
                    boxes[boxIndex] = new BoxState(boxIndex, superSource);
                }
                
                const box = boxes[boxIndex];
                
                // Parse based on Op ID
                try {
                    switch (opId) {
                        case 'SuperSourceV2BoxEnable':
                            box.enable = (attrs.enable || 'False').toLowerCase() === 'true';
                            break;
                        case 'SuperSourceV2BoxSize':
                            box.size = parseFloat(attrs.size || '1.0');
                            break;
                        case 'SuperSourceV2BoxXPosition':
                            box.xPosition = parseFloat(attrs.xPosition || '0.0');
                            break;
                        case 'SuperSourceV2BoxYPosition':
                            box.yPosition = parseFloat(attrs.yPosition || '0.0');
                            break;
                        case 'SuperSourceV2BoxMaskEnable':
                        case 'SuperSourceV2BoxCropEnable':
                            box.maskEnable = (attrs.enable || 'False').toLowerCase() === 'true';
                            break;
                        case 'SuperSourceV2BoxMaskLeft':
                        case 'SuperSourceV2BoxCropLeft':
                            box.maskLeft = parseFloat(attrs.left || '0.0');
                            break;
                        case 'SuperSourceV2BoxMaskTop':
                        case 'SuperSourceV2BoxCropTop':
                            box.maskTop = parseFloat(attrs.top || '0.0');
                            break;
                        case 'SuperSourceV2BoxMaskRight':
                        case 'SuperSourceV2BoxCropRight':
                            box.maskRight = parseFloat(attrs.right || '0.0');
                            break;
                        case 'SuperSourceV2BoxMaskBottom':
                        case 'SuperSourceV2BoxCropBottom':
                            box.maskBottom = parseFloat(attrs.bottom || '0.0');
                            break;
                    }
                } catch (e) {
                    errors.push(`Line ${lineNum + 1}: Parse error - ${e.message}`);
                }
            } else {
                // Unknown line format
                errors.push(`Line ${lineNum + 1}: Unknown line format - ${line}`);
                if (strict) continue;
            }
        }
        
        if (strict && errors.length > 0) {
            throw new Error(`XML Parse Errors:\n${errors.join('\n')}`);
        }
        
        return boxes;
    }
    
    /**
     * Format XML by removing invalid lines, comments, and empty lines
     * @param {string} xmlText - The XML text to format
     * @returns {string} - Cleaned XML with only valid Op lines
     */
    static formatXML(xmlText) {
        const lines = xmlText.split('\n');
        const validLines = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            // Skip empty lines
            if (!trimmed) continue;
            
            // Skip comments
            if (trimmed.startsWith('<!--') || trimmed.startsWith('<!') || trimmed.includes('-->')) continue;
            
            // Skip Macro tag lines
            if (trimmed.startsWith('<Macro') || trimmed.startsWith('</Macro>')) continue;
            
            // Skip XML declaration and Profile tags
            if (trimmed.startsWith('<?xml') || trimmed.startsWith('<Profile') || trimmed.startsWith('</Profile>') ||
                trimmed.startsWith('<MacroPool') || trimmed.startsWith('</MacroPool>') || trimmed.startsWith('<MacroControl')) continue;
            
            // Check if it's a valid Op line
            if (trimmed.startsWith('<Op ')) {
                const opMatch = trimmed.match(/<Op\s+([^>]+)\/>/);
                if (!opMatch) continue; // Invalid Op format
                
                const attrsStr = opMatch[1];
                const attrs = {};
                const attrPattern = /(\w+)="([^"]*)"/g;
                let attrMatch;
                
                while ((attrMatch = attrPattern.exec(attrsStr)) !== null) {
                    attrs[attrMatch[1]] = attrMatch[2];
                }
                
                const opId = attrs.id || '';
                
                // Only keep known Op IDs
                if (this.KNOWN_OP_IDS.has(opId)) {
                    validLines.push(trimmed);
                }
            }
        }
        
        return validLines.join('\n');
    }
    
    /**
     * Parse a complete macro XML to extract transitions
     * Returns initial states, final states, frames, and easing type
     * @param {string} macroXML - Complete macro XML content
     * @returns {object} - {initialStates, finalStates, frames, easingType, name, description}
     */
    static parseMacroTransition(macroXML) {
        const lines = macroXML.split('\n');
        
        // Extract frames and easing from comment
        let frames = 30;
        let easingType = 'linear';
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('<!-- Duration:')) {
                const frameMatch = trimmed.match(/Duration:\s*(\d+)\s*frames/);
                const easingMatch = trimmed.match(/Easing:\s*(\w+)/);
                if (frameMatch) frames = parseInt(frameMatch[1]);
                if (easingMatch) easingType = easingMatch[1];
                break;
            }
        }
        
        // Find Initial and Final sections
        let inInitial = false;
        let inFinal = false;
        let initialXML = [];
        let finalXML = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            if (trimmed.includes('<!-- Initial Enable States -->') || trimmed.includes('<!-- Initial Positions and Masks -->')) {
                inInitial = true;
                inFinal = false;
                continue;
            }
            
            if (trimmed.includes('<!-- Animation Frames -->')) {
                inInitial = false;
                continue;
            }
            
            if (trimmed.includes('<!-- Final States -->')) {
                inFinal = true;
                inInitial = false;
                continue;
            }
            
            if (inInitial && trimmed.startsWith('<Op ')) {
                initialXML.push(trimmed);
            } else if (inFinal && trimmed.startsWith('<Op ')) {
                finalXML.push(trimmed);
            }
        }
        
        // Parse initial and final states
        const initialStates = this.parseOps(initialXML.join('\n'), false);
        const finalStates = this.parseOps(finalXML.join('\n'), false);
        
        // Calculate frames and easing mathematically by analyzing the animation frames
        const calculatedParams = this.analyzeAnimationFrames(macroXML);
        if (calculatedParams) {
            frames = calculatedParams.frames;
            easingType = calculatedParams.easingType;
        }
        
        return {
            initialStates,
            finalStates,
            frames,
            easingType
        };
    }
    
    /**
     * Analyze animation frames to determine frame count and easing type mathematically
     * @param {string} macroXML - Complete macro XML
     * @returns {object|null} - {frames, easingType} or null if cannot determine
     */
    static analyzeAnimationFrames(macroXML) {
        const lines = macroXML.split('\n');
        const frameSamples = [];
        
        // Collect frame samples
        for (const line of lines) {
            const trimmed = line.trim();
            const frameMatch = trimmed.match(/<!-- Frame (\d+)\/(\d+)/);
            if (frameMatch) {
                const currentFrame = parseInt(frameMatch[1]);
                const totalFrames = parseInt(frameMatch[2]);
                frameSamples.push({ current: currentFrame, total: totalFrames });
            }
        }
        
        if (frameSamples.length === 0) return null;
        
        // Get total frames from samples
        const frames = frameSamples[frameSamples.length - 1].total;
        
        // Analyze easing by comparing position changes across frames
        // This is a simplified heuristic - in practice, more sophisticated analysis would be needed
        const easingType = this.detectEasingType(macroXML, frames);
        
        return { frames, easingType };
    }
    
    /**
     * Detect easing type by analyzing interpolation pattern
     * @param {string} macroXML - Macro XML content
     * @param {number} totalFrames - Total number of frames
     * @returns {string} - Detected easing type
     */
    static detectEasingType(macroXML, totalFrames) {
        // Extract position values across frames to detect easing pattern
        const lines = macroXML.split('\n');
        const positions = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.includes('<!-- Frame') && line.includes('Box') !== -1) {
                // Look for next XPosition line
                for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
                    const nextLine = lines[j].trim();
                    if (nextLine.includes('XPosition')) {
                        const match = nextLine.match(/xPosition="([^"]+)"/);
                        if (match) {
                            positions.push(parseFloat(match[1]));
                            break;
                        }
                    }
                }
            }
        }
        
        if (positions.length < 3) return 'linear';
        
        // Analyze the pattern of changes
        const deltas = [];
        for (let i = 1; i < positions.length; i++) {
            deltas.push(Math.abs(positions[i] - positions[i - 1]));
        }
        
        // Check if deltas are increasing (ease_in), decreasing (ease_out), or both (ease_in_out)
        const firstThird = deltas.slice(0, Math.floor(deltas.length / 3));
        const lastThird = deltas.slice(-Math.floor(deltas.length / 3));
        
        const firstAvg = firstThird.reduce((a, b) => a + b, 0) / firstThird.length;
        const lastAvg = lastThird.reduce((a, b) => a + b, 0) / lastThird.length;
        
        if (Math.abs(firstAvg - lastAvg) < firstAvg * 0.1) {
            return 'linear';
        } else if (lastAvg > firstAvg * 1.5) {
            return 'ease_in';
        } else if (firstAvg > lastAvg * 1.5) {
            return 'ease_out';
        } else {
            return 'ease_in_out';
        }
    }
}

// ============== Transition Generator ==============

class TransitionGenerator {
    constructor(initialStates, finalStates, durationFrames, easingType) {
        this.initialStates = initialStates;
        this.finalStates = finalStates;
        this.durationFrames = durationFrames;
        this.easingFunc = EasingFunctions[easingType] || EasingFunctions.linear;
        this.easingType = easingType;
        
        // Ensure all 4 boxes exist
        for (let i = 0; i < 4; i++) {
            if (!(i in this.initialStates)) {
                this.initialStates[i] = new BoxState(i);
            }
            if (!(i in this.finalStates)) {
                this.finalStates[i] = new BoxState(i);
            }
        }
    }
    
    interpolate(start, end, t) {
        const easedT = this.easingFunc(t);
        return start + (end - start) * easedT;
    }
    
    interpolateBox(initial, final, t) {
        const box = new BoxState(initial.boxIndex, initial.superSource);
        box.enable = t < 1 ? initial.enable : final.enable;
        box.size = this.interpolate(initial.size, final.size, t);
        box.xPosition = this.interpolate(initial.xPosition, final.xPosition, t);
        box.yPosition = this.interpolate(initial.yPosition, final.yPosition, t);
        box.maskEnable = initial.maskEnable || final.maskEnable;
        // BUG FIX: If maskEnable is false, treat mask values as 0
        const initMaskL = initial.maskEnable ? initial.maskLeft : 0;
        const initMaskR = initial.maskEnable ? initial.maskRight : 0;
        const initMaskT = initial.maskEnable ? initial.maskTop : 0;
        const initMaskB = initial.maskEnable ? initial.maskBottom : 0;
        const finalMaskL = final.maskEnable ? final.maskLeft : 0;
        const finalMaskR = final.maskEnable ? final.maskRight : 0;
        const finalMaskT = final.maskEnable ? final.maskTop : 0;
        const finalMaskB = final.maskEnable ? final.maskBottom : 0;
        box.maskLeft = this.interpolate(initMaskL, finalMaskL, t);
        box.maskTop = this.interpolate(initMaskT, finalMaskT, t);
        box.maskRight = this.interpolate(initMaskR, finalMaskR, t);
        box.maskBottom = this.interpolate(initMaskB, finalMaskB, t);
        return box;
    }
    
    // Get interpolated states for a specific frame (0 = initial, durationFrames = final)
    // Correctly handles early disable and late enable timing
    getFrameStates(frame) {
        const t = this.durationFrames > 0 ? frame / this.durationFrames : 0;
        const timing = this.calculateEnableDisableTiming();
        const states = {};
        
        for (let i = 0; i < 4; i++) {
            states[i] = this.interpolateBox(this.initialStates[i], this.finalStates[i], t);
            // Override enable state based on timing
            states[i].enable = this.isBoxEnabledAtFrame(i, frame, timing);
        }
        return states;
    }
    
    shouldBoxAnimate(boxIndex) {
        const initial = this.initialStates[boxIndex];
        const final = this.finalStates[boxIndex];
        return initial.enable || final.enable;
    }
    
    // Calculate the visual area of a box at a given interpolation t
    getBoxVisualArea(boxIndex, t) {
        const interpolated = this.interpolateBox(this.initialStates[boxIndex], this.finalStates[boxIndex], t);
        const baseW = interpolated.size * 32; // SCREEN_WIDTH
        const baseH = interpolated.size * 18; // SCREEN_HEIGHT
        const maskL = interpolated.maskEnable ? (interpolated.maskLeft / 32) * baseW : 0;
        const maskR = interpolated.maskEnable ? (interpolated.maskRight / 32) * baseW : 0;
        const maskT = interpolated.maskEnable ? (interpolated.maskTop / 18) * baseH : 0;
        const maskB = interpolated.maskEnable ? (interpolated.maskBottom / 18) * baseH : 0;
        const visibleW = baseW - maskL - maskR;
        const visibleH = baseH - maskT - maskB;
        return visibleW * visibleH;
    }
    
    // Check if two boxes overlap at a given interpolation t
    boxesOverlap(boxIndexA, boxIndexB, t) {
        const boxA = this.interpolateBox(this.initialStates[boxIndexA], this.finalStates[boxIndexA], t);
        const boxB = this.interpolateBox(this.initialStates[boxIndexB], this.finalStates[boxIndexB], t);
        
        const getBoxBounds = (box) => {
            const baseW = box.size * 32;
            const baseH = box.size * 18;
            const maskL = box.maskEnable ? (box.maskLeft / 32) * baseW : 0;
            const maskR = box.maskEnable ? (box.maskRight / 32) * baseW : 0;
            const maskT = box.maskEnable ? (box.maskTop / 18) * baseH : 0;
            const maskB = box.maskEnable ? (box.maskBottom / 18) * baseH : 0;
            return {
                left: box.xPosition - baseW / 2 + maskL,
                right: box.xPosition + baseW / 2 - maskR,
                top: box.yPosition + baseH / 2 - maskT,
                bottom: box.yPosition - baseH / 2 + maskB
            };
        };
        
        const boundsA = getBoxBounds(boxA);
        const boundsB = getBoxBounds(boxB);
        
        // Check for overlap
        return !(boundsA.left >= boundsB.right || boundsA.right <= boundsB.left ||
                 boundsA.bottom >= boundsB.top || boundsA.top <= boundsB.bottom);
    }
    
    // Determine early disable frame for Enable->Disable transitions
    // Returns the frame number to disable, or null if no early disable needed
    //
    // Logic: For a box that is Enable->Disable, check if there's a LARGER box with
    // HIGHER index (lower layer priority) that overlaps with it. If the overlap
    // persists for >= 5% of duration, we should disable this smaller upper-layer box
    // early to simulate the visual expectation that larger boxes appear on top.
    //
    // Layer order: Box 0 (top) > Box 1 > Box 2 > Box 3 (bottom)
    // Visual expectation: Larger box should appear on top
    calculateEarlyDisableFrame(boxIndex) {
        const initial = this.initialStates[boxIndex];
        const final = this.finalStates[boxIndex];
        
        // Only applies to Enable -> Disable transitions
        if (!initial.enable || final.enable) return null;
        
        const threshold = Math.ceil(this.durationFrames * 0.05); // 5% of duration
        
        // Check against boxes with HIGHER index (lower in layer order, i.e., "below" this box)
        // If a larger box is "below" us but should visually be on top, we need to disable early
        for (let other = boxIndex + 1; other < 4; other++) {
            const otherFinal = this.finalStates[other];
            
            // Other box needs to be enabled at the end (will be visible)
            if (!otherFinal.enable) continue;
            
            // Scan from the END of transition backwards to find when overlap starts
            let consecutiveOverlapFrames = 0;
            let firstOverlapFrame = null;
            
            for (let frame = this.durationFrames; frame >= 0; frame--) {
                const t = frame / this.durationFrames;
                
                if (this.boxesOverlap(boxIndex, other, t)) {
                    const areaThis = this.getBoxVisualArea(boxIndex, t);
                    const areaOther = this.getBoxVisualArea(other, t);
                    
                    if (areaOther > areaThis) {
                        consecutiveOverlapFrames++;
                        firstOverlapFrame = frame;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
            
            if (consecutiveOverlapFrames >= threshold && firstOverlapFrame !== null) {
                return firstOverlapFrame;
            }
        }
        
        return null;
    }
    
    // Determine late enable frame for Disable->Enable transitions
    // Returns the frame number to enable, or null if no late enable needed
    //
    // Logic: For a box that is Disable->Enable, check if there's a LARGER box with
    // HIGHER index (lower layer priority) that overlaps with it at the start.
    // If so, delay enabling until the overlap with larger boxes ends.
    calculateLateEnableFrame(boxIndex) {
        const initial = this.initialStates[boxIndex];
        const final = this.finalStates[boxIndex];
        
        // Only applies to Disable -> Enable transitions
        if (initial.enable || !final.enable) return null;
        
        const threshold = Math.ceil(this.durationFrames * 0.05); // 5% of duration
        
        // Check against boxes with HIGHER index (lower in layer order)
        for (let other = boxIndex + 1; other < 4; other++) {
            const otherInitial = this.initialStates[other];
            
            // Other box needs to be enabled at the start (currently visible)
            if (!otherInitial.enable) continue;
            
            // Scan from the START of transition forwards to find when overlap ends
            let consecutiveOverlapFrames = 0;
            let lastOverlapFrame = null;
            
            for (let frame = 0; frame <= this.durationFrames; frame++) {
                const t = frame / this.durationFrames;
                
                if (this.boxesOverlap(boxIndex, other, t)) {
                    const areaThis = this.getBoxVisualArea(boxIndex, t);
                    const areaOther = this.getBoxVisualArea(other, t);
                    
                    if (areaOther > areaThis) {
                        consecutiveOverlapFrames++;
                        lastOverlapFrame = frame;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
            
            if (consecutiveOverlapFrames >= threshold && lastOverlapFrame !== null) {
                // Enable after the overlap ends
                return lastOverlapFrame + 1;
            }
        }
        
        return null;
    }
    
    // Calculate enable/disable timing info for all boxes
    // Returns { earlyDisable: {boxIndex: frame}, lateEnable: {boxIndex: frame} }
    calculateEnableDisableTiming() {
        const earlyDisable = {};
        const lateEnable = {};
        
        for (let i = 0; i < 4; i++) {
            if (!this.shouldBoxAnimate(i)) continue;
            
            const earlyFrame = this.calculateEarlyDisableFrame(i);
            if (earlyFrame !== null) {
                earlyDisable[i] = earlyFrame;
            }
            
            const lateFrame = this.calculateLateEnableFrame(i);
            if (lateFrame !== null) {
                lateEnable[i] = lateFrame;
            }
        }
        
        return { earlyDisable, lateEnable };
    }
    
    // Check if a box is enabled at a specific frame (considering early disable / late enable)
    isBoxEnabledAtFrame(boxIndex, frame, timing = null) {
        const initial = this.initialStates[boxIndex];
        const final = this.finalStates[boxIndex];
        
        if (!initial.enable && !final.enable) return false;
        
        // Calculate timing if not provided
        if (!timing) {
            timing = this.calculateEnableDisableTiming();
        }
        
        // Enable -> Disable: check for early disable
        if (initial.enable && !final.enable) {
            const earlyFrame = timing.earlyDisable[boxIndex];
            if (earlyFrame !== undefined && frame >= earlyFrame) {
                return false;
            }
            return true; // Still enabled
        }
        
        // Disable -> Enable: check for late enable
        if (!initial.enable && final.enable) {
            const lateFrame = timing.lateEnable[boxIndex];
            if (lateFrame !== undefined && frame < lateFrame) {
                return false;
            }
            return true; // Already enabled
        }
        
        // Enable -> Enable: always enabled
        return true;
    }
    
    generate() {
        const lines = [];
        
        const animatingBoxes = [];
        for (let i = 0; i < 4; i++) {
            if (this.shouldBoxAnimate(i)) {
                animatingBoxes.push(i);
            }
        }
        
        // Calculate enable/disable timing
        const timing = this.calculateEnableDisableTiming();
        
        lines.push(`<!-- Duration: ${this.durationFrames} frames | Easing: ${this.easingType} -->`);
        lines.push('');
        
        // Initial Enable States
        // Disable->Enable: Enable at start (unless late enable); Enable->Disable: Keep enabled until early disable or end
        lines.push('<!-- Initial Enable States -->');
        for (let i = 0; i < 4; i++) {
            const initial = this.initialStates[i];
            const final = this.finalStates[i];
            const ss = initial.superSource;
            
            // Determine if box should be enabled at start
            let enableAtStart = initial.enable || final.enable;
            // If Disable->Enable with late enable, don't enable at start
            if (!initial.enable && final.enable && timing.lateEnable[i] !== undefined) {
                enableAtStart = false;
            }
            
            const enable = enableAtStart ? 'True' : 'False';
            lines.push(`<Op id="SuperSourceV2BoxEnable" superSource="${ss}" boxIndex="${i}" enable="${enable}" />`);
        }
        lines.push('');
        
        // Initial Positions and Masks
        lines.push('<!-- Initial Positions and Masks -->');
        for (const i of animatingBoxes) {
            const initial = this.initialStates[i];
            const ss = initial.superSource;
            const idx = initial.boxIndex;
            
            lines.push(`<Op id="SuperSourceV2BoxSize" superSource="${ss}" boxIndex="${idx}" size="${initial.size.toFixed(4)}"/>`);
            lines.push(`<Op id="SuperSourceV2BoxXPosition" superSource="${ss}" boxIndex="${idx}" xPosition="${initial.xPosition.toFixed(4)}"/>`);
            lines.push(`<Op id="SuperSourceV2BoxYPosition" superSource="${ss}" boxIndex="${idx}" yPosition="${initial.yPosition.toFixed(4)}"/>`);
            
            if (initial.maskEnable || this.finalStates[i].maskEnable) {
                lines.push(`<Op id="SuperSourceV2BoxMaskEnable" superSource="${ss}" boxIndex="${idx}" enable="True"/>`);
                lines.push(`<Op id="SuperSourceV2BoxMaskLeft" superSource="${ss}" boxIndex="${idx}" left="${initial.maskLeft.toFixed(2)}"/>`);
                lines.push(`<Op id="SuperSourceV2BoxMaskTop" superSource="${ss}" boxIndex="${idx}" top="${initial.maskTop.toFixed(2)}"/>`);
                lines.push(`<Op id="SuperSourceV2BoxMaskRight" superSource="${ss}" boxIndex="${idx}" right="${initial.maskRight.toFixed(2)}"/>`);
                lines.push(`<Op id="SuperSourceV2BoxMaskBottom" superSource="${ss}" boxIndex="${idx}" bottom="${initial.maskBottom.toFixed(2)}"/>`);
            }
            lines.push('');
        }
        
        lines.push('<Op id="MacroSleep" frames="1"/>');
        lines.push('');
        
        // Animation Frames
        lines.push('<!-- Animation Frames -->');
        for (let frame = 1; frame <= this.durationFrames; frame++) {
            lines.push(`<!-- Frame ${frame}/${this.durationFrames} -->`);
            const t = frame / this.durationFrames;
            
            // Check for late enable at this frame
            for (const boxIndex of animatingBoxes) {
                if (timing.lateEnable[boxIndex] === frame) {
                    const ss = this.initialStates[boxIndex].superSource;
                    lines.push(`<!-- Late enable Box ${boxIndex} after overlap with larger box ends -->`);
                    lines.push(`<Op id="SuperSourceV2BoxEnable" superSource="${ss}" boxIndex="${boxIndex}" enable="True" />`);
                }
            }
            
            // Check for early disable at this frame
            for (const boxIndex of animatingBoxes) {
                if (timing.earlyDisable[boxIndex] === frame) {
                    const ss = this.initialStates[boxIndex].superSource;
                    lines.push(`<!-- Early disable Box ${boxIndex} to avoid visual overlap with larger box -->`);
                    lines.push(`<Op id="SuperSourceV2BoxEnable" superSource="${ss}" boxIndex="${boxIndex}" enable="False" />`);
                }
            }
            
            for (const boxIndex of animatingBoxes) {
                // Skip if not enabled at this frame
                if (!this.isBoxEnabledAtFrame(boxIndex, frame, timing)) continue;
                
                const initial = this.initialStates[boxIndex];
                const final = this.finalStates[boxIndex];
                const interpolated = this.interpolateBox(initial, final, t);
                
                const ss = interpolated.superSource;
                const idx = interpolated.boxIndex;
                
                lines.push(`<Op id="SuperSourceV2BoxSize" superSource="${ss}" boxIndex="${idx}" size="${interpolated.size.toFixed(4)}"/>`);
                lines.push(`<Op id="SuperSourceV2BoxXPosition" superSource="${ss}" boxIndex="${idx}" xPosition="${interpolated.xPosition.toFixed(4)}"/>`);
                lines.push(`<Op id="SuperSourceV2BoxYPosition" superSource="${ss}" boxIndex="${idx}" yPosition="${interpolated.yPosition.toFixed(4)}"/>`);
                
                if (initial.maskEnable || final.maskEnable) {
                    lines.push(`<Op id="SuperSourceV2BoxMaskLeft" superSource="${ss}" boxIndex="${idx}" left="${interpolated.maskLeft.toFixed(2)}"/>`);
                    lines.push(`<Op id="SuperSourceV2BoxMaskTop" superSource="${ss}" boxIndex="${idx}" top="${interpolated.maskTop.toFixed(2)}"/>`);
                    lines.push(`<Op id="SuperSourceV2BoxMaskRight" superSource="${ss}" boxIndex="${idx}" right="${interpolated.maskRight.toFixed(2)}"/>`);
                    lines.push(`<Op id="SuperSourceV2BoxMaskBottom" superSource="${ss}" boxIndex="${idx}" bottom="${interpolated.maskBottom.toFixed(2)}"/>`);
                }
            }
            
            lines.push('<Op id="MacroSleep" frames="1"/>');
            lines.push('');
        }
        
        // Final States
        lines.push('<!-- Final States -->');
        for (let i = 0; i < 4; i++) {
            // Skip if already handled by early disable or late enable
            if (timing.earlyDisable[i] !== undefined) continue;
            if (timing.lateEnable[i] !== undefined) continue;
            
            const final = this.finalStates[i];
            const ss = final.superSource;
            const enable = final.enable ? 'True' : 'False';
            lines.push(`<Op id="SuperSourceV2BoxEnable" superSource="${ss}" boxIndex="${i}" enable="${enable}" />`);
        }
        
        for (const i of animatingBoxes) {
            const final = this.finalStates[i];
            if (final.maskEnable) {
                const ss = final.superSource;
                lines.push(`<Op id="SuperSourceV2BoxMaskEnable" superSource="${ss}" boxIndex="${i}" enable="True"/>`);
                lines.push(`<Op id="SuperSourceV2BoxMaskLeft" superSource="${ss}" boxIndex="${i}" left="${final.maskLeft.toFixed(2)}"/>`);
                lines.push(`<Op id="SuperSourceV2BoxMaskTop" superSource="${ss}" boxIndex="${i}" top="${final.maskTop.toFixed(2)}"/>`);
                lines.push(`<Op id="SuperSourceV2BoxMaskRight" superSource="${ss}" boxIndex="${i}" right="${final.maskRight.toFixed(2)}"/>`);
                lines.push(`<Op id="SuperSourceV2BoxMaskBottom" superSource="${ss}" boxIndex="${i}" bottom="${final.maskBottom.toFixed(2)}"/>`);
            }
        }
        
        return lines.join('\n');
    }
}

// ============== Canvas Preview ==============

class BoxPreviewCanvas {
    // Extended coordinate range for display (40x25 with 16:9 aspect ratio maintained)
    static DISPLAY_X_MIN = -20;
    static DISPLAY_X_MAX = 20;
    static DISPLAY_Y_MIN = -12.5;
    static DISPLAY_Y_MAX = 12.5;
    static DISPLAY_WIDTH = 40;
    static DISPLAY_HEIGHT = 25;
    
    // Visible screen area (actual SuperSource coordinates)
    static SCREEN_X_MIN = -16;
    static SCREEN_X_MAX = 16;
    static SCREEN_Y_MIN = -9;
    static SCREEN_Y_MAX = 9;
    static SCREEN_WIDTH = 32;
    static SCREEN_HEIGHT = 18;
    
    // Box colors - vibrant theme
    static BOX_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFD93D'];
    
    // Interaction hit zones (in canvas pixels)
    static EDGE_HIT_ZONE = 8;   // Width of edge hit zone for mask adjustment
    static CORNER_HIT_ZONE = 12; // Size of corner hit zone for size adjustment
    
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // High DPI support
        this.dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        // Set canvas actual size in memory (scaled for HiDPI)
        canvas.width = rect.width * this.dpr;
        canvas.height = rect.height * this.dpr;
        
        // Scale context to match HiDPI
        this.ctx.scale(this.dpr, this.dpr);
        
        // Use CSS size for calculations
        this.width = rect.width;
        this.height = rect.height;
        this.padding = 45;
        
        // Calculate draw area maintaining 16:9 aspect ratio
        const availableWidth = this.width - 2 * this.padding;
        const availableHeight = this.height - 2 * this.padding;
        
        // Use 16:9 aspect ratio (40 units width : 25 units height = 1.6 : 1)
        const aspectRatio = 40 / 25; // 1.6
        
        if (availableWidth / availableHeight > aspectRatio) {
            // Height constrained
            this.drawHeight = availableHeight;
            this.drawWidth = this.drawHeight * aspectRatio;
        } else {
            // Width constrained
            this.drawWidth = availableWidth;
            this.drawHeight = this.drawWidth / aspectRatio;
        }
        
        // Center the drawing area
        this.offsetX = this.padding + (availableWidth - this.drawWidth) / 2;
        this.offsetY = this.padding + (availableHeight - this.drawHeight) / 2;
        
        // Interaction state (local to canvas, not shared)
        this.isDragging = false;
        this.dragType = null;
        this.dragBoxIndex = null;
        this.dragStartCoord = null;
        this.dragStartBoxState = null;
        this.hoverInfo = null;
        this.shiftKey = false;
        this.dragAxis = null;
        this.wasDragging = false;
        
        // Highlighted box index for touch interaction (shows handles without locking)
        // This is different from AppState.activeBoxIndex which locks the box
        this.highlightedBoxIndex = null;
        
        // Touch interaction state
        this.lastTapTime = 0;
        this.lastTapBoxIndex = null;
        
        // Transforming animation states (only used during playback)
        this.transformingStates = null;
        
        // Bind mouse events
        this.bindMouseEvents();
    }
    
    // Get current states based on view mode (from AppState)
    getCurrentStates() {
        if (AppState.viewMode === 'transforming' && this.transformingStates) {
            return this.transformingStates;
        }
        return AppState.viewMode === 'initial' ? AppState.initialStates : AppState.finalStates;
    }
    
    // Set transforming states for animation playback
    setTransformingStates(states) {
        this.transformingStates = states;
        this.redraw();
    }
    
    // Bind mouse event handlers
    bindMouseEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
        this.canvas.addEventListener('dblclick', (e) => this.onDoubleClick(e));
        this.canvas.addEventListener('click', (e) => this.onClick(e));
        
        // Track shift key globally
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Shift') this.shiftKey = true;
        });
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Shift') this.shiftKey = false;
        });
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
    }
    
    // Convert canvas pixel position to coordinate system
    canvasToCoord(canvasX, canvasY) {
        const normX = (canvasX - this.offsetX) / this.drawWidth;
        const normY = (canvasY - this.offsetY) / this.drawHeight;
        
        const x = BoxPreviewCanvas.DISPLAY_X_MIN + normX * BoxPreviewCanvas.DISPLAY_WIDTH;
        const y = BoxPreviewCanvas.DISPLAY_Y_MAX - normY * BoxPreviewCanvas.DISPLAY_HEIGHT;
        
        return { x, y };
    }
    
    // Get mouse position relative to canvas
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    // Calculate box boundaries in canvas pixels
    // allowDisabled: if true, also calculate bounds for disabled boxes
    getBoxCanvasBounds(box, allowDisabled = false) {
        if (!box.enable && !allowDisabled) return null;
        
        const baseW = box.size * BoxPreviewCanvas.SCREEN_WIDTH;
        const baseH = box.size * BoxPreviewCanvas.SCREEN_HEIGHT;
        const maskL = box.maskEnable ? (box.maskLeft / 32) * baseW : 0;
        const maskR = box.maskEnable ? (box.maskRight / 32) * baseW : 0;
        const maskT = box.maskEnable ? (box.maskTop / 18) * baseH : 0;
        const maskB = box.maskEnable ? (box.maskBottom / 18) * baseH : 0;
        
        if (baseW - maskL - maskR <= 0 || baseH - maskT - maskB <= 0) return null;
        
        const boxL = box.xPosition - baseW / 2 + maskL;
        const boxR = box.xPosition + baseW / 2 - maskR;
        const boxT = box.yPosition + baseH / 2 - maskT;
        const boxB = box.yPosition - baseH / 2 + maskB;
        
        const tl = this.coordToCanvas(boxL, boxT);
        const br = this.coordToCanvas(boxR, boxB);
        
        return {
            left: tl.x,
            top: tl.y,
            right: br.x,
            bottom: br.y,
            width: br.x - tl.x,
            height: br.y - tl.y,
            // Also store coordinate bounds
            coordLeft: boxL,
            coordRight: boxR,
            coordTop: boxT,
            coordBottom: boxB
        };
    }
    
    // Detect what part of which box is at the given canvas position
    // Returns: { boxIndex, type, isDisabled } or null
    // type: 'move', 'corner-tl', 'corner-tr', 'corner-bl', 'corner-br', 'edge-left', 'edge-right', 'edge-top', 'edge-bottom'
    // Layer order for hit testing: Enabled 0 > 1 > 2 > 3 > Disabled 0 > 1 > 2 > 3
    hitTest(canvasX, canvasY) {
        const states = this.getCurrentStates();
        if (!states) return null;
        
        const EDGE = BoxPreviewCanvas.EDGE_HIT_ZONE;
        const CORNER = BoxPreviewCanvas.CORNER_HIT_ZONE;
        
        // Helper function to test a single box
        const testBox = (box, i) => {
            const bounds = this.getBoxCanvasBounds(box, true); // Allow disabled boxes
            if (!bounds) return null;
            
            const { left, top, right, bottom } = bounds;
            
            // Check if point is near/in the box
            if (canvasX < left - EDGE || canvasX > right + EDGE ||
                canvasY < top - EDGE || canvasY > bottom + EDGE) {
                return null;
            }
            
            // Check corners first (higher priority)
            if (canvasX >= left - CORNER && canvasX <= left + CORNER &&
                canvasY >= top - CORNER && canvasY <= top + CORNER) {
                return { boxIndex: i, type: 'corner-tl', isDisabled: !box.enable };
            }
            if (canvasX >= right - CORNER && canvasX <= right + CORNER &&
                canvasY >= top - CORNER && canvasY <= top + CORNER) {
                return { boxIndex: i, type: 'corner-tr', isDisabled: !box.enable };
            }
            if (canvasX >= left - CORNER && canvasX <= left + CORNER &&
                canvasY >= bottom - CORNER && canvasY <= bottom + CORNER) {
                return { boxIndex: i, type: 'corner-bl', isDisabled: !box.enable };
            }
            if (canvasX >= right - CORNER && canvasX <= right + CORNER &&
                canvasY >= bottom - CORNER && canvasY <= bottom + CORNER) {
                return { boxIndex: i, type: 'corner-br', isDisabled: !box.enable };
            }
            
            // Check edges
            if (canvasX >= left - EDGE && canvasX <= left + EDGE &&
                canvasY > top + CORNER && canvasY < bottom - CORNER) {
                return { boxIndex: i, type: 'edge-left', isDisabled: !box.enable };
            }
            if (canvasX >= right - EDGE && canvasX <= right + EDGE &&
                canvasY > top + CORNER && canvasY < bottom - CORNER) {
                return { boxIndex: i, type: 'edge-right', isDisabled: !box.enable };
            }
            if (canvasY >= top - EDGE && canvasY <= top + EDGE &&
                canvasX > left + CORNER && canvasX < right - CORNER) {
                return { boxIndex: i, type: 'edge-top', isDisabled: !box.enable };
            }
            if (canvasY >= bottom - EDGE && canvasY <= bottom + EDGE &&
                canvasX > left + CORNER && canvasX < right - CORNER) {
                return { boxIndex: i, type: 'edge-bottom', isDisabled: !box.enable };
            }
            
            // Inside the box (move)
            if (canvasX > left && canvasX < right &&
                canvasY > top && canvasY < bottom) {
                return { boxIndex: i, type: 'move', isDisabled: !box.enable };
            }
            
            return null;
        };
        
        // If a box is active, only test that box
        if (AppState.activeBoxIndex !== null) {
            const box = states[AppState.activeBoxIndex];
            if (box) {
                return testBox(box, AppState.activeBoxIndex);
            }
            return null;
        }
        
        // Test in layer order: Enabled 0 > 1 > 2 > 3 > Disabled 0 > 1 > 2 > 3
        // First pass: enabled boxes (top layer)
        for (let i = 0; i < 4; i++) {
            const box = states[i];
            if (!box || !box.enable) continue;
            const result = testBox(box, i);
            if (result) return result;
        }
        
        // Second pass: disabled boxes (bottom layer)
        for (let i = 0; i < 4; i++) {
            const box = states[i];
            if (!box || box.enable) continue;
            // Only test disabled boxes that should be shown (enabled in other mode)
            const otherStates = AppState.viewMode === 'initial' ? AppState.finalStates : AppState.initialStates;
            if (!otherStates[i] || !otherStates[i].enable) continue;
            const result = testBox(box, i);
            if (result) return result;
        }
        
        return null;
    }
    
    // Update cursor based on hover state
    updateCursor(hitInfo) {
        if (!hitInfo) {
            this.canvas.style.cursor = 'default';
            return;
        }
        
        switch (hitInfo.type) {
            case 'move':
                this.canvas.style.cursor = 'move';
                break;
            case 'corner-tl':
            case 'corner-br':
                this.canvas.style.cursor = 'nwse-resize';
                break;
            case 'corner-tr':
            case 'corner-bl':
                this.canvas.style.cursor = 'nesw-resize';
                break;
            case 'edge-left':
            case 'edge-right':
                this.canvas.style.cursor = 'ew-resize';
                break;
            case 'edge-top':
            case 'edge-bottom':
                this.canvas.style.cursor = 'ns-resize';
                break;
            default:
                this.canvas.style.cursor = 'default';
        }
    }
    
    // Mouse event handlers
    onMouseDown(e) {
        if (AppState.viewMode === 'transforming') return;
        
        const pos = this.getMousePos(e);
        const hitInfo = this.hitTest(pos.x, pos.y);
        
        if (hitInfo) {
            this.isDragging = true;
            this.dragBoxIndex = hitInfo.boxIndex;
            this.dragType = hitInfo.type;
            this.dragStartCoord = this.canvasToCoord(pos.x, pos.y);
            this.shiftKey = e.shiftKey;
            this.dragAxis = null; // Reset drag axis for shift+move
            
            // Deep copy the box state
            const states = this.getCurrentStates();
            const box = states[this.dragBoxIndex];
            this.dragStartBoxState = {
                size: box.size,
                xPosition: box.xPosition,
                yPosition: box.yPosition,
                maskLeft: box.maskLeft,
                maskRight: box.maskRight,
                maskTop: box.maskTop,
                maskBottom: box.maskBottom,
                maskEnable: box.maskEnable
            };
            
            e.preventDefault();
        }
    }
    
    // Handle click for highlighting box or deactivating when clicking outside
    onClick(e) {
        if (AppState.viewMode === 'transforming') return;
        
        // Skip if we just finished dragging
        if (this.wasDragging) {
            this.wasDragging = false;
            return;
        }
        
        const pos = this.getMousePos(e);
        const hitInfo = this.hitTest(pos.x, pos.y);
        
        if (hitInfo) {
            // Single click on a box - highlight it (show handles) without locking
            // This is especially useful for touch/mobile interaction
            this.highlightedBoxIndex = hitInfo.boxIndex;
            this.redraw();
        } else {
            // Click outside any box
            // Clear highlighted box
            if (this.highlightedBoxIndex !== null) {
                this.highlightedBoxIndex = null;
                this.redraw();
            }
            // Also clear active box if any
            if (AppState.activeBoxIndex !== null) {
                AppState.activeBoxIndex = null;
                const i18n = window.i18nManager;
                toast.info(i18n.t('toast.boxUnlocked'), i18n.t('toast.boxUnlockedMsg'));
                this.redraw();
            }
        }
    }
    
    // Handle double-click for box activation toggle
    onDoubleClick(e) {
        if (AppState.viewMode === 'transforming') return;
        
        const pos = this.getMousePos(e);
        const hitInfo = this.hitTest(pos.x, pos.y);
        
        if (hitInfo) {
            // Toggle active box
            const i18n = window.i18nManager;
            if (AppState.activeBoxIndex === hitInfo.boxIndex) {
                // Double-clicking on already active box - deactivate
                AppState.activeBoxIndex = null;
                toast.info(i18n.t('toast.boxUnlocked'), i18n.t('toast.boxUnlockedMsg'));
            } else {
                // Activate this box
                AppState.activeBoxIndex = hitInfo.boxIndex;
                toast.info(i18n.t('toast.boxLocked'), i18n.tf('toast.boxLockedMsg', hitInfo.boxIndex));
            }
            this.redraw();
        }
    }
    
    onMouseMove(e) {
        const pos = this.getMousePos(e);
        this.shiftKey = e.shiftKey; // Update shift key state
        
        if (this.isDragging) {
            this.handleDrag(pos);
        } else {
            // Update hover state and cursor
            const hitInfo = this.hitTest(pos.x, pos.y);
            this.hoverInfo = hitInfo;
            this.updateCursor(hitInfo);
            this.redraw(); // Redraw to show hover effects
        }
    }
    
    onMouseUp(e) {
        if (this.isDragging) {
            // Mark that we were dragging to prevent click from firing
            this.wasDragging = true;
            
            this.isDragging = false;
            this.dragType = null;
            this.dragBoxIndex = null;
            this.dragStartCoord = null;
            this.dragStartBoxState = null;
            this.dragAxis = null;
        }
    }
    
    onMouseLeave(e) {
        this.hoverInfo = null;
        this.updateCursor(null);
        if (this.isDragging) {
            // Keep dragging state, will complete on mouseup
        }
        this.redraw();
    }
    
    // Touch event handlers
    onTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const pos = {
                x: touch.clientX - this.canvas.getBoundingClientRect().left,
                y: touch.clientY - this.canvas.getBoundingClientRect().top
            };
            const hitInfo = this.hitTest(pos.x, pos.y);
            
            // Store touch start info for tap detection
            this.touchStartTime = Date.now();
            this.touchStartPos = pos;
            this.touchStartHit = hitInfo;
            this.touchMoved = false;
            
            // Start drag if on a box
            if (hitInfo) {
                const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                this.onMouseDown(mouseEvent);
            }
            
            e.preventDefault();
        }
    }
    
    onTouchMove(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const pos = {
                x: touch.clientX - this.canvas.getBoundingClientRect().left,
                y: touch.clientY - this.canvas.getBoundingClientRect().top
            };
            
            // Check if user has moved significantly (not a tap)
            if (this.touchStartPos) {
                const dist = Math.hypot(pos.x - this.touchStartPos.x, pos.y - this.touchStartPos.y);
                if (dist > 10) {
                    this.touchMoved = true;
                }
            }
            
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.onMouseMove(mouseEvent);
            e.preventDefault();
        }
    }
    
    onTouchEnd(e) {
        const touchDuration = Date.now() - (this.touchStartTime || 0);
        const hitInfo = this.touchStartHit;
        
        // Handle tap (short touch without movement)
        if (!this.touchMoved && touchDuration < 300) {
            const now = Date.now();
            const doubleTapThreshold = 300; // ms
            
            if (hitInfo) {
                // Tapped on a box
                if (this.lastTapBoxIndex === hitInfo.boxIndex && 
                    now - this.lastTapTime < doubleTapThreshold) {
                    // Double tap on same box - toggle active (lock)
                    this.handleDoubleTapOnBox(hitInfo.boxIndex);
                    this.lastTapTime = 0;
                    this.lastTapBoxIndex = null;
                } else {
                    // Single tap - highlight (show handles)
                    this.highlightedBoxIndex = hitInfo.boxIndex;
                    this.redraw();
                    this.lastTapTime = now;
                    this.lastTapBoxIndex = hitInfo.boxIndex;
                }
            } else {
                // Tapped outside any box - clear highlight and active
                if (this.highlightedBoxIndex !== null) {
                    this.highlightedBoxIndex = null;
                    this.redraw();
                }
                if (AppState.activeBoxIndex !== null) {
                    AppState.activeBoxIndex = null;
                    const i18n = window.i18nManager;
                    toast.info(i18n.t('toast.boxUnlocked'), i18n.t('toast.boxUnlockedMsg'));
                    this.redraw();
                }
                this.lastTapTime = 0;
                this.lastTapBoxIndex = null;
            }
        }
        
        // Clean up drag state
        this.onMouseUp(e);
        
        // Reset touch tracking
        this.touchStartTime = null;
        this.touchStartPos = null;
        this.touchStartHit = null;
        this.touchMoved = false;
    }
    
    // Handle double tap on a box (toggle active/lock state)
    handleDoubleTapOnBox(boxIndex) {
        if (AppState.viewMode === 'transforming') return;
        
        const i18n = window.i18nManager;
        if (AppState.activeBoxIndex === boxIndex) {
            // Double-tap on already active box - deactivate
            AppState.activeBoxIndex = null;
            this.highlightedBoxIndex = null;
            toast.info(i18n.t('toast.boxUnlocked'), i18n.t('toast.boxUnlockedMsg'));
        } else {
            // Activate this box
            AppState.activeBoxIndex = boxIndex;
            this.highlightedBoxIndex = boxIndex;
            toast.info(i18n.t('toast.boxLocked'), i18n.tf('toast.boxLockedMsg', boxIndex));
        }
        this.redraw();
    }
    
    // Handle drag operation
    handleDrag(pos) {
        const coord = this.canvasToCoord(pos.x, pos.y);
        const states = this.getCurrentStates();
        if (!states || AppState.viewMode === 'transforming') return;
        
        const box = states[this.dragBoxIndex];
        if (!box) return;
        
        const deltaX = coord.x - this.dragStartCoord.x;
        const deltaY = coord.y - this.dragStartCoord.y;
        const startState = this.dragStartBoxState;
        
        switch (this.dragType) {
            case 'move':
                this.handleMove(box, deltaX, deltaY);
                break;
            case 'corner-tl':
            case 'corner-tr':
            case 'corner-bl':
            case 'corner-br':
                this.handleResize(box, coord, startState);
                break;
            case 'edge-left':
            case 'edge-right':
            case 'edge-top':
            case 'edge-bottom':
                this.handleMaskAdjust(box, coord, startState);
                break;
        }
        
        // Use unified App.update() - skip panel update during drag for performance
        App.update('canvas', { boxIndex: this.dragBoxIndex });
    }
    
    // Handle move operation
    handleMove(box, deltaX, deltaY) {
        const startState = this.dragStartBoxState;
        
        // Shift key: constrain to single axis
        if (this.shiftKey) {
            // Determine drag axis on first significant movement
            if (this.dragAxis === null) {
                if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
                    this.dragAxis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
                }
            }
            
            // Apply constraint
            if (this.dragAxis === 'x') {
                deltaY = 0;
            } else if (this.dragAxis === 'y') {
                deltaX = 0;
            }
        } else {
            // Reset drag axis when shift is released
            this.dragAxis = null;
        }
        
        // Apply precision snapping using AppState
        const newX = AppState.snapPosition(startState.xPosition + deltaX);
        const newY = AppState.snapPosition(startState.yPosition + deltaY);
        
        box.xPosition = newX;
        box.yPosition = newY;
        
        // No boundary clamping - allow box to go outside visible area
    }
    
    // Handle resize operation (corner drag)
    handleResize(box, coord, startState) {
        const baseW = startState.size * BoxPreviewCanvas.SCREEN_WIDTH;
        const baseH = startState.size * BoxPreviewCanvas.SCREEN_HEIGHT;
        
        // Calculate box center and edges at start
        const startCenterX = startState.xPosition;
        const startCenterY = startState.yPosition;
        const startLeft = startCenterX - baseW / 2;
        const startRight = startCenterX + baseW / 2;
        const startTop = startCenterY + baseH / 2;
        const startBottom = startCenterY - baseH / 2;
        
        let newSize = startState.size;
        let fixedX, fixedY;
        let anchorType = 'center'; // 'center', 'tl', 'tr', 'bl', 'br'
        
        // Shift key: resize from center (keep position fixed)
        if (this.shiftKey) {
            // Calculate distance from center to mouse
            const distX = Math.abs(coord.x - startCenterX);
            const distY = Math.abs(coord.y - startCenterY);
            
            // Calculate size based on distance from center
            const sizeFromX = (distX * 2) / BoxPreviewCanvas.SCREEN_WIDTH;
            const sizeFromY = (distY * 2) / BoxPreviewCanvas.SCREEN_HEIGHT;
            newSize = Math.max(sizeFromX, sizeFromY);
            
            fixedX = startCenterX;
            fixedY = startCenterY;
            anchorType = 'center';
        } else {
            // Normal resize: opposite corner stays fixed
            switch (this.dragType) {
                case 'corner-tl': {
                    // Bottom-right stays fixed
                    fixedX = startRight;
                    fixedY = startBottom;
                    const newWidth = (fixedX - coord.x);
                    const newHeight = (coord.y - fixedY);
                    const sizeFromW = newWidth / BoxPreviewCanvas.SCREEN_WIDTH;
                    const sizeFromH = newHeight / BoxPreviewCanvas.SCREEN_HEIGHT;
                    newSize = Math.max(sizeFromW, sizeFromH);
                    anchorType = 'br';
                    break;
                }
                case 'corner-tr': {
                    // Bottom-left stays fixed
                    fixedX = startLeft;
                    fixedY = startBottom;
                    const newWidth = (coord.x - fixedX);
                    const newHeight = (coord.y - fixedY);
                    const sizeFromW = newWidth / BoxPreviewCanvas.SCREEN_WIDTH;
                    const sizeFromH = newHeight / BoxPreviewCanvas.SCREEN_HEIGHT;
                    newSize = Math.max(sizeFromW, sizeFromH);
                    anchorType = 'bl';
                    break;
                }
                case 'corner-bl': {
                    // Top-right stays fixed
                    fixedX = startRight;
                    fixedY = startTop;
                    const newWidth = (fixedX - coord.x);
                    const newHeight = (fixedY - coord.y);
                    const sizeFromW = newWidth / BoxPreviewCanvas.SCREEN_WIDTH;
                    const sizeFromH = newHeight / BoxPreviewCanvas.SCREEN_HEIGHT;
                    newSize = Math.max(sizeFromW, sizeFromH);
                    anchorType = 'tr';
                    break;
                }
                case 'corner-br': {
                    // Top-left stays fixed
                    fixedX = startLeft;
                    fixedY = startTop;
                    const newWidth = (coord.x - fixedX);
                    const newHeight = (fixedY - coord.y);
                    const sizeFromW = newWidth / BoxPreviewCanvas.SCREEN_WIDTH;
                    const sizeFromH = newHeight / BoxPreviewCanvas.SCREEN_HEIGHT;
                    newSize = Math.max(sizeFromW, sizeFromH);
                    anchorType = 'tl';
                    break;
                }
            }
        }
        
        // Clamp size to valid range (0.02 to 2.0) and apply precision
        newSize = Math.max(0.02, Math.min(2.0, newSize));
        const snappedSize = AppState.snapSize(newSize);
        box.size = snappedSize;
        
        // Calculate new dimensions based on snapped size
        const newW = snappedSize * BoxPreviewCanvas.SCREEN_WIDTH;
        const newH = snappedSize * BoxPreviewCanvas.SCREEN_HEIGHT;
        
        // Recalculate position based on anchor type using snapped size
        switch (anchorType) {
            case 'center':
                box.xPosition = fixedX;
                box.yPosition = fixedY;
                break;
            case 'tl': // Top-left is anchor
                box.xPosition = fixedX + newW / 2;
                box.yPosition = fixedY - newH / 2;
                break;
            case 'tr': // Top-right is anchor
                box.xPosition = fixedX - newW / 2;
                box.yPosition = fixedY - newH / 2;
                break;
            case 'bl': // Bottom-left is anchor
                box.xPosition = fixedX + newW / 2;
                box.yPosition = fixedY + newH / 2;
                break;
            case 'br': // Bottom-right is anchor
                box.xPosition = fixedX - newW / 2;
                box.yPosition = fixedY + newH / 2;
                break;
        }
    }
    
    // Handle mask adjustment (edge drag)
    handleMaskAdjust(box, coord, startState) {
        // Auto-enable mask when adjusting
        if (!box.maskEnable) {
            box.maskEnable = true;
        }
        
        const baseW = box.size * BoxPreviewCanvas.SCREEN_WIDTH;
        const baseH = box.size * BoxPreviewCanvas.SCREEN_HEIGHT;
        const halfW = baseW / 2;
        const halfH = baseH / 2;
        
        // Box boundaries without mask
        const boxLeft = box.xPosition - halfW;
        const boxRight = box.xPosition + halfW;
        const boxTop = box.yPosition + halfH;
        const boxBottom = box.yPosition - halfH;
        
        // Get link states from AppState
        const linkStates = AppState.linkStates[box.boxIndex] || { lr: true, tb: true };
        
        switch (this.dragType) {
            case 'edge-left': {
                // Distance from original left edge to current mouse position
                const newMaskedLeft = coord.x - boxLeft;
                // Convert to mask units (0-32)
                const maxMask = linkStates.lr ? 16 - 0.05 : 32 - box.maskRight - 0.1;
                let maskValue = Math.max(0, Math.min(maxMask, (newMaskedLeft / baseW) * 32));
                maskValue = AppState.snapMask(maskValue);
                box.maskLeft = maskValue;
                // If linked, also update right
                if (linkStates.lr) {
                    box.maskRight = maskValue;
                }
                break;
            }
            case 'edge-right': {
                // Distance from original right edge to current mouse position
                const newMaskedRight = boxRight - coord.x;
                const maxMask = linkStates.lr ? 16 - 0.05 : 32 - box.maskLeft - 0.1;
                let maskValue = Math.max(0, Math.min(maxMask, (newMaskedRight / baseW) * 32));
                maskValue = AppState.snapMask(maskValue);
                box.maskRight = maskValue;
                // If linked, also update left
                if (linkStates.lr) {
                    box.maskLeft = maskValue;
                }
                break;
            }
            case 'edge-top': {
                // Distance from original top edge to current mouse position
                const newMaskedTop = boxTop - coord.y;
                const maxMask = linkStates.tb ? 9 - 0.05 : 18 - box.maskBottom - 0.1;
                let maskValue = Math.max(0, Math.min(maxMask, (newMaskedTop / baseH) * 18));
                maskValue = AppState.snapMask(maskValue);
                box.maskTop = maskValue;
                // If linked, also update bottom
                if (linkStates.tb) {
                    box.maskBottom = maskValue;
                }
                break;
            }
            case 'edge-bottom': {
                // Distance from original bottom edge to current mouse position
                const newMaskedBottom = coord.y - boxBottom;
                const maxMask = linkStates.tb ? 9 - 0.05 : 18 - box.maskTop - 0.1;
                let maskValue = Math.max(0, Math.min(maxMask, (newMaskedBottom / baseH) * 18));
                maskValue = AppState.snapMask(maskValue);
                box.maskBottom = maskValue;
                // If linked, also update top
                if (linkStates.tb) {
                    box.maskTop = maskValue;
                }
                break;
            }
        }
    }
    
    coordToCanvas(x, y) {
        const normX = (x - BoxPreviewCanvas.DISPLAY_X_MIN) / BoxPreviewCanvas.DISPLAY_WIDTH;
        const normY = (BoxPreviewCanvas.DISPLAY_Y_MAX - y) / BoxPreviewCanvas.DISPLAY_HEIGHT;
        
        const canvasX = this.offsetX + normX * this.drawWidth;
        const canvasY = this.offsetY + normY * this.drawHeight;
        
        return { x: canvasX, y: canvasY };
    }
    
    // Get colors based on current theme
    getThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return isDark ? {
            // Dark theme - Pure Black
            canvasBg: '#0a0a0a',
            extendedBg: '#171717',
            screenBg: '#1f1f1f',
            gridLineOutside: '#27272a',
            gridLineInside: '#3f3f46',
            labelOutside: '#52525b',
            labelInside: '#a1a1aa',
            screenBorder: '#FF4757',
            centerCross: '#52525b',
            centerDot: '#FF4757',
            boxLabelBg: 'rgba(23, 23, 23, 0.95)',
            boxLabelText: '#fafafa',
            boxLabelTextDisabled: '#a1a1aa',
            boxLabelTextSecondary: '#a1a1aa'
        } : {
            // Light theme
            canvasBg: '#F8F9FA',
            extendedBg: '#F0F1F3',
            screenBg: '#FFFFFF',
            gridLineOutside: '#E0E2E6',
            gridLineInside: '#E5E7EB',
            labelOutside: '#B0B5BC',
            labelInside: '#6B7280',
            screenBorder: '#FF4757',
            centerCross: '#9CA3AF',
            centerDot: '#FF4757',
            boxLabelBg: 'rgba(255, 255, 255, 0.9)',
            boxLabelText: '#1F2937',
            boxLabelTextDisabled: '#6B7280',
            boxLabelTextSecondary: '#6B7280'
        };
    }
    
    drawGrid() {
        const ctx = this.ctx;
        const colors = this.getThemeColors();
        
        // Clear canvas with theme-appropriate background
        ctx.fillStyle = colors.canvasBg;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw outer boundary area (extended area)
        const extTopLeft = this.coordToCanvas(BoxPreviewCanvas.DISPLAY_X_MIN, BoxPreviewCanvas.DISPLAY_Y_MAX);
        const extBottomRight = this.coordToCanvas(BoxPreviewCanvas.DISPLAY_X_MAX, BoxPreviewCanvas.DISPLAY_Y_MIN);
        
        ctx.fillStyle = colors.extendedBg;
        ctx.fillRect(extTopLeft.x, extTopLeft.y, extBottomRight.x - extTopLeft.x, extBottomRight.y - extTopLeft.y);
        
        // Draw visible screen area background
        const screenTopLeft = this.coordToCanvas(BoxPreviewCanvas.SCREEN_X_MIN, BoxPreviewCanvas.SCREEN_Y_MAX);
        const screenBottomRight = this.coordToCanvas(BoxPreviewCanvas.SCREEN_X_MAX, BoxPreviewCanvas.SCREEN_Y_MIN);
        
        ctx.fillStyle = colors.screenBg;
        ctx.fillRect(screenTopLeft.x, screenTopLeft.y, screenBottomRight.x - screenTopLeft.x, screenBottomRight.y - screenTopLeft.y);
        
        // Draw grid lines
        ctx.strokeStyle = colors.gridLineInside;
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        
        const gridIntervalX = 4;
        const gridIntervalY = 4;
        
        // Vertical grid lines
        for (let x = -20; x <= 20; x += gridIntervalX) {
            const pos = this.coordToCanvas(x, 0);
            const isOutside = x < -16 || x > 16;
            
            ctx.strokeStyle = isOutside ? colors.gridLineOutside : colors.gridLineInside;
            ctx.beginPath();
            ctx.moveTo(pos.x, this.offsetY);
            ctx.lineTo(pos.x, this.offsetY + this.drawHeight);
            ctx.stroke();
            
            // X axis labels
            ctx.fillStyle = isOutside ? colors.labelOutside : colors.labelInside;
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(x.toString(), pos.x, this.offsetY + this.drawHeight + 16);
        }
        
        // Horizontal grid lines
        for (let y = -12; y <= 12; y += gridIntervalY) {
            const pos = this.coordToCanvas(0, y);
            const isOutside = y < -9 || y > 9;
            
            ctx.strokeStyle = isOutside ? colors.gridLineOutside : colors.gridLineInside;
            ctx.beginPath();
            ctx.moveTo(this.offsetX, pos.y);
            ctx.lineTo(this.offsetX + this.drawWidth, pos.y);
            ctx.stroke();
            
            // Y axis labels
            ctx.fillStyle = isOutside ? colors.labelOutside : colors.labelInside;
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(y.toString(), this.offsetX - 8, pos.y + 4);
        }
        
        // Draw visible screen boundary (16:9 area)
        ctx.strokeStyle = colors.screenBorder;
        ctx.lineWidth = 2;
        ctx.strokeRect(screenTopLeft.x, screenTopLeft.y, 
            screenBottomRight.x - screenTopLeft.x, screenBottomRight.y - screenTopLeft.y);
        
        // Draw center cross
        const center = this.coordToCanvas(0, 0);
        ctx.strokeStyle = colors.centerCross;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(center.x - 12, center.y);
        ctx.lineTo(center.x + 12, center.y);
        ctx.moveTo(center.x, center.y - 12);
        ctx.lineTo(center.x, center.y + 12);
        ctx.stroke();
        
        // Draw center point
        ctx.fillStyle = colors.centerDot;
        ctx.beginPath();
        ctx.arc(center.x, center.y, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    // Draw a single box with optional disabled state indicator
    // isDisabledInOtherMode: true if this box is disabled in the other state (initial/final)
    drawBox(box, isDisabledInOtherMode = false) {
        // Allow drawing disabled boxes if they are enabled in the other mode (for ghost preview)
        if (!box.enable && !isDisabledInOtherMode) return;
        
        const ctx = this.ctx;
        const color = BoxPreviewCanvas.BOX_COLORS[box.boxIndex];
        const colors = this.getThemeColors();
        
        // Check if this box is being hovered or dragged
        const isHovered = this.hoverInfo && this.hoverInfo.boxIndex === box.boxIndex;
        const isDragging = this.isDragging && this.dragBoxIndex === box.boxIndex;
        const isActive = AppState.activeBoxIndex === box.boxIndex;
        const isHighlighted = this.highlightedBoxIndex === box.boxIndex; // For touch/click highlight
        const isInteractive = AppState.viewMode !== 'transforming';
        const isDisabled = !box.enable; // Currently disabled in this state
        
        // Calculate box dimensions with mask
        const baseW = box.size * BoxPreviewCanvas.SCREEN_WIDTH;
        const baseH = box.size * BoxPreviewCanvas.SCREEN_HEIGHT;
        const maskL = box.maskEnable ? (box.maskLeft / 32) * baseW : 0;
        const maskR = box.maskEnable ? (box.maskRight / 32) * baseW : 0;
        const maskT = box.maskEnable ? (box.maskTop / 18) * baseH : 0;
        const maskB = box.maskEnable ? (box.maskBottom / 18) * baseH : 0;
        
        if (baseW - maskL - maskR <= 0 || baseH - maskT - maskB <= 0) return;
        
        // Box boundaries in coordinates
        const boxL = box.xPosition - baseW / 2 + maskL;
        const boxR = box.xPosition + baseW / 2 - maskR;
        const boxT = box.yPosition + baseH / 2 - maskT;
        const boxB = box.yPosition - baseH / 2 + maskB;
        
        // Convert to canvas pixels
        const tl = this.coordToCanvas(boxL, boxT);
        const br = this.coordToCanvas(boxR, boxB);
        const rectX = tl.x, rectY = tl.y;
        const rectW = br.x - tl.x, rectH = br.y - tl.y;
        
        // Determine if this box should show handles (highlighted, hovered, dragging, or active)
        const showHandles = isHovered || isDragging || isActive || isHighlighted;
        
        // Draw active box highlight (subtle filled background only, no thick border)
        if (isActive && isInteractive) {
            ctx.fillStyle = color + '25'; // Very subtle highlight
            ctx.fillRect(rectX - 4, rectY - 4, rectW + 8, rectH + 8);
        }
        
        // Determine fill opacity based on state
        // Disabled boxes now use same opacity as enabled (70 for hover/active, 50 normal)
        let fillOpacity, strokeOpacity;
        if (isDisabled) {
            fillOpacity = showHandles ? '70' : '50';
            strokeOpacity = showHandles ? 'CC' : '99';
        } else if (showHandles) {
            fillOpacity = '70';
            strokeOpacity = 'FF';
        } else {
            fillOpacity = '50';
            strokeOpacity = 'CC';
        }
        
        // Draw box with shadow
        ctx.shadowColor = showHandles ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = showHandles ? 12 : 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = color + fillOpacity;
        ctx.fillRect(rectX, rectY, rectW, rectH);
        ctx.shadowColor = 'transparent';
        
        // Draw border - dashed for disabled boxes, solid for enabled
        ctx.strokeStyle = color + strokeOpacity;
        ctx.lineWidth = showHandles ? 3 : 2;
        if (isDisabled) {
            ctx.setLineDash([6, 4]); // Dashed line for disabled
        } else {
            ctx.setLineDash([]);
        }
        ctx.strokeRect(rectX, rectY, rectW, rectH);
        ctx.setLineDash([]); // Reset dash
        
        // Draw interaction handles when interactive and (hovered/dragging/active/highlighted)
        // Now also works for disabled boxes and highlighted boxes (touch selection)
        if (isInteractive && showHandles) {
            this.drawInteractionHandles(box, rectX, rectY, rectW, rectH, color, isActive);
        }
        
        // Draw center point
        const center = this.coordToCanvas(box.xPosition, box.yPosition);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = color + (isDisabled ? '99' : 'FF');
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(center.x, center.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Label positioning: stay in box, prefer visible in canvas, avoid center point
        const LW = 60, LH = 32, PAD = 8;
        let lx = center.x, ly = center.y + PAD + LH / 2;
        
        // Clamp to box boundaries
        lx = Math.max(rectX + LW / 2 + 2, Math.min(rectX + rectW - LW / 2 - 2, lx));
        ly = Math.max(rectY + LH / 2 + 2, Math.min(rectY + rectH - LH / 2 - 2, ly));
        
        // Try to keep label visible in canvas render area (0 to width/height)
        const canvasMargin = 4;
        const visLeft = canvasMargin + LW / 2;
        const visRight = this.width - canvasMargin - LW / 2;
        const visTop = canvasMargin + LH / 2;
        const visBottom = this.height - canvasMargin - LH / 2;
        
        // Adjust X if needed, but stay in box
        if (lx < visLeft) lx = Math.min(visLeft, rectX + rectW - LW / 2 - 2);
        if (lx > visRight) lx = Math.max(visRight, rectX + LW / 2 + 2);
        
        // Adjust Y if needed, but stay in box
        if (ly < visTop) ly = Math.min(visTop, rectY + rectH - LH / 2 - 2);
        if (ly > visBottom) ly = Math.max(visBottom, rectY + LH / 2 + 2);
        
        // Avoid overlapping with center point (check if label covers center)
        const centerDist = Math.hypot(lx - center.x, ly - center.y);
        if (centerDist < LH / 2 + 8) {
            // Move label: prefer Y axis shift (below or above center)
            const belowY = center.y + PAD + LH / 2;
            const aboveY = center.y - PAD - LH / 2;
            if (belowY <= rectY + rectH - LH / 2 - 2 && belowY <= visBottom) {
                ly = belowY;
            } else if (aboveY >= rectY + LH / 2 + 2 && aboveY >= visTop) {
                ly = aboveY;
            }
        }
        
        // Draw label (using theme colors)
        ctx.fillStyle = colors.boxLabelBg;
        ctx.beginPath();
        ctx.roundRect(lx - LW / 2, ly - LH / 2, LW, LH, 4);
        ctx.fill();
        
        ctx.fillStyle = isDisabled ? colors.boxLabelTextDisabled : colors.boxLabelText;
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Box ${box.boxIndex}${isDisabled ? ' (Off)' : ''}`, lx, ly - 3);
        
        ctx.fillStyle = colors.boxLabelTextSecondary;
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`S:${box.size.toFixed(2)}`, lx, ly + 10);
    }
    
    // Draw interaction handles (corners for resize, edges highlighted for mask)
    drawInteractionHandles(box, rectX, rectY, rectW, rectH, color, isActiveBox = false) {
        const ctx = this.ctx;
        const colors = this.getThemeColors();
        const CORNER_SIZE = 8;
        const EDGE_HANDLE_WIDTH = 24;  // Width of edge handle rectangle
        const EDGE_HANDLE_HEIGHT = 6;  // Height of edge handle rectangle
        const activeType = this.isDragging ? this.dragType : (this.hoverInfo ? this.hoverInfo.type : null);
        const handleFillInactive = colors.screenBg; // Use screen background for inactive handles
        
        // Draw corner handles (for resize)
        const corners = [
            { x: rectX, y: rectY, type: 'corner-tl' },
            { x: rectX + rectW, y: rectY, type: 'corner-tr' },
            { x: rectX, y: rectY + rectH, type: 'corner-bl' },
            { x: rectX + rectW, y: rectY + rectH, type: 'corner-br' }
        ];
        
        corners.forEach(corner => {
            const isActive = activeType === corner.type;
            // For active box, always fill with color; otherwise use theme-appropriate fill
            ctx.fillStyle = (isActive || isActiveBox) ? color : handleFillInactive;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(corner.x - CORNER_SIZE / 2, corner.y - CORNER_SIZE / 2, CORNER_SIZE, CORNER_SIZE);
            ctx.fill();
            ctx.stroke();
        });
        
        // Draw edge midpoint handles (rectangles for mask adjustment)
        const edgeHandles = [
            { 
                x: rectX - EDGE_HANDLE_HEIGHT / 2, 
                y: rectY + rectH / 2 - EDGE_HANDLE_WIDTH / 2, 
                w: EDGE_HANDLE_HEIGHT, 
                h: EDGE_HANDLE_WIDTH, 
                type: 'edge-left' 
            },
            { 
                x: rectX + rectW - EDGE_HANDLE_HEIGHT / 2, 
                y: rectY + rectH / 2 - EDGE_HANDLE_WIDTH / 2, 
                w: EDGE_HANDLE_HEIGHT, 
                h: EDGE_HANDLE_WIDTH, 
                type: 'edge-right' 
            },
            { 
                x: rectX + rectW / 2 - EDGE_HANDLE_WIDTH / 2, 
                y: rectY - EDGE_HANDLE_HEIGHT / 2, 
                w: EDGE_HANDLE_WIDTH, 
                h: EDGE_HANDLE_HEIGHT, 
                type: 'edge-top' 
            },
            { 
                x: rectX + rectW / 2 - EDGE_HANDLE_WIDTH / 2, 
                y: rectY + rectH - EDGE_HANDLE_HEIGHT / 2, 
                w: EDGE_HANDLE_WIDTH, 
                h: EDGE_HANDLE_HEIGHT, 
                type: 'edge-bottom' 
            }
        ];
        
        edgeHandles.forEach(handle => {
            const isActive = activeType === handle.type;
            // For active box, always fill with color; otherwise use theme-appropriate fill
            ctx.fillStyle = (isActive || isActiveBox) ? color : handleFillInactive;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(handle.x, handle.y, handle.w, handle.h, 2);
            ctx.fill();
            ctx.stroke();
        });
        
        // Highlight the entire edge when active (dragging)
        if (activeType && activeType.startsWith('edge-')) {
            const edges = [
                { x1: rectX, y1: rectY + CORNER_SIZE, x2: rectX, y2: rectY + rectH - CORNER_SIZE, type: 'edge-left' },
                { x1: rectX + rectW, y1: rectY + CORNER_SIZE, x2: rectX + rectW, y2: rectY + rectH - CORNER_SIZE, type: 'edge-right' },
                { x1: rectX + CORNER_SIZE, y1: rectY, x2: rectX + rectW - CORNER_SIZE, y2: rectY, type: 'edge-top' },
                { x1: rectX + CORNER_SIZE, y1: rectY + rectH, x2: rectX + rectW - CORNER_SIZE, y2: rectY + rectH, type: 'edge-bottom' }
            ];
            
            edges.forEach(edge => {
                if (activeType === edge.type) {
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(edge.x1, edge.y1);
                    ctx.lineTo(edge.x2, edge.y2);
                    ctx.stroke();
                }
            });
        }
    }
    
    /**
     * Highlight a box (show handles) without locking it
     * Called from external sources like legend or box control panel
     * @param {number} boxIndex - The box index to highlight (0-3), or null to clear
     */
    highlightBox(boxIndex) {
        if (AppState.viewMode === 'transforming') return;
        this.highlightedBoxIndex = boxIndex;
        this.redraw();
    }
    
    /**
     * Toggle active (locked) state for a box
     * Called from external sources like legend or box control panel on double-click
     * @param {number} boxIndex - The box index to toggle (0-3)
     */
    toggleActiveBox(boxIndex) {
        if (AppState.viewMode === 'transforming') return;
        
        const i18n = window.i18nManager;
        if (AppState.activeBoxIndex === boxIndex) {
            // Already active - deactivate
            AppState.activeBoxIndex = null;
            this.highlightedBoxIndex = null;
            toast.info(i18n.t('toast.boxUnlocked'), i18n.t('toast.boxUnlockedMsg'));
        } else {
            // Activate this box
            AppState.activeBoxIndex = boxIndex;
            this.highlightedBoxIndex = boxIndex;
            toast.info(i18n.t('toast.boxLocked'), i18n.tf('toast.boxLockedMsg', boxIndex));
        }
        this.redraw();
    }
    
    setViewMode(mode) {
        // ViewMode is managed by AppState, this method is kept for compatibility
        // but does nothing as redraw() reads from AppState
        this.redraw();
    }
    
    // Update transforming states for animation preview
    updateTransformingStates(states) {
        this.transformingStates = states;
        if (AppState.viewMode === 'transforming') {
            this.redraw();
        }
    }
    
    redraw() {
        this.drawGrid();
        
        // Draw boxes based on current view mode (read from AppState)
        // Layer order: Enabled 0 > 1 > 2 > 3 > Disabled 0 > 1 > 2 > 3
        // Draw in reverse order so higher priority boxes are drawn last (on top)
        const drawOrder = [3, 2, 1, 0];
        
        if (AppState.viewMode === 'initial') {
            // First pass: draw disabled boxes (those enabled in final but not in initial) as ghosts
            // These go below all enabled boxes
            for (const i of drawOrder) {
                const initialBox = AppState.initialStates[i];
                const finalBox = AppState.finalStates[i];
                if (initialBox && !initialBox.enable && finalBox && finalBox.enable) {
                    // This box is disabled in initial but enabled in final - draw as ghost
                    this.drawBox(initialBox, true);
                }
            }
            // Second pass: draw enabled boxes (on top of disabled)
            for (const i of drawOrder) {
                if (AppState.initialStates[i] && AppState.initialStates[i].enable) {
                    this.drawBox(AppState.initialStates[i], false);
                }
            }
        } else if (AppState.viewMode === 'final') {
            // First pass: draw disabled boxes (those enabled in initial but not in final) as ghosts
            for (const i of drawOrder) {
                const initialBox = AppState.initialStates[i];
                const finalBox = AppState.finalStates[i];
                if (finalBox && !finalBox.enable && initialBox && initialBox.enable) {
                    // This box is disabled in final but enabled in initial - draw as ghost
                    this.drawBox(finalBox, true);
                }
            }
            // Second pass: draw enabled boxes
            for (const i of drawOrder) {
                if (AppState.finalStates[i] && AppState.finalStates[i].enable) {
                    this.drawBox(AppState.finalStates[i], false);
                }
            }
        } else if (AppState.viewMode === 'transforming' && this.transformingStates) {
            // During transition, boxes have their enable state set by interpolation
            // Draw disabled boxes first (bottom layer), then enabled boxes (top layer)
            // First pass: disabled boxes
            for (const i of drawOrder) {
                const box = this.transformingStates[i];
                if (box && !box.enable) {
                    this.drawBox(box, false);
                }
            }
            // Second pass: enabled boxes
            for (const i of drawOrder) {
                const box = this.transformingStates[i];
                if (box && box.enable) {
                    this.drawBox(box, false);
                }
            }
        }
    }
    
    clear() {
        // Clear is now handled by App.clearStates()
        this.drawGrid();
    }
}

// ============== Easing Preview Canvas ==============

class EasingPreviewCanvas {
    // Extended range to show values outside 0-1
    static DISPLAY_MIN = -0.1;
    static DISPLAY_MAX = 1.2;
    static DISPLAY_RANGE = 1.3; // 1.2 - (-0.1)
    
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // High DPI support
        this.dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        // Set canvas actual size in memory (scaled for HiDPI)
        canvas.width = rect.width * this.dpr;
        canvas.height = rect.height * this.dpr;
        
        // Scale context to match HiDPI
        this.ctx.scale(this.dpr, this.dpr);
        
        // Use CSS size for calculations
        this.width = rect.width;
        this.height = rect.height;
        this.padding = 10;
    }
    
    // Get theme-aware colors
    getThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            return {
                background: '#161616',
                validArea: 'rgba(255, 71, 87, 0.1)',
                grid: '#2a2a2a',
                axis: '#3a3a3a',
                reference: '#525252',
                curve: '#FF4757',
                point: '#FF4757',
                text: '#a1a1aa'
            };
        } else {
            return {
                background: '#FFFFFF',
                validArea: '#FFF5F5',
                grid: '#F3F4F6',
                axis: '#E5E7EB',
                reference: '#D1D5DB',
                curve: '#FF4757',
                point: '#FF4757',
                text: '#9CA3AF'
            };
        }
    }
    
    valueToCanvas(t, value) {
        const drawWidth = this.width - 2 * this.padding;
        const drawHeight = this.height - 2 * this.padding;
        
        const normT = (t - EasingPreviewCanvas.DISPLAY_MIN) / EasingPreviewCanvas.DISPLAY_RANGE;
        const normV = (EasingPreviewCanvas.DISPLAY_MAX - value) / EasingPreviewCanvas.DISPLAY_RANGE;
        
        return {
            x: this.padding + normT * drawWidth,
            y: this.padding + normV * drawHeight
        };
    }
    
    draw(easingType) {
        const ctx = this.ctx;
        const easingFunc = EasingFunctions[easingType] || EasingFunctions.linear;
        const colors = this.getThemeColors();
        
        const drawWidth = this.width - 2 * this.padding;
        const drawHeight = this.height - 2 * this.padding;
        
        // Clear with theme background
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw valid range area (0-1 x 0-1)
        const validTopLeft = this.valueToCanvas(0, 1);
        const validBottomRight = this.valueToCanvas(1, 0);
        
        ctx.fillStyle = colors.validArea;
        ctx.fillRect(validTopLeft.x, validTopLeft.y, 
            validBottomRight.x - validTopLeft.x, validBottomRight.y - validTopLeft.y);
        
        // Draw grid
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1;
        
        // Vertical lines at 0, 0.5, 1
        [0, 0.5, 1].forEach(t => {
            const pos = this.valueToCanvas(t, 0);
            ctx.beginPath();
            ctx.moveTo(pos.x, this.padding);
            ctx.lineTo(pos.x, this.height - this.padding);
            ctx.stroke();
        });
        
        // Horizontal lines at 0, 0.5, 1
        [0, 0.5, 1].forEach(v => {
            const pos = this.valueToCanvas(0, v);
            ctx.beginPath();
            ctx.moveTo(this.padding, pos.y);
            ctx.lineTo(this.width - this.padding, pos.y);
            ctx.stroke();
        });
        
        // Draw axis at 0 and 1 boundaries
        ctx.strokeStyle = colors.axis;
        ctx.lineWidth = 1;
        
        // Draw the diagonal reference line (linear)
        ctx.strokeStyle = colors.reference;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        const linearStart = this.valueToCanvas(0, 0);
        const linearEnd = this.valueToCanvas(1, 1);
        ctx.moveTo(linearStart.x, linearStart.y);
        ctx.lineTo(linearEnd.x, linearEnd.y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw easing curve - extended range for elastic/bounce effects
        ctx.strokeStyle = colors.curve;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        let isFirst = true;
        for (let i = -10; i <= 110; i++) {
            const t = i / 100;
            const clampedT = Math.max(0, Math.min(1, t));
            const value = easingFunc(clampedT);
            
            // Only draw from 0 to 1 for t
            if (t >= 0 && t <= 1) {
                const pos = this.valueToCanvas(t, value);
                
                if (isFirst) {
                    ctx.moveTo(pos.x, pos.y);
                    isFirst = false;
                } else {
                    ctx.lineTo(pos.x, pos.y);
                }
            }
        }
        ctx.stroke();
        
        // Draw start and end points
        const startPos = this.valueToCanvas(0, easingFunc(0));
        const endPos = this.valueToCanvas(1, easingFunc(1));
        
        ctx.fillStyle = colors.point;
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(endPos.x, endPos.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw boundary markers
        ctx.fillStyle = colors.text;
        ctx.font = '8px Inter, sans-serif';
        ctx.textAlign = 'center';
        
        const zeroPos = this.valueToCanvas(0, 0);
        const onePos = this.valueToCanvas(1, 1);
        ctx.fillText('0', zeroPos.x, this.height - 2);
        ctx.fillText('1', onePos.x, this.height - 2);
    }
}

// ============== Main Application ==============

// ============== Box Control Panel ==============

class BoxControlPanel {
    constructor(app) {
        this.app = app;
        
        // Clipboard for copy/paste functionality (local to this panel)
        this.clipboard = {
            type: null, // 'param' or 'box'
            param: null, // parameter name if type is 'param'
            value: null, // single value if type is 'param'
            boxState: null, // full box state if type is 'box'
            sourceMode: null, // 'initial' or 'final'
            sourceBoxIndex: null
        };
        
        this.initElements();
        this.bindEvents();
        this.updateUI();
    }
    
    // Update link button UI for a specific box
    updateLinkButtonUI(boxIndex) {
        const panel = document.querySelector(`.box-control-panel[data-box="${boxIndex}"]`);
        if (!panel) return;
        
        const lrBtn = panel.querySelector('.link-btn[data-link="lr"]');
        const tbBtn = panel.querySelector('.link-btn[data-link="tb"]');
        if (lrBtn) {
            lrBtn.classList.toggle('active', AppState.linkStates[boxIndex].lr);
        }
        if (tbBtn) {
            tbBtn.classList.toggle('active', AppState.linkStates[boxIndex].tb);
        }
    }
    
    initElements() {
        this.boxPanels = document.querySelectorAll('.box-control-panel');
    }
    
    bindEvents() {
        // Enable switches
        document.querySelectorAll('.box-enable').forEach(input => {
            input.addEventListener('change', (e) => this.onEnableChange(e));
        });
        
        // Mask enable switches
        document.querySelectorAll('.mask-enable').forEach(input => {
            input.addEventListener('change', (e) => this.onMaskEnableChange(e));
        });
        
        // Sliders
        document.querySelectorAll('.box-slider').forEach(slider => {
            slider.addEventListener('input', (e) => this.onSliderInput(e));
        });
        
        // Number inputs
        document.querySelectorAll('.box-input').forEach(input => {
            input.addEventListener('input', (e) => this.onNumberInput(e));
            input.addEventListener('change', (e) => this.onNumberChange(e));
        });
        
        // Link buttons
        document.querySelectorAll('.link-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.onLinkToggle(e));
        });
        
        // Copy parameter buttons
        document.querySelectorAll('.copy-param-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.onCopyParamClick(e));
        });
        
        // Copy box buttons
        document.querySelectorAll('.copy-box-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.onCopyBoxClick(e));
        });
        
        // Note: Toggle buttons are now handled by SuperSourceTransitionApp.setPreviewMode()
    }
    
    getCurrentStates() {
        return AppState.getCurrentStates();
    }
    
    setMode(mode) {
        // Toggle button states are now managed by SuperSourceTransitionApp.setPreviewMode()
        // This method only handles panel enable/disable state
        
        // Enable/disable panels based on mode
        const isEditable = mode !== 'transforming';
        this.boxPanels.forEach(panel => {
            if (isEditable) {
                panel.classList.remove('disabled');
            } else {
                panel.classList.add('disabled');
            }
            
            // Disable all inputs in panel
            panel.querySelectorAll('input, button').forEach(el => {
                el.disabled = !isEditable;
            });
        });
        
        this.updateUI();
        
        // Update copy/paste button states when switching modes
        this.updateCopyPasteButtons();
    }
    
    updateUI() {
        const states = this.getCurrentStates();
        
        for (let i = 0; i < 4; i++) {
            const box = states[i] || new BoxState(i);
            this.updateBoxUI(i, box);
        }
    }
    
    updateBoxUI(boxIndex, box) {
        const panel = document.querySelector(`.box-control-panel[data-box="${boxIndex}"]`);
        if (!panel) return;
        
        // Update enable switch
        const enableSwitch = panel.querySelector('.box-enable');
        if (enableSwitch) enableSwitch.checked = box.enable;
        
        // Update mask enable switch
        const maskEnableSwitch = panel.querySelector('.mask-enable');
        if (maskEnableSwitch) maskEnableSwitch.checked = box.maskEnable;
        
        // Update mask controls visibility
        const maskControls = panel.querySelector('.mask-controls');
        if (maskControls) {
            if (box.maskEnable) {
                maskControls.classList.add('enabled');
            } else {
                maskControls.classList.remove('enabled');
            }
        }
        
        // Update parameters
        const params = ['size', 'xPosition', 'yPosition', 'maskLeft', 'maskRight', 'maskTop', 'maskBottom'];
        params.forEach(param => {
            const slider = panel.querySelector(`.box-slider[data-param="${param}"]`);
            const input = panel.querySelector(`.box-input[data-param="${param}"]`);
            const value = box[param];
            
            if (slider) slider.value = value;
            if (input) input.value = this.formatValue(param, value);
        });
        
        // Update link button states
        const lrBtn = panel.querySelector('.link-btn[data-link="lr"]');
        const tbBtn = panel.querySelector('.link-btn[data-link="tb"]');
        if (lrBtn) {
            lrBtn.classList.toggle('active', AppState.linkStates[boxIndex].lr);
        }
        if (tbBtn) {
            tbBtn.classList.toggle('active', AppState.linkStates[boxIndex].tb);
        }
    }
    
    formatValue(param, value) {
        if (param === 'size') return value.toFixed(2);
        if (param.startsWith('mask')) return value.toFixed(1);
        return value.toFixed(2);
    }
    
    onEnableChange(e) {
        if (AppState.viewMode === 'transforming') return;
        
        const boxIndex = parseInt(e.target.dataset.box);
        App.setBoxProperty(boxIndex, 'enable', e.target.checked);
    }
    
    onMaskEnableChange(e) {
        if (AppState.viewMode === 'transforming') return;
        
        const boxIndex = parseInt(e.target.dataset.box);
        App.setBoxProperty(boxIndex, 'maskEnable', e.target.checked);
        
        // Update mask controls visibility
        const panel = document.querySelector(`.box-control-panel[data-box="${boxIndex}"]`);
        const maskControls = panel.querySelector('.mask-controls');
        if (maskControls) {
            maskControls.classList.toggle('enabled', e.target.checked);
        }
    }
    
    onSliderInput(e) {
        if (AppState.viewMode === 'transforming') return;
        
        const boxIndex = parseInt(e.target.dataset.box);
        const param = e.target.dataset.param;
        const value = parseFloat(e.target.value);
        
        this.updateParam(boxIndex, param, value);
    }
    
    onNumberInput(e) {
        if (AppState.viewMode === 'transforming') return;
        
        const boxIndex = parseInt(e.target.dataset.box);
        const param = e.target.dataset.param;
        const value = parseFloat(e.target.value);
        
        if (!isNaN(value)) {
            // Update state and slider only, don't update the input box to preserve user input
            this.updateParamFromInput(boxIndex, param, value);
        }
    }
    
    onNumberChange(e) {
        // Ensure valid value on blur
        const boxIndex = parseInt(e.target.dataset.box);
        const param = e.target.dataset.param;
        const states = this.getCurrentStates();
        const value = states[boxIndex][param];
        e.target.value = this.formatValue(param, value);
    }
    
    // Update parameter from number input - don't update the input field itself
    updateParamFromInput(boxIndex, param, value) {
        const states = AppState.getEditableStates();
        states[boxIndex][param] = value;
        
        // Handle linked parameters
        App.handleLinkedMask(boxIndex, param, value);
        
        // Update slider only (not the input field that triggered this)
        const panel = document.querySelector(`.box-control-panel[data-box="${boxIndex}"]`);
        if (panel) {
            const slider = panel.querySelector(`.box-slider[data-param="${param}"]`);
            if (slider) slider.value = value;
            
            // Update linked param's slider and input
            if (param === 'maskLeft' && AppState.linkStates[boxIndex].lr) {
                const linkedSlider = panel.querySelector(`.box-slider[data-param="maskRight"]`);
                const linkedInput = panel.querySelector(`.box-input[data-param="maskRight"]`);
                if (linkedSlider) linkedSlider.value = value;
                if (linkedInput) linkedInput.value = this.formatValue('maskRight', value);
            } else if (param === 'maskRight' && AppState.linkStates[boxIndex].lr) {
                const linkedSlider = panel.querySelector(`.box-slider[data-param="maskLeft"]`);
                const linkedInput = panel.querySelector(`.box-input[data-param="maskLeft"]`);
                if (linkedSlider) linkedSlider.value = value;
                if (linkedInput) linkedInput.value = this.formatValue('maskLeft', value);
            } else if (param === 'maskTop' && AppState.linkStates[boxIndex].tb) {
                const linkedSlider = panel.querySelector(`.box-slider[data-param="maskBottom"]`);
                const linkedInput = panel.querySelector(`.box-input[data-param="maskBottom"]`);
                if (linkedSlider) linkedSlider.value = value;
                if (linkedInput) linkedInput.value = this.formatValue('maskBottom', value);
            } else if (param === 'maskBottom' && AppState.linkStates[boxIndex].tb) {
                const linkedSlider = panel.querySelector(`.box-slider[data-param="maskTop"]`);
                const linkedInput = panel.querySelector(`.box-input[data-param="maskTop"]`);
                if (linkedSlider) linkedSlider.value = value;
                if (linkedInput) linkedInput.value = this.formatValue('maskTop', value);
            }
        }
        
        // Use App.update with skipPanel to avoid recursive update
        App.update('panel', { boxIndex, skipPanel: true });
    }
    
    updateParam(boxIndex, param, value) {
        const states = AppState.getEditableStates();
        states[boxIndex][param] = value;
        
        // Handle linked parameters
        App.handleLinkedMask(boxIndex, param, value);
        
        // Update UI
        this.updateBoxUI(boxIndex, states[boxIndex]);
        
        // Use App.update with skipPanel to avoid recursive update (we just updated UI)
        App.update('panel', { boxIndex, skipPanel: true });
    }
    
    onLinkToggle(e) {
        const btn = e.currentTarget;
        const boxIndex = parseInt(btn.dataset.box);
        const linkType = btn.dataset.link;
        
        // Use App.toggleLink which handles syncing values and update
        App.toggleLink(boxIndex, linkType);
        
        // Update button state
        btn.classList.toggle('active', AppState.linkStates[boxIndex][linkType]);
    }
    
    // Copy parameter button click handler
    onCopyParamClick(e) {
        const btn = e.currentTarget;
        const boxIndex = parseInt(btn.dataset.box);
        const param = btn.dataset.param;
        
        // If already in clipboard for this param, this is a cancel action
        if (this.clipboard.type === 'param' && this.clipboard.param === param && 
            btn.classList.contains('copied')) {
            this.clearClipboard();
            return;
        }
        
        // If clipboard has same param type, this is a paste action
        if (this.clipboard.type === 'param' && this.clipboard.param === param && 
            btn.classList.contains('paste-mode')) {
            this.pasteParam(boxIndex, param);
            return;
        }
        
        // Copy action
        const states = this.getCurrentStates();
        this.clipboard = {
            type: 'param',
            param: param,
            value: states[boxIndex][param],
            boxState: null,
            sourceMode: AppState.viewMode,
            sourceBoxIndex: boxIndex
        };
        
        // Update button states
        this.updateCopyPasteButtons();
        
        const i18n = window.i18nManager;
        showToast('success', i18n.t('toast.copied'), `${this.getParamDisplayName(param)}: ${this.formatValue(param, this.clipboard.value)}`);
    }
    
    // Paste parameter to target
    pasteParam(boxIndex, param) {
        if (AppState.viewMode === 'transforming') return;
        
        const states = AppState.getEditableStates();
        states[boxIndex][param] = this.clipboard.value;
        
        // Handle linked parameters
        App.handleLinkedMask(boxIndex, param, this.clipboard.value);
        
        // Update via App.update
        App.update('panel', { boxIndex });
        
        const i18n = window.i18nManager;
        showToast('success', i18n.t('toast.pasted'), `${this.getParamDisplayName(param)} → Box ${boxIndex}`);
        
        // Auto clear clipboard after paste
        this.clearClipboardSilent();
    }
    
    // Clear clipboard silently (no toast)
    clearClipboardSilent() {
        this.clipboard = {
            type: null,
            param: null,
            value: null,
            boxState: null,
            sourceMode: null,
            sourceBoxIndex: null
        };
        this.updateCopyPasteButtons();
    }
    
    // Copy box button click handler
    onCopyBoxClick(e) {
        const btn = e.currentTarget;
        const boxIndex = parseInt(btn.dataset.box);
        
        // If already in clipboard for this box, this is a cancel action
        if (this.clipboard.type === 'box' && btn.classList.contains('copied')) {
            this.clearClipboard();
            return;
        }
        
        // If clipboard has box data, this is a paste action
        if (this.clipboard.type === 'box' && btn.classList.contains('paste-mode')) {
            this.pasteBox(boxIndex);
            return;
        }
        
        // Copy action
        const states = this.getCurrentStates();
        this.clipboard = {
            type: 'box',
            param: null,
            value: null,
            boxState: states[boxIndex].clone(),
            sourceMode: AppState.viewMode,
            sourceBoxIndex: boxIndex
        };
        
        // Update button states
        this.updateCopyPasteButtons();
        
        const i18n = window.i18nManager;
        showToast('success', i18n.t('toast.copied'), i18n.tf('toast.copiedBox', boxIndex));
    }
    
    // Paste box to target
    pasteBox(boxIndex) {
        if (AppState.viewMode === 'transforming') return;
        
        const states = AppState.getEditableStates();
        states[boxIndex].copyFrom(this.clipboard.boxState);
        states[boxIndex].boxIndex = boxIndex; // Keep original boxIndex
        
        // Update via App.update
        App.update('panel', { boxIndex });
        
        const i18n = window.i18nManager;
        showToast('success', i18n.t('toast.pasted'), i18n.tf('toast.pastedBox', boxIndex));
        
        // Auto clear clipboard after paste
        this.clearClipboardSilent();
    }
    
    // Clear clipboard and reset all button states
    clearClipboard() {
        this.clipboard = {
            type: null,
            param: null,
            value: null,
            boxState: null,
            sourceMode: null,
            sourceBoxIndex: null
        };
        this.updateCopyPasteButtons();
        const i18n = window.i18nManager;
        showToast('info', i18n.t('toast.cancelled'), i18n.t('toast.cancelledSuccess'));
    }
    
    // Update all copy/paste button states based on clipboard
    updateCopyPasteButtons() {
        const copyIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        const pasteIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>';
        const cancelIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        const copyBoxIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        const pasteBoxIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>';
        const cancelBoxIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        
        const i18n = window.i18nManager;
        
        // Reset all param buttons
        document.querySelectorAll('.copy-param-btn').forEach(btn => {
            btn.classList.remove('copied', 'paste-mode');
            btn.innerHTML = copyIcon;
            btn.title = i18n.t('boxControl.copyParam');
            
            // If clipboard has same param type
            if (this.clipboard.type === 'param' && btn.dataset.param === this.clipboard.param) {
                // If current mode is source mode and this is the source box, show cancel
                if (AppState.viewMode === this.clipboard.sourceMode && 
                    parseInt(btn.dataset.box) === this.clipboard.sourceBoxIndex) {
                    btn.classList.add('copied');
                    btn.innerHTML = cancelIcon;
                    btn.title = i18n.t('boxControl.cancelCopy');
                } else {
                    // Otherwise show paste mode
                    btn.classList.add('paste-mode');
                    btn.innerHTML = pasteIcon;
                    btn.title = i18n.t('boxControl.paste');
                }
            }
        });
        
        // Reset all box buttons
        document.querySelectorAll('.copy-box-btn').forEach(btn => {
            btn.classList.remove('copied', 'paste-mode');
            btn.innerHTML = copyBoxIcon;
            btn.title = i18n.t('boxControl.copyBox');
            
            // If clipboard has box data
            if (this.clipboard.type === 'box') {
                // If current mode is source mode and this is the source box, show cancel
                if (AppState.viewMode === this.clipboard.sourceMode && 
                    parseInt(btn.dataset.box) === this.clipboard.sourceBoxIndex) {
                    btn.classList.add('copied');
                    btn.innerHTML = cancelBoxIcon;
                    btn.title = i18n.t('boxControl.cancelCopy');
                } else {
                    // Otherwise show paste mode
                    btn.classList.add('paste-mode');
                    btn.innerHTML = pasteBoxIcon;
                    btn.title = i18n.t('boxControl.paste');
                }
            }
        });
    }
    
    // Get display name for parameter
    getParamDisplayName(param) {
        const names = {
            size: 'Size',
            xPosition: 'X Pos',
            yPosition: 'Y Pos',
            maskLeft: 'Mask Left',
            maskRight: 'Mask Right',
            maskTop: 'Mask Top',
            maskBottom: 'Mask Bottom'
        };
        return names[param] || param;
    }
    
    // Update UI with transforming states (read-only display)
    updateTransformingDisplay(states) {
        if (AppState.viewMode !== 'transforming') return;
        
        for (let i = 0; i < 4; i++) {
            const box = states[i] || new BoxState(i);
            this.updateBoxUI(i, box);
        }
    }
    
    // Update slider step attributes based on precision
    updateSliderSteps(precision) {
        const posStep = precision === 'precise' ? 0.01 : (precision === 'medium' ? 1/6 : 1/3);
        const sizeStep = precision === 'precise' ? 0.01 : (precision === 'medium' ? 1/18 : 1/9);
        const maskStep = precision === 'precise' ? 0.1 : (precision === 'medium' ? 1 : 2);
        
        document.querySelectorAll('.box-slider').forEach(slider => {
            const param = slider.dataset.param;
            if (param === 'size') {
                slider.step = sizeStep;
            } else if (param === 'xPosition' || param === 'yPosition') {
                slider.step = posStep;
            } else if (param.startsWith('mask')) {
                slider.step = maskStep;
            }
        });
    }
    
    // Reset a single box to default state (delegates to App)
    resetBox(boxIndex) {
        if (AppState.viewMode === 'transforming') return;
        
        App.resetBox(boxIndex);
        
        const i18n = window.i18nManager;
        toast.info(i18n.t('toast.reset'), i18n.tf('toast.resetSuccess', boxIndex) || `Box ${boxIndex} ${i18n.t('toast.resetSuccess')}`);
    }
}

// ============== Main Application Class ==============

class SuperSourceTransitionApp {
    // ============== Initialization ==============
    
    constructor() {
        this.previewCanvas = new BoxPreviewCanvas(document.getElementById('previewCanvas'));
        this.easingPreviewCanvas = new EasingPreviewCanvas(document.getElementById('easingPreviewCanvas'));
        
        // Animation state (playback control, not Box data)
        this.generator = null;
        this.currentFrame = 0;
        this.totalFrames = 0;
        this.isPlaying = false;
        this.animationId = null;
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 60; // 60 FPS
        
        this.initElements();
        this.bindEvents();
        this.initEasingOptions();
        
        // Initialize Box Control Panel after elements are ready
        this.boxControlPanel = new BoxControlPanel(this);
        
        // Initialize App controller with references
        App.init(this);
        
        // Initialize default drag precision
        App.setDragPrecision('medium');
        // Update slider steps for the initial precision
        if (this.boxControlPanel) {
            this.boxControlPanel.updateSliderSteps('medium');
        }
        
        // Initial draw
        this.previewCanvas.drawGrid();
        this.easingPreviewCanvas.draw('linear');
    }
    
    initElements() {
        // Input elements
        this.initialXmlEl = document.getElementById('initialXml');
        this.finalXmlEl = document.getElementById('finalXml');
        this.framesInputEl = document.getElementById('framesInput');
        this.fpsInputEl = document.getElementById('fpsInput');
        this.easingCategoryEl = document.getElementById('easingCategory');
        this.easingTypeEl = document.getElementById('easingType');
        this.outputXmlEl = document.getElementById('outputXml');
        this.outputInfoEl = document.getElementById('outputInfo');
        this.outputSection = document.querySelector('.output-section');
        
        // Initially hide output section
        this.outputSection.classList.add('hidden');
        
        // Buttons
        this.copyInitialBtn = document.getElementById('copyInitialBtn');
        this.saveInitialBtn = document.getElementById('saveInitialBtn');
        this.copyFinalBtn = document.getElementById('copyFinalBtn');
        this.saveFinalBtn = document.getElementById('saveFinalBtn');
        this.clearInitialBtn = document.getElementById('clearInitialBtn');
        this.clearFinalBtn = document.getElementById('clearFinalBtn');
        this.formatInitialBtn = document.getElementById('formatInitialBtn');
        this.formatFinalBtn = document.getElementById('formatFinalBtn');
        this.swapBtn = document.getElementById('swapBtn');
        this.loadSampleBtn = document.getElementById('loadSampleBtn');
        this.copyOutputBtn = document.getElementById('copyOutputBtn');
        this.saveOutputBtn = document.getElementById('saveOutputBtn');
        
        // Reset box buttons
        this.resetBoxBtns = document.querySelectorAll('.reset-box-btn');
        
        // Toggle buttons - 统一两组 toggle 按钮
        // Preview section toggles
        this.previewInitialToggleBtn = document.querySelector('.preview-section .toggle-btn[data-view="initial"]');
        this.previewTransformingToggleBtn = document.querySelector('.preview-section .toggle-btn[data-view="transforming"]');
        this.previewFinalToggleBtn = document.querySelector('.preview-section .toggle-btn[data-view="final"]');
        
        // Box control section toggles
        this.boxCtrlInitialToggleBtn = document.getElementById('boxCtrlInitialBtn');
        this.boxCtrlTransformingToggleBtn = document.getElementById('boxCtrlTransformingBtn');
        this.boxCtrlFinalToggleBtn = document.getElementById('boxCtrlFinalBtn');
        
        // All toggle buttons for batch update
        this.allToggleBtns = document.querySelectorAll('.toggle-btn');
        
        // Preview controls
        this.previewControls = document.getElementById('previewControls');
        this.prevFrameBtn = document.getElementById('prevFrameBtn');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.nextFrameBtn = document.getElementById('nextFrameBtn');
        this.frameSlider = document.getElementById('frameSlider');
        this.currentFrameLabel = document.getElementById('currentFrameLabel');
        this.totalFrameLabel = document.getElementById('totalFrameLabel');
        this.playIcon = this.playPauseBtn.querySelector('.play-icon');
        this.pauseIcon = this.playPauseBtn.querySelector('.pause-icon');
        
        // Precision toggle buttons
        this.dragPrecisionToggle = document.getElementById('dragPrecisionToggle');
        this.boxCtrlPrecisionToggle = document.getElementById('boxCtrlPrecisionToggle');
        this.allPrecisionBtns = document.querySelectorAll('.precision-btn');
    }
    
    bindEvents() {
        // XML panel buttons
        this.copyInitialBtn.addEventListener('click', () => this.copyXmlContent('initial'));
        this.saveInitialBtn.addEventListener('click', () => this.saveXmlFile('initial'));
        this.copyFinalBtn.addEventListener('click', () => this.copyXmlContent('final'));
        this.saveFinalBtn.addEventListener('click', () => this.saveXmlFile('final'));
        this.clearInitialBtn.addEventListener('click', () => this.clearInitial());
        this.clearFinalBtn.addEventListener('click', () => this.clearFinal());
        this.formatInitialBtn.addEventListener('click', () => this.formatXml('initial'));
        this.formatFinalBtn.addEventListener('click', () => this.formatXml('final'));
        this.swapBtn.addEventListener('click', () => this.swapPositions());
        
        // Action buttons
        this.loadSampleBtn.addEventListener('click', () => this.loadSample());
        this.copyOutputBtn.addEventListener('click', () => this.copyToClipboard());
        this.saveOutputBtn.addEventListener('click', () => this.saveOutputFile());
        
        // Reset box buttons
        this.resetBoxBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const boxIndex = parseInt(e.currentTarget.dataset.box);
                if (this.boxControlPanel) {
                    this.boxControlPanel.resetBox(boxIndex);
                }
            });
        });
        
        // Easing selection - trigger auto generate
        this.easingCategoryEl.addEventListener('change', () => {
            this.updateEasingOptions();
            this.tryAutoGenerate();
        });
        this.easingTypeEl.addEventListener('change', () => {
            this.updateEasingPreview();
            this.tryAutoGenerate();
        });
        
        // Frames input - trigger auto generate
        this.framesInputEl.addEventListener('input', () => this.debounceAutoGenerate());
        
        // FPS input - update frame interval
        this.fpsInputEl.addEventListener('input', () => this.updateFrameInterval());
        
        // Toggle buttons - 所有 initial/final 按钮都调用统一的 setPreviewMode
        this.previewInitialToggleBtn.addEventListener('click', () => this.setPreviewMode('initial'));
        this.previewFinalToggleBtn.addEventListener('click', () => this.setPreviewMode('final'));
        this.boxCtrlInitialToggleBtn.addEventListener('click', () => this.setPreviewMode('initial'));
        this.boxCtrlFinalToggleBtn.addEventListener('click', () => this.setPreviewMode('final'));
        
        // Auto-preview and auto-generate on input change
        this.initialXmlEl.addEventListener('input', () => this.debouncePreviewInitial());
        this.finalXmlEl.addEventListener('input', () => this.debouncePreviewFinal());
        
        // Preview control buttons
        this.prevFrameBtn.addEventListener('click', () => this.stepFrame(-1));
        this.nextFrameBtn.addEventListener('click', () => this.stepFrame(1));
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Frame slider
        this.frameSlider.addEventListener('input', () => this.onSliderInput());
        this.frameSlider.addEventListener('mousedown', () => this.pausePlayback());
        this.frameSlider.addEventListener('touchstart', () => this.pausePlayback());
        
        // Precision toggle buttons
        this.allPrecisionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setDragPrecision(e.currentTarget.dataset.precision));
        });
        
        // Legend items - click to highlight, double-click to lock
        this.bindLegendEvents();
        
        // Box panel header titles - click to highlight, double-click to lock
        this.bindBoxPanelHeaderEvents();
    }
    
    // Bind click/double-click events on legend items
    bindLegendEvents() {
        const legendItems = document.querySelectorAll('.legend-item[data-box]');
        legendItems.forEach(item => {
            let clickTimer = null;
            
            item.addEventListener('click', (e) => {
                const boxIndex = parseInt(item.dataset.box);
                
                // Use timer to differentiate single vs double click
                if (clickTimer) {
                    // Double click detected
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    this.previewCanvas.toggleActiveBox(boxIndex);
                } else {
                    clickTimer = setTimeout(() => {
                        // Single click - highlight box
                        this.previewCanvas.highlightBox(boxIndex);
                        clickTimer = null;
                    }, 250);
                }
            });
        });
    }
    
    // Bind click/double-click events on box panel headers
    bindBoxPanelHeaderEvents() {
        const boxPanelHeaders = document.querySelectorAll('.box-panel-header');
        boxPanelHeaders.forEach(header => {
            const panel = header.closest('.box-control-panel');
            if (!panel) return;
            
            const boxIndex = parseInt(panel.dataset.box);
            const colorDot = header.querySelector('.box-color-dot');
            const title = header.querySelector('.box-title');
            
            let clickTimer = null;
            
            const handleClick = (e) => {
                // Don't trigger on buttons or switches
                if (e.target.closest('button') || e.target.closest('.enable-switch')) return;
                
                // Use timer to differentiate single vs double click
                if (clickTimer) {
                    // Double click detected
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    this.previewCanvas.toggleActiveBox(boxIndex);
                } else {
                    clickTimer = setTimeout(() => {
                        // Single click - highlight box
                        this.previewCanvas.highlightBox(boxIndex);
                        clickTimer = null;
                    }, 250);
                }
            };
            
            // Make color dot and title clickable
            if (colorDot) {
                colorDot.style.cursor = 'pointer';
                colorDot.addEventListener('click', handleClick);
            }
            if (title) {
                title.style.cursor = 'pointer';
                title.addEventListener('click', handleClick);
            }
        });
    }
    
    // ============== Precision Control ==============
    
    // Set drag precision for both canvas and control panel sliders
    setDragPrecision(precision) {
        // Update button states for both toggle groups
        this.allPrecisionBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.precision === precision);
        });
        
        // Update App precision (affects canvas snapping)
        App.setDragPrecision(precision);
        
        // Update slider step attributes in control panel
        if (this.boxControlPanel) {
            this.boxControlPanel.updateSliderSteps(precision);
        }
        
        // Show feedback toast
        const i18n = window.i18nManager;
        const precisionNames = {
            'precise': i18n.t('toast.precisionPrecise'),
            'medium': i18n.t('toast.precisionMedium'),
            'coarse': i18n.t('toast.precisionCoarse')
        };
        toast.info(i18n.t('toast.dragPrecisionChanged'), precisionNames[precision]);
    }
    
    // ============== View Mode Management ==============
    
    setPreviewMode(mode) {
        // Stop playback when switching to initial or final
        this.pausePlayback();
        
        // Update frame position based on mode
        if (mode === 'initial') {
            this.currentFrame = 0;
        } else if (mode === 'final') {
            this.currentFrame = this.totalFrames;
        }
        // transforming mode keeps current frame
        
        // Update slider position
        this.updateSliderPosition();
        
        // Update toggle button states
        this.updateToggleButtonStates(mode);
        
        // Update via App.setViewMode (handles canvas redraw and panel update)
        App.setViewMode(mode);
        
        // Sync box control panel mode (enable/disable state)
        if (this.boxControlPanel) {
            this.boxControlPanel.setMode(mode);
        }
    }
    
    // Update toggle button states based on mode
    updateToggleButtonStates(mode) {
        this.allToggleBtns.forEach(b => b.classList.remove('active'));
        
        if (mode === 'initial') {
            this.previewInitialToggleBtn.classList.add('active');
            this.boxCtrlInitialToggleBtn.classList.add('active');
        } else if (mode === 'final') {
            this.previewFinalToggleBtn.classList.add('active');
            this.boxCtrlFinalToggleBtn.classList.add('active');
        } else if (mode === 'transforming') {
            this.previewTransformingToggleBtn.classList.add('active');
            this.boxCtrlTransformingToggleBtn.classList.add('active');
        }
    }
    
    // ============== Easing Configuration ==============
    
    initEasingOptions() {
        this.updateEasingOptions();
    }
    
    updateEasingOptions() {
        const category = this.easingCategoryEl.value;
        const easings = EasingCategories[category] || EasingCategories.basic;
        
        this.easingTypeEl.innerHTML = '';
        easings.forEach(easing => {
            const option = document.createElement('option');
            option.value = easing;
            option.textContent = easing;
            this.easingTypeEl.appendChild(option);
        });
        
        this.updateEasingPreview();
    }
    
    updateEasingPreview() {
        const easingType = this.easingTypeEl.value;
        this.easingPreviewCanvas.draw(easingType);
    }
    
    // ============== Debounce Utilities ==============
    
    debouncePreviewInitial = (() => {
        let timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.previewInitial(true);
                this.tryAutoGenerate();
            }, 500);
        };
    })();
    
    debouncePreviewFinal = (() => {
        let timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.previewFinal(true);
                this.tryAutoGenerate();
            }, 500);
        };
    })();
    
    debounceAutoGenerate = (() => {
        let timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => this.tryAutoGenerate(), 300);
        };
    })();
    
    // ============== Transition Generation ==============
    
    // Try to auto-generate transition if both XMLs are valid
    tryAutoGenerate() {
        const initialXml = this.initialXmlEl.value.trim();
        const finalXml = this.finalXmlEl.value.trim();
        
        if (!initialXml || !finalXml) return;
        
        // Check if initial and final XML are the same
        if (initialXml === finalXml) return;
        
        const frames = parseInt(this.framesInputEl.value);
        if (isNaN(frames) || frames <= 0) return;
        
        try {
            // Validate both XMLs
            const initialStates = XMLParser.parseOps(initialXml);
            const finalStates = XMLParser.parseOps(finalXml);
            
            // Check if at least one box is enabled
            const hasInitialBox = Object.values(initialStates).some(b => b.enable);
            const hasFinalBox = Object.values(finalStates).some(b => b.enable);
            
            if (!hasInitialBox && !hasFinalBox) return;
            
            // Auto generate (silent mode)
            this.generate(true);
        } catch (e) {
            // Invalid XML, don't auto-generate
        }
    }
    
    // ============== XML Operations ==============
    
    previewInitial(silent = false) {
        const xml = this.initialXmlEl.value.trim();
        const i18n = window.i18nManager;
        if (!xml) {
            App.clearStates('initial');
            if (!silent) toast.info(i18n.t('toast.info'), i18n.t('toast.initialEmpty'));
            return;
        }
        
        try {
            const states = XMLParser.parseOps(xml);
            
            // Load via App (handles canvas redraw and panel update)
            App.loadStates('initial', states);
            
            const enabledCount = Object.values(states).filter(b => b.enable).length;
            if (!silent) toast.success(i18n.t('toast.previewSuccess'), i18n.tf('toast.initialPreview', enabledCount));
        } catch (e) {
            if (!silent) toast.error(i18n.t('toast.parseError'), i18n.tf('toast.parseInitialError', e.message));
        }
    }
    
    previewFinal(silent = false) {
        const xml = this.finalXmlEl.value.trim();
        const i18n = window.i18nManager;
        if (!xml) {
            App.clearStates('final');
            if (!silent) toast.info(i18n.t('toast.info'), i18n.t('toast.finalEmpty'));
            return;
        }
        
        try {
            const states = XMLParser.parseOps(xml);
            
            // Load via App (handles canvas redraw and panel update)
            App.loadStates('final', states);
            
            const enabledCount = Object.values(states).filter(b => b.enable).length;
            if (!silent) toast.success(i18n.t('toast.previewSuccess'), i18n.tf('toast.finalPreview', enabledCount));
        } catch (e) {
            if (!silent) toast.error(i18n.t('toast.parseError'), i18n.tf('toast.parseFinalError', e.message));
        }
    }
    
    clearInitial() {
        this.initialXmlEl.value = '';
        App.clearStates('initial');
        this.hidePreviewControls();
        const i18n = window.i18nManager;
        toast.info(i18n.t('toast.cleared'), i18n.t('toast.initialCleared'));
    }
    
    clearFinal() {
        this.finalXmlEl.value = '';
        App.clearStates('final');
        this.hidePreviewControls();
        const i18n = window.i18nManager;
        toast.info(i18n.t('toast.cleared'), i18n.t('toast.finalCleared'));
    }
    
    formatXml(type) {
        const textarea = type === 'initial' ? this.initialXmlEl : this.finalXmlEl;
        const xml = textarea.value.trim();
        
        try {
            // Parse the XML first to validate and normalize
            const states = XMLParser.parseOps(xml);
            
            // Load parsed states to ensure AppState is synced
            const mode = type === 'initial' ? 'initial' : 'final';
            const targetStates = mode === 'initial' ? AppState.initialStates : AppState.finalStates;
            for (let i = 0; i < 4; i++) {
                if (states[i]) {
                    targetStates[i].copyFrom(states[i]);
                } else {
                    targetStates[i].reset();
                }
            }
            
            // Generate formatted XML using AppState.generateXML()
            textarea.value = AppState.generateXML(mode);
            
            // Update preview and box control panel
            if (type === 'initial') {
                this.previewInitial(true);
            } else {
                this.previewFinal(true);
            }
            
            const i18n = window.i18nManager;
            toast.success(i18n.t('toast.formatted'), i18n.t('toast.formattedSuccess'));
        } catch (e) {
            const i18n = window.i18nManager;
            toast.error(i18n.t('toast.error'), i18n.t('toast.formatErrorMsg'));
        }
    }
    
    updateFrameInterval() {
        const fps = parseInt(this.fpsInputEl.value) || 60;
        this.frameInterval = 1000 / Math.max(1, Math.min(fps, 120));
    }
    
    swapPositions() {
        const initial = this.initialXmlEl.value;
        const final = this.finalXmlEl.value;
        
        this.initialXmlEl.value = final;
        this.finalXmlEl.value = initial;
        
        // Swap via App (handles state swap and UI update)
        App.swapStates();
        
        const i18n = window.i18nManager;
        toast.success(i18n.t('toast.swapped'), i18n.t('toast.swappedSuccess'));
    }
    
    // ============== Animation Generation ==============
    
    generate(silent = false) {
        const initialXml = this.initialXmlEl.value.trim();
        const finalXml = this.finalXmlEl.value.trim();
        const i18n = window.i18nManager;
        
        if (!initialXml || !finalXml) {
            if (!silent) toast.warning(i18n.t('toast.missingInput'), i18n.t('toast.missingXml'));
            return false;
        }
        
        const frames = parseInt(this.framesInputEl.value);
        if (isNaN(frames) || frames <= 0) {
            if (!silent) toast.warning(i18n.t('toast.invalidParameter'), i18n.t('toast.invalidFrames'));
            return false;
        }
        
        const easingType = this.easingTypeEl.value;
        
        try {
            const initialStates = XMLParser.parseOps(initialXml);
            const finalStates = XMLParser.parseOps(finalXml);
            
            this.generator = new TransitionGenerator(initialStates, finalStates, frames, easingType);
            const output = this.generator.generate();
            
            this.outputXmlEl.querySelector('code').textContent = output;
            
            // Show output section
            this.outputSection.classList.remove('hidden');
            
            const animatingBoxes = [];
            for (let i = 0; i < 4; i++) {
                if (this.generator.shouldBoxAnimate(i)) {
                    animatingBoxes.push(i);
                }
            }
            
            this.outputInfoEl.textContent = i18n.tf('toast.outputInfo', frames, easingType, animatingBoxes.join(', '));
            
            // Setup preview animation (don't change current mode)
            this.totalFrames = frames;
            this.showPreviewControls();
            
            // Keep current frame position relative to new total, or reset if out of bounds
            if (this.currentFrame > this.totalFrames) {
                this.currentFrame = this.totalFrames;
            }
            this.updateSliderPosition();
            
            if (!silent) toast.success(i18n.t('toast.generated'), i18n.tf('toast.generatedFrames', frames));
            return true;
        } catch (e) {
            if (!silent) toast.error(i18n.t('toast.generateError'), e.message);
            return false;
        }
    }
    
    // ============== Animation Playback Control ==============
    
    // Preview controls
    showPreviewControls() {
        this.previewControls.style.display = 'block';
        this.frameSlider.max = this.totalFrames;
        this.totalFrameLabel.textContent = this.totalFrames;
    }
    
    hidePreviewControls() {
        this.previewControls.style.display = 'none';
        this.pausePlayback();
        this.generator = null;
    }
    
    updateSliderPosition() {
        this.frameSlider.value = this.currentFrame;
        this.currentFrameLabel.textContent = this.currentFrame;
    }
    
    onSliderInput() {
        this.currentFrame = parseInt(this.frameSlider.value);
        this.currentFrameLabel.textContent = this.currentFrame;
        this.updatePreviewForFrame();
        
        // Determine mode based on current frame
        let mode;
        if (this.currentFrame === 0) {
            mode = 'initial';
        } else if (this.currentFrame === this.totalFrames) {
            mode = 'final';
        } else {
            mode = 'transforming';
        }
        this.updateToggleButtonStates(mode);
    }
    
    updatePreviewForFrame() {
        if (!this.generator) return;
        
        if (this.currentFrame === 0) {
            App.setViewMode('initial');
        } else if (this.currentFrame === this.totalFrames) {
            App.setViewMode('final');
        } else {
            const states = this.generator.getFrameStates(this.currentFrame);
            App.setTransformingStates(states);
        }
        
        // Update box control panel mode (enable/disable state)
        if (this.boxControlPanel) {
            this.boxControlPanel.setMode(AppState.viewMode);
        }
    }
    
    stepFrame(delta) {
        this.pausePlayback();
        this.currentFrame = Math.max(0, Math.min(this.totalFrames, this.currentFrame + delta));
        this.updateSliderPosition();
        this.updatePreviewForFrame();
        
        // Determine mode based on current frame
        let mode;
        if (this.currentFrame === 0) {
            mode = 'initial';
        } else if (this.currentFrame === this.totalFrames) {
            mode = 'final';
        } else {
            mode = 'transforming';
        }
        this.updateToggleButtonStates(mode);
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pausePlayback();
        } else {
            this.startPlayback();
        }
    }
    
    startPlayback() {
        if (!this.generator) return;
        
        // If at the end, restart from beginning
        if (this.currentFrame >= this.totalFrames) {
            this.currentFrame = 0;
        }
        
        this.isPlaying = true;
        this.playIcon.style.display = 'none';
        this.pauseIcon.style.display = 'block';
        this.lastFrameTime = performance.now();
        this.animationLoop();
    }
    
    pausePlayback() {
        this.isPlaying = false;
        this.playIcon.style.display = 'block';
        this.pauseIcon.style.display = 'none';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    animationLoop() {
        if (!this.isPlaying) return;
        
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;
        
        if (elapsed >= this.frameInterval) {
            this.lastFrameTime = now - (elapsed % this.frameInterval);
            this.currentFrame++;
            
            if (this.currentFrame > this.totalFrames) {
                this.currentFrame = this.totalFrames;
                this.pausePlayback();
            }
            
            this.updateSliderPosition();
            this.updatePreviewForFrame();
            
            // Determine mode based on current frame
            let mode;
            if (this.currentFrame === 0) {
                mode = 'initial';
            } else if (this.currentFrame === this.totalFrames) {
                mode = 'final';
            } else {
                mode = 'transforming';
            }
            this.updateToggleButtonStates(mode);
        }
        
        if (this.isPlaying) {
            this.animationId = requestAnimationFrame(() => this.animationLoop());
        }
    }
    
    // ============== File Operations ==============
    
    // Copy XML content from input panels
    copyXmlContent(type) {
        const content = type === 'initial' ? this.initialXmlEl.value : this.finalXmlEl.value;
        const i18n = window.i18nManager;
        if (!content.trim()) {
            toast.warning(i18n.t('toast.noContent'), i18n.t('toast.noContentWarning'));
            return;
        }
        
        navigator.clipboard.writeText(content).then(() => {
            const msg = type === 'initial' ? i18n.t('toast.initialXmlCopied') : i18n.t('toast.finalXmlCopied');
            toast.success(i18n.t('toast.copied'), msg);
        }).catch(err => {
            toast.error(i18n.t('toast.copyFailed'), err.message);
        });
    }
    
    // Save XML content to file with file picker
    async saveXmlFile(type) {
        const content = type === 'initial' ? this.initialXmlEl.value : this.finalXmlEl.value;
        const i18n = window.i18nManager;
        if (!content.trim()) {
            toast.warning(i18n.t('toast.noContent'), i18n.t('toast.noContentToSave'));
            return;
        }
        
        const filename = type === 'initial' ? 'initial_position.xml' : 'final_position.xml';
        
        // Try using File System Access API (modern browsers)
        if ('showSaveFilePicker' in window) {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: filename,
                    types: [{
                        description: 'XML Files',
                        accept: { 'application/xml': ['.xml'] }
                    }]
                });
                const writable = await handle.createWritable();
                await writable.write(content);
                await writable.close();
                toast.success(i18n.t('toast.saved'), i18n.t('toast.savedSuccess'));
                return;
            } catch (err) {
                if (err.name === 'AbortError') {
                    // User cancelled
                    return;
                }
                // Fall through to legacy download
            }
        }
        
        // Fallback to legacy download
        const blob = new Blob([content], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(i18n.t('toast.saved'), i18n.t('toast.fileDownloaded'));
    }
    
    copyToClipboard() {
        const content = this.outputXmlEl.querySelector('code').textContent;
        const i18n = window.i18nManager;
        if (!content || content.includes('Generated XML') || content.includes('生成的 XML')) {
            toast.warning(i18n.t('toast.noContent'), i18n.t('toast.noContentWarning'));
            return;
        }
        
        navigator.clipboard.writeText(content).then(() => {
            toast.success(i18n.t('toast.copied'), i18n.t('toast.copiedSuccess'));
        }).catch(err => {
            toast.error(i18n.t('toast.copyFailed'), err.message);
        });
    }
    
    // Save output XML to file with file picker
    async saveOutputFile() {
        const content = this.outputXmlEl.querySelector('code').textContent;
        const i18n = window.i18nManager;
        if (!content || content.includes('Generated XML') || content.includes('生成的 XML')) {
            toast.warning(i18n.t('toast.noContent'), i18n.t('toast.noContentToSave'));
            return;
        }
        
        // Try using File System Access API (modern browsers)
        if ('showSaveFilePicker' in window) {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: 'transition_output.xml',
                    types: [{
                        description: 'XML Files',
                        accept: { 'application/xml': ['.xml'] }
                    }]
                });
                const writable = await handle.createWritable();
                await writable.write(content);
                await writable.close();
                toast.success(i18n.t('toast.saved'), i18n.t('toast.savedSuccess'));
                return;
            } catch (err) {
                if (err.name === 'AbortError') {
                    // User cancelled
                    return;
                }
                // Fall through to legacy download
            }
        }
        
        // Fallback to legacy download
        const blob = new Blob([content], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transition_output.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(i18n.t('toast.saved'), i18n.t('toast.fileDownloaded'));
    }
    
    loadSample() {
        const initialSample = `<Op id="SuperSourceV2BoxEnable" superSource="0" boxIndex="0" enable="True" />
<Op id="SuperSourceV2BoxSize" superSource="0" boxIndex="0" size="0.7"/>
<Op id="SuperSourceV2BoxXPosition" superSource="0" boxIndex="0" xPosition="-5.33322016398112"/>
<Op id="SuperSourceV2BoxYPosition" superSource="0" boxIndex="0" yPosition="-0.00006421407063802083"/>
<Op id="SuperSourceV2BoxMaskEnable" superSource="0" boxIndex="0" enable="True"/>
<Op id="SuperSourceV2BoxMaskLeft" superSource="0" boxIndex="0" left="2"/>
<Op id="SuperSourceV2BoxMaskTop" superSource="0" boxIndex="0" top="0"/>
<Op id="SuperSourceV2BoxMaskRight" superSource="0" boxIndex="0" right="2"/>
<Op id="SuperSourceV2BoxMaskBottom" superSource="0" boxIndex="0" bottom="0"/>
<Op id="SuperSourceV2BoxEnable" superSource="0" boxIndex="1" enable="True" />
<Op id="SuperSourceV2BoxSize" superSource="0" boxIndex="1" size="0.7"/>
<Op id="SuperSourceV2BoxXPosition" superSource="0" boxIndex="1" xPosition="10.000113169352213"/>
<Op id="SuperSourceV2BoxYPosition" superSource="0" boxIndex="1" yPosition="-0.00006421407063802083"/>
<Op id="SuperSourceV2BoxMaskEnable" superSource="0" boxIndex="1" enable="True"/>
<Op id="SuperSourceV2BoxMaskLeft" superSource="0" boxIndex="1" left="9"/>
<Op id="SuperSourceV2BoxMaskTop" superSource="0" boxIndex="1" top="0"/>
<Op id="SuperSourceV2BoxMaskRight" superSource="0" boxIndex="1" right="9"/>
<Op id="SuperSourceV2BoxMaskBottom" superSource="0" boxIndex="1" bottom="0"/>
<Op id="SuperSourceV2BoxEnable" superSource="0" boxIndex="2" enable="False" />
<Op id="SuperSourceV2BoxEnable" superSource="0" boxIndex="3" enable="False" />`;

        const finalSample = `<Op id="SuperSourceV2BoxEnable" superSource="0" boxIndex="0" enable="True" />
<Op id="SuperSourceV2BoxEnable" superSource="0" boxIndex="1" enable="True" />
<Op id="SuperSourceV2BoxEnable" superSource="0" boxIndex="2" enable="False" />
<Op id="SuperSourceV2BoxEnable" superSource="0" boxIndex="3" enable="False" />
<Op id="SuperSourceV2BoxSize" superSource="0" boxIndex="0" size="0.7000"/>
<Op id="SuperSourceV2BoxXPosition" superSource="0" boxIndex="0" xPosition="-26.6666"/>
<Op id="SuperSourceV2BoxYPosition" superSource="0" boxIndex="0" yPosition="-0.0001"/>
<Op id="SuperSourceV2BoxMaskEnable" superSource="0" boxIndex="0" enable="True"/>
<Op id="SuperSourceV2BoxMaskLeft" superSource="0" boxIndex="0" left="2.00"/>
<Op id="SuperSourceV2BoxMaskTop" superSource="0" boxIndex="0" top="0.00"/>
<Op id="SuperSourceV2BoxMaskRight" superSource="0" boxIndex="0" right="2.00"/>
<Op id="SuperSourceV2BoxMaskBottom" superSource="0" boxIndex="0" bottom="0.00"/>`;

        this.initialXmlEl.value = initialSample;
        this.finalXmlEl.value = finalSample;
        
        this.previewInitial(true);
        this.previewFinal(true);
        this.tryAutoGenerate();
        
        const i18n = window.i18nManager;
        toast.success(i18n.t('toast.loaded'), i18n.t('toast.loadedSuccess'));
    }
}

// ============== Initialize Application ==============
window.App = App; // Expose App globally

document.addEventListener('DOMContentLoaded', () => {
    new SuperSourceTransitionApp();
});