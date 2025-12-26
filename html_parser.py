"""
Parser de archivos HTML locales
Permite analizar propiedades desde archivos HTML descargados manualmente
"""

import os
from bs4 import BeautifulSoup
from typing import List, Dict, Optional
from rich.console import Console
import config

console = Console()


class LocalHTMLParser:
    """
    Parser para archivos HTML descargados localmente

    Uso:
    1. Descarga manualmente páginas de Zonaprop desde tu navegador
    2. Guárdalas en una carpeta (ej: html_files/)
    3. Ejecuta el parser sobre esos archivos
    """

    def __init__(self, html_dir: str = "html_files"):
        """
        Inicializa el parser

        Args:
            html_dir: Directorio con archivos HTML
        """
        self.html_dir = html_dir
        self.properties = []

    def extract_property_data(self, listing_element) -> Optional[Dict]:
        """
        Extrae datos de un elemento de propiedad (mismo que scraper.py)
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

            # Características
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

            # URL
            link_elem = listing_element.find('a', href=True)
            if link_elem:
                href = link_elem['href']
                data['url'] = href if href.startswith('http') else config.ZONAPROP_BASE_URL + href
            else:
                data['url'] = 'N/A'

            # ID
            data_id = listing_element.get('data-id') or listing_element.get('id')
            data['id'] = data_id if data_id else 'N/A'

            return data

        except Exception as e:
            console.print(f"[yellow]Advertencia: Error al extraer datos: {e}[/yellow]")
            return None

    def parse_html_file(self, filepath: str) -> List[Dict]:
        """
        Parsea un archivo HTML

        Args:
            filepath: Ruta al archivo HTML

        Returns:
            Lista de propiedades encontradas
        """
        console.print(f"[cyan]Parseando: {os.path.basename(filepath)}[/cyan]")

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                html_content = f.read()

            soup = BeautifulSoup(html_content, 'lxml')

            # Buscar elementos de listado
            listings = soup.find_all('div', class_='posting-card') or \
                      soup.find_all('div', class_='posting') or \
                      soup.find_all('article', class_='posting')

            if not listings:
                console.print(f"[yellow]No se encontraron propiedades en {os.path.basename(filepath)}[/yellow]")
                return []

            properties = []
            for listing in listings:
                property_data = self.extract_property_data(listing)
                if property_data:
                    properties.append(property_data)

            console.print(f"[green]✓ {len(properties)} propiedades encontradas[/green]")
            return properties

        except Exception as e:
            console.print(f"[red]Error al parsear {filepath}: {e}[/red]")
            return []

    def parse_directory(self) -> List[Dict]:
        """
        Parsea todos los archivos HTML en el directorio

        Returns:
            Lista de todas las propiedades encontradas
        """
        if not os.path.exists(self.html_dir):
            console.print(f"[red]Error: El directorio {self.html_dir} no existe[/red]")
            console.print(f"[yellow]Crea el directorio y coloca archivos HTML de Zonaprop allí[/yellow]")
            return []

        html_files = [f for f in os.listdir(self.html_dir) if f.endswith(('.html', '.htm'))]

        if not html_files:
            console.print(f"[yellow]No se encontraron archivos HTML en {self.html_dir}[/yellow]")
            return []

        console.print(f"\n[bold blue]Parseando {len(html_files)} archivos HTML[/bold blue]\n")

        all_properties = []

        for html_file in html_files:
            filepath = os.path.join(self.html_dir, html_file)
            properties = self.parse_html_file(filepath)
            all_properties.extend(properties)

        self.properties = all_properties
        console.print(f"\n[bold green]✓ Total: {len(all_properties)} propiedades encontradas[/bold green]\n")

        return all_properties

    def save_to_json(self, filename: str = "propiedades.json"):
        """Guarda los resultados en JSON"""
        import json
        os.makedirs(config.OUTPUT_DIR, exist_ok=True)
        filepath = os.path.join(config.OUTPUT_DIR, filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.properties, f, ensure_ascii=False, indent=2)

        console.print(f"[green]✓ Datos guardados en {filepath}[/green]")
        return filepath


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Parser de archivos HTML de Zonaprop')
    parser.add_argument(
        '-d', '--directory',
        type=str,
        default='html_files',
        help='Directorio con archivos HTML (default: html_files)'
    )
    parser.add_argument(
        '--json',
        type=str,
        default='propiedades.json',
        help='Nombre del archivo JSON de salida'
    )

    args = parser.parse_args()

    # Instrucciones si el directorio no existe
    if not os.path.exists(args.directory):
        console.print("\n[bold yellow]📁 Modo Offline - Parser de HTML Local[/bold yellow]\n")
        console.print("Para usar este parser:")
        console.print("1. Abre Zonaprop en tu navegador")
        console.print("2. Realiza tu búsqueda (ej: departamentos en venta)")
        console.print("3. Guarda cada página como HTML (Ctrl+S o Cmd+S)")
        console.print(f"4. Coloca los archivos en la carpeta '{args.directory}/'")
        console.print("5. Ejecuta este script nuevamente\n")

        # Crear el directorio
        os.makedirs(args.directory, exist_ok=True)
        console.print(f"[green]✓ Directorio '{args.directory}/' creado[/green]\n")
    else:
        parser_obj = LocalHTMLParser(args.directory)
        properties = parser_obj.parse_directory()

        if properties:
            parser_obj.save_to_json(args.json)
            console.print("\n[cyan]Ahora puedes analizar los datos con:[/cyan]")
            console.print(f"[green]python main.py --analyze-only --json {args.json}[/green]\n")
