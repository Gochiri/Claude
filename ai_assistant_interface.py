#!/usr/bin/env python3
"""
Interfaz para Asistente de IA
Permite buscar y generar presentaciones HTML de propiedades con criterios específicos
"""

import json
import os
import argparse
from typing import List, Dict, Optional
from rich.console import Console
from property_filter import PropertyFilter, filter_properties
from html_generator import PropertyHTMLGenerator

console = Console()


class AIPropertyAssistant:
    """
    Asistente principal para búsqueda y presentación de propiedades
    Diseñado para ser llamado por un asistente de IA
    """

    def __init__(self, properties_file: str = "resultados/propiedades.json"):
        """
        Inicializa el asistente

        Args:
            properties_file: Ruta al archivo JSON con propiedades
        """
        self.properties_file = properties_file
        self.properties = self._load_properties()

    def _load_properties(self) -> List[Dict]:
        """Carga las propiedades desde el archivo JSON"""
        if not os.path.exists(self.properties_file):
            console.print(f"[red]Error: No se encontró {self.properties_file}[/red]")
            console.print("[yellow]Ejecuta primero: python html_parser.py -d html_files[/yellow]")
            return []

        with open(self.properties_file, 'r', encoding='utf-8') as f:
            properties = json.load(f)

        console.print(f"[green]✓ Cargadas {len(properties)} propiedades desde {self.properties_file}[/green]\n")
        return properties

    def search_and_generate(
        self,
        # Criterios de búsqueda
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        min_surface: Optional[float] = None,
        max_surface: Optional[float] = None,
        min_rooms: Optional[int] = None,
        max_rooms: Optional[int] = None,
        neighborhoods: Optional[List[str]] = None,
        keywords: Optional[List[str]] = None,
        sort_by: str = 'price_per_m2',
        top_n: int = 5,
        # Datos del cliente
        business_name: str = "Inmobiliaria Premium",
        business_phone: str = "+54 11 1234-5678",
        business_email: str = "contacto@inmobiliaria.com",
        business_address: str = "Av. Santa Fe 1234, CABA",
        business_logo: Optional[str] = None,
        primary_color: str = "#2563eb",
        # Personalización del reporte
        title: str = "Propiedades Seleccionadas",
        subtitle: str = "Las mejores opciones según tus criterios",
        output_file: str = "resultados/propiedades_presentacion.html"
    ) -> Dict:
        """
        Busca propiedades y genera presentación HTML personalizada

        Returns:
            Dict con información del resultado (propiedades encontradas, HTML generado, etc.)
        """
        if not self.properties:
            return {
                'success': False,
                'error': 'No hay propiedades cargadas',
                'properties_found': 0
            }

        console.print("[bold blue]═══ Búsqueda de Propiedades ═══[/bold blue]\n")

        # Aplicar filtros
        filtered_properties = filter_properties(
            self.properties,
            min_price=min_price,
            max_price=max_price,
            min_surface=min_surface,
            max_surface=max_surface,
            min_rooms=min_rooms,
            max_rooms=max_rooms,
            neighborhoods=neighborhoods,
            keywords=keywords,
            sort_by=sort_by,
            top_n=top_n
        )

        if not filtered_properties:
            console.print("[yellow]No se encontraron propiedades con esos criterios[/yellow]")
            return {
                'success': False,
                'error': 'No se encontraron propiedades con los criterios especificados',
                'properties_found': 0
            }

        console.print(f"\n[bold green]✓ {len(filtered_properties)} propiedades seleccionadas[/bold green]\n")

        # Generar HTML
        console.print("[bold blue]═══ Generando HTML Personalizado ═══[/bold blue]\n")

        generator = PropertyHTMLGenerator(
            business_name=business_name,
            business_phone=business_phone,
            business_email=business_email,
            business_address=business_address,
            business_logo_path=business_logo,
            primary_color=primary_color
        )

        html_path = generator.generate_html(
            filtered_properties,
            title=title,
            subtitle=subtitle,
            output_path=output_file
        )

        # Mostrar resumen
        console.print("\n[bold green]═══ Resultado ═══[/bold green]\n")
        for i, prop in enumerate(filtered_properties, 1):
            console.print(f"{i}. [cyan]{prop['titulo']}[/cyan]")
            console.print(f"   💰 {prop['precio']} | 📍 {prop['ubicacion']}")
            console.print()

        return {
            'success': True,
            'properties_found': len(filtered_properties),
            'html_generated': html_path,
            'properties': filtered_properties
        }


