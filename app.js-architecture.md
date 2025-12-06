# SuperSource Transition Generator - Architecture Documentation

## 概述 (Overview)

本文档详细说明 `app.js` 的架构设计、执行逻辑和书写规范。

This document provides a comprehensive explanation of the `app.js` architecture, execution logic, and coding patterns.

---

## 目录 (Table of Contents)

1. [整体架构](#整体架构-overall-architecture)
2. [核心设计模式](#核心设计模式-core-design-patterns)
3. [类的职责划分](#类的职责划分-class-responsibilities)
4. [数据流与状态管理](#数据流与状态管理-data-flow-and-state-management)
5. [更新循环机制](#更新循环机制-update-cycle)
6. [事件处理流程](#事件处理流程-event-handling-flow)
7. [书写规范与最佳实践](#书写规范与最佳实践-coding-standards)
8. [扩展指南](#扩展指南-extension-guide)

---

## 整体架构 (Overall Architecture)

### 架构图 (Architecture Diagram)

```
┌─────────────────────────────────────────────────────────────┐
│                    SuperSourceTransitionApp                 │
│                    (应用程序协调器/App Coordinator)          │
│  - 初始化所有组件 / Initialize all components                │
│  - 协调高层级操作 / Coordinate high-level operations         │
│  - 管理动画播放 / Manage animation playback                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┼──────────┬──────────┬──────────┐
        │          │          │          │          │
        ▼          ▼          ▼          ▼          ▼
   ┌────────┐ ┌──────┐ ┌──────────┐ ┌──────────┐ ┌────────┐
   │AppState│ │ App  │ │BoxPreview│ │BoxControl│ │其他工具类│
   │        │ │      │ │Canvas    │ │Panel     │ │XMLParser│
   │数据存储│ │控制器 │ │画布渲染   │ │UI面板    │ │等       │
   └────────┘ └──────┘ └──────────┘ └──────────┘ └────────┘
```

### 模块说明 (Module Descriptions)

1. **EasingFunctions** - 缓动函数库 (Easing function library)
2. **BoxState** - Box状态数据类 (Box state data class)
3. **AppState** - 全局应用状态 (Global application state)
4. **App** - 全局应用控制器 (Global application controller)
5. **XMLParser** - XML解析工具 (XML parsing utility)
6. **TransitionGenerator** - 过渡动画生成器 (Transition generator)
7. **BoxPreviewCanvas** - 画布预览组件 (Canvas preview component)
8. **EasingPreviewCanvas** - 缓动曲线预览 (Easing curve preview)
9. **BoxControlPanel** - Box控制面板 (Box control panel)
10. **SuperSourceTransitionApp** - 主应用类 (Main application class)

---

## 核心设计模式 (Core Design Patterns)

### 1. 单一数据源 (Single Source of Truth)

**AppState** 是所有 Box 数据的唯一真实来源。

```javascript
const AppState = {
    initialStates: [BoxState, BoxState, BoxState, BoxState],
    finalStates: [BoxState, BoxState, BoxState, BoxState],
    viewMode: 'initial' | 'final' | 'transforming',
    // ...其他状态
};
```

**原则 (Principles):**
- ✅ 所有数据读取从 AppState
- ✅ 所有数据修改通过 App 控制器
- ❌ 禁止组件直接修改 AppState
- ❌ 禁止组件维护自己的状态副本

### 2. 中心化控制 (Centralized Control)

**App** 是所有 UI 更新的中央控制器。

```javascript
const App = {
    update(source, options) {
        // 统一的更新入口
        // 1. 更新画布
        // 2. 更新控制面板
        // 3. 更新 XML
        // 4. 尝试自动生成
    }
};
```

**原则 (Principles):**
- ✅ 所有状态变化通过 App.update()
- ✅ 使用 App 提供的高级方法（setBoxProperty, toggleLink, etc.）
- ❌ 禁止组件直接调用其他组件的更新方法
- ❌ 禁止绕过 App 直接更新 UI

### 3. 职责分离 (Separation of Concerns)

每个类有明确的单一职责：

```
AppState    → 纯数据存储 (Pure data storage)
App         → 业务逻辑与协调 (Business logic & coordination)
Canvas      → 渲染与交互 (Rendering & interaction)
Panel       → UI 控件管理 (UI control management)
MainApp     → 应用生命周期 (Application lifecycle)
```

---

## 类的职责划分 (Class Responsibilities)

### BoxState (Box 状态类)

**职责:**
- 存储单个 Box 的所有属性
- 提供克隆和复制方法

**数据字段:**
```javascript
{
    boxIndex: number,        // Box 索引 (0-3)
    superSource: number,     // SuperSource 索引 (0-1)
    enable: boolean,         // 是否启用
    size: number,            // 大小 (0.07-1.0)
    xPosition: number,       // X 位置 (-48 to 48)
    yPosition: number,       // Y 位置 (-27 to 27)
    maskEnable: boolean,     // 遮罩启用
    maskLeft: number,        // 左遮罩 (0-32)
    maskRight: number,       // 右遮罩 (0-32)
    maskTop: number,         // 上遮罩 (0-18)
    maskBottom: number       // 下遮罩 (0-18)
}
```

**方法:**
- `clone()` - 深拷贝当前状态
- `copyFrom(other)` - 从另一个状态复制
- `reset()` - 重置为默认值

**使用规范:**
- 不包含业务逻辑
- 只提供数据操作方法
- 不引用其他类

### AppState (全局应用状态)

**职责:**
- 存储所有应用级状态
- 提供状态访问辅助方法
- 提供快照和精度调整方法
- 生成 XML 输出

**核心字段:**
```javascript
{
    initialStates: BoxState[4],    // 初始位置
    finalStates: BoxState[4],      // 最终位置
    viewMode: string,              // 当前视图模式
    dragPrecision: string,         // 拖动精度
    linkStates: Object,            // 遮罩链接状态
    activeBoxIndex: number|null,   // 活动 Box
    transformingStates: BoxState[4]|null  // 变换中的状态
}
```

**辅助方法:**
```javascript
// 获取当前可见的状态
getCurrentStates()      // 根据 viewMode 返回对应状态
getEditableStates()     // 获取可编辑的状态（非 transforming）

// 精度调整
snapPosition(value)     // 位置精度对齐
snapSize(value)         // 大小精度对齐
snapMask(value)         // 遮罩精度对齐

// XML 生成
generateXML(mode)       // 生成指定模式的 XML
```

**使用规范:**
- 纯数据对象，不包含业务逻辑
- 不主动触发更新
- 不持有对其他类的引用

### App (全局应用控制器)

**职责:**
- 中心化的状态管理
- 统一的 UI 更新协调
- 高级状态操作接口

**核心方法:**

```javascript
// 初始化
init(mainApp)           // 初始化引用

// 统一更新接口 (MOST IMPORTANT)
update(source, options) // 唯一的更新入口点

// 高级状态操作
setBoxProperty(boxIndex, property, value)  // 设置 Box 属性
toggleLink(boxIndex, linkType)             // 切换链接状态
loadStates(mode, parsedStates)             // 加载状态
clearStates(mode)                          // 清空状态
resetBox(boxIndex)                         // 重置单个 Box
swapStates()                               // 交换初始/最终状态
setViewMode(mode)                          // 设置视图模式
setDragPrecision(precision)                // 设置拖动精度
setTransformingStates(states)              // 设置变换状态

// 内部辅助方法
handleLinkedMask(boxIndex, property, value)  // 处理链接遮罩
syncXmlTextareas()                           // 同步 XML 文本框
```

**update() 方法详解:**

这是整个应用中最关键的方法，所有数据变化最终都应该调用它。

```javascript
App.update(source, options)
```

**参数:**
- `source`: 更新来源标识 (用于调试和优化)
  - `'canvas'` - 来自画布交互
  - `'panel'` - 来自控制面板
  - `'xml'` - 来自 XML 输入
  - `'mode'` - 视图模式切换
  - `'load'` - 加载数据
  - `'reset'` - 重置操作
  - `'swap'` - 交换操作

- `options`: 可选参数
  - `boxIndex` - 特定 Box 索引（null = 全部）
  - `skipCanvas` - 跳过画布重绘
  - `skipPanel` - 跳过面板更新
  - `skipXml` - 跳过 XML 更新
  - `skipAutoGenerate` - 跳过自动生成

**更新流程:**
```javascript
App.update(source, options) {
    1. 重绘画布（如果需要）
    2. 更新控制面板 UI（如果需要）
    3. 更新 XML 文本框（如果需要）
    4. 尝试自动生成过渡（如果需要）
}
```

**使用示例:**
```javascript
// 从画布更新单个 Box
App.update('canvas', { boxIndex: 0 });

// 切换视图模式，不触发自动生成
App.update('mode', { skipAutoGenerate: true });

// 加载数据，不重新生成 XML
App.update('load', { skipXml: true });
```

**使用规范:**
- 所有状态变化必须通过 App 方法
- 优先使用高级方法（setBoxProperty 等）
- 直接修改 AppState 后必须调用 update()
- 使用 skip 选项避免不必要的更新

### BoxPreviewCanvas (画布预览组件)

**职责:**
- 渲染 Box 位置预览
- 处理鼠标/触摸交互
- 提供拖动编辑功能

**核心方法:**
```javascript
// 渲染
redraw()                    // 重绘整个画布
drawGrid()                  // 绘制网格
drawBox(box, index)         // 绘制单个 Box

// 交互
hitTest(x, y)              // 检测点击位置
onMouseDown(e)             // 鼠标按下
onMouseMove(e)             // 鼠标移动
onMouseUp(e)               // 鼠标释放

// 状态访问
getCurrentStates()         // 获取当前状态（从 AppState）
```

**交互流程:**
```
用户拖动 → 修改 AppState → 调用 App.update('canvas')
                                      ↓
                          画布重绘 + 面板更新 + XML更新
```

**使用规范:**
- 不直接修改 AppState，通过 App 方法
- 使用 AppState.getCurrentStates() 读取数据
- 拖动结束后调用 App.update('canvas')

### BoxControlPanel (Box 控制面板)

**职责:**
- 渲染 Box 参数控件
- 处理用户输入事件
- 管理复制粘贴功能

**核心方法:**
```javascript
// UI 更新
updateUI()                          // 更新所有 Box UI
updateBoxUI(boxIndex, box)          // 更新单个 Box UI
updateTransformingDisplay(states)   // 显示变换状态

// 事件处理
onEnableChange(e)                   // Enable 开关变化
onMaskEnableChange(e)               // Mask Enable 变化
onSliderInput(e)                    // 滑块输入
onNumberInput(e)                    // 数字输入
onLinkToggle(e)                     // 链接按钮切换

// 复制粘贴
onCopyParamClick(e)                 // 复制参数
onCopyBoxClick(e)                   // 复制整个 Box
pasteParam(boxIndex, param)         // 粘贴参数
pasteBox(boxIndex)                  // 粘贴 Box
```

**使用规范:**
- 使用 App.setBoxProperty() 修改属性
- 使用 App.toggleLink() 切换链接
- 更新 UI 时读取 AppState.getCurrentStates()

### SuperSourceTransitionApp (主应用类)

**职责:**
- 应用生命周期管理
- 组件初始化与协调
- 动画播放控制
- XML 输入输出处理
- 文件操作

**核心字段:**
```javascript
{
    // 组件引用
    previewCanvas: BoxPreviewCanvas,
    boxControlPanel: BoxControlPanel,
    easingPreviewCanvas: EasingPreviewCanvas,
    
    // DOM 元素引用
    initialXmlEl, finalXmlEl, outputXmlEl,
    // ... 各种按钮和输入框
    
    // 动画状态
    generator: TransitionGenerator,
    currentFrame: number,
    totalFrames: number,
    isPlaying: boolean,
    animationId: number,
    frameInterval: number
}
```

**核心方法:**
```javascript
// 初始化
constructor()                       // 构造函数
initElements()                      // 初始化 DOM 元素
bindEvents()                        // 绑定事件处理器

// XML 操作
previewInitial(silent)              // 预览初始 XML
previewFinal(silent)                // 预览最终 XML
formatXml(type)                     // 格式化 XML
clearInitial()                      // 清空初始
clearFinal()                        // 清空最终
swapPositions()                     // 交换位置

// 动画生成
generate(silent)                    // 生成过渡动画
tryAutoGenerate()                   // 尝试自动生成

// 播放控制
setPreviewMode(mode)                // 设置预览模式
startPlayback()                     // 开始播放
pausePlayback()                     // 暂停播放
stepFrame(delta)                    // 步进帧
updatePreviewForFrame()             // 更新帧预览

// 文件操作
copyXmlContent(type)                // 复制 XML
saveXmlFile(type)                   // 保存 XML 文件
copyToClipboard()                   // 复制输出
saveOutputFile()                    // 保存输出文件
```

**使用规范:**
- 通过 App 方法修改状态
- 使用 App.init(this) 初始化 App 控制器
- 动画相关状态保留在 SuperSourceTransitionApp

---

## 数据流与状态管理 (Data Flow and State Management)

### 数据流向图 (Data Flow Diagram)

```
用户交互 (User Interaction)
    ↓
事件处理器 (Event Handler)
    ↓
修改 AppState (Modify AppState)
    ↓
调用 App.update() (Call App.update())
    ↓
┌───────────────┬──────────────┬──────────────┐
│   画布重绘     │  面板UI更新   │   XML同步     │
│ Canvas Redraw │ Panel Update │  XML Sync    │
└───────────────┴──────────────┴──────────────┘
    ↓
UI 反映最新状态 (UI reflects new state)
```

### 状态变化示例 (State Change Examples)

#### 示例 1: 用户在画布上拖动 Box

```javascript
// 1. 用户拖动 (BoxPreviewCanvas)
onMouseMove(e) {
    // 计算新位置
    const newX = ...;
    const newY = ...;
    
    // 2. 修改 AppState
    const states = AppState.getEditableStates();
    states[boxIndex].xPosition = newX;
    states[boxIndex].yPosition = newY;
    
    // 3. 调用 App.update()
    App.update('canvas', { 
        boxIndex,
        skipPanel: false  // 需要更新面板显示新值
    });
}

// App.update() 自动完成:
// - 重绘画布
// - 更新控制面板中的滑块和输入框
// - 更新 XML 文本框
// - 尝试自动生成过渡
```

#### 示例 2: 用户在面板中调整滑块

```javascript
// 1. 用户拖动滑块 (BoxControlPanel)
onSliderInput(e) {
    const value = parseFloat(e.target.value);
    
    // 2. 使用 App 高级方法
    App.setBoxProperty(boxIndex, param, value);
    
    // App.setBoxProperty() 内部:
    // - 修改 AppState
    // - 处理链接遮罩
    // - 调用 App.update()
}
```

#### 示例 3: 加载 XML 数据

```javascript
// 1. 用户输入 XML (SuperSourceTransitionApp)
previewInitial() {
    // 解析 XML
    const states = XMLParser.parseOps(xml);
    
    // 2. 使用 App 方法加载
    App.loadStates('initial', states);
    
    // App.loadStates() 内部:
    // - 更新 AppState.initialStates
    // - 调用 App.update('load', { skipXml: true })
    //   (skipXml 因为我们正在从 XML 加载，不需要重新生成)
}
```

### 状态一致性保证 (State Consistency Guarantee)

**关键原则:**

1. **单一修改入口:** 所有状态修改通过 App 方法
2. **同步更新:** App.update() 保证所有视图同步
3. **原子操作:** 状态修改和 UI 更新在同一调用中完成
4. **跳过优化:** 使用 skip 选项避免不必要的更新

**反例 (Bad Practice):**
```javascript
// ❌ 直接修改状态，没有通知其他组件
AppState.initialStates[0].size = 0.5;
this.previewCanvas.redraw();  // 其他组件不知道变化

// ❌ 绕过 App 直接调用组件方法
this.boxControlPanel.updateBoxUI(0, box);
this.previewCanvas.redraw();
```

**正例 (Good Practice):**
```javascript
// ✅ 使用 App 高级方法
App.setBoxProperty(0, 'size', 0.5);

// ✅ 直接修改后调用 update
AppState.initialStates[0].size = 0.5;
App.update('panel', { boxIndex: 0 });
```

---

## 更新循环机制 (Update Cycle)

### 更新触发源 (Update Triggers)

| 触发源 | 说明 | 调用方式 |
|--------|------|----------|
| Canvas | 画布交互（拖动） | `App.update('canvas', { boxIndex })` |
| Panel | 控制面板输入 | `App.setBoxProperty()` → `App.update('panel')` |
| XML | XML 输入变化 | `App.loadStates()` → `App.update('load')` |
| Mode | 视图模式切换 | `App.setViewMode()` → `App.update('mode')` |
| Reset | 重置操作 | `App.resetBox()` → `App.update('reset')` |
| Swap | 交换操作 | `App.swapStates()` → `App.update('swap')` |

### 更新优化策略 (Update Optimization)

#### 1. 跳过不必要的更新

```javascript
// 场景：从 XML 加载数据
App.loadStates('initial', states);
// 内部调用: App.update('load', { skipXml: true })
// 原因：我们正在从 XML 加载，不需要重新生成 XML

// 场景：切换视图模式
App.setViewMode('final');
// 内部调用: App.update('mode', { skipAutoGenerate: true })
// 原因：只是切换视图，不需要重新生成过渡
```

#### 2. 增量更新

```javascript
// 只更新特定 Box 的面板 UI
App.update('canvas', { 
    boxIndex: 0,  // 只更新 Box 0
    skipCanvas: true  // 画布已经实时更新了
});
```

#### 3. 防抖处理

```javascript
// XML 输入防抖
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
```

---

## 事件处理流程 (Event Handling Flow)

### 事件处理模式

```
DOM Event → Event Handler → Modify State → App.update() → UI Update
```

### 常见事件流程

#### 1. 画布拖动事件

```javascript
// 鼠标按下
onMouseDown(e) {
    // 保存初始状态
    this.isDragging = true;
    this.dragStartBoxState = box.clone();
}

// 鼠标移动
onMouseMove(e) {
    if (!this.isDragging) return;
    
    // 计算新值
    const delta = ...;
    const newValue = this.dragStartBoxState.xPosition + delta;
    
    // 应用精度对齐
    const snappedValue = AppState.snapPosition(newValue);
    
    // 修改状态
    const states = AppState.getEditableStates();
    states[this.dragBoxIndex].xPosition = snappedValue;
    
    // 实时更新（跳过面板和 XML）
    App.update('canvas', { 
        boxIndex: this.dragBoxIndex,
        skipPanel: true,
        skipXml: true,
        skipAutoGenerate: true
    });
}

// 鼠标释放
onMouseUp(e) {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    
    // 完整更新（包括面板和 XML）
    App.update('canvas', { 
        boxIndex: this.dragBoxIndex
    });
}
```

#### 2. 控制面板输入事件

```javascript
// 滑块输入（实时）
onSliderInput(e) {
    const value = parseFloat(e.target.value);
    
    // 使用高级方法（自动处理链接和更新）
    App.setBoxProperty(boxIndex, param, value);
}

// 数字输入（实时预览）
onNumberInput(e) {
    const value = parseFloat(e.target.value);
    
    if (!isNaN(value)) {
        // 直接修改状态
        AppState.getEditableStates()[boxIndex][param] = value;
        
        // 更新其他组件，但不更新输入框本身
        App.update('panel', { 
            boxIndex,
            skipPanel: true  // 避免清除用户正在输入的内容
        });
    }
}

// 数字输入完成（失焦）
onNumberChange(e) {
    // 格式化并确保有效值
    const value = AppState.getEditableStates()[boxIndex][param];
    e.target.value = this.formatValue(param, value);
}
```

#### 3. 视图模式切换

```javascript
setPreviewMode(mode) {
    // 停止播放
    this.pausePlayback();
    
    // 更新按钮状态
    this.allToggleBtns.forEach(b => b.classList.remove('active'));
    // ... 设置对应按钮为 active
    
    // 更新帧位置
    if (mode === 'initial') this.currentFrame = 0;
    if (mode === 'final') this.currentFrame = this.totalFrames;
    
    // 通过 App 更新视图
    App.setViewMode(mode);
    // 内部调用: App.update('mode', { skipAutoGenerate: true })
    
    // 同步面板状态
    this.boxControlPanel.setMode(mode);
}
```

---

## 书写规范与最佳实践 (Coding Standards)

### 1. 状态管理规范

#### ✅ 正确做法

```javascript
// 使用 App 高级方法
App.setBoxProperty(0, 'size', 0.5);

// 或者：修改状态后立即调用 update
AppState.initialStates[0].size = 0.5;
App.update('panel', { boxIndex: 0 });

// 批量修改
for (let i = 0; i < 4; i++) {
    AppState.initialStates[i].reset();
}
App.update('reset');
```

#### ❌ 错误做法

```javascript
// 直接修改状态，没有通知
AppState.initialStates[0].size = 0.5;

// 绕过 App 直接调用组件
this.previewCanvas.redraw();
this.boxControlPanel.updateBoxUI(0, box);

// 不一致的更新
AppState.initialStates[0].size = 0.5;
this.previewCanvas.redraw();  // 只更新了画布
```

### 2. 组件通信规范

#### ✅ 正确做法

```javascript
// 组件通过 App 通信
class BoxPreviewCanvas {
    onDragEnd() {
        // 不直接调用 BoxControlPanel
        // 而是通过 App.update() 间接更新
        App.update('canvas', { boxIndex });
    }
}

// 组件读取共享状态
class BoxControlPanel {
    updateUI() {
        const states = AppState.getCurrentStates();
        // 使用 states...
    }
}
```

#### ❌ 错误做法

```javascript
// 组件之间直接引用
class BoxPreviewCanvas {
    constructor(boxControlPanel) {
        this.boxControlPanel = boxControlPanel;  // ❌
    }
    
    onDragEnd() {
        this.boxControlPanel.updateBoxUI(...);  // ❌
    }
}
```

### 3. 代码组织规范

#### 文件结构

```javascript
// 1. 工具类和数据类
class BoxState { ... }

// 2. 全局状态
const AppState = { ... };

// 3. 全局控制器
const App = { ... };

// 4. 工具类
class XMLParser { ... }
class TransitionGenerator { ... }

// 5. 组件类
class BoxPreviewCanvas { ... }
class BoxControlPanel { ... }

// 6. 主应用类
class SuperSourceTransitionApp { ... }

// 7. 初始化
document.addEventListener('DOMContentLoaded', () => {
    new SuperSourceTransitionApp();
});
```

#### 方法组织

```javascript
class SomeClass {
    constructor() { ... }
    
    // === 公共 API ===
    publicMethod() { ... }
    
    // === 事件处理 ===
    onSomeEvent(e) { ... }
    
    // === 内部方法 ===
    _privateHelper() { ... }
    
    // === 工具方法 ===
    formatValue() { ... }
}
```

### 4. 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 类名 | PascalCase | `BoxPreviewCanvas` |
| 方法名 | camelCase | `updateBoxUI()` |
| 常量 | UPPER_SNAKE_CASE | `SCREEN_WIDTH` |
| 私有方法 | _camelCase | `_calculateBounds()` |
| 事件处理器 | on + EventName | `onMouseDown()` |
| Boolean | is/has + Adjective | `isPlaying`, `hasChanged` |

### 5. 注释规范

```javascript
/**
 * 多行注释用于类和重要方法
 * @param {number} boxIndex - Box 索引
 * @returns {BoxState} - Box 状态
 */
function getBoxState(boxIndex) {
    // 单行注释用于解释复杂逻辑
    const states = AppState.getCurrentStates();
    return states[boxIndex];
}
```

---

## 扩展指南 (Extension Guide)

### 添加新的 Box 属性

```javascript
// 1. 在 BoxState 中添加属性
class BoxState {
    constructor(boxIndex, superSource = 0) {
        // ... 现有属性
        this.newProperty = defaultValue;
    }
    
    clone() {
        // ... 克隆新属性
        cloned.newProperty = this.newProperty;
        return cloned;
    }
    
    copyFrom(other) {
        // ... 复制新属性
        this.newProperty = other.newProperty || defaultValue;
    }
    
    reset() {
        // ... 重置新属性
        this.newProperty = defaultValue;
    }
}

// 2. 在 AppState.generateXML() 中添加 XML 生成
generateXML(mode) {
    // ...
    lines.push(`<Op id="SuperSourceV2BoxNewProperty" ... />`);
}

// 3. 在 XMLParser 中添加解析
static parseOps(xmlText) {
    // ...
    case 'SuperSourceV2BoxNewProperty':
        box.newProperty = parseFloat(attrs.value);
        break;
}

// 4. 在 BoxControlPanel 中添加控件
// HTML: 添加输入控件
// JS: 添加事件处理和 UI 更新

// 5. 在 TransitionGenerator 中添加插值
interpolateBox(initial, final, t) {
    // ...
    box.newProperty = this.interpolate(
        initial.newProperty, 
        final.newProperty, 
        t
    );
    return box;
}
```

### 添加新的视图模式

```javascript
// 1. 在 AppState 中添加模式
const AppState = {
    viewMode: 'initial' | 'final' | 'transforming' | 'newMode',
    // ...
};

// 2. 更新 AppState.getCurrentStates()
getCurrentStates() {
    if (this.viewMode === 'newMode') {
        return this.newModeStates;
    }
    // ... 现有逻辑
}

// 3. 添加切换按钮和事件处理
// HTML: 添加按钮
// JS: 绑定事件到 setPreviewMode('newMode')

// 4. 更新相关组件
class BoxControlPanel {
    setMode(mode) {
        // 处理 newMode ...
    }
}
```

### 添加新的交互方式

```javascript
// 在 BoxPreviewCanvas 中添加
class BoxPreviewCanvas {
    bindEvents() {
        // ... 现有事件
        this.canvas.addEventListener('contextmenu', (e) => 
            this.onContextMenu(e)
        );
    }
    
    onContextMenu(e) {
        e.preventDefault();
        // 实现上下文菜单逻辑
        
        // 修改状态后通过 App 更新
        App.update('canvas', { boxIndex });
    }
}
```

---

## 总结 (Summary)

### 关键要点 (Key Points)

1. **单一数据源:** AppState 是所有数据的唯一来源
2. **中心化控制:** App 是所有更新的协调者
3. **职责分离:** 每个类有明确的单一职责
4. **统一更新:** 所有变化通过 App.update() 同步
5. **优化机制:** 使用 skip 选项避免不必要的更新

### 代码审查清单 (Code Review Checklist)

- [ ] 是否通过 App 方法修改状态？
- [ ] 是否调用了 App.update()？
- [ ] 是否使用了正确的 skip 选项？
- [ ] 是否避免了组件间直接引用？
- [ ] 是否从 AppState 读取状态？
- [ ] 是否保持了职责分离？
- [ ] 是否添加了必要的注释？
- [ ] 是否遵循了命名规范？