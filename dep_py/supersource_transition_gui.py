#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SuperSource Transition XML Generator - GUI Version
带图形界面的ATEM SuperSource过渡动画Macro XML生成器

使用方法:
  python supersource_transition_gui.py
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, filedialog, messagebox
from tkinter import Canvas
import re
import math
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple
from enum import Enum


# ============== 缓动函数 ==============

class EasingType(Enum):
    """缓动曲线类型"""
    LINEAR = "linear"
    EASE_IN = "ease_in"
    EASE_OUT = "ease_out"
    EASE_IN_OUT = "ease_in_out"
    EASE_IN_QUAD = "ease_in_quad"
    EASE_OUT_QUAD = "ease_out_quad"
    EASE_IN_OUT_QUAD = "ease_in_out_quad"
    EASE_IN_CUBIC = "ease_in_cubic"
    EASE_OUT_CUBIC = "ease_out_cubic"
    EASE_IN_OUT_CUBIC = "ease_in_out_cubic"
    EASE_IN_QUART = "ease_in_quart"
    EASE_OUT_QUART = "ease_out_quart"
    EASE_IN_OUT_QUART = "ease_in_out_quart"
    EASE_IN_QUINT = "ease_in_quint"
    EASE_OUT_QUINT = "ease_out_quint"
    EASE_IN_OUT_QUINT = "ease_in_out_quint"
    EASE_IN_SINE = "ease_in_sine"
    EASE_OUT_SINE = "ease_out_sine"
    EASE_IN_OUT_SINE = "ease_in_out_sine"
    EASE_IN_EXPO = "ease_in_expo"
    EASE_OUT_EXPO = "ease_out_expo"
    EASE_IN_OUT_EXPO = "ease_in_out_expo"
    EASE_IN_CIRC = "ease_in_circ"
    EASE_OUT_CIRC = "ease_out_circ"
    EASE_IN_OUT_CIRC = "ease_in_out_circ"
    EASE_IN_BACK = "ease_in_back"
    EASE_OUT_BACK = "ease_out_back"
    EASE_IN_OUT_BACK = "ease_in_out_back"
    EASE_IN_ELASTIC = "ease_in_elastic"
    EASE_OUT_ELASTIC = "ease_out_elastic"
    EASE_IN_OUT_ELASTIC = "ease_in_out_elastic"
    EASE_IN_BOUNCE = "ease_in_bounce"
    EASE_OUT_BOUNCE = "ease_out_bounce"
    EASE_IN_OUT_BOUNCE = "ease_in_out_bounce"


