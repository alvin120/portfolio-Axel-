#!/usr/bin/env python3
"""
Script pour analyser les tailles actuelles des images et simuler l'optimisation
"""
from PIL import Image
import os

img_dir = r"C:\Users\Axel\OneDrive\Bureau\Axel site\portfolio Axel\img"
quality = 75

print("=" * 70)
print("ANALYSE DES IMAGES - SIMULATION D'OPTIMISATION")
print("=" * 70)
print(f"\nRépertoire: {img_dir}")
print(f"Qualité cible: {quality}")
print("\n" + "-" * 70)

files = sorted([f for f in os.listdir(img_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])

total_original = 0
total_after = 0

print(f"{'Fichier':<25} {'Avant':<12} {'Dimens.':<15} {'Statut':<10}")
print("-" * 70)

for filename in files:
    filepath = os.path.join(img_dir, filename)
    
    try:
        size_kb = os.path.getsize(filepath) / 1024
        total_original += size_kb
        
        img = Image.open(filepath)
        width, height = img.size
        
        # Estimer la réduction (généralement 20-40% avec qualité 75)
        estimated_reduction = 0.30  # estimation conservatrice
        estimated_after = size_kb * (1 - estimated_reduction)
        total_after += estimated_after
        
        print(f"{filename:<25} {size_kb:>8.1f} KB  {width}x{height:<10} ✓ OK")
        
    except Exception as e:
        print(f"{filename:<25} {'ERROR':<12} {str(e):<15} ✗")

print("-" * 70)
print(f"\n{'TOTAL':<25} {total_original:>8.1f} KB")
print(f"Après optimisation (est.): {total_after:>8.1f} KB")
print(f"Réduction estimée: {(total_original - total_after)/1024:>6.2f} MB ({((total_original-total_after)/total_original*100):>5.1f}%)")
print("\n" + "=" * 70)
