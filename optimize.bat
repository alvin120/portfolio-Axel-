@echo off
REM Script pour optimiser les images JPG
setlocal enabledelayedexpansion

cd /d "C:\Users\Axel\OneDrive\Bureau\Axel site\portfolio Axel\img"

echo === Optimisation des images ===
echo.

for %%f in (*.jpg) do (
    echo Optimisation de %%f...
    REM Utiliser ImageMagick si disponible
    magick convert "%%f" -quality 75 -strip "%%f.tmp" && move /Y "%%f.tmp" "%%f"
    if not exist "%%f.tmp" (
        echo ✓ %%f optimisée
    ) else (
        echo ✗ Erreur avec %%f
    )
)

echo.
echo === Terminé ===
pause
