@echo off
title SysNerIA 3D Viewer
cd /d "%~dp0"

echo.
echo  ============================================
echo    SysNerIA - Visor 3D
echo  ============================================
echo.

:: Comprobar si el puerto 8080 ya está en uso
netstat -an | find ":8080" >nul 2>&1
if %errorlevel% equ 0 (
    echo  [i] Puerto 8080 ya activo — conectando...
    echo.
    start http://localhost:8080
    goto :end
)

:: Si no está en uso, iniciar servidor
echo  [*] Iniciando servidor en http://localhost:8080
echo.
echo  Para cerrar, cierra esta ventana.
echo.
start http://localhost:8080
python -m http.server 8080

:end
echo.
echo  Pulse cualquier tecla para salir...
pause >nul
