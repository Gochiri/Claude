#!/usr/bin/env python3
"""
Script de verificación de configuración
Valida que todo esté correctamente instalado y configurado
"""

import os
import sys
from pathlib import Path
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

console = Console()


def check_python_version():
    """Verifica la versión de Python"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        return True, f"Python {version.major}.{version.minor}.{version.micro}"
    return False, f"Python {version.major}.{version.minor}.{version.micro} (se requiere 3.8+)"


def check_dependencies():
    """Verifica que todas las dependencias estén instaladas"""
    dependencies = {
        'requests': 'requests',
        'beautifulsoup4': 'bs4',
        'pandas': 'pandas',
        'lxml': 'lxml',
        'python-dotenv': 'dotenv',
        'rich': 'rich',
        'openpyxl': 'openpyxl'
    }

    results = {}
    for package_name, import_name in dependencies.items():
        try:
            __import__(import_name)
            results[package_name] = (True, "✓ Instalado")
        except ImportError:
            results[package_name] = (False, "✗ No instalado")

    return results


def check_env_file():
    """Verifica que el archivo .env exista y tenga contenido"""
    env_path = Path('.env')

    if not env_path.exists():
        return False, "✗ Archivo .env no existe", {}

    # Leer variables del .env
    from dotenv import dotenv_values
    env_vars = dotenv_values('.env')

    if not env_vars:
        return False, "✗ Archivo .env existe pero está vacío", {}

    return True, f"✓ Archivo .env existe ({len(env_vars)} variables)", env_vars


def check_scraping_services():
    """Verifica qué servicios de scraping están configurados"""
    from dotenv import load_dotenv
    load_dotenv()

    services = {
        'ScraperAPI': os.getenv('SCRAPERAPI_KEY'),
        'Bright Data': os.getenv('BRIGHTDATA_USERNAME') and os.getenv('BRIGHTDATA_PASSWORD'),
        'Apify': os.getenv('APIFY_TOKEN')
    }

    return services


def check_project_structure():
    """Verifica que todos los archivos necesarios existan"""
    required_files = [
        'config.py',
        'scraper.py',
        'scraper_pro.py',
        'scraping_services.py',
        'analyzer.py',
        'property_filter.py',
        'html_generator.py',
        'ai_assistant_interface.py',
        'requirements.txt'
    ]

    results = {}
    for filename in required_files:
        path = Path(filename)
        results[filename] = path.exists()

    return results


def test_scraping_service(service_name):
    """Prueba un servicio de scraping con una URL simple"""
    from scraping_services import get_scraper_client

    # URL de prueba (no de Zonaprop para no gastar créditos)
    test_url = "http://httpbin.org/html"

    try:
        console.print(f"\n[cyan]Probando {service_name}...[/cyan]")
        client = get_scraper_client(service_name.lower().replace(' ', ''))

        if hasattr(client, 'get'):
            response = client.get(test_url)
            if response.status_code == 200:
                console.print(f"[green]✓ {service_name} funciona correctamente[/green]")
                return True
        elif hasattr(client, 'scrape_url'):
            html = client.scrape_url(test_url)
            if html:
                console.print(f"[green]✓ {service_name} funciona correctamente[/green]")
                return True

        console.print(f"[yellow]⚠ {service_name} respondió pero sin contenido[/yellow]")
        return False

    except Exception as e:
        console.print(f"[red]✗ Error en {service_name}: {e}[/red]")
        return False


def main():
    console.print("\n")
    console.print(Panel.fit(
        "[bold blue]Verificador de Configuración - Zonaprop Scraper[/bold blue]\n"
        "Validando instalación y configuración...",
        border_style="blue"
    ))
    console.print("\n")

    # 1. Verificar versión de Python
    console.print("[bold]1. Versión de Python[/bold]")
    py_ok, py_version = check_python_version()
    if py_ok:
        console.print(f"   [green]✓ {py_version}[/green]\n")
    else:
        console.print(f"   [red]✗ {py_version}[/red]\n")
        console.print("[red]Error: Se requiere Python 3.8 o superior[/red]")
        return

    # 2. Verificar dependencias
    console.print("[bold]2. Dependencias de Python[/bold]")
    deps = check_dependencies()

    table = Table(show_header=True, header_style="bold cyan")
    table.add_column("Paquete", style="dim")
    table.add_column("Estado")

    all_installed = True
    for package, (installed, status) in deps.items():
        if installed:
            table.add_row(package, f"[green]{status}[/green]")
        else:
            table.add_row(package, f"[red]{status}[/red]")
            all_installed = False

    console.print(table)
    console.print()

    if not all_installed:
        console.print("[yellow]⚠ Faltan dependencias. Ejecuta:[/yellow]")
        console.print("[cyan]pip install -r requirements.txt[/cyan]\n")

    # 3. Verificar estructura del proyecto
    console.print("[bold]3. Archivos del Proyecto[/bold]")
    files = check_project_structure()

    missing_files = [f for f, exists in files.items() if not exists]
    if missing_files:
        console.print(f"   [red]✗ Faltan {len(missing_files)} archivos:[/red]")
        for f in missing_files:
            console.print(f"     - {f}")
    else:
        console.print(f"   [green]✓ Todos los archivos necesarios están presentes ({len(files)} archivos)[/green]")
    console.print()

    # 4. Verificar archivo .env
    console.print("[bold]4. Configuración (.env)[/bold]")
    env_ok, env_msg, env_vars = check_env_file()

    if env_ok:
        console.print(f"   [green]{env_msg}[/green]")
    else:
        console.print(f"   [yellow]{env_msg}[/yellow]")
        console.print("\n   [yellow]Para crear el archivo .env:[/yellow]")
        console.print("   [cyan]Windows:[/cyan] copy .env.example .env")
        console.print("   [cyan]Linux/Mac:[/cyan] cp .env.example .env")
        console.print("\n   Luego edita .env y agrega tus API keys\n")

    console.print()

    # 5. Verificar servicios de scraping
    console.print("[bold]5. Servicios de Scraping[/bold]")
    services = check_scraping_services()

    configured_services = []
    for service, configured in services.items():
        if configured:
            console.print(f"   [green]✓ {service} configurado[/green]")
            configured_services.append(service)
        else:
            console.print(f"   [dim]○ {service} no configurado[/dim]")

    console.print()

    if not configured_services:
        console.print("[yellow]⚠ No hay servicios de scraping configurados[/yellow]")
        console.print("\n[bold]Para configurar un servicio:[/bold]")
        console.print("1. Regístrate en uno de estos servicios:")
        console.print("   • ScraperAPI: https://www.scraperapi.com/signup (5K gratis/mes)")
        console.print("   • Apify: https://console.apify.com/sign-up ($5 gratis/mes)")
        console.print("   • Bright Data: https://brightdata.com/cp/start (trial 7 días)")
        console.print("\n2. Obtén tu API key/token")
        console.print("3. Agrégala al archivo .env")
        console.print()
    else:
        # Preguntar si quiere probar los servicios
        console.print(f"[bold green]✓ {len(configured_services)} servicio(s) configurado(s)[/bold green]\n")

        test = console.input("¿Deseas probar los servicios configurados? (s/n): ")
        if test.lower() in ['s', 'si', 'y', 'yes']:
            console.print()
            for service in configured_services:
                service_key = service.lower().replace(' ', '')
                test_scraping_service(service_key)

    # Resumen final
    console.print("\n")
    console.print("─" * 60)
    console.print("\n[bold]Resumen:[/bold]")

    if py_ok and all_installed and not missing_files:
        if configured_services:
            console.print("[bold green]✓ Sistema listo para usar[/bold green]")
            console.print("\n[bold]Comandos para empezar:[/bold]")
            console.print("\n1. Scrapear propiedades:")
            console.print(f"   [cyan]python scraper_pro.py -l palermo -t departamentos -o venta -p 2 --service {configured_services[0].lower().replace(' ', '')}[/cyan]")
            console.print("\n2. Usar el asistente IA:")
            console.print(f"   [cyan]python ai_assistant_interface.py --min-price 200000 --max-price 350000 --neighborhoods Palermo --business-name \"Tu Inmobiliaria\" --service {configured_services[0].lower().replace(' ', '')}[/cyan]")
        else:
            console.print("[yellow]⚠ Falta configurar un servicio de scraping[/yellow]")
            console.print("   Ver documentación: INICIO_RAPIDO_WINDOWS.md")
    else:
        console.print("[red]✗ Hay problemas que resolver[/red]")
        if not all_installed:
            console.print("   - Instalar dependencias faltantes")
        if missing_files:
            console.print("   - Archivos del proyecto faltantes")

    console.print()


if __name__ == "__main__":
    main()
