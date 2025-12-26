"""
Web Scraper para Zonaprop
Permite extraer información de propiedades para análisis
"""

import requests
from bs4 import BeautifulSoup
import time
import json
from typing import List, Dict, Optional
from rich.console import Console
from rich.progress import track
import config

console = Console()


class ZonapropScraper:
    """Scraper principal para Zonaprop"""

    def __init__(self, location: str = None, property_type: str = None, operation: str = None):
        """
        Inicializa el scraper

        Args:
            location: Ubicación de búsqueda (ej: "capital-federal")
            property_type: Tipo de propiedad (ej: "departamentos", "casas")
            operation: Tipo de operación (ej: "venta", "alquiler")
        """
        self.location = location or config.DEFAULT_LOCATION
        self.property_type = property_type or config.DEFAULT_PROPERTY_TYPE
        self.operation = operation or config.DEFAULT_OPERATION
        self.session = requests.Session()
        self.session.headers.update(config.HEADERS)
        self.properties = []

    def build_search_url(self, page: int = 1) -> str:
        """Construye la URL de búsqueda"""
        url = f"{config.ZONAPROP_BASE_URL}/{self.property_type}-{self.operation}-{self.location}"
        if page > 1:
            url += f"-pagina-{page}.html"
        else:
            url += ".html"
        return url

    def extract_property_data(self, listing_element) -> Optional[Dict]:
        """
        Extrae datos de un elemento de propiedad

        Args:
            listing_element: Elemento BeautifulSoup con los datos de la propiedad

        Returns:
            Diccionario con los datos extraídos o None si hay error
        """
        try:
            data = {}

            # Título
            title_elem = listing_element.find('h2', class_='posting-title')
            data['titulo'] = title_elem.get_text(strip=True) if title_elem else 'N/A'

            # Precio
            price_elem = listing_element.find('div', class_='price')
            if not price_elem:
                price_elem = listing_element.find('span', class_='price')
            data['precio'] = price_elem.get_text(strip=True) if price_elem else 'N/A'

            # Ubicación
            location_elem = listing_element.find('div', class_='location')
            if not location_elem:
                location_elem = listing_element.find('span', class_='location')
            data['ubicacion'] = location_elem.get_text(strip=True) if location_elem else 'N/A'

            # Características (superficie, habitaciones, etc.)
            features = {}
            features_elems = listing_element.find_all('span', class_='posting-feature')
            if not features_elems:
                features_elems = listing_element.find_all('li', class_='posting-feature')

            for feature in features_elems:
                text = feature.get_text(strip=True)
                if 'm²' in text or 'm2' in text:
                    features['superficie'] = text
                elif 'amb' in text.lower() or 'ambiente' in text.lower():
                    features['ambientes'] = text
                elif 'dorm' in text.lower() or 'habitacion' in text.lower():
                    features['habitaciones'] = text
                elif 'baño' in text.lower():
                    features['baños'] = text

            data['caracteristicas'] = features

            # URL de la propiedad
            link_elem = listing_element.find('a', href=True)
            if link_elem:
                href = link_elem['href']
                data['url'] = href if href.startswith('http') else config.ZONAPROP_BASE_URL + href
            else:
                data['url'] = 'N/A'

            # ID de la propiedad (si está disponible)
            data_id = listing_element.get('data-id') or listing_element.get('id')
            data['id'] = data_id if data_id else 'N/A'

            return data

        except Exception as e:
            console.print(f"[yellow]Advertencia: Error al extraer datos: {e}[/yellow]")
            return None

    def scrape_page(self, page: int) -> List[Dict]:
        """
        Scrapea una página de resultados

        Args:
            page: Número de página a scrapear

        Returns:
            Lista de propiedades encontradas
        """
        url = self.build_search_url(page)
        console.print(f"[cyan]Scrapeando página {page}: {url}[/cyan]")

        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'lxml')

            # Buscar elementos de listado (pueden variar según la estructura del sitio)
            listings = soup.find_all('div', class_='posting-card') or \
                      soup.find_all('div', class_='posting') or \
                      soup.find_all('article', class_='posting')

            if not listings:
                console.print(f"[yellow]No se encontraron propiedades en la página {page}[/yellow]")
                return []

            properties = []
            for listing in listings:
                property_data = self.extract_property_data(listing)
                if property_data:
                    properties.append(property_data)

            console.print(f"[green]✓ Encontradas {len(properties)} propiedades en página {page}[/green]")
            return properties

        except requests.RequestException as e:
            console.print(f"[red]Error al obtener página {page}: {e}[/red]")
            return []

    def scrape(self, max_pages: int = None) -> List[Dict]:
        """
        Scrapea múltiples páginas de resultados

        Args:
            max_pages: Número máximo de páginas a scrapear

        Returns:
            Lista de todas las propiedades encontradas
        """
        max_pages = max_pages or config.MAX_PAGES

        console.print(f"\n[bold blue]Iniciando scraping de Zonaprop[/bold blue]")
        console.print(f"Ubicación: {self.location}")
        console.print(f"Tipo: {self.property_type}")
        console.print(f"Operación: {self.operation}")
        console.print(f"Páginas máximas: {max_pages}\n")

        all_properties = []

        for page in track(range(1, max_pages + 1), description="Scrapeando páginas..."):
            properties = self.scrape_page(page)

            if not properties:
                console.print(f"[yellow]No hay más resultados. Deteniendo en página {page}[/yellow]")
                break

            all_properties.extend(properties)

            # Delay para ser respetuosos con el servidor
            if page < max_pages:
                time.sleep(config.REQUEST_DELAY)

        self.properties = all_properties
        console.print(f"\n[bold green]✓ Scraping completado: {len(all_properties)} propiedades encontradas[/bold green]\n")

        return all_properties

    def save_to_json(self, filename: str = "propiedades.json"):
        """Guarda los resultados en formato JSON"""
        import os
        os.makedirs(config.OUTPUT_DIR, exist_ok=True)
        filepath = os.path.join(config.OUTPUT_DIR, filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.properties, f, ensure_ascii=False, indent=2)

        console.print(f"[green]✓ Datos guardados en {filepath}[/green]")
        return filepath


if __name__ == "__main__":
    # Ejemplo de uso
    scraper = ZonapropScraper(
        location="capital-federal",
        property_type="departamentos",
        operation="venta"
    )

    properties = scraper.scrape(max_pages=3)
    scraper.save_to_json()
