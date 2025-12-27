#!/usr/bin/env python3
"""
Scraper usando la API interna de Zonaprop
Mucho más rápido y confiable que scraping de HTML
"""

import requests
import json
import os
from typing import List, Dict, Optional
from rich.console import Console
from rich.progress import track
import config

console = Console()


class ZonapropAPIScraper:
    """Scraper que usa la API interna de Zonaprop"""

    # Mapeo de tipos de operación
    OPERATION_MAP = {
        'venta': '1',
        'alquiler': '2',
        'alquiler-temporal': '4'
    }

    # Mapeo de tipos de propiedad
    PROPERTY_TYPE_MAP = {
        'casa': '1',
        'departamento': '2',
        'departamentos': '2',  # Plural
        'oficina': '4',
        'local': '5',
        'edificio': '7',
        'galpon': '8',
        'consultorio': '10',
        'quinta': '11',
        'campo': '14',
        'terreno': '26',
        'garage': '32',
        'hotel': '38',
        'deposito': '45',
        'ph': '2001'
    }

    # Mapeo de monedas
    CURRENCY_MAP = {
        'ars': '1',
        'usd': '2'
    }

    # Mapeo de ciudades/zonas (algunos ejemplos comunes)
    LOCATION_MAP = {
        'capital-federal': '1004884',
        'palermo': '1004884',  # CABA
        'belgrano': '1004884',
        'recoleta': '1004884',
        'caballito': '1004884',
        'nuñez': '1004884',
        'colegiales': '1004884',
        # Agregar más según necesidad
    }

    def __init__(
        self,
        location: str = 'capital-federal',
        property_type: str = 'departamentos',
        operation: str = 'venta',
        currency: str = 'usd',
        min_price: Optional[int] = None,
        max_price: Optional[int] = None
    ):
        """
        Inicializa el scraper de API

        Args:
            location: Ubicación de búsqueda
            property_type: Tipo de propiedad
            operation: Tipo de operación (venta, alquiler, alquiler-temporal)
            currency: Moneda (usd, ars)
            min_price: Precio mínimo
            max_price: Precio máximo
        """
        self.location = location
        self.property_type = property_type
        self.operation = operation
        self.currency = currency
        self.min_price = min_price or 30000
        self.max_price = max_price or 1000000
        self.properties = []

        # Headers necesarios para la API
        self.headers = {
            'accept': '*/*',
            'accept-language': 'es-ES,es;q=0.9',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'origin': 'https://www.zonaprop.com.ar',
            'referer': 'https://www.zonaprop.com.ar',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

        self.api_url = 'https://www.zonaprop.com.ar/rplis-api/postings'

    def _build_payload(self, page: int = 1, page_size: int = 20) -> Dict:
        """
        Construye el payload para la API

        Args:
            page: Número de página
            page_size: Cantidad de resultados por página

        Returns:
            Dict con el payload
        """
        # Obtener IDs de los mapeos
        operation_id = self.OPERATION_MAP.get(self.operation, '1')
        property_type_id = self.PROPERTY_TYPE_MAP.get(self.property_type, '2')
        currency_id = self.CURRENCY_MAP.get(self.currency, '2')
        city_id = self.LOCATION_MAP.get(self.location, '1004884')

        payload = {
            'moneda': int(currency_id),
            'preciomin': str(self.min_price),
            'preciomax': str(self.max_price),
            'tipoDeOperacion': operation_id,
            'tipoDePropiedad': property_type_id,
            'superficieCubierta': 1,
            'idunidaddemedida': 1,
            'tipoAnunciante': 'ALL',
            'sort': 'relevance',
            'preTipoDeOperacion': operation_id,
            'city': city_id,
            'pagina': page,
            'tamanioPagina': page_size
        }

        return payload

    def scrape_page(self, page: int = 1) -> List[Dict]:
        """
        Scrapea una página usando la API

        Args:
            page: Número de página

        Returns:
            Lista de propiedades
        """
        payload = self._build_payload(page)

        try:
            console.print(f"[cyan]Scrapeando página {page} vía API...[/cyan]")

            response = requests.post(
                self.api_url,
                headers=self.headers,
                json=payload,
                timeout=30
            )

            response.raise_for_status()
            data = response.json()

            # La API devuelve los resultados en data['listPostings']
            if 'listPostings' in data:
                postings = data['listPostings']
                console.print(f"[green]✓ Encontradas {len(postings)} propiedades en página {page}[/green]")
                return self._parse_postings(postings)
            else:
                console.print(f"[yellow]No se encontraron propiedades en página {page}[/yellow]")
                return []

        except requests.RequestException as e:
            console.print(f"[red]Error al obtener página {page}: {e}[/red]")
            return []

    def _parse_postings(self, postings: List[Dict]) -> List[Dict]:
        """
        Parsea los postings de la API al formato estándar

        Args:
            postings: Lista de postings de la API

        Returns:
            Lista de propiedades en formato estándar
        """
        properties = []

        for posting in postings:
            try:
                # Extraer datos del posting
                property_data = {
                    'titulo': posting.get('postingTitle', 'N/A'),
                    'precio': self._format_price(posting.get('priceOperationTypes', [])),
                    'ubicacion': self._format_location(posting.get('address', {})),
                    'superficie_total': posting.get('totalSurface', 'N/A'),
                    'superficie_cubierta': posting.get('coveredSurface', 'N/A'),
                    'ambientes': posting.get('roomCount', 'N/A'),
                    'dormitorios': posting.get('bedroomCount', 'N/A'),
                    'baños': posting.get('bathroomCount', 'N/A'),
                    'descripcion': posting.get('postingDescription', ''),
                    'url': f"https://www.zonaprop.com.ar{posting.get('postingURL', '')}",
                    'id': posting.get('postingId', 'N/A'),
                    'publisher': posting.get('publisher', {}).get('name', 'N/A'),
                    'images': [img.get('url') for img in posting.get('multimedia', {}).get('images', [])]
                }

                properties.append(property_data)

            except Exception as e:
                console.print(f"[yellow]Error parseando posting: {e}[/yellow]")
                continue

        return properties

    def _format_price(self, price_operations: List[Dict]) -> str:
        """Formatea el precio desde los price operations"""
        if not price_operations:
            return 'Consultar'

        try:
            price_op = price_operations[0]
            amount = price_op.get('amount', 0)
            currency = price_op.get('currency', {}).get('name', 'USD')

            if amount:
                return f"{currency} {amount:,.0f}".replace(',', '.')
            else:
                return 'Consultar'
        except:
            return 'Consultar'

    def _format_location(self, address: Dict) -> str:
        """Formatea la ubicación desde el objeto address"""
        parts = []

        if address.get('streetName'):
            parts.append(address['streetName'])
        if address.get('streetNumber'):
            parts.append(str(address['streetNumber']))
        if address.get('location'):
            parts.append(address['location'])
        if address.get('city'):
            parts.append(address['city'])

        return ', '.join(parts) if parts else 'N/A'

    def scrape(self, max_pages: int = 3) -> List[Dict]:
        """
        Scrapea múltiples páginas

        Args:
            max_pages: Número máximo de páginas a scrapear

        Returns:
            Lista de todas las propiedades encontradas
        """
        console.print("\n[bold blue]═══ Iniciando scraping vía API de Zonaprop ═══[/bold blue]\n")
        console.print(f"[cyan]Ubicación:[/cyan] {self.location}")
        console.print(f"[cyan]Tipo:[/cyan] {self.property_type}")
        console.print(f"[cyan]Operación:[/cyan] {self.operation}")
        console.print(f"[cyan]Rango de precios:[/cyan] {self.currency.upper()} {self.min_price:,} - {self.max_price:,}")
        console.print(f"[cyan]Páginas máximas:[/cyan] {max_pages}\n")

        all_properties = []

        for page in track(range(1, max_pages + 1), description="Scrapeando páginas..."):
            properties = self.scrape_page(page)

            if not properties:
                console.print(f"[yellow]No hay más resultados. Deteniendo en página {page}[/yellow]")
                break

            all_properties.extend(properties)

        self.properties = all_properties

        console.print(f"\n[bold green]✓ Scraping completado: {len(self.properties)} propiedades encontradas[/bold green]\n")

        return self.properties

    def save_to_json(self, filename: str = 'propiedades.json') -> str:
        """
        Guarda las propiedades en un archivo JSON

        Args:
            filename: Nombre del archivo

        Returns:
            Ruta del archivo guardado
        """
        os.makedirs(config.OUTPUT_DIR, exist_ok=True)
        filepath = os.path.join(config.OUTPUT_DIR, filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.properties, f, ensure_ascii=False, indent=2)

        console.print(f"[green]✓ Datos guardados en {filepath}[/green]")
        return filepath


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Scraper de API de Zonaprop')
    parser.add_argument('-l', '--location', default='capital-federal',
                       help='Ubicación (capital-federal, palermo, etc.)')
    parser.add_argument('-t', '--type', default='departamentos',
                       help='Tipo de propiedad')
    parser.add_argument('-o', '--operation', default='venta',
                       choices=['venta', 'alquiler', 'alquiler-temporal'])
    parser.add_argument('-c', '--currency', default='usd',
                       choices=['usd', 'ars'])
    parser.add_argument('-p', '--pages', type=int, default=3,
                       help='Número de páginas a scrapear')
    parser.add_argument('--min-price', type=int,
                       help='Precio mínimo')
    parser.add_argument('--max-price', type=int,
                       help='Precio máximo')

    args = parser.parse_args()

    scraper = ZonapropAPIScraper(
        location=args.location,
        property_type=args.type,
        operation=args.operation,
        currency=args.currency,
        min_price=args.min_price,
        max_price=args.max_price
    )

    properties = scraper.scrape(max_pages=args.pages)
    scraper.save_to_json()

    console.print(f"\n[bold]Siguiente paso:[/bold]")
    console.print("[cyan]python ai_assistant_interface.py --business-name \"Tu Inmobiliaria\"[/cyan]\n")
