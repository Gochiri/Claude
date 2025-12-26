#!/usr/bin/env python3
"""
Script de demostración del Zonaprop Scraper & Analyzer
Muestra el uso de las clases principales
"""

from rich.console import Console
from analyzer import PropertyAnalyzer
import json
import os
import config

console = Console()


def demo_analyzer():
    """Demo del analizador con datos de ejemplo"""

    console.print("\n[bold cyan]═══ DEMO: Analizador de Propiedades ═══[/bold cyan]\n")

    # Cargar datos de ejemplo
    json_path = os.path.join(config.OUTPUT_DIR, "propiedades.json")

    if not os.path.exists(json_path):
        console.print(f"[red]Error: No se encontró {json_path}[/red]")
        console.print("[yellow]Primero ejecuta: python main.py[/yellow]")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        properties = json.load(f)

    console.print(f"[green]✓ Cargadas {len(properties)} propiedades[/green]\n")

    # Crear analizador
    analyzer = PropertyAnalyzer(properties)
    analyzer.process_data()

    # Mostrar estadísticas
    console.print("[bold]1️⃣  Estadísticas Generales[/bold]")
    analyzer.display_statistics()

    # Top 5 mejor precio/m²
    console.print("[bold]2️⃣  Top 5 Mejor Precio/m²[/bold]")
    analyzer.display_top_properties(5, by='precio_m2')

    # Top 5 más baratos
    console.print("[bold]3️⃣  Top 5 Más Económicos[/bold]")
    top_cheap = analyzer.get_top_properties(5, by='precio_numerico', ascending=True)

    from rich.table import Table
    table = Table(title="Propiedades Más Económicas")
    table.add_column("Ubicación", style="cyan")
    table.add_column("Precio", style="green", justify="right")
    table.add_column("Ambientes", justify="center")

    for _, row in top_cheap.iterrows():
        table.add_row(
            row['ubicacion'][:30],
            f"${row['precio_numerico']:,.0f}",
            f"{row['ambientes_numerico']:.0f}" if row['ambientes_numerico'] else 'N/A'
        )

    console.print(table)
    console.print()

    # Top 5 más grandes
    console.print("[bold]4️⃣  Top 5 Más Amplios[/bold]")
    top_large = analyzer.get_top_properties(5, by='superficie_numerico', ascending=False)

    table = Table(title="Propiedades Más Amplias")
    table.add_column("Ubicación", style="cyan")
    table.add_column("Superficie", style="yellow", justify="right")
    table.add_column("Ambientes", justify="center")

    for _, row in top_large.iterrows():
        table.add_row(
            row['ubicacion'][:30],
            f"{row['superficie_numerico']:.0f} m²",
            f"{row['ambientes_numerico']:.0f}" if row['ambientes_numerico'] else 'N/A'
        )

    console.print(table)
    console.print()

    # Resumen de barrios
    console.print("[bold]5️⃣  Distribución por Barrio[/bold]")
    barrios = analyzer.df['ubicacion'].str.split(',').str[0].value_counts()

    table = Table(title="Propiedades por Barrio")
    table.add_column("Barrio", style="cyan")
    table.add_column("Cantidad", style="green", justify="right")

    for barrio, count in barrios.head(10).items():
        table.add_row(barrio, str(count))

    console.print(table)
    console.print()

    console.print("[bold green]✓ Demo completada[/bold green]\n")


def demo_scraper():
    """Demo del scraper (requiere conexión a internet)"""

    console.print("\n[bold cyan]═══ DEMO: Scraper de Zonaprop ═══[/bold cyan]\n")
    console.print("[yellow]Nota: Esta demo requiere conexión a internet real[/yellow]\n")

    console.print("[bold]Ejemplos de uso del scraper:[/bold]\n")

    ejemplos = [
        {
            "descripcion": "Departamentos en venta - Palermo",
            "comando": "python main.py -l palermo -t departamentos -o venta -p 3"
        },
        {
            "descripcion": "Casas en alquiler - Belgrano",
            "comando": "python main.py -l belgrano -t casas -o alquiler -p 2 --excel"
        },
        {
            "descripcion": "Terrenos en venta - Capital Federal",
            "comando": "python main.py -l capital-federal -t terrenos -o venta -p 5 --csv"
        },
    ]

    from rich.table import Table
    table = Table(title="Ejemplos de Uso")
    table.add_column("Descripción", style="cyan")
    table.add_column("Comando", style="green")

    for ej in ejemplos:
        table.add_row(ej["descripcion"], ej["comando"])

    console.print(table)
    console.print()


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "scraper":
        demo_scraper()
    else:
        demo_analyzer()
