#!/usr/bin/env python3
from PIL import Image
import os
import json

img_dir = r"C:\Users\Axel\OneDrive\Bureau\Axel site\portfolio Axel\img"
quality = 75
max_width = 1920

print("=== Image Optimization Started ===\n")

for filename in os.listdir(img_dir):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        filepath = os.path.join(img_dir, filename)
        original_size = os.path.getsize(filepath) / 1024
        
        try:
            img = Image.open(filepath)
            width, height = img.size
            
            # Redimensionner si trop grande
            if width > max_width:
                ratio = max_width / width
                new_height = int(height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Sauvegarder optimisée
            img.save(filepath, quality=quality, optimize=True)
            new_size = os.path.getsize(filepath) / 1024
            reduction = ((original_size - new_size) / original_size * 100)
            
            print(f"✓ {filename}")
            print(f"  Avant: {original_size:.1f} KB | Après: {new_size:.1f} KB | Réduction: {reduction:.1f}%\n")
        
        except Exception as e:
            print(f"✗ {filename}: {str(e)}\n")

print("=== Optimization Complete ===")
