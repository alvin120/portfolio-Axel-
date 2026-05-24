from PIL import Image
import os

filepath = r"C:\Users\Axel\OneDrive\Bureau\Axel site\portfolio Axel\img\image1.jpg"
original_size = os.path.getsize(filepath) / 1024

print(f"Image: image1.jpg (Galette Fromage)")
print(f"Taille avant: {original_size:.1f} KB")

img = Image.open(filepath)
print(f"Dimensions avant: {img.size[0]}x{img.size[1]}px")

# Redimensionner si > 1200px
if img.size[0] > 1200:
    ratio = 1200 / img.size[0]
    new_height = int(img.size[1] * ratio)
    img = img.resize((1200, new_height), Image.Resampling.LANCZOS)
    print(f"Dimensions après: {img.size[0]}x{img.size[1]}px")

# Optimiser
img.save(filepath, quality=72, optimize=True)
new_size = os.path.getsize(filepath) / 1024
reduction = ((original_size - new_size) / original_size * 100)

print(f"Taille après: {new_size:.1f} KB")
print(f"Réduction: {reduction:.1f}%")
print("✓ Image optimisée!")