class EasingFunctions:
    """缓动函数集合"""
    
    @staticmethod
    def linear(t: float) -> float:
        return t
    
    @staticmethod
    def ease_in_quad(t: float) -> float:
        return t * t
    
    @staticmethod
    def ease_out_quad(t: float) -> float:
        return t * (2 - t)
    
    @staticmethod
    def ease_in_out_quad(t: float) -> float:
        if t < 0.5:
            return 2 * t * t
        return -1 + (4 - 2 * t) * t
    
    @staticmethod
    def ease_in_cubic(t: float) -> float:
        return t * t * t
    
    @staticmethod
    def ease_out_cubic(t: float) -> float:
        t -= 1
        return t * t * t + 1
    
    @staticmethod
    def ease_in_out_cubic(t: float) -> float:
        if t < 0.5:
            return 4 * t * t * t
        t = 2 * t - 2
        return 0.5 * t * t * t + 1
    
    @staticmethod
    def ease_in_quart(t: float) -> float:
        return t * t * t * t
    
    @staticmethod
    def ease_out_quart(t: float) -> float:
        t -= 1
        return 1 - t * t * t * t
    
    @staticmethod
    def ease_in_out_quart(t: float) -> float:
        if t < 0.5:
            return 8 * t * t * t * t
        t -= 1
        return 1 - 8 * t * t * t * t
    
    @staticmethod
    def ease_in_quint(t: float) -> float:
        return t * t * t * t * t
    
    @staticmethod
    def ease_out_quint(t: float) -> float:
        t -= 1
        return t * t * t * t * t + 1
    
    @staticmethod
    def ease_in_out_quint(t: float) -> float:
        if t < 0.5:
            return 16 * t * t * t * t * t
        t -= 1
        return 16 * t * t * t * t * t + 1
    
    @staticmethod
    def ease_in_sine(t: float) -> float:
        return 1 - math.cos(t * math.pi / 2)
    
    @staticmethod
    def ease_out_sine(t: float) -> float:
        return math.sin(t * math.pi / 2)
    
    @staticmethod
    def ease_in_out_sine(t: float) -> float:
        return 0.5 * (1 - math.cos(math.pi * t))
    
    @staticmethod
    def ease_in_expo(t: float) -> float:
        if t == 0:
            return 0
        return math.pow(2, 10 * (t - 1))
    
    @staticmethod
    def ease_out_expo(t: float) -> float:
        if t == 1:
            return 1
        return 1 - math.pow(2, -10 * t)
    
    @staticmethod
    def ease_in_out_expo(t: float) -> float:
        if t == 0:
            return 0
        if t == 1:
            return 1
        if t < 0.5:
            return 0.5 * math.pow(2, 20 * t - 10)
        return 1 - 0.5 * math.pow(2, -20 * t + 10)
    
    @staticmethod
    def ease_in_circ(t: float) -> float:
        return 1 - math.sqrt(1 - t * t)
    
    @staticmethod
    def ease_out_circ(t: float) -> float:
        t -= 1
        return math.sqrt(1 - t * t)
    
    @staticmethod
    def ease_in_out_circ(t: float) -> float:
        if t < 0.5:
            return 0.5 * (1 - math.sqrt(1 - 4 * t * t))
        t = 2 * t - 2
        return 0.5 * (math.sqrt(1 - t * t) + 1)
    
    @staticmethod
    def ease_in_back(t: float) -> float:
        c1 = 1.70158
        return t * t * ((c1 + 1) * t - c1)
    
    @staticmethod
    def ease_out_back(t: float) -> float:
        c1 = 1.70158
        t -= 1
        return t * t * ((c1 + 1) * t + c1) + 1
    
    @staticmethod
    def ease_in_out_back(t: float) -> float:
        c2 = 1.70158 * 1.525
        if t < 0.5:
            return 0.5 * (4 * t * t * ((c2 + 1) * 2 * t - c2))
        t = 2 * t - 2
        return 0.5 * (t * t * ((c2 + 1) * t + c2) + 2)
    
    @staticmethod
    def ease_in_elastic(t: float) -> float:
        if t == 0:
            return 0
        if t == 1:
            return 1
        c4 = (2 * math.pi) / 3
        return -math.pow(2, 10 * t - 10) * math.sin((t * 10 - 10.75) * c4)
    
    @staticmethod
    def ease_out_elastic(t: float) -> float:
        if t == 0:
            return 0
        if t == 1:
            return 1
        c4 = (2 * math.pi) / 3
        return math.pow(2, -10 * t) * math.sin((t * 10 - 0.75) * c4) + 1
    
    @staticmethod
    def ease_in_out_elastic(t: float) -> float:
        if t == 0:
            return 0
        if t == 1:
            return 1
        c5 = (2 * math.pi) / 4.5
        if t < 0.5:
            return -0.5 * math.pow(2, 20 * t - 10) * math.sin((20 * t - 11.125) * c5)
        return 0.5 * math.pow(2, -20 * t + 10) * math.sin((20 * t - 11.125) * c5) + 1
    
    @staticmethod
    def ease_out_bounce(t: float) -> float:
        n1 = 7.5625
        d1 = 2.75
        if t < 1 / d1:
            return n1 * t * t
        elif t < 2 / d1:
            t -= 1.5 / d1
            return n1 * t * t + 0.75
        elif t < 2.5 / d1:
            t -= 2.25 / d1
            return n1 * t * t + 0.9375
        else:
            t -= 2.625 / d1
            return n1 * t * t + 0.984375
    
    @staticmethod
    def ease_in_bounce(t: float) -> float:
        return 1 - EasingFunctions.ease_out_bounce(1 - t)
    
    @staticmethod
    def ease_in_out_bounce(t: float) -> float:
        if t < 0.5:
            return 0.5 * EasingFunctions.ease_in_bounce(2 * t)
        return 0.5 * EasingFunctions.ease_out_bounce(2 * t - 1) + 0.5
    
    @classmethod
    def get_function(cls, easing_type: EasingType):
        """获取缓动函数"""
        mapping = {
            EasingType.LINEAR: cls.linear,
            EasingType.EASE_IN: cls.ease_in_quad,
            EasingType.EASE_OUT: cls.ease_out_quad,
            EasingType.EASE_IN_OUT: cls.ease_in_out_quad,
            EasingType.EASE_IN_QUAD: cls.ease_in_quad,
            EasingType.EASE_OUT_QUAD: cls.ease_out_quad,
            EasingType.EASE_IN_OUT_QUAD: cls.ease_in_out_quad,
            EasingType.EASE_IN_CUBIC: cls.ease_in_cubic,
            EasingType.EASE_OUT_CUBIC: cls.ease_out_cubic,
            EasingType.EASE_IN_OUT_CUBIC: cls.ease_in_out_cubic,
            EasingType.EASE_IN_QUART: cls.ease_in_quart,
            EasingType.EASE_OUT_QUART: cls.ease_out_quart,
            EasingType.EASE_IN_OUT_QUART: cls.ease_in_out_quart,
            EasingType.EASE_IN_QUINT: cls.ease_in_quint,
            EasingType.EASE_OUT_QUINT: cls.ease_out_quint,
            EasingType.EASE_IN_OUT_QUINT: cls.ease_in_out_quint,
            EasingType.EASE_IN_SINE: cls.ease_in_sine,
            EasingType.EASE_OUT_SINE: cls.ease_out_sine,
            EasingType.EASE_IN_OUT_SINE: cls.ease_in_out_sine,
            EasingType.EASE_IN_EXPO: cls.ease_in_expo,
            EasingType.EASE_OUT_EXPO: cls.ease_out_expo,
            EasingType.EASE_IN_OUT_EXPO: cls.ease_in_out_expo,
            EasingType.EASE_IN_CIRC: cls.ease_in_circ,
            EasingType.EASE_OUT_CIRC: cls.ease_out_circ,
            EasingType.EASE_IN_OUT_CIRC: cls.ease_in_out_circ,
            EasingType.EASE_IN_BACK: cls.ease_in_back,
            EasingType.EASE_OUT_BACK: cls.ease_out_back,
            EasingType.EASE_IN_OUT_BACK: cls.ease_in_out_back,
            EasingType.EASE_IN_ELASTIC: cls.ease_in_elastic,
            EasingType.EASE_OUT_ELASTIC: cls.ease_out_elastic,
            EasingType.EASE_IN_OUT_ELASTIC: cls.ease_in_out_elastic,
            EasingType.EASE_IN_BOUNCE: cls.ease_in_bounce,
            EasingType.EASE_OUT_BOUNCE: cls.ease_out_bounce,
            EasingType.EASE_IN_OUT_BOUNCE: cls.ease_in_out_bounce,
        }
        return mapping.get(easing_type, cls.linear)


# ============== 数据结构 ==============

@dataclass
class BoxState:
    """Box状态数据"""
    box_index: int
    super_source: int = 0
    enable: bool = False
    size: float = 1.0
    x_position: float = 0.0
    y_position: float = 0.0
    mask_enable: bool = False
    mask_left: float = 0.0
    mask_top: float = 0.0
    mask_right: float = 0.0
    mask_bottom: float = 0.0


# ============== XML解析器 ==============

