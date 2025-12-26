#!/usr/bin/env python3
"""
Zonaprop Scraper & Analyzer
Script principal para scrapear y analizar propiedades de Zonaprop
"""

import argparse
import json
import os
from rich.console import Console
from scraper import ZonapropScraper
from analyzer import PropertyAnalyzer
import config

console = Console()


def main():
    """Función principal"""
    parser = argparse.ArgumentParser(
        description='Web Scraper y Analizador de Propiedades de Zonaprop',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos de uso:
  # Buscar departamentos en venta en Capital Federal (primeras 3 páginas)
  python main.py -l capital-federal -t departamentos -o venta -p 3

  # Buscar casas en alquiler en Palermo (primeras 5 páginas)
  python main.py -l palermo -t casas -o alquiler -p 5

  # Analizar datos existentes sin scrapear de nuevo
  python main.py --analyze-only

  # Scrapear y exportar a Excel
  python main.py -l belgrano -p 2 --excel
        """
    )

    parser.add_argument(
        '-l', '--location',
        type=str,
        default=config.DEFAULT_LOCATION,
        help=f'Ubicación de búsqueda (default: {config.DEFAULT_LOCATION})'
    )

    parser.add_argument(
        '-t', '--type',
        type=str,
        default=config.DEFAULT_PROPERTY_TYPE,
        help=f'Tipo de propiedad: departamentos, casas, terrenos (default: {config.DEFAULT_PROPERTY_TYPE})'
    )

    parser.add_argument(
        '-o', '--operation',
        type=str,
        default=config.DEFAULT_OPERATION,
        help=f'Tipo de operación: venta, alquiler (default: {config.DEFAULT_OPERATION})'
    )

    parser.add_argument(
        '-p', '--pages',
        type=int,
        default=config.MAX_PAGES,
        help=f'Número máximo de páginas a scrapear (default: {config.MAX_PAGES})'
    )

    parser.add_argument(
        '--json',
        type=str,
        default='propiedades.json',
        help='Nombre del archivo JSON de salida (default: propiedades.json)'
    )

    parser.add_argument(
        '--csv',
        action='store_true',
        help='Exportar resultados a CSV'
    )

    parser.add_argument(
        '--excel',
        action='store_true',
        help='Exportar resultados a Excel'
    )

    parser.add_argument(
        '--analyze-only',
        action='store_true',
        help='Solo analizar datos existentes sin scrapear'
    )

    parser.add_argument(
        '--no-analysis',
        action='store_true',
        help='Solo scrapear sin analizar datos'
    )

    parser.add_argument(
        '--top',
        type=int,
        default=10,
        help='Número de mejores propiedades a mostrar (default: 10)'
    )

    args = parser.parse_args()

    # Banner
    console.print("\n[bold blue]═══════════════════════════════════════════════[/bold blue]")
    console.print("[bold cyan]    Zonaprop Scraper & Analyzer    [/bold cyan]")
    console.print("[bold blue]═══════════════════════════════════════════════[/bold blue]\n")

    properties = []

    # Fase 1: Scraping
    if not args.analyze_only:
        scraper = ZonapropScraper(
            location=args.location,
            property_type=args.type,
            operation=args.operation
        )

        properties = scraper.scrape(max_pages=args.pages)

        if properties:
            scraper.save_to_json(args.json)
        else:
            console.print("[red]No se encontraron propiedades. Verifica los parámetros de búsqueda.[/red]")
            return

    # Fase 2: Análisis
    if not args.no_analysis:
        # Si no scrapeamos, cargar desde JSON
        if args.analyze_only:
            json_path = os.path.join(config.OUTPUT_DIR, args.json)
            if not os.path.exists(json_path):
                console.print(f"[red]Error: No se encontró el archivo {json_path}[/red]")
                console.print("[yellow]Primero ejecuta el scraper sin --analyze-only[/yellow]")
                return

            with open(json_path, 'r', encoding='utf-8') as f:
                properties = json.load(f)

            console.print(f"[green]✓ Cargadas {len(properties)} propiedades desde {json_path}[/green]\n")

        if properties:
            analyzer = PropertyAnalyzer(properties)
            analyzer.process_data()
            analyzer.display_statistics()
            analyzer.display_top_properties(args.top)

            # Exportar según opciones
            if args.csv:
                analyzer.export_to_csv()

            if args.excel:
                analyzer.export_to_excel()

    console.print("\n[bold green]✓ Proceso completado exitosamente[/bold green]\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[yellow]Proceso interrumpido por el usuario[/yellow]")
    except Exception as e:
        console.print(f"\n[red]Error: {e}[/red]")
        import traceback
        console.print(f"[dim]{traceback.format_exc()}[/dim]")
