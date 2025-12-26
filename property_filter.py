"""
Sistema de filtros avanzados para propiedades
Permite filtrar propiedades según criterios muy específicos
"""

import json
from typing import List, Dict, Optional
from rich.console import Console

console = Console()


class PropertyFilter:
    """Filtrador avanzado de propiedades"""

    def __init__(self, properties: List[Dict]):
        """
        Inicializa el filtrador

        Args:
            properties: Lista de propiedades a filtrar
        """
        self.properties = properties
        self.filtered = properties.copy()

    def _extract_numeric_price(self, price_str: str) -> Optional[float]:
        """Extrae valor numérico del precio"""
        import re
        if not price_str or price_str == 'N/A':
            return None
        price_clean = re.sub(r'[^\d,.]', '', str(price_str))
        price_clean = price_clean.replace('.', '').replace(',', '.')
        try:
            return float(price_clean)
        except (ValueError, AttributeError):
            return None

    def _extract_numeric_value(self, value_str: str) -> Optional[float]:
        """Extrae valor numérico de una cadena"""
        import re
        if not value_str or value_str == 'N/A':
            return None
        numbers = re.findall(r'\d+', str(value_str))
        if numbers:
            return float(numbers[0])
        return None

    def by_price_range(self, min_price: Optional[float] = None, max_price: Optional[float] = None):
        """
        Filtra por rango de precios

        Args:
            min_price: Precio mínimo en USD
            max_price: Precio máximo en USD
        """
        result = []
        for prop in self.filtered:
            price = self._extract_numeric_price(prop.get('precio', ''))
            if price is None:
                continue

            if min_price and price < min_price:
                continue
            if max_price and price > max_price:
                continue

            result.append(prop)

        self.filtered = result
        console.print(f"[cyan]Filtro precio: {len(result)} propiedades entre ${min_price or 0:,} y ${max_price or 999999999:,}[/cyan]")
        return self

    def by_surface_range(self, min_surface: Optional[float] = None, max_surface: Optional[float] = None):
        """
        Filtra por rango de superficie

        Args:
            min_surface: Superficie mínima en m²
            max_surface: Superficie máxima en m²
        """
        result = []
        for prop in self.filtered:
            surface = self._extract_numeric_value(
                prop.get('caracteristicas', {}).get('superficie', '')
            )
            if surface is None:
                continue

            if min_surface and surface < min_surface:
                continue
            if max_surface and surface > max_surface:
                continue

            result.append(prop)

        self.filtered = result
        console.print(f"[cyan]Filtro superficie: {len(result)} propiedades entre {min_surface or 0}m² y {max_surface or 999999}m²[/cyan]")
        return self

    def by_rooms(self, min_rooms: Optional[int] = None, max_rooms: Optional[int] = None):
        """
        Filtra por número de ambientes

        Args:
            min_rooms: Número mínimo de ambientes
            max_rooms: Número máximo de ambientes
        """
        result = []
        for prop in self.filtered:
            rooms = self._extract_numeric_value(
                prop.get('caracteristicas', {}).get('ambientes', '')
            )
            if rooms is None:
                continue

            if min_rooms and rooms < min_rooms:
                continue
            if max_rooms and rooms > max_rooms:
                continue

            result.append(prop)

        self.filtered = result
        console.print(f"[cyan]Filtro ambientes: {len(result)} propiedades entre {min_rooms or 0} y {max_rooms or 99} ambientes[/cyan]")
        return self

    def by_neighborhood(self, neighborhoods: List[str]):
        """
        Filtra por barrio(s)

        Args:
            neighborhoods: Lista de barrios (ej: ["Palermo", "Recoleta"])
        """
        result = []
        neighborhoods_lower = [n.lower() for n in neighborhoods]

        for prop in self.filtered:
            ubicacion = prop.get('ubicacion', '').lower()
            if any(barrio in ubicacion for barrio in neighborhoods_lower):
                result.append(prop)

        self.filtered = result
        console.print(f"[cyan]Filtro barrios {neighborhoods}: {len(result)} propiedades encontradas[/cyan]")
        return self

    def by_keyword(self, keywords: List[str]):
        """
        Filtra por palabras clave en el título

        Args:
            keywords: Lista de palabras clave (ej: ["terraza", "cochera", "luminoso"])
        """
        result = []
        keywords_lower = [k.lower() for k in keywords]

        for prop in self.filtered:
            titulo = prop.get('titulo', '').lower()
            if any(keyword in titulo for keyword in keywords_lower):
                result.append(prop)

        self.filtered = result
        console.print(f"[cyan]Filtro keywords {keywords}: {len(result)} propiedades encontradas[/cyan]")
        return self

    def sort_by(self, criterion: str = 'price_per_m2', ascending: bool = True):
        """
        Ordena resultados según criterio

        Args:
            criterion: Criterio de ordenamiento
                - 'price': Por precio total
                - 'price_per_m2': Por precio por m²
                - 'surface': Por superficie
                - 'rooms': Por número de ambientes
            ascending: True para ascendente, False para descendente
        """
        def get_sort_value(prop):
            if criterion == 'price':
                return self._extract_numeric_price(prop.get('precio', '')) or 999999999
            elif criterion == 'price_per_m2':
                price = self._extract_numeric_price(prop.get('precio', ''))
                surface = self._extract_numeric_value(
                    prop.get('caracteristicas', {}).get('superficie', '')
                )
                if price and surface:
                    return price / surface
                return 999999999
            elif criterion == 'surface':
                return self._extract_numeric_value(
                    prop.get('caracteristicas', {}).get('superficie', '')
                ) or 0
            elif criterion == 'rooms':
                return self._extract_numeric_value(
                    prop.get('caracteristicas', {}).get('ambientes', '')
                ) or 0
            return 0

        self.filtered.sort(key=get_sort_value, reverse=not ascending)
        console.print(f"[cyan]Ordenado por {criterion} ({'ascendente' if ascending else 'descendente'})[/cyan]")
        return self

    def get_top(self, n: int = 5) -> List[Dict]:
        """
        Obtiene las top N propiedades

        Args:
            n: Número de propiedades a retornar

        Returns:
            Lista de top N propiedades
        """
        console.print(f"[green]✓ Top {n} propiedades seleccionadas[/green]\n")
        return self.filtered[:n]

    def get_all(self) -> List[Dict]:
        """Retorna todas las propiedades filtradas"""
        return self.filtered

    def count(self) -> int:
        """Retorna el número de propiedades filtradas"""
        return len(self.filtered)