class XMLParser:
    """解析SuperSource XML"""
    
    @staticmethod
    def parse_ops(xml_text: str) -> Dict[int, BoxState]:
        """解析XML操作到BoxState字典"""
        boxes: Dict[int, BoxState] = {}
        
        op_pattern = r'<Op\s+([^>]+)/>'
        attr_pattern = r'(\w+)="([^"]*)"'
        
        for match in re.finditer(op_pattern, xml_text):
            attrs_str = match.group(1)
            attrs = dict(re.findall(attr_pattern, attrs_str))
            
            op_id = attrs.get('id', '')
            box_index = int(attrs.get('boxIndex', 0))
            super_source = int(attrs.get('superSource', 0))
            
            if box_index not in boxes:
                boxes[box_index] = BoxState(box_index=box_index, super_source=super_source)
            
            box = boxes[box_index]
            
            if op_id == 'SuperSourceV2BoxEnable':
                box.enable = attrs.get('enable', 'False').lower() == 'true'
            elif op_id == 'SuperSourceV2BoxSize':
                box.size = float(attrs.get('size', 1.0))
            elif op_id == 'SuperSourceV2BoxXPosition':
                box.x_position = float(attrs.get('xPosition', 0.0))
            elif op_id == 'SuperSourceV2BoxYPosition':
                box.y_position = float(attrs.get('yPosition', 0.0))
            # Mask和Crop都映射到mask字段
            elif op_id in ('SuperSourceV2BoxMaskEnable', 'SuperSourceV2BoxCropEnable'):
                box.mask_enable = attrs.get('enable', 'False').lower() == 'true'
            elif op_id in ('SuperSourceV2BoxMaskLeft', 'SuperSourceV2BoxCropLeft'):
                box.mask_left = float(attrs.get('left', 0.0))
            elif op_id in ('SuperSourceV2BoxMaskTop', 'SuperSourceV2BoxCropTop'):
                box.mask_top = float(attrs.get('top', 0.0))
            elif op_id in ('SuperSourceV2BoxMaskRight', 'SuperSourceV2BoxCropRight'):
                box.mask_right = float(attrs.get('right', 0.0))
            elif op_id in ('SuperSourceV2BoxMaskBottom', 'SuperSourceV2BoxCropBottom'):
                box.mask_bottom = float(attrs.get('bottom', 0.0))
        
        return boxes


# ============== 过渡生成器 ==============

