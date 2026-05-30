@echo off
title SysNerIA 3D Viewer
cd /d "%~dp0"

echo.
echo  ============================================
echo    SysNerIA - Visor 3D
echo    Servidor local iniciado...
echo  ============================================
echo.
echo  Abriendo navegador en http://localhost:8080
echo.
echo  Para cerrar, cierra esta ventana.
echo.

:: Abrir navegador
start http://localhost:8080

:: Iniciar servidor Python
python -m http.server 8080

pause
