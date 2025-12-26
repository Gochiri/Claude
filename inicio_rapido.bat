@echo off
REM =========================================================
REM Script de Inicio Rápido - Zonaprop Scraper (Windows)
REM =========================================================

echo.
echo ========================================
echo  Zonaprop Scraper - Menu Principal
echo ========================================
echo.

:MENU
echo Selecciona una opcion:
echo.
echo [1] Verificar configuracion del sistema
echo [2] Crear archivo .env desde plantilla
echo [3] Instalar dependencias
echo [4] Scrapear propiedades (modo rapido)
echo [5] Usar Asistente IA (modo interactivo)
echo [6] Ver documentacion
echo [7] Salir
echo.

set /p option="Ingresa el numero de opcion: "

if "%option%"=="1" goto VERIFICAR
if "%option%"=="2" goto CREAR_ENV
if "%option%"=="3" goto INSTALAR
if "%option%"=="4" goto SCRAPEAR
if "%option%"=="5" goto ASISTENTE
if "%option%"=="6" goto DOCUMENTACION
if "%option%"=="7" goto SALIR

echo Opcion invalida. Intenta de nuevo.
echo.
goto MENU

:VERIFICAR
echo.
echo Verificando configuracion...
python setup_verificador.py
echo.
pause
goto MENU

:CREAR_ENV
echo.
echo Creando archivo .env desde .env.example...

if exist .env (
    echo ADVERTENCIA: El archivo .env ya existe.
    set /p overwrite="¿Deseas sobrescribirlo? (s/n): "
    if /i not "%overwrite%"=="s" goto MENU
)

copy .env.example .env
echo.
echo Archivo .env creado exitosamente.
echo.
echo IMPORTANTE: Ahora debes editar el archivo .env y agregar tus API keys.
echo Para editarlo, ejecuta: notepad .env
echo.
set /p edit="¿Deseas editar el archivo ahora? (s/n): "
if /i "%edit%"=="s" notepad .env
echo.
pause
goto MENU

:INSTALAR
echo.
echo Instalando dependencias desde requirements.txt...
pip install -r requirements.txt
echo.
echo Instalacion completada.
echo.
pause
goto MENU

:SCRAPEAR
echo.
echo ========================================
echo  Scrapear Propiedades
echo ========================================
echo.

REM Solicitar parametros
set /p location="Ubicacion (ej: palermo, belgrano, capital-federal): "
if "%location%"=="" set location=capital-federal

set /p prop_type="Tipo de propiedad (departamentos/casas/ph): "
if "%prop_type%"=="" set prop_type=departamentos

set /p operation="Operacion (venta/alquiler): "
if "%operation%"=="" set operation=venta

set /p pages="Numero de paginas a scrapear (1-10): "
if "%pages%"=="" set pages=3

echo.
echo Servicios disponibles:
echo [1] ScraperAPI (recomendado)
echo [2] Apify
echo [3] Bright Data
echo [4] Directo (puede fallar por proxy)
echo.
set /p service_opt="Selecciona servicio (1-4): "

if "%service_opt%"=="1" set service=scraperapi
if "%service_opt%"=="2" set service=apify
if "%service_opt%"=="3" set service=brightdata
if "%service_opt%"=="4" set service=direct

if "%service%"=="" set service=scraperapi

echo.
echo Ejecutando scraper con los siguientes parametros:
echo   Ubicacion: %location%
echo   Tipo: %prop_type%
echo   Operacion: %operation%
echo   Paginas: %pages%
echo   Servicio: %service%
echo.
echo Esto puede tardar varios segundos por pagina...
echo.

python scraper_pro.py -l %location% -t %prop_type% -o %operation% -p %pages% --service %service%

echo.
echo Scraping completado. Los resultados se guardaron en: resultados\propiedades.json
echo.
pause
goto MENU

:ASISTENTE
echo.
echo ========================================
echo  Asistente IA - Busqueda Personalizada
echo ========================================
echo.

REM Solicitar criterios de busqueda
set /p min_price="Precio minimo (USD): "
if "%min_price%"=="" set min_price=0

set /p max_price="Precio maximo (USD): "
if "%max_price%"=="" set max_price=999999999

set /p min_rooms="Habitaciones minimas: "
if "%min_rooms%"=="" set min_rooms=1

set /p max_rooms="Habitaciones maximas: "
if "%max_rooms%"=="" set max_rooms=10

set /p neighborhoods="Barrios (separados por espacios, ej: Palermo Belgrano): "
if "%neighborhoods%"=="" set neighborhoods=Palermo

echo.
REM Solicitar datos del negocio
set /p business_name="Nombre de tu negocio/inmobiliaria: "
if "%business_name%"=="" set business_name=Inmobiliaria Premium

set /p business_phone="Telefono de contacto: "
if "%business_phone%"=="" set business_phone=+54 11 1234-5678

set /p business_email="Email de contacto: "
if "%business_email%"=="" set business_email=contacto@inmobiliaria.com

echo.
echo Servicios disponibles:
echo [1] ScraperAPI (recomendado)
echo [2] Apify
echo [3] Bright Data
echo.
set /p service_opt="Selecciona servicio (1-3): "

if "%service_opt%"=="1" set service=scraperapi
if "%service_opt%"=="2" set service=apify
if "%service_opt%"=="3" set service=brightdata

if "%service%"=="" set service=scraperapi

echo.
echo Generando reporte personalizado...
echo Esto puede tardar varios minutos...
echo.

python ai_assistant_interface.py ^
    --min-price %min_price% ^
    --max-price %max_price% ^
    --min-rooms %min_rooms% ^
    --max-rooms %max_rooms% ^
    --neighborhoods %neighborhoods% ^
    --business-name "%business_name%" ^
    --business-phone "%business_phone%" ^
    --business-email "%business_email%" ^
    --service %service%

echo.
set /p open_html="¿Deseas abrir el HTML generado? (s/n): "
if /i "%open_html%"=="s" start resultados\propiedades_presentacion.html

echo.
pause
goto MENU

:DOCUMENTACION
echo.
echo ========================================
echo  Documentacion Disponible
echo ========================================
echo.
echo [1] README.md - Introduccion general
echo [2] INICIO_RAPIDO_WINDOWS.md - Guia para Windows
echo [3] SERVICIOS_SCRAPING.md - Servicios profesionales
echo [4] GUIA_CLIENTE.md - Guia de uso para clientes
echo [5] Volver al menu
echo.

set /p doc_opt="Selecciona documento (1-5): "

if "%doc_opt%"=="1" start README.md
if "%doc_opt%"=="2" start INICIO_RAPIDO_WINDOWS.md
if "%doc_opt%"=="3" start SERVICIOS_SCRAPING.md
if "%doc_opt%"=="4" start GUIA_CLIENTE.md
if "%doc_opt%"=="5" goto MENU

echo.
pause
goto MENU

:SALIR
echo.
echo Gracias por usar Zonaprop Scraper!
echo.
exit /b

REM =========================================================
REM Fin del script
REM =========================================================
