#!/usr/bin/env python3
"""
Script d'optimisation des images avec rapport détaillé
"""

from PIL import Image
import os
import sys

img_dir = r"C:\Users\Axel\OneDrive\Bureau\Axel site\portfolio Axel\img"
quality = 75
max_width = 1920

# Statistiques
total_files = 0
total_original_size = 0
total_new_size = 0
successful_files = []
failed_files = []

print("=" * 60)
print("   OPTIMISATION DES IMAGES - RAPPORT DÉTAILLÉ")
print("=" * 60)
print(f"\nRépertoire: {img_dir}")
print(f"Qualité cible: {quality}")
print(f"Largeur maximale: {max_width}px")
print("\n" + "-" * 60)
print("RÉSULTATS DE L'OPTIMISATION")
print("-" * 60 + "\n")

try:
    files = sorted([f for f in os.listdir(img_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
    
    if not files:
        print("❌ Aucun fichier image trouvé!")
        sys.exit(1)
    
    for filename in files:
        filepath = os.path.join(img_dir, filename)
        
        try:
            original_size = os.path.getsize(filepath) / 1024
            total_files += 1
            total_original_size += original_size
            
            # Ouvrir l'image
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
            
            total_new_size += new_size
            
            print(f"✅ {filename}")
            print(f"   Avant: {original_size:>8.1f} KB")
            print(f"   Après: {new_size:>8.1f} KB")
            print(f"   Réduction: {reduction:>6.1f}% ({original_size - new_size:.1f} KB)")
            print()
            
            successful_files.append({
                'name': filename,
                'before': original_size,
                'after': new_size,
                'reduction': reduction
            })
        
        except Exception as e:
            print(f"❌ {filename}")
            print(f"   Erreur: {str(e)}\n")
            failed_files.append({'name': filename, 'error': str(e)})

except Exception as e:
    print(f"ERREUR FATALE: {str(e)}")
    sys.exit(1)

# Afficher le résumé
print("=" * 60)
print("RÉSUMÉ GÉNÉRAL")
print("=" * 60)
print(f"\nFichiers traités avec succès: {len(successful_files)}")
print(f"Fichiers échoués: {len(failed_files)}")
print(f"Total fichiers: {total_files}")

if total_files > 0 and total_original_size > 0:
    print(f"\nTaille totale AVANT: {total_original_size:,.1f} KB ({total_original_size/1024:.2f} MB)")
    print(f"Taille totale APRÈS: {total_new_size:,.1f} KB ({total_new_size/1024:.2f} MB)")
    total_reduction = total_original_size - total_new_size
    total_reduction_percent = (total_reduction / total_original_size * 100)
    print(f"Réduction totale: {total_reduction:,.1f} KB ({total_reduction_percent:.1f}%)")

if failed_files:
    print("\n" + "-" * 60)
    print("FICHIERS AVEC ERREURS:")
    print("-" * 60)
    for item in failed_files:
        print(f"❌ {item['name']}: {item['error']}")

print("\n" + "=" * 60)
print("   ✅ OPTIMISATION TERMINÉE")
print("=" * 60)
