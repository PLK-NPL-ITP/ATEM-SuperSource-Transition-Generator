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

// ============== Global Application State ==============
// Single source of truth for all box data

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
    
    // Registered update callbacks
    _listeners: [],
    
    // Get current editable states based on view mode
    getCurrentStates() {
        return this.viewMode === 'initial' ? this.initialStates : this.finalStates;
    },
    
    // Update a single box property and notify listeners
    updateBox(mode, boxIndex, property, value) {
        const states = mode === 'initial' ? this.initialStates : this.finalStates;
        if (boxIndex >= 0 && boxIndex < 4 && states[boxIndex]) {
            states[boxIndex][property] = value;
            this.notifyListeners('box', { mode, boxIndex, property, value });
        }
    },
    
    // Update entire box state
    updateBoxState(mode, boxIndex, newState) {
        const states = mode === 'initial' ? this.initialStates : this.finalStates;
        if (boxIndex >= 0 && boxIndex < 4) {
            states[boxIndex].copyFrom(newState);
            this.notifyListeners('box', { mode, boxIndex });
        }
    },
    
    // Load states from parsed XML
    loadStates(mode, parsedStates) {
        const states = mode === 'initial' ? this.initialStates : this.finalStates;
        for (let i = 0; i < 4; i++) {
            if (parsedStates[i]) {
                states[i].copyFrom(parsedStates[i]);
            } else {
                states[i].reset();
            }
        }
        this.notifyListeners('load', { mode });
    },
    
    // Clear states for a mode
    clearStates(mode) {
        const states = mode === 'initial' ? this.initialStates : this.finalStates;
        for (let i = 0; i < 4; i++) {
            states[i].reset();
        }
        this.notifyListeners('clear', { mode });
    },
    
    // Reset single box
    resetBox(mode, boxIndex) {
        const states = mode === 'initial' ? this.initialStates : this.finalStates;
        if (boxIndex >= 0 && boxIndex < 4) {
            states[boxIndex].reset();
            this.linkStates[boxIndex] = { lr: true, tb: true };
            this.notifyListeners('reset', { mode, boxIndex });
        }
    },
    
    // Swap initial and final states
    swapStates() {
        for (let i = 0; i < 4; i++) {
            const temp = this.initialStates[i].clone();
            this.initialStates[i].copyFrom(this.finalStates[i]);
            this.finalStates[i].copyFrom(temp);
        }
        this.notifyListeners('swap', {});
    },
    
    // Set view mode
    setViewMode(mode) {
        this.viewMode = mode;
        this.notifyListeners('viewMode', { mode });
    },
    
    // Set drag precision
    setDragPrecision(precision) {
        this.dragPrecision = precision;
        this.notifyListeners('precision', { precision });
    },
    
    // Toggle link state
    toggleLink(boxIndex, linkType) {
        this.linkStates[boxIndex][linkType] = !this.linkStates[boxIndex][linkType];
        // Sync values if linking
        if (this.linkStates[boxIndex][linkType]) {
            const states = this.getCurrentStates();
            if (linkType === 'lr') {
                states[boxIndex].maskRight = states[boxIndex].maskLeft;
            } else if (linkType === 'tb') {
                states[boxIndex].maskBottom = states[boxIndex].maskTop;
            }
        }
        this.notifyListeners('link', { boxIndex, linkType });
    },
    
    // Register a listener for state changes
    addListener(callback) {
        this._listeners.push(callback);
    },
    
    // Remove a listener
    removeListener(callback) {
        const idx = this._listeners.indexOf(callback);
        if (idx !== -1) this._listeners.splice(idx, 1);
    },
    
    // Notify all listeners of a change
    notifyListeners(eventType, data) {
        for (const listener of this._listeners) {
            try {
                listener(eventType, data);
            } catch (e) {
                console.error('Listener error:', e);
            }
        }
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

// ============== XML Parser ==============

class XMLParser {
    static parseOps(xmlText) {
        const boxes = {};
        const opPattern = /<Op\s+([^>]+)\/>/g;
        const attrPattern = /(\w+)="([^"]*)"/g;
        
        let match;
        while ((match = opPattern.exec(xmlText)) !== null) {
            const attrsStr = match[1];
            const attrs = {};
            let attrMatch;
            
            while ((attrMatch = attrPattern.exec(attrsStr)) !== null) {
                attrs[attrMatch[1]] = attrMatch[2];
            }
            attrPattern.lastIndex = 0; // Reset regex
            
            const opId = attrs.id || '';
            const boxIndex = parseInt(attrs.boxIndex || '0');
            const superSource = parseInt(attrs.superSource || '0');
            
            if (!(boxIndex in boxes)) {
                boxes[boxIndex] = new BoxState(boxIndex, superSource);
            }
            
            const box = boxes[boxIndex];
            
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
        }
        
        return boxes;
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
        box.maskLeft = this.interpolate(initial.maskLeft, final.maskLeft, t);
        box.maskTop = this.interpolate(initial.maskTop, final.maskTop, t);
        box.maskRight = this.interpolate(initial.maskRight, final.maskRight, t);
        box.maskBottom = this.interpolate(initial.maskBottom, final.maskBottom, t);
        return box;
    }
    
    // Get interpolated states for a specific frame (0 = initial, durationFrames = final)
    getFrameStates(frame) {
        const t = this.durationFrames > 0 ? frame / this.durationFrames : 0;
        const states = {};
        for (let i = 0; i < 4; i++) {
            states[i] = this.interpolateBox(this.initialStates[i], this.finalStates[i], t);
        }
        return states;
    }
    
    shouldBoxAnimate(boxIndex) {
        const initial = this.initialStates[boxIndex];
        const final = this.finalStates[boxIndex];
        return initial.enable || final.enable;
    }
    
    generate() {
        const lines = [];
        
        const animatingBoxes = [];
        for (let i = 0; i < 4; i++) {
            if (this.shouldBoxAnimate(i)) {
                animatingBoxes.push(i);
            }
        }
        
        lines.push(`<!-- Duration: ${this.durationFrames} frames | Easing: ${this.easingType} -->`);
        lines.push('');
        
        // Initial Enable States
        lines.push('<!-- Initial Enable States -->');
        for (let i = 0; i < 4; i++) {
            const initial = this.initialStates[i];
            const final = this.finalStates[i];
            const ss = initial.superSource;
            const enable = (initial.enable || final.enable) ? 'True' : 'False';
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
            
            for (const boxIndex of animatingBoxes) {
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
        
        // Transforming animation states (only used during playback)
        this.transformingStates = null;
        
        // Bind mouse events
        this.bindMouseEvents();
        
        // Register as AppState listener
        AppState.addListener((eventType, data) => this.onAppStateChange(eventType, data));
    }
    
    // Handle AppState changes
    onAppStateChange(eventType, data) {
        // Redraw on any state change
        if (['box', 'load', 'clear', 'reset', 'swap', 'viewMode', 'link'].includes(eventType)) {
            this.redraw();
        }
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
    getBoxCanvasBounds(box) {
        if (!box.enable) return null;
        
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
    // Returns: { boxIndex, type } or null
    // type: 'move', 'corner-tl', 'corner-tr', 'corner-bl', 'corner-br', 'edge-left', 'edge-right', 'edge-top', 'edge-bottom'
    hitTest(canvasX, canvasY) {
        const states = this.getCurrentStates();
        if (!states) return null;
        
        const EDGE = BoxPreviewCanvas.EDGE_HIT_ZONE;
        const CORNER = BoxPreviewCanvas.CORNER_HIT_ZONE;
        
        // If a box is active, only test that box
        const boxesToTest = this.activeBoxIndex !== null ? [this.activeBoxIndex] : [0, 1, 2, 3];
        
        // Check boxes from top to bottom (0 first since it's on top)
        for (const i of boxesToTest) {
            const box = states[i];
            if (!box || !box.enable) continue;
            
            const bounds = this.getBoxCanvasBounds(box);
            if (!bounds) continue;
            
            const { left, top, right, bottom } = bounds;
            
            // Check if point is near/in the box
            if (canvasX < left - EDGE || canvasX > right + EDGE ||
                canvasY < top - EDGE || canvasY > bottom + EDGE) {
                continue;
            }
            
            // Check corners first (higher priority)
            // Top-left corner
            if (canvasX >= left - CORNER && canvasX <= left + CORNER &&
                canvasY >= top - CORNER && canvasY <= top + CORNER) {
                return { boxIndex: i, type: 'corner-tl' };
            }
            // Top-right corner
            if (canvasX >= right - CORNER && canvasX <= right + CORNER &&
                canvasY >= top - CORNER && canvasY <= top + CORNER) {
                return { boxIndex: i, type: 'corner-tr' };
            }
            // Bottom-left corner
            if (canvasX >= left - CORNER && canvasX <= left + CORNER &&
                canvasY >= bottom - CORNER && canvasY <= bottom + CORNER) {
                return { boxIndex: i, type: 'corner-bl' };
            }
            // Bottom-right corner
            if (canvasX >= right - CORNER && canvasX <= right + CORNER &&
                canvasY >= bottom - CORNER && canvasY <= bottom + CORNER) {
                return { boxIndex: i, type: 'corner-br' };
            }
            
            // Check edges (for mask adjustment)
            // Left edge
            if (canvasX >= left - EDGE && canvasX <= left + EDGE &&
                canvasY > top + CORNER && canvasY < bottom - CORNER) {
                return { boxIndex: i, type: 'edge-left' };
            }
            // Right edge
            if (canvasX >= right - EDGE && canvasX <= right + EDGE &&
                canvasY > top + CORNER && canvasY < bottom - CORNER) {
                return { boxIndex: i, type: 'edge-right' };
            }
            // Top edge
            if (canvasY >= top - EDGE && canvasY <= top + EDGE &&
                canvasX > left + CORNER && canvasX < right - CORNER) {
                return { boxIndex: i, type: 'edge-top' };
            }
            // Bottom edge
            if (canvasY >= bottom - EDGE && canvasY <= bottom + EDGE &&
                canvasX > left + CORNER && canvasX < right - CORNER) {
                return { boxIndex: i, type: 'edge-bottom' };
            }
            
            // Inside the box (move)
            if (canvasX > left && canvasX < right &&
                canvasY > top && canvasY < bottom) {
                return { boxIndex: i, type: 'move' };
            }
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
    
    // Handle click for deactivating box when clicking outside
    onClick(e) {
        if (AppState.viewMode === 'transforming') return;
        
        // Skip if we just finished dragging
        if (this.wasDragging) {
            this.wasDragging = false;
            return;
        }
        
        const pos = this.getMousePos(e);
        const hitInfo = this.hitTest(pos.x, pos.y);
        
        // Only handle clicks outside any box to deactivate
        if (!hitInfo && this.activeBoxIndex !== null) {
            this.activeBoxIndex = null;
            toast.info('Box 解锁', '现在可以与任意 Box 交互');
            this.redraw();
        }
    }
    
    // Handle double-click for box activation toggle
    onDoubleClick(e) {
        if (AppState.viewMode === 'transforming') return;
        
        const pos = this.getMousePos(e);
        const hitInfo = this.hitTest(pos.x, pos.y);
        
        if (hitInfo) {
            // Toggle active box
            if (this.activeBoxIndex === hitInfo.boxIndex) {
                // Double-clicking on already active box - deactivate
                this.activeBoxIndex = null;
                toast.info('Box 解锁', '现在可以与任意 Box 交互');
            } else {
                // Activate this box
                this.activeBoxIndex = hitInfo.boxIndex;
                toast.info('Box 锁定', `已锁定到 Box ${hitInfo.boxIndex}，双击或点击空白解锁`);
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
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.onMouseDown(mouseEvent);
            e.preventDefault();
        }
    }
    
    onTouchMove(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.onMouseMove(mouseEvent);
            e.preventDefault();
        }
    }
    
    onTouchEnd(e) {
        this.onMouseUp(e);
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
        
        // Notify AppState of change (this will trigger UI updates)
        AppState.notifyListeners('box', { mode: AppState.viewMode, boxIndex: this.dragBoxIndex });
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
    
    drawGrid() {
        const ctx = this.ctx;
        
        // Clear canvas with modern white/light gray background
        ctx.fillStyle = '#F8F9FA';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw outer boundary area (extended area)
        const extTopLeft = this.coordToCanvas(BoxPreviewCanvas.DISPLAY_X_MIN, BoxPreviewCanvas.DISPLAY_Y_MAX);
        const extBottomRight = this.coordToCanvas(BoxPreviewCanvas.DISPLAY_X_MAX, BoxPreviewCanvas.DISPLAY_Y_MIN);
        
        ctx.fillStyle = '#F0F1F3';
        ctx.fillRect(extTopLeft.x, extTopLeft.y, extBottomRight.x - extTopLeft.x, extBottomRight.y - extTopLeft.y);
        
        // Draw visible screen area background
        const screenTopLeft = this.coordToCanvas(BoxPreviewCanvas.SCREEN_X_MIN, BoxPreviewCanvas.SCREEN_Y_MAX);
        const screenBottomRight = this.coordToCanvas(BoxPreviewCanvas.SCREEN_X_MAX, BoxPreviewCanvas.SCREEN_Y_MIN);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(screenTopLeft.x, screenTopLeft.y, screenBottomRight.x - screenTopLeft.x, screenBottomRight.y - screenTopLeft.y);
        
        // Draw grid lines
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        
        const gridIntervalX = 4;
        const gridIntervalY = 4;
        
        // Vertical grid lines
        for (let x = -20; x <= 20; x += gridIntervalX) {
            const pos = this.coordToCanvas(x, 0);
            const isOutside = x < -16 || x > 16;
            
            ctx.strokeStyle = isOutside ? '#E0E2E6' : '#E5E7EB';
            ctx.beginPath();
            ctx.moveTo(pos.x, this.offsetY);
            ctx.lineTo(pos.x, this.offsetY + this.drawHeight);
            ctx.stroke();
            
            // X axis labels
            ctx.fillStyle = isOutside ? '#B0B5BC' : '#6B7280';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(x.toString(), pos.x, this.offsetY + this.drawHeight + 16);
        }
        
        // Horizontal grid lines
        for (let y = -12; y <= 12; y += gridIntervalY) {
            const pos = this.coordToCanvas(0, y);
            const isOutside = y < -9 || y > 9;
            
            ctx.strokeStyle = isOutside ? '#E0E2E6' : '#E5E7EB';
            ctx.beginPath();
            ctx.moveTo(this.offsetX, pos.y);
            ctx.lineTo(this.offsetX + this.drawWidth, pos.y);
            ctx.stroke();
            
            // Y axis labels
            ctx.fillStyle = isOutside ? '#B0B5BC' : '#6B7280';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(y.toString(), this.offsetX - 8, pos.y + 4);
        }
        
        // Draw visible screen boundary (16:9 area)
        ctx.strokeStyle = '#FF4757';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenTopLeft.x, screenTopLeft.y, 
            screenBottomRight.x - screenTopLeft.x, screenBottomRight.y - screenTopLeft.y);
        
        // Draw center cross
        const center = this.coordToCanvas(0, 0);
        ctx.strokeStyle = '#9CA3AF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(center.x - 12, center.y);
        ctx.lineTo(center.x + 12, center.y);
        ctx.moveTo(center.x, center.y - 12);
        ctx.lineTo(center.x, center.y + 12);
        ctx.stroke();
        
        // Draw center point
        ctx.fillStyle = '#FF4757';
        ctx.beginPath();
        ctx.arc(center.x, center.y, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    drawBox(box) {
        if (!box.enable) return;
        
        const ctx = this.ctx;
        const color = BoxPreviewCanvas.BOX_COLORS[box.boxIndex];
        
        // Check if this box is being hovered or dragged
        const isHovered = this.hoverInfo && this.hoverInfo.boxIndex === box.boxIndex;
        const isDragging = this.isDragging && this.dragBoxIndex === box.boxIndex;
        const isActive = this.activeBoxIndex === box.boxIndex;
        const isInteractive = AppState.viewMode !== 'transforming';
        
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
        
        // Draw active box glow effect
        if (isActive && isInteractive) {
            ctx.shadowColor = color;
            ctx.shadowBlur = 15;
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 4]);
            ctx.strokeRect(rectX - 4, rectY - 4, rectW + 8, rectH + 8);
            ctx.setLineDash([]);
            ctx.shadowBlur = 0;
        }
        
        // Draw box with shadow
        ctx.shadowColor = (isHovered || isDragging || isActive) ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = (isHovered || isDragging || isActive) ? 12 : 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = color + ((isHovered || isDragging || isActive) ? '70' : '50');
        ctx.fillRect(rectX, rectY, rectW, rectH);
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = color;
        ctx.lineWidth = (isHovered || isDragging || isActive) ? 3 : 2;
        ctx.strokeRect(rectX, rectY, rectW, rectH);
        
        // Draw interaction handles when interactive and (hovered/dragging/active)
        if (isInteractive && (isHovered || isDragging || isActive)) {
            this.drawInteractionHandles(box, rectX, rectY, rectW, rectH, color);
        }
        
        // Draw center point
        const center = this.coordToCanvas(box.xPosition, box.yPosition);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = color;
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
        
        // Draw label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.roundRect(lx - LW / 2, ly - LH / 2, LW, LH, 4);
        ctx.fill();
        
        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Box ${box.boxIndex}`, lx, ly - 3);
        
        ctx.fillStyle = '#6B7280';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`S:${box.size.toFixed(2)}`, lx, ly + 10);
    }
    
    // Draw interaction handles (corners for resize, edges highlighted for mask)
    drawInteractionHandles(box, rectX, rectY, rectW, rectH, color) {
        const ctx = this.ctx;
        const CORNER_SIZE = 8;
        const EDGE_HANDLE_WIDTH = 24;  // Width of edge handle rectangle
        const EDGE_HANDLE_HEIGHT = 6;  // Height of edge handle rectangle
        const activeType = this.isDragging ? this.dragType : (this.hoverInfo ? this.hoverInfo.type : null);
        
        // Draw corner handles (for resize)
        const corners = [
            { x: rectX, y: rectY, type: 'corner-tl' },
            { x: rectX + rectW, y: rectY, type: 'corner-tr' },
            { x: rectX, y: rectY + rectH, type: 'corner-bl' },
            { x: rectX + rectW, y: rectY + rectH, type: 'corner-br' }
        ];
        
        corners.forEach(corner => {
            const isActive = activeType === corner.type;
            ctx.fillStyle = isActive ? color : '#FFFFFF';
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
            ctx.fillStyle = isActive ? color : '#FFFFFF';
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
        // Draw in reverse order: Box 3 first (bottom), Box 0 last (top)
        // This ensures Box 0 is always on top, Box 3 is always at bottom
        const drawOrder = [3, 2, 1, 0];
        
        if (AppState.viewMode === 'initial') {
            for (const i of drawOrder) {
                if (AppState.initialStates[i]) {
                    this.drawBox(AppState.initialStates[i]);
                }
            }
        } else if (AppState.viewMode === 'final') {
            for (const i of drawOrder) {
                if (AppState.finalStates[i]) {
                    this.drawBox(AppState.finalStates[i]);
                }
            }
        } else if (AppState.viewMode === 'transforming' && this.transformingStates) {
            for (const i of drawOrder) {
                if (this.transformingStates[i]) {
                    this.drawBox(this.transformingStates[i]);
                }
            }
        }
    }
    
    clear() {
        // Clear is now handled by AppState.clearStates()
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
        
        const drawWidth = this.width - 2 * this.padding;
        const drawHeight = this.height - 2 * this.padding;
        
        // Clear with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw valid range area (0-1 x 0-1)
        const validTopLeft = this.valueToCanvas(0, 1);
        const validBottomRight = this.valueToCanvas(1, 0);
        
        ctx.fillStyle = '#FFF5F5';
        ctx.fillRect(validTopLeft.x, validTopLeft.y, 
            validBottomRight.x - validTopLeft.x, validBottomRight.y - validTopLeft.y);
        
        // Draw grid
        ctx.strokeStyle = '#F3F4F6';
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
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        
        // Draw the diagonal reference line (linear)
        ctx.strokeStyle = '#D1D5DB';
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
        ctx.strokeStyle = '#FF4757';
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
        
        ctx.fillStyle = '#FF4757';
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(endPos.x, endPos.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw boundary markers
        ctx.fillStyle = '#9CA3AF';
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
        
        // Register as AppState listener
        this._onAppStateChange = this.onAppStateChange.bind(this);
        AppState.addListener(this._onAppStateChange);
        
        this.updateUI();
    }
    
    // Handle AppState changes
    onAppStateChange(eventType, data) {
        switch (eventType) {
            case 'box':
            case 'load':
            case 'clear':
            case 'reset':
            case 'swap':
                this.updateUI();
                break;
            case 'viewMode':
                this.setMode(data.mode);
                break;
            case 'link':
                this.updateLinkButtonUI(data.boxIndex);
                break;
        }
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
        AppState.updateBox(AppState.viewMode, boxIndex, 'enable', e.target.checked);
        this.syncToApp();
    }
    
    onMaskEnableChange(e) {
        if (AppState.viewMode === 'transforming') return;
        
        const boxIndex = parseInt(e.target.dataset.box);
        AppState.updateBox(AppState.viewMode, boxIndex, 'maskEnable', e.target.checked);
        
        // Update mask controls visibility
        const panel = document.querySelector(`.box-control-panel[data-box="${boxIndex}"]`);
        const maskControls = panel.querySelector('.mask-controls');
        if (maskControls) {
            maskControls.classList.toggle('enabled', e.target.checked);
        }
        
        this.syncToApp();
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
        const states = this.getCurrentStates();
        states[boxIndex][param] = value;
        
        // Handle linked parameters
        if (param === 'maskLeft' && AppState.linkStates[boxIndex].lr) {
            states[boxIndex].maskRight = value;
        } else if (param === 'maskRight' && AppState.linkStates[boxIndex].lr) {
            states[boxIndex].maskLeft = value;
        } else if (param === 'maskTop' && AppState.linkStates[boxIndex].tb) {
            states[boxIndex].maskBottom = value;
        } else if (param === 'maskBottom' && AppState.linkStates[boxIndex].tb) {
            states[boxIndex].maskTop = value;
        }
        
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
        
        this.syncToApp();
    }
    
    updateParam(boxIndex, param, value) {
        const states = this.getCurrentStates();
        states[boxIndex][param] = value;
        
        // Handle linked parameters
        if (param === 'maskLeft' && AppState.linkStates[boxIndex].lr) {
            states[boxIndex].maskRight = value;
        } else if (param === 'maskRight' && AppState.linkStates[boxIndex].lr) {
            states[boxIndex].maskLeft = value;
        } else if (param === 'maskTop' && AppState.linkStates[boxIndex].tb) {
            states[boxIndex].maskBottom = value;
        } else if (param === 'maskBottom' && AppState.linkStates[boxIndex].tb) {
            states[boxIndex].maskTop = value;
        }
        
        // Update UI
        this.updateBoxUI(boxIndex, states[boxIndex]);
        
        // Notify AppState of changes
        AppState.notifyListeners('box', { mode: AppState.viewMode, boxIndex });
        
        this.syncToApp();
    }
    
    onLinkToggle(e) {
        const btn = e.currentTarget;
        const boxIndex = parseInt(btn.dataset.box);
        const linkType = btn.dataset.link;
        
        // Use AppState.toggleLink which handles syncing values
        AppState.toggleLink(boxIndex, linkType);
        
        // Update button state
        btn.classList.toggle('active', AppState.linkStates[boxIndex][linkType]);
        
        // Update UI if values were synced
        if (AppState.linkStates[boxIndex][linkType]) {
            this.updateBoxUI(boxIndex, this.getCurrentStates()[boxIndex]);
            this.syncToApp();
        }
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
        
        showToast('success', '已复制', `${this.getParamDisplayName(param)}: ${this.formatValue(param, this.clipboard.value)}`);
    }
    
    // Paste parameter to target
    pasteParam(boxIndex, param) {
        if (AppState.viewMode === 'transforming') return;
        
        const states = this.getCurrentStates();
        states[boxIndex][param] = this.clipboard.value;
        
        // Handle linked parameters
        if (param === 'maskLeft' && AppState.linkStates[boxIndex].lr) {
            states[boxIndex].maskRight = this.clipboard.value;
        } else if (param === 'maskRight' && AppState.linkStates[boxIndex].lr) {
            states[boxIndex].maskLeft = this.clipboard.value;
        } else if (param === 'maskTop' && AppState.linkStates[boxIndex].tb) {
            states[boxIndex].maskBottom = this.clipboard.value;
        } else if (param === 'maskBottom' && AppState.linkStates[boxIndex].tb) {
            states[boxIndex].maskTop = this.clipboard.value;
        }
        
        this.updateBoxUI(boxIndex, states[boxIndex]);
        this.syncToApp();
        
        showToast('success', '已粘贴', `${this.getParamDisplayName(param)} → Box ${boxIndex}`);
        
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
        
        showToast('success', '已复制', `Box ${boxIndex} 全部参数`);
    }
    
    // Paste box to target
    pasteBox(boxIndex) {
        if (AppState.viewMode === 'transforming') return;
        
        const states = this.getCurrentStates();
        states[boxIndex].copyFrom(this.clipboard.boxState);
        states[boxIndex].boxIndex = boxIndex; // Keep original boxIndex
        
        this.updateBoxUI(boxIndex, states[boxIndex]);
        this.syncToApp();
        
        showToast('success', '已粘贴', `全部参数 → Box ${boxIndex}`);
        
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
        showToast('info', '已取消', '复制已取消');
    }
    
    // Update all copy/paste button states based on clipboard
    updateCopyPasteButtons() {
        const copyIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        const pasteIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>';
        const cancelIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        const copyBoxIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        const pasteBoxIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>';
        const cancelBoxIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        
        // Reset all param buttons
        document.querySelectorAll('.copy-param-btn').forEach(btn => {
            btn.classList.remove('copied', 'paste-mode');
            btn.innerHTML = copyIcon;
            btn.title = '复制';
            
            // If clipboard has same param type
            if (this.clipboard.type === 'param' && btn.dataset.param === this.clipboard.param) {
                // If current mode is source mode and this is the source box, show cancel
                if (AppState.viewMode === this.clipboard.sourceMode && 
                    parseInt(btn.dataset.box) === this.clipboard.sourceBoxIndex) {
                    btn.classList.add('copied');
                    btn.innerHTML = cancelIcon;
                    btn.title = '取消复制';
                } else {
                    // Otherwise show paste mode
                    btn.classList.add('paste-mode');
                    btn.innerHTML = pasteIcon;
                    btn.title = '粘贴';
                }
            }
        });
        
        // Reset all box buttons
        document.querySelectorAll('.copy-box-btn').forEach(btn => {
            btn.classList.remove('copied', 'paste-mode');
            btn.innerHTML = copyBoxIcon;
            btn.title = '复制整个 Box';
            
            // If clipboard has box data
            if (this.clipboard.type === 'box') {
                // If current mode is source mode and this is the source box, show cancel
                if (AppState.viewMode === this.clipboard.sourceMode && 
                    parseInt(btn.dataset.box) === this.clipboard.sourceBoxIndex) {
                    btn.classList.add('copied');
                    btn.innerHTML = cancelBoxIcon;
                    btn.title = '取消复制';
                } else {
                    // Otherwise show paste mode
                    btn.classList.add('paste-mode');
                    btn.innerHTML = pasteBoxIcon;
                    btn.title = '粘贴';
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
    
    // Reset a single box to default state (now delegates to AppState)
    resetBox(boxIndex) {
        if (AppState.viewMode === 'transforming') return;
        
        AppState.resetBox(AppState.viewMode, boxIndex);
        this.syncToApp();
        
        toast.info('已重置', `Box ${boxIndex} 已恢复默认值`);
    }
    
    // Sync current state to app (update XML textarea and preview)
    syncToApp() {
        if (AppState.viewMode === 'transforming') return;
        
        const xml = AppState.generateXML(AppState.viewMode);
        
        if (AppState.viewMode === 'initial') {
            this.app.initialXmlEl.value = xml;
        } else {
            this.app.finalXmlEl.value = xml;
        }
        
        // Redraw canvas
        this.app.previewCanvas.redraw();
        
        // Try auto generate
        this.app.tryAutoGenerate();
    }
}

class SuperSourceTransitionApp {
    constructor() {
        this.previewCanvas = new BoxPreviewCanvas(document.getElementById('previewCanvas'));
        this.easingPreviewCanvas = new EasingPreviewCanvas(document.getElementById('easingPreviewCanvas'));
        
        // Animation state
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
        
        // Initialize default drag precision
        AppState.setDragPrecision('medium');
        this.updateSliderSteps('medium');
        
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
    }
    
    // Set drag precision for both canvas and control panel sliders
    setDragPrecision(precision) {
        // Update button states for both toggle groups
        this.allPrecisionBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.precision === precision);
        });
        
        // Update AppState precision (canvas reads from AppState)
        AppState.setDragPrecision(precision);
        
        // Update slider step attributes
        this.updateSliderSteps(precision);
        
        const precisionNames = {
            'precise': '精确 (无限制)',
            'medium': '中等 (位置 1/6, 大小 1/18)',
            'coarse': '粗略 (位置 1/3, 大小 1/9)'
        };
        toast.info('拖动精度', precisionNames[precision]);
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
    
    setPreviewMode(mode) {
        // Stop playback when switching to initial or final
        this.pausePlayback();
        
        // Update ALL toggle button states (both preview and box control sections)
        this.allToggleBtns.forEach(b => b.classList.remove('active'));
        
        if (mode === 'initial') {
            this.previewInitialToggleBtn.classList.add('active');
            this.boxCtrlInitialToggleBtn.classList.add('active');
            this.currentFrame = 0;
        } else if (mode === 'final') {
            this.previewFinalToggleBtn.classList.add('active');
            this.boxCtrlFinalToggleBtn.classList.add('active');
            this.currentFrame = this.totalFrames;
        } else if (mode === 'transforming') {
            this.previewTransformingToggleBtn.classList.add('active');
            this.boxCtrlTransformingToggleBtn.classList.add('active');
        }
        
        this.updateSliderPosition();
        
        // Update AppState viewMode (this will notify all listeners including canvas and control panel)
        AppState.setViewMode(mode);
        
        // Sync box control panel mode
        if (this.boxControlPanel) {
            this.boxControlPanel.setMode(mode);
        }
    }
    
    updateToggleButtons() {
        this.allToggleBtns.forEach(b => b.classList.remove('active'));
        
        if (this.currentFrame === 0) {
            this.previewInitialToggleBtn.classList.add('active');
            this.boxCtrlInitialToggleBtn.classList.add('active');
        } else if (this.currentFrame === this.totalFrames) {
            this.previewFinalToggleBtn.classList.add('active');
            this.boxCtrlFinalToggleBtn.classList.add('active');
        } else {
            this.previewTransformingToggleBtn.classList.add('active');
            this.boxCtrlTransformingToggleBtn.classList.add('active');
        }
    }
    
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
    
    previewInitial(silent = false) {
        const xml = this.initialXmlEl.value.trim();
        if (!xml) {
            AppState.clearStates('initial');
            this.previewCanvas.redraw();
            if (!silent) toast.info('提示', '初始位置为空');
            return;
        }
        
        try {
            const states = XMLParser.parseOps(xml);
            
            // Load to AppState (this notifies all listeners)
            AppState.loadStates('initial', states);
            this.previewCanvas.redraw();
            
            const enabledCount = Object.values(states).filter(b => b.enable).length;
            if (!silent) toast.success('预览成功', `Initial: ${enabledCount} 个启用的 Box`);
        } catch (e) {
            if (!silent) toast.error('解析错误', `解析初始位置 XML 失败: ${e.message}`);
        }
    }
    
    previewFinal(silent = false) {
        const xml = this.finalXmlEl.value.trim();
        if (!xml) {
            AppState.clearStates('final');
            this.previewCanvas.redraw();
            if (!silent) toast.info('提示', '最终位置为空');
            return;
        }
        
        try {
            const states = XMLParser.parseOps(xml);
            
            // Load to AppState (this notifies all listeners)
            AppState.loadStates('final', states);
            this.previewCanvas.redraw();
            
            const enabledCount = Object.values(states).filter(b => b.enable).length;
            if (!silent) toast.success('预览成功', `Final: ${enabledCount} 个启用的 Box`);
        } catch (e) {
            if (!silent) toast.error('解析错误', `解析最终位置 XML 失败: ${e.message}`);
        }
    }
    
    clearInitial() {
        this.initialXmlEl.value = '';
        AppState.clearStates('initial');
        this.previewCanvas.redraw();
        this.hidePreviewControls();
        toast.info('已清空', '初始位置已清空');
    }
    
    clearFinal() {
        this.finalXmlEl.value = '';
        AppState.clearStates('final');
        this.previewCanvas.redraw();
        this.hidePreviewControls();
        toast.info('已清空', '最终位置已清空');
    }
    
    formatXml(type) {
        const textarea = type === 'initial' ? this.initialXmlEl : this.finalXmlEl;
        const xml = textarea.value.trim();
        
        try {
            // Parse the XML first to validate and normalize
            const states = XMLParser.parseOps(xml);
            
            // Generate formatted XML with all parameters
            const lines = [];
            for (let i = 0; i < 4; i++) {
                const box = states[i] || new BoxState(i);
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
            
            textarea.value = lines.join('\n');
            
            // Update preview and box control panel
            if (type === 'initial') {
                this.previewInitial(true);
            } else {
                this.previewFinal(true);
            }
            
            toast.success('格式化完成', 'XML 已格式化并补全所有参数');
        } catch (e) {
            toast.error('格式化失败', 'XML 格式无效');
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
        
        // Swap in AppState (this handles state swapping and notifies listeners)
        AppState.swapStates();
        
        // Redraw preview canvas
        this.previewCanvas.redraw();
        
        this.tryAutoGenerate();
        
        toast.success('交换完成', 'Initial ↔ Final 已交换');
    }
    
    generate(silent = false) {
        const initialXml = this.initialXmlEl.value.trim();
        const finalXml = this.finalXmlEl.value.trim();
        
        if (!initialXml || !finalXml) {
            if (!silent) toast.warning('缺少输入', '请输入初始位置和最终位置的 XML');
            return false;
        }
        
        const frames = parseInt(this.framesInputEl.value);
        if (isNaN(frames) || frames <= 0) {
            if (!silent) toast.warning('参数错误', '帧数必须大于 0');
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
            
            this.outputInfoEl.textContent = `帧数: ${frames} | 缓动: ${easingType} | 活动Box: [${animatingBoxes.join(', ')}]`;
            
            // Setup preview animation (don't change current mode)
            this.totalFrames = frames;
            this.showPreviewControls();
            
            // Keep current frame position relative to new total, or reset if out of bounds
            if (this.currentFrame > this.totalFrames) {
                this.currentFrame = this.totalFrames;
            }
            this.updateSliderPosition();
            
            if (!silent) toast.success('生成成功', `已生成 ${frames} 帧过渡动画`);
            return true;
        } catch (e) {
            if (!silent) toast.error('生成失败', e.message);
            return false;
        }
    }
    
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
        this.updateToggleButtons();
    }
    
    updatePreviewForFrame() {
        if (!this.generator) return;
        
        if (this.currentFrame === 0) {
            AppState.setViewMode('initial');
        } else if (this.currentFrame === this.totalFrames) {
            AppState.setViewMode('final');
        } else {
            const states = this.generator.getFrameStates(this.currentFrame);
            this.previewCanvas.updateTransformingStates(states);
            AppState.setViewMode('transforming');
            
            // Update box control panel with transforming states (read-only)
            if (this.boxControlPanel) {
                this.boxControlPanel.updateTransformingDisplay(states);
            }
        }
    }
    
    stepFrame(delta) {
        this.pausePlayback();
        this.currentFrame = Math.max(0, Math.min(this.totalFrames, this.currentFrame + delta));
        this.updateSliderPosition();
        this.updatePreviewForFrame();
        this.updateToggleButtons();
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
            this.updateToggleButtons();
        }
        
        if (this.isPlaying) {
            this.animationId = requestAnimationFrame(() => this.animationLoop());
        }
    }
    
    // Copy XML content from input panels
    copyXmlContent(type) {
        const content = type === 'initial' ? this.initialXmlEl.value : this.finalXmlEl.value;
        if (!content.trim()) {
            toast.warning('无内容', '没有内容可复制');
            return;
        }
        
        navigator.clipboard.writeText(content).then(() => {
            toast.success('复制成功', `${type === 'initial' ? '初始位置' : '最终位置'} XML 已复制到剪贴板`);
        }).catch(err => {
            toast.error('复制失败', err.message);
        });
    }
    
    // Save XML content to file with file picker
    async saveXmlFile(type) {
        const content = type === 'initial' ? this.initialXmlEl.value : this.finalXmlEl.value;
        if (!content.trim()) {
            toast.warning('无内容', '没有内容可保存');
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
                toast.success('保存成功', '文件已保存');
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
        toast.success('保存成功', '文件已下载');
    }
    
    copyToClipboard() {
        const content = this.outputXmlEl.querySelector('code').textContent;
        if (!content || content.includes('生成的 XML 将在这里显示')) {
            toast.warning('无内容', '没有内容可复制');
            return;
        }
        
        navigator.clipboard.writeText(content).then(() => {
            toast.success('复制成功', '已复制到剪贴板');
        }).catch(err => {
            toast.error('复制失败', err.message);
        });
    }
    
    // Save output XML to file with file picker
    async saveOutputFile() {
        const content = this.outputXmlEl.querySelector('code').textContent;
        if (!content || content.includes('生成的 XML 将在这里显示')) {
            toast.warning('无内容', '没有内容可保存');
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
                toast.success('保存成功', '文件已保存');
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
        toast.success('保存成功', '文件已下载');
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
        
        toast.success('加载成功', '示例数据已加载');
    }
}

// ============== Initialize Application ==============

document.addEventListener('DOMContentLoaded', () => {
    new SuperSourceTransitionApp();
});