class TransitionGenerator:
    """过渡动画生成器"""
    
    def __init__(self, initial_states: Dict[int, BoxState], final_states: Dict[int, BoxState],
                 duration_frames: int, easing_type: EasingType):
        self.initial_states = initial_states
        self.final_states = final_states
        self.duration_frames = duration_frames
        self.easing_func = EasingFunctions.get_function(easing_type)
        self.easing_type = easing_type
        
        for i in range(4):
            if i not in self.initial_states:
                self.initial_states[i] = BoxState(box_index=i, enable=False)
            if i not in self.final_states:
                self.final_states[i] = BoxState(box_index=i, enable=False)
    
    def interpolate(self, start: float, end: float, t: float) -> float:
        """插值计算"""
        eased_t = self.easing_func(t)
        return start + (end - start) * eased_t
    
    def interpolate_box(self, initial: BoxState, final: BoxState, t: float) -> BoxState:
        """插值计算Box状态"""
        return BoxState(
            box_index=initial.box_index,
            super_source=initial.super_source,
            enable=initial.enable if t < 1 else final.enable,
            size=self.interpolate(initial.size, final.size, t),
            x_position=self.interpolate(initial.x_position, final.x_position, t),
            y_position=self.interpolate(initial.y_position, final.y_position, t),
            mask_enable=initial.mask_enable or final.mask_enable,
            mask_left=self.interpolate(initial.mask_left, final.mask_left, t),
            mask_top=self.interpolate(initial.mask_top, final.mask_top, t),
            mask_right=self.interpolate(initial.mask_right, final.mask_right, t),
            mask_bottom=self.interpolate(initial.mask_bottom, final.mask_bottom, t),
        )
    
    def should_box_animate(self, box_index: int) -> bool:
        """判断box是否需要动画"""
        initial = self.initial_states[box_index]
        final = self.final_states[box_index]
        
        if not initial.enable and not final.enable:
            return False
        
        return True
    
    def generate(self) -> str:
        """生成完整的过渡XML"""
        lines = []
        
        animating_boxes = []
        for i in range(4):
            if self.should_box_animate(i):
                animating_boxes.append(i)
        
        lines.append(f"<!-- Duration: {self.duration_frames} frames | Easing: {self.easing_type.value} -->")
        lines.append("")
        
        # Initial Enable States
        lines.append("<!-- Initial Enable States -->")
        for i in range(4):
            initial = self.initial_states[i]
            final = self.final_states[i]
            ss = initial.super_source
            
            if initial.enable or final.enable:
                lines.append(f'<Op id="SuperSourceV2BoxEnable" superSource="{ss}" boxIndex="{i}" enable="True" />')
            else:
                lines.append(f'<Op id="SuperSourceV2BoxEnable" superSource="{ss}" boxIndex="{i}" enable="False" />')
        lines.append("")
        
        # Initial Positions and Masks
        lines.append("<!-- Initial Positions and Masks -->")
        for i in animating_boxes:
            initial = self.initial_states[i]
            ss = initial.super_source
            idx = initial.box_index
            
            lines.append(f'<Op id="SuperSourceV2BoxSize" superSource="{ss}" boxIndex="{idx}" size="{initial.size:.4f}"/>')
            lines.append(f'<Op id="SuperSourceV2BoxXPosition" superSource="{ss}" boxIndex="{idx}" xPosition="{initial.x_position:.4f}"/>')
            lines.append(f'<Op id="SuperSourceV2BoxYPosition" superSource="{ss}" boxIndex="{idx}" yPosition="{initial.y_position:.4f}"/>')
            
            if initial.mask_enable or self.final_states[i].mask_enable:
                lines.append(f'<Op id="SuperSourceV2BoxMaskEnable" superSource="{ss}" boxIndex="{idx}" enable="True"/>')
                lines.append(f'<Op id="SuperSourceV2BoxMaskLeft" superSource="{ss}" boxIndex="{idx}" left="{initial.mask_left:.2f}"/>')
                lines.append(f'<Op id="SuperSourceV2BoxMaskTop" superSource="{ss}" boxIndex="{idx}" top="{initial.mask_top:.2f}"/>')
                lines.append(f'<Op id="SuperSourceV2BoxMaskRight" superSource="{ss}" boxIndex="{idx}" right="{initial.mask_right:.2f}"/>')
                lines.append(f'<Op id="SuperSourceV2BoxMaskBottom" superSource="{ss}" boxIndex="{idx}" bottom="{initial.mask_bottom:.2f}"/>')
            
            lines.append("")
        
        lines.append('<Op id="MacroSleep" frames="1"/>')
        lines.append("")
        
        # Animation Frames
        lines.append("<!-- Animation Frames -->")
        for frame in range(1, self.duration_frames + 1):
            t = frame / self.duration_frames
            
            lines.append(f"<!-- Frame {frame}/{self.duration_frames} (t={t:.3f}) -->")
            
            for box_index in animating_boxes:
                initial = self.initial_states[box_index]
                final = self.final_states[box_index]
                
                interpolated = self.interpolate_box(initial, final, t)
                
                ss = interpolated.super_source
                idx = interpolated.box_index
                
                lines.append(f'<Op id="SuperSourceV2BoxSize" superSource="{ss}" boxIndex="{idx}" size="{interpolated.size:.4f}"/>')
                lines.append(f'<Op id="SuperSourceV2BoxXPosition" superSource="{ss}" boxIndex="{idx}" xPosition="{interpolated.x_position:.4f}"/>')
                lines.append(f'<Op id="SuperSourceV2BoxYPosition" superSource="{ss}" boxIndex="{idx}" yPosition="{interpolated.y_position:.4f}"/>')
                
                if initial.mask_enable or final.mask_enable:
                    lines.append(f'<Op id="SuperSourceV2BoxMaskLeft" superSource="{ss}" boxIndex="{idx}" left="{interpolated.mask_left:.2f}"/>')
                    lines.append(f'<Op id="SuperSourceV2BoxMaskTop" superSource="{ss}" boxIndex="{idx}" top="{interpolated.mask_top:.2f}"/>')
                    lines.append(f'<Op id="SuperSourceV2BoxMaskRight" superSource="{ss}" boxIndex="{idx}" right="{interpolated.mask_right:.2f}"/>')
                    lines.append(f'<Op id="SuperSourceV2BoxMaskBottom" superSource="{ss}" boxIndex="{idx}" bottom="{interpolated.mask_bottom:.2f}"/>')
            
            lines.append('<Op id="MacroSleep" frames="1"/>')
            lines.append("")
        
        # Final States
        lines.append("<!-- Final States -->")
        for i in range(4):
            final = self.final_states[i]
            ss = final.super_source
            enable_str = "True" if final.enable else "False"
            lines.append(f'<Op id="SuperSourceV2BoxEnable" superSource="{ss}" boxIndex="{i}" enable="{enable_str}" />')
        
        for i in animating_boxes:
            final = self.final_states[i]
            if final.mask_enable:
                ss = final.super_source
                lines.append(f'<Op id="SuperSourceV2BoxMaskEnable" superSource="{ss}" boxIndex="{i}" enable="True"/>')
                lines.append(f'<Op id="SuperSourceV2BoxMaskLeft" superSource="{ss}" boxIndex="{i}" left="{final.mask_left:.2f}"/>')
                lines.append(f'<Op id="SuperSourceV2BoxMaskTop" superSource="{ss}" boxIndex="{i}" top="{final.mask_top:.2f}"/>')
                lines.append(f'<Op id="SuperSourceV2BoxMaskRight" superSource="{ss}" boxIndex="{i}" right="{final.mask_right:.2f}"/>')
                lines.append(f'<Op id="SuperSourceV2BoxMaskBottom" superSource="{ss}" boxIndex="{i}" bottom="{final.mask_bottom:.2f}"/>')
        
        return "\n".join(lines)


# ============== 可视化预览 ==============