# Función de conveniencia para uso rápido
def filter_properties(
    properties: List[Dict],
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_surface: Optional[float] = None,
    max_surface: Optional[float] = None,
    min_rooms: Optional[int] = None,
    max_rooms: Optional[int] = None,
    neighborhoods: Optional[List[str]] = None,
    keywords: Optional[List[str]] = None,
    sort_by: str = 'price_per_m2',
    top_n: int = 5
) -> List[Dict]:
    """
    Filtra propiedades con criterios específicos (función de conveniencia)

    Ejemplo:
        top_5 = filter_properties(
            properties,
            min_price=200000,
            max_price=300000,
            min_rooms=2,
            max_rooms=3,
            neighborhoods=["Palermo", "Belgrano"],
            keywords=["terraza", "cochera"],
            sort_by='price_per_m2',
            top_n=5
        )
    """
    filterer = PropertyFilter(properties)

    if min_price or max_price:
        filterer.by_price_range(min_price, max_price)

    if min_surface or max_surface:
        filterer.by_surface_range(min_surface, max_surface)

    if min_rooms or max_rooms:
        filterer.by_rooms(min_rooms, max_rooms)

    if neighborhoods:
        filterer.by_neighborhood(neighborhoods)

    if keywords:
        filterer.by_keyword(keywords)

    filterer.sort_by(sort_by, ascending=True)

    return filterer.get_top(top_n)


if __name__ == "__main__":
    # Ejemplo de uso
    import os

    # Cargar propiedades
    json_path = os.path.join('resultados', 'propiedades.json')
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            properties = json.load(f)

        console.print("\n[bold blue]═══ Demo de Filtros Avanzados ═══[/bold blue]\n")

        # Ejemplo 1: Filtro completo
        console.print("[bold yellow]Ejemplo 1: 2-3 ambientes en Palermo, USD 200K-350K[/bold yellow]")
        top_5 = filter_properties(
            properties,
            min_price=200000,
            max_price=350000,
            min_rooms=2,
            max_rooms=3,
            neighborhoods=["Palermo"],
            sort_by='price_per_m2',
            top_n=5
        )

        for i, prop in enumerate(top_5, 1):
            console.print(f"{i}. {prop['titulo']} - {prop['precio']} - {prop['ubicacion']}")

        console.print()

        # Ejemplo 2: Por keywords
        console.print("[bold yellow]Ejemplo 2: Propiedades con 'terraza' o 'balcón'[/bold yellow]")
        filterer = PropertyFilter(properties)
        results = filterer.by_keyword(['terraza', 'balcón']).sort_by('price').get_top(3)

        for i, prop in enumerate(results, 1):
            console.print(f"{i}. {prop['titulo']} - {prop['precio']}")

    else:
        console.print(f"[red]No se encontró {json_path}[/red]")
        console.print("[yellow]Ejecuta primero: python html_parser.py -d html_files[/yellow]")