def main():
    """Función principal para uso desde CLI"""
    parser = argparse.ArgumentParser(
        description='Asistente IA para búsqueda y presentación de propiedades',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos de uso:

1. Buscar 2-3 ambientes en Palermo, USD 200K-300K:
   python ai_assistant_interface.py \\
       --min-price 200000 --max-price 300000 \\
       --min-rooms 2 --max-rooms 3 \\
       --neighborhoods Palermo \\
       --business-name "Inmobiliaria Premium" \\
       --business-phone "+54 11 4567-8900"

2. Buscar propiedades con terraza en Recoleta:
   python ai_assistant_interface.py \\
       --keywords terraza balcón \\
       --neighborhoods Recoleta Palermo \\
       --top 3

3. Buscar las 5 mejores por precio/m²:
   python ai_assistant_interface.py \\
       --sort-by price_per_m2 \\
       --top 5
        """
    )

    # Criterios de búsqueda
    search = parser.add_argument_group('Criterios de búsqueda')
    search.add_argument('--min-price', type=float, help='Precio mínimo en USD')
    search.add_argument('--max-price', type=float, help='Precio máximo en USD')
    search.add_argument('--min-surface', type=float, help='Superficie mínima en m²')
    search.add_argument('--max-surface', type=float, help='Superficie máxima en m²')
    search.add_argument('--min-rooms', type=int, help='Mínimo de ambientes')
    search.add_argument('--max-rooms', type=int, help='Máximo de ambientes')
    search.add_argument('--neighborhoods', nargs='+', help='Barrios (ej: Palermo Recoleta)')
    search.add_argument('--keywords', nargs='+', help='Palabras clave (ej: terraza cochera)')
    search.add_argument('--sort-by', default='price_per_m2',
                       choices=['price', 'price_per_m2', 'surface', 'rooms'],
                       help='Criterio de ordenamiento')
    search.add_argument('--top', type=int, default=5, help='Número de propiedades a retornar')

    # Datos del negocio
    business = parser.add_argument_group('Datos del negocio')
    business.add_argument('--business-name', default='Inmobiliaria Premium',
                         help='Nombre del negocio')
    business.add_argument('--business-phone', default='+54 11 1234-5678',
                         help='Teléfono de contacto')
    business.add_argument('--business-email', default='contacto@inmobiliaria.com',
                         help='Email de contacto')
    business.add_argument('--business-address', default='Av. Santa Fe 1234, CABA',
                         help='Dirección física')
    business.add_argument('--business-logo', help='Ruta al logo del negocio')
    business.add_argument('--primary-color', default='#2563eb',
                         help='Color primario (hex)')

    # Personalización del reporte
    report = parser.add_argument_group('Personalización del reporte')
    report.add_argument('--title', default='Propiedades Seleccionadas',
                       help='Título del reporte')
    report.add_argument('--subtitle', default='Las mejores opciones según tus criterios',
                       help='Subtítulo del reporte')
    report.add_argument('--output', default='resultados/propiedades_presentacion.html',
                       help='Archivo de salida HTML')

    # Fuente de datos
    parser.add_argument('--properties-file', default='resultados/propiedades.json',
                       help='Archivo JSON con propiedades')

    args = parser.parse_args()

    # Crear asistente y ejecutar búsqueda
    assistant = AIPropertyAssistant(args.properties_file)

    result = assistant.search_and_generate(
        min_price=args.min_price,
        max_price=args.max_price,
        min_surface=args.min_surface,
        max_surface=args.max_surface,
        min_rooms=args.min_rooms,
        max_rooms=args.max_rooms,
        neighborhoods=args.neighborhoods,
        keywords=args.keywords,
        sort_by=args.sort_by,
        top_n=args.top,
        business_name=args.business_name,
        business_phone=args.business_phone,
        business_email=args.business_email,
        business_address=args.business_address,
        business_logo=args.business_logo,
        primary_color=args.primary_color,
        title=args.title,
        subtitle=args.subtitle,
        output_file=args.output
    )

    if result['success']:
        console.print(f"\n[bold green]✓ Presentación HTML generada:[/bold green]")
        console.print(f"[yellow]{result['html_generated']}[/yellow]\n")
        console.print(f"[cyan]Abre este archivo en tu navegador para ver el resultado[/cyan]\n")
    else:
        console.print(f"\n[red]✗ Error: {result['error']}[/red]\n")


if __name__ == "__main__":
    main()