class BoxPreviewCanvas:
    """Box位置可视化预览画布"""
    
    # 坐标系范围: X: -16 到 16, Y: -9 到 9
    COORD_X_MIN = -16
    COORD_X_MAX = 16
    COORD_Y_MIN = -9
    COORD_Y_MAX = 9
    
    # 屏幕范围 (可见区域): X: -16 到 16, Y: -9 到 9
    SCREEN_WIDTH = 32  # 总宽度
    SCREEN_HEIGHT = 18  # 总高度
    
    # Box颜色
    BOX_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
    BOX_COLORS_DIM = ['#994040', '#2E7A74', '#2A6D7D', '#5A7C6C']
    
    def __init__(self, parent, width=400, height=225, title="Preview"):
        """
        初始化预览画布
        Args:
            parent: 父容器
            width: 画布宽度（像素）
            height: 画布高度（像素）
            title: 预览窗口标题
        """
        self.width = width
        self.height = height
        self.padding = 30  # 边距用于显示坐标轴标签
        self.title = title
        
        # 创建画布
        self.canvas = Canvas(parent, width=width, height=height, bg='#1a1a2e', highlightthickness=1, highlightbackground='#333')
        
        # 计算绘图区域
        self.draw_width = width - 2 * self.padding
        self.draw_height = height - 2 * self.padding
        
        # 存储当前显示的Box状态
        self.box_states: Dict[int, BoxState] = {}
        
    def grid(self, **kwargs):
        """布局画布"""
        self.canvas.grid(**kwargs)
    
    def pack(self, **kwargs):
        """布局画布"""
        self.canvas.pack(**kwargs)
    
    def coord_to_canvas(self, x: float, y: float) -> Tuple[float, float]:
        """
        将坐标系坐标转换为画布坐标
        坐标系: 中心为(0,0), X: -16到16, Y: -9到9
        画布: 左上角为(0,0)
        """
        # 归一化到0-1范围
        norm_x = (x - self.COORD_X_MIN) / self.SCREEN_WIDTH
        norm_y = (self.COORD_Y_MAX - y) / self.SCREEN_HEIGHT  # Y轴翻转
        
        # 转换到画布坐标
        canvas_x = self.padding + norm_x * self.draw_width
        canvas_y = self.padding + norm_y * self.draw_height
        
        return canvas_x, canvas_y
    
    def size_to_canvas(self, size: float) -> Tuple[float, float]:
        """
        将Box的size转换为画布上的宽高
        size=1 表示和整个屏幕一样大 (32x18)
        """
        box_width = size * self.SCREEN_WIDTH
        box_height = size * self.SCREEN_HEIGHT
        
        # 转换为画布像素
        canvas_width = (box_width / self.SCREEN_WIDTH) * self.draw_width
        canvas_height = (box_height / self.SCREEN_HEIGHT) * self.draw_height
        
        return canvas_width, canvas_height
    
    def draw_grid(self):
        """绘制坐标网格和轴"""
        # 清除画布
        self.canvas.delete("all")
        
        # 绘制背景网格
        grid_color = '#2a2a4a'
        grid_interval = 4  # 统一的网格间隔
        
        # 垂直网格线 (每4个单位)
        for x in range(-16, 17, grid_interval):
            cx, _ = self.coord_to_canvas(x, 0)
            self.canvas.create_line(cx, self.padding, cx, self.height - self.padding, 
                                   fill=grid_color, dash=(2, 4))
            # X轴标签
            self.canvas.create_text(cx, self.height - self.padding + 12, 
                                   text=str(x), fill='#666', font=('Arial', 8))
        
        # 水平网格线 (每4个单位，与X轴保持一致)
        for y in range(-8, 9, grid_interval):
            _, cy = self.coord_to_canvas(0, y)
            self.canvas.create_line(self.padding, cy, self.width - self.padding, cy, 
                                   fill=grid_color, dash=(2, 4))
            # Y轴标签
            self.canvas.create_text(self.padding - 12, cy, 
                                   text=str(y), fill='#666', font=('Arial', 8))
        
        # 绘制屏幕边界 (可见区域)
        screen_color = '#4a4a6a'
        x1, y1 = self.coord_to_canvas(-16, 9)
        x2, y2 = self.coord_to_canvas(16, -9)
        self.canvas.create_rectangle(x1, y1, x2, y2, outline=screen_color, width=2)
        
        # 绘制中心十字
        cx, cy = self.coord_to_canvas(0, 0)
        cross_size = 10
        self.canvas.create_line(cx - cross_size, cy, cx + cross_size, cy, fill='#666', width=1)
        self.canvas.create_line(cx, cy - cross_size, cx, cy + cross_size, fill='#666', width=1)
        
        # 标题
        self.canvas.create_text(self.width / 2, 12, text=self.title, 
                               fill='#888', font=('Arial', 10, 'bold'))
    
    def draw_box(self, box: BoxState, is_final: bool = False):
        """绘制单个Box"""
        if not box.enable:
            return
        
        # 获取颜色
        color = self.BOX_COLORS[box.box_index] if not is_final else self.BOX_COLORS_DIM[box.box_index]
        
        # 计算Box的基本尺寸 (size=1 时为 32x18)
        base_width = box.size * self.SCREEN_WIDTH
        base_height = box.size * self.SCREEN_HEIGHT
        
        # 应用mask裁剪 (mask是相对于当前Box大小的比例)
        # mask值x对应横向裁切 x/32，y对应纵向裁切 y/18
        if box.mask_enable:
            total_left = (box.mask_left / 32) * base_width
            total_right = (box.mask_right / 32) * base_width
            total_top = (box.mask_top / 18) * base_height
            total_bottom = (box.mask_bottom / 18) * base_height
        else:
            total_left = total_right = total_top = total_bottom = 0
        
        # Box的实际可见宽高
        visible_width = base_width - total_left - total_right
        visible_height = base_height - total_top - total_bottom
        
        if visible_width <= 0 or visible_height <= 0:
            return  # Box被完全裁剪
        
        # Box中心位置
        center_x = box.x_position
        center_y = box.y_position
        
        # 可见区域的边界（坐标系中）
        box_left = center_x - base_width / 2 + total_left
        box_right = center_x + base_width / 2 - total_right
        box_top = center_y + base_height / 2 - total_top
        box_bottom = center_y - base_height / 2 + total_bottom
        
        # 转换为画布坐标
        canvas_x1, canvas_y1 = self.coord_to_canvas(box_left, box_top)
        canvas_x2, canvas_y2 = self.coord_to_canvas(box_right, box_bottom)
        
        # 绘制Box矩形
        if is_final:
            # 最终状态用虚线边框
            self.canvas.create_rectangle(
                canvas_x1, canvas_y1, canvas_x2, canvas_y2,
                outline=color, width=2, dash=(4, 4)
            )
        else:
            # 初始状态用实线边框和半透明填充
            self.canvas.create_rectangle(
                canvas_x1, canvas_y1, canvas_x2, canvas_y2,
                outline=color, width=2
            )
            self.canvas.create_rectangle(
                canvas_x1, canvas_y1, canvas_x2, canvas_y2,
                fill=color, stipple='gray25', outline=''
            )
        
        # 绘制Box标签
        label_x = (canvas_x1 + canvas_x2) / 2
        label_y = (canvas_y1 + canvas_y2) / 2
        label_text = f"Box {box.box_index}"
        
        # 显示Box信息
        info_text = f"S:{box.size:.2f}"
        self.canvas.create_text(label_x, label_y - 8, text=label_text, 
                               fill='white', font=('Arial', 9, 'bold'))
        self.canvas.create_text(label_x, label_y + 8, text=info_text, 
                               fill='white', font=('Arial', 8))
        
        # 绘制中心点
        cx, cy = self.coord_to_canvas(center_x, center_y)
        self.canvas.create_oval(cx - 3, cy - 3, cx + 3, cy + 3, 
                               fill='white', outline=color)
    
    def update_preview(self, states: Dict[int, BoxState]):
        """更新预览"""
        self.box_states = states
        self.redraw()
    
    def redraw(self):
        """重新绘制"""
        self.draw_grid()
        
        # 绘制所有Box
        for box_index, box in self.box_states.items():
            self.draw_box(box, is_final=False)
    
    def clear(self):
        """清空预览"""
        self.box_states = {}
        self.draw_grid()


# ============== GUI ==============

class SuperSourceTransitionGUI:
    """图形界面"""
    
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("SuperSource Transition XML Generator")
        self.root.geometry("1400x750")
        
        self.easing_categories = {
            "基础 (Basic)": ["linear", "ease_in", "ease_out", "ease_in_out"],
            "二次方 (Quadratic)": ["ease_in_quad", "ease_out_quad", "ease_in_out_quad"],
            "三次方 (Cubic)": ["ease_in_cubic", "ease_out_cubic", "ease_in_out_cubic"],
            "四次方 (Quartic)": ["ease_in_quart", "ease_out_quart", "ease_in_out_quart"],
            "五次方 (Quintic)": ["ease_in_quint", "ease_out_quint", "ease_in_out_quint"],
            "正弦 (Sine)": ["ease_in_sine", "ease_out_sine", "ease_in_out_sine"],
            "指数 (Exponential)": ["ease_in_expo", "ease_out_expo", "ease_in_out_expo"],
            "圆形 (Circular)": ["ease_in_circ", "ease_out_circ", "ease_in_out_circ"],
            "回弹 (Back)": ["ease_in_back", "ease_out_back", "ease_in_out_back"],
            "弹性 (Elastic)": ["ease_in_elastic", "ease_out_elastic", "ease_in_out_elastic"],
            "弹跳 (Bounce)": ["ease_in_bounce", "ease_out_bounce", "ease_in_out_bounce"],
        }
        
        self.setup_ui()
    
    def setup_ui(self):
        """设置UI"""
        # 主框架
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(0, weight=1)
        
        # ===== 左侧：输入和预览区域 =====
        left_frame = ttk.Frame(main_frame)
        left_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(0, 5))
        left_frame.columnconfigure(0, weight=1)
        left_frame.columnconfigure(1, weight=0)
        left_frame.rowconfigure(1, weight=1)
        left_frame.rowconfigure(4, weight=1)
        
        # --- 初始位置区域 ---
        init_label_frame = ttk.Frame(left_frame)
        init_label_frame.grid(row=0, column=0, columnspan=2, sticky=(tk.W, tk.E))
        ttk.Label(init_label_frame, text="初始位置 XML:", font=('Arial', 10, 'bold')).pack(side=tk.LEFT)
        
        # 初始位置按钮
        init_btn_frame = ttk.Frame(init_label_frame)
        init_btn_frame.pack(side=tk.RIGHT)
        ttk.Button(init_btn_frame, text="👁 预览", width=8, command=self.preview_initial).pack(side=tk.LEFT, padx=2)
        ttk.Button(init_btn_frame, text="🗑️ 清空", width=8, command=self.clear_initial).pack(side=tk.LEFT, padx=2)
        
        # 初始位置XML输入和预览
        self.initial_text = scrolledtext.ScrolledText(left_frame, width=50, height=8)
        self.initial_text.grid(row=1, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(5, 5))
        
        # 初始位置预览画布
        init_preview_frame = ttk.LabelFrame(left_frame, text="Initial Preview", padding="3")
        init_preview_frame.grid(row=1, column=1, sticky=(tk.N, tk.S, tk.E, tk.W), padx=(5, 0), pady=(5, 5))
        self.initial_preview = BoxPreviewCanvas(init_preview_frame, width=320, height=180, title="Initial Position")
        self.initial_preview.grid(row=0, column=0)
        self.initial_preview.draw_grid()
        
        # --- Swap按钮 ---
        swap_frame = ttk.Frame(left_frame)
        swap_frame.grid(row=2, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        ttk.Button(swap_frame, text="⇅ Swap Initial ↔ Final", command=self.swap_positions).pack()
        
        # --- 最终位置区域 ---
        final_label_frame = ttk.Frame(left_frame)
        final_label_frame.grid(row=3, column=0, columnspan=2, sticky=(tk.W, tk.E))
        ttk.Label(final_label_frame, text="最终位置 XML:", font=('Arial', 10, 'bold')).pack(side=tk.LEFT)
        
        # 最终位置按钮
        final_btn_frame = ttk.Frame(final_label_frame)
        final_btn_frame.pack(side=tk.RIGHT)
        ttk.Button(final_btn_frame, text="👁 预览", width=8, command=self.preview_final).pack(side=tk.LEFT, padx=2)
        ttk.Button(final_btn_frame, text="🗑️ 清空", width=8, command=self.clear_final).pack(side=tk.LEFT, padx=2)
        
        # 最终位置XML输入和预览
        self.final_text = scrolledtext.ScrolledText(left_frame, width=50, height=8)
        self.final_text.grid(row=4, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(5, 0))
        
        # 最终位置预览画布
        final_preview_frame = ttk.LabelFrame(left_frame, text="Final Preview", padding="3")
        final_preview_frame.grid(row=4, column=1, sticky=(tk.N, tk.S, tk.E, tk.W), padx=(5, 0), pady=(5, 0))
        self.final_preview = BoxPreviewCanvas(final_preview_frame, width=320, height=180, title="Final Position")
        self.final_preview.grid(row=0, column=0)
        self.final_preview.draw_grid()
        
        # ===== 右侧：参数和输出 =====
        right_frame = ttk.Frame(main_frame)
        right_frame.grid(row=0, column=1, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(5, 0))
        right_frame.columnconfigure(0, weight=1)
        right_frame.rowconfigure(2, weight=1)
        
        # 参数区域
        params_frame = ttk.LabelFrame(right_frame, text="参数", padding="5")
        params_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 5))
        
        # 帧数
        ttk.Label(params_frame, text="过渡帧数:").grid(row=0, column=0, sticky=tk.W, padx=5)
        self.frames_var = tk.StringVar(value="30")
        frames_entry = ttk.Entry(params_frame, textvariable=self.frames_var, width=10)
        frames_entry.grid(row=0, column=1, sticky=tk.W, padx=5)
        
        # 缓动曲线选择
        ttk.Label(params_frame, text="缓动曲线:").grid(row=0, column=2, sticky=tk.W, padx=(20, 5))
        
        # 缓动分类
        self.category_var = tk.StringVar()
        category_combo = ttk.Combobox(params_frame, textvariable=self.category_var, 
                                       values=list(self.easing_categories.keys()), width=18)
        category_combo.grid(row=0, column=3, sticky=tk.W, padx=5)
        category_combo.bind('<<ComboboxSelected>>', self.on_category_change)
        category_combo.current(0)
        
        # 具体缓动
        self.easing_var = tk.StringVar()
        self.easing_combo = ttk.Combobox(params_frame, textvariable=self.easing_var, width=18)
        self.easing_combo.grid(row=0, column=4, sticky=tk.W, padx=5)
        self.on_category_change(None)  # 初始化
        
        # 按钮区域
        buttons_frame = ttk.Frame(right_frame)
        buttons_frame.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=10)
        
        ttk.Button(buttons_frame, text="🔄 生成过渡", command=self.generate).pack(side=tk.LEFT, padx=3)
        ttk.Button(buttons_frame, text="💾 保存", command=self.save_file).pack(side=tk.LEFT, padx=3)
        ttk.Button(buttons_frame, text="📋 复制", command=self.copy_to_clipboard).pack(side=tk.LEFT, padx=3)
        ttk.Button(buttons_frame, text="🗑️ 全部清空", command=self.clear_all).pack(side=tk.LEFT, padx=3)
        ttk.Button(buttons_frame, text="📥 加载示例", command=self.load_sample).pack(side=tk.LEFT, padx=3)
        
        # 输出区域
        output_frame = ttk.LabelFrame(right_frame, text="输出预览", padding="5")
        output_frame.grid(row=2, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        output_frame.columnconfigure(0, weight=1)
        output_frame.rowconfigure(0, weight=1)
        
        self.output_text = scrolledtext.ScrolledText(output_frame, width=55, height=25)
        self.output_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 状态栏
        self.status_var = tk.StringVar(value="就绪 - 输入XML后点击预览按钮查看Box位置")
        status_bar = ttk.Label(main_frame, textvariable=self.status_var, relief=tk.SUNKEN, anchor=tk.W)
        status_bar.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(10, 0))
    
    def on_category_change(self, event):
        """缓动分类变化时更新具体选项"""
        category = self.category_var.get()
        if category in self.easing_categories:
            easings = self.easing_categories[category]
            self.easing_combo['values'] = easings
            self.easing_combo.current(0)
    
    def preview_initial(self):
        """预览初始位置"""
        initial_xml = self.initial_text.get("1.0", tk.END)
        if not initial_xml.strip():
            self.initial_preview.clear()
            self.status_var.set("初始位置为空")
            return
        
        try:
            initial_states = XMLParser.parse_ops(initial_xml)
            self.initial_preview.update_preview(initial_states)
            enabled_count = len([b for b in initial_states.values() if b.enable])
            self.status_var.set(f"✓ Initial: {enabled_count} 个启用的Box")
        except Exception as e:
            messagebox.showerror("错误", f"解析初始位置XML失败: {str(e)}")
    
    def preview_final(self):
        """预览最终位置"""
        final_xml = self.final_text.get("1.0", tk.END)
        if not final_xml.strip():
            self.final_preview.clear()
            self.status_var.set("最终位置为空")
            return
        
        try:
            final_states = XMLParser.parse_ops(final_xml)
            self.final_preview.update_preview(final_states)
            enabled_count = len([b for b in final_states.values() if b.enable])
            self.status_var.set(f"✓ Final: {enabled_count} 个启用的Box")
        except Exception as e:
            messagebox.showerror("错误", f"解析最终位置XML失败: {str(e)}")
    
    def clear_initial(self):
        """清空初始位置"""
        self.initial_text.delete("1.0", tk.END)
        self.initial_preview.clear()
        self.status_var.set("已清空初始位置")
    
    def clear_final(self):
        """清空最终位置"""
        self.final_text.delete("1.0", tk.END)
        self.final_preview.clear()
        self.status_var.set("已清空最终位置")
    
    def swap_positions(self):
        """交换初始和最终位置"""
        initial_content = self.initial_text.get("1.0", tk.END).strip()
        final_content = self.final_text.get("1.0", tk.END).strip()
        
        self.initial_text.delete("1.0", tk.END)
        self.final_text.delete("1.0", tk.END)
        
        if final_content:
            self.initial_text.insert("1.0", final_content)
        if initial_content:
            self.final_text.insert("1.0", initial_content)
        
        # 自动刷新预览
        self.preview_initial()
        self.preview_final()
        self.status_var.set("✓ 已交换 Initial ↔ Final")
    
    def parse_easing_type(self, easing_str: str) -> EasingType:
        """解析缓动类型"""
        easing_map = {
            "linear": EasingType.LINEAR,
            "ease_in": EasingType.EASE_IN,
            "ease_out": EasingType.EASE_OUT,
            "ease_in_out": EasingType.EASE_IN_OUT,
            "ease_in_quad": EasingType.EASE_IN_QUAD,
            "ease_out_quad": EasingType.EASE_OUT_QUAD,
            "ease_in_out_quad": EasingType.EASE_IN_OUT_QUAD,
            "ease_in_cubic": EasingType.EASE_IN_CUBIC,
            "ease_out_cubic": EasingType.EASE_OUT_CUBIC,
            "ease_in_out_cubic": EasingType.EASE_IN_OUT_CUBIC,
            "ease_in_quart": EasingType.EASE_IN_QUART,
            "ease_out_quart": EasingType.EASE_OUT_QUART,
            "ease_in_out_quart": EasingType.EASE_IN_OUT_QUART,
            "ease_in_quint": EasingType.EASE_IN_QUINT,
            "ease_out_quint": EasingType.EASE_OUT_QUINT,
            "ease_in_out_quint": EasingType.EASE_IN_OUT_QUINT,
            "ease_in_sine": EasingType.EASE_IN_SINE,
            "ease_out_sine": EasingType.EASE_OUT_SINE,
            "ease_in_out_sine": EasingType.EASE_IN_OUT_SINE,
            "ease_in_expo": EasingType.EASE_IN_EXPO,
            "ease_out_expo": EasingType.EASE_OUT_EXPO,
            "ease_in_out_expo": EasingType.EASE_IN_OUT_EXPO,
            "ease_in_circ": EasingType.EASE_IN_CIRC,
            "ease_out_circ": EasingType.EASE_OUT_CIRC,
            "ease_in_out_circ": EasingType.EASE_IN_OUT_CIRC,
            "ease_in_back": EasingType.EASE_IN_BACK,
            "ease_out_back": EasingType.EASE_OUT_BACK,
            "ease_in_out_back": EasingType.EASE_IN_OUT_BACK,
            "ease_in_elastic": EasingType.EASE_IN_ELASTIC,
            "ease_out_elastic": EasingType.EASE_OUT_ELASTIC,
            "ease_in_out_elastic": EasingType.EASE_IN_OUT_ELASTIC,
            "ease_in_bounce": EasingType.EASE_IN_BOUNCE,
            "ease_out_bounce": EasingType.EASE_OUT_BOUNCE,
            "ease_in_out_bounce": EasingType.EASE_IN_OUT_BOUNCE,
        }
        return easing_map.get(easing_str.lower(), EasingType.LINEAR)
    
    def generate(self):
        """生成过渡XML"""
        try:
            initial_xml = self.initial_text.get("1.0", tk.END)
            final_xml = self.final_text.get("1.0", tk.END)
            
            if not initial_xml.strip() or not final_xml.strip():
                messagebox.showwarning("警告", "请输入初始位置和最终位置的XML")
                return
            
            frames = int(self.frames_var.get())
            if frames <= 0:
                messagebox.showwarning("警告", "帧数必须大于0")
                return
            
            easing_str = self.easing_var.get()
            easing_type = self.parse_easing_type(easing_str)
            
            initial_states = XMLParser.parse_ops(initial_xml)
            final_states = XMLParser.parse_ops(final_xml)
            
            generator = TransitionGenerator(initial_states, final_states, frames, easing_type)
            output = generator.generate()
            
            self.output_text.delete("1.0", tk.END)
            self.output_text.insert("1.0", output)
            
            animating_boxes = [i for i in range(4) if generator.should_box_animate(i)]
            self.status_var.set(f"✓ 已生成 | 帧数: {frames} | 缓动: {easing_str} | 活动Box: {animating_boxes}")
            
        except Exception as e:
            messagebox.showerror("错误", f"生成失败: {str(e)}")
            self.status_var.set(f"✗ 错误: {str(e)}")
    
    def save_file(self):
        """保存到文件"""
        content = self.output_text.get("1.0", tk.END).strip()
        if not content:
            messagebox.showwarning("警告", "没有内容可保存")
            return
        
        file_path = filedialog.asksaveasfilename(
            defaultextension=".xml",
            filetypes=[("XML文件", "*.xml"), ("所有文件", "*.*")],
            initialfile="transition_output.xml"
        )
        
        if file_path:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            self.status_var.set(f"✓ 已保存: {file_path}")
    
    def copy_to_clipboard(self):
        """复制到剪贴板"""
        content = self.output_text.get("1.0", tk.END).strip()
        if content:
            self.root.clipboard_clear()
            self.root.clipboard_append(content)
            self.status_var.set("✓ 已复制到剪贴板")
    
    def clear_all(self):
        """清空所有"""
        self.initial_text.delete("1.0", tk.END)
        self.final_text.delete("1.0", tk.END)
        self.output_text.delete("1.0", tk.END)
        self.initial_preview.clear()
        self.final_preview.clear()
        self.status_var.set("已清空所有内容")
    
    def load_sample(self):
        """加载示例数据"""
        initial_sample = '''<Op id="SuperSourceV2BoxEnable" superSource="0" boxIndex="0" enable="True" />
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
<Op id="SuperSourceV2BoxEnable" superSource="0" boxIndex="3" enable="False" />'''
        
        final_sample = '''<!-- Initial Enable States -->
<Op id="SuperSourceV2BoxEnable" superSource="0" boxIndex="0" enable="True" />
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
<Op id="SuperSourceV2BoxMaskBottom" superSource="0" boxIndex="0" bottom="0.00"/>'''
        
        self.initial_text.delete("1.0", tk.END)
        self.initial_text.insert("1.0", initial_sample)
        
        self.final_text.delete("1.0", tk.END)
        self.final_text.insert("1.0", final_sample)
        
        self.preview_initial()
        self.preview_final()
        self.status_var.set("✓ 已加载示例数据")
    
    def run(self):
        """运行GUI"""
        self.root.mainloop()

if __name__ == "__main__":
    app = SuperSourceTransitionGUI()
    app.run()
