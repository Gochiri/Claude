"""
Generador de datos mock para testing
Útil cuando no hay conexión a internet o para desarrollo
"""

import random
import json
import os
from typing import List, Dict
from rich.console import Console
import config

console = Console()


class MockDataGenerator:
    """Genera datos realistas de propiedades para testing"""

    BARRIOS = [
        "Palermo", "Recoleta", "Belgrano", "Caballito", "Villa Crespo",
        "Almagro", "Núñez", "San Telmo", "Puerto Madero", "Barrio Norte",
        "Colegiales", "Villa Urquiza", "Flores", "Balvanera", "Monserrat",
        "San Nicolás", "Villa Devoto", "Paternal", "Saavedra", "Coghlan"
    ]

    TIPOS_DEPARTAMENTO = [
        "Departamento {} ambientes",
        "Monoambiente",
        "Loft",
        "Semipiso",
        "PH",
        "Duplex",
    ]

    CARACTERISTICAS_EXTRAS = [
        "luminoso", "reciclado", "a estrenar", "con balcón", "con terraza",
        "con cochera", "con parrilla", "con vista", "premium", "clásico",
        "moderno", "amplio", "reformado", "en edificio histórico"
    ]

    def __init__(self, seed: int = None):
        """
        Inicializa el generador

        Args:
            seed: Semilla para reproducibilidad (opcional)
        """
        if seed:
            random.seed(seed)

    def _generate_titulo(self, ambientes: int) -> str:
        """Genera un título realista"""
        if ambientes == 1:
            tipo = "Monoambiente"
        else:
            tipo = random.choice(self.TIPOS_DEPARTAMENTO).format(ambientes)

        extra = random.choice(self.CARACTERISTICAS_EXTRAS) if random.random() > 0.5 else ""

        if extra:
            return f"{tipo} {extra}"
        return tipo

    def _generate_precio(self, ambientes: int, superficie: float) -> int:
        """Genera un precio realista en USD"""
        # Precio base por m²
        precio_m2_base = random.randint(2500, 5000)

        # Ajustar por ambientes
        if ambientes == 1:
            precio_m2 = precio_m2_base * 0.9
        elif ambientes >= 4:
            precio_m2 = precio_m2_base * 1.15
        else:
            precio_m2 = precio_m2_base

        # Calcular precio total
        precio = int(superficie * precio_m2)

        # Redondear a miles
        precio = round(precio / 1000) * 1000

        return precio

    def _generate_superficie(self, ambientes: int) -> int:
        """Genera superficie realista según ambientes"""
        if ambientes == 1:
            return random.randint(25, 45)
        elif ambientes == 2:
            return random.randint(40, 65)
        elif ambientes == 3:
            return random.randint(60, 90)
        else:
            return random.randint(85, 150)

    def generate_property(self, prop_id: int = None) -> Dict:
        """Genera una propiedad individual"""
        ambientes = random.choice([1, 1, 2, 2, 2, 3, 3, 4])
        superficie = self._generate_superficie(ambientes)
        precio = self._generate_precio(ambientes, superficie)
        barrio = random.choice(self.BARRIOS)

        # Habitaciones y baños
        if ambientes == 1:
            habitaciones = 1
            baños = 1
        elif ambientes == 2:
            habitaciones = 1
            baños = 1
        elif ambientes == 3:
            habitaciones = 2
            baños = random.choice([1, 2])
        else:
            habitaciones = random.randint(2, 3)
            baños = 2

        prop_id = prop_id or random.randint(1000000, 9999999)

        return {
            "id": str(prop_id),
            "titulo": self._generate_titulo(ambientes),
            "precio": f"USD {precio:,}".replace(',', '.'),
            "ubicacion": f"{barrio}, Capital Federal",
            "caracteristicas": {
                "superficie": f"{superficie} m²",
                "ambientes": f"{ambientes} amb",
                "habitaciones": f"{habitaciones} dorm",
                "baños": f"{baños} baño" if baños == 1 else f"{baños} baños"
            },
            "url": f"https://www.zonaprop.com.ar/propiedades/{prop_id}.html"
        }

    def generate_multiple(self, count: int = 50) -> List[Dict]:
        """
        Genera múltiples propiedades

        Args:
            count: Número de propiedades a generar

        Returns:
            Lista de propiedades
        """
        console.print(f"[cyan]Generando {count} propiedades mock...[/cyan]")

        properties = []
        used_ids = set()

        for i in range(count):
            # Generar ID único
            prop_id = random.randint(1000000, 9999999)
            while prop_id in used_ids:
                prop_id = random.randint(1000000, 9999999)
            used_ids.add(prop_id)

            prop = self.generate_property(prop_id)
            properties.append(prop)

        console.print(f"[green]✓ {len(properties)} propiedades generadas[/green]")
        return properties

    def save_to_json(self, properties: List[Dict], filename: str = "propiedades_mock.json"):
        """Guarda las propiedades mock en JSON"""
        os.makedirs(config.OUTPUT_DIR, exist_ok=True)
        filepath = os.path.join(config.OUTPUT_DIR, filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(properties, f, ensure_ascii=False, indent=2)

        console.print(f"[green]✓ Datos guardados en {filepath}[/green]")
        return filepath


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description='Generador de datos mock para testing'
    )
    parser.add_argument(
        '-n', '--count',
        type=int,
        default=50,
        help='Número de propiedades a generar (default: 50)'
    )
    parser.add_argument(
        '--seed',
        type=int,
        help='Semilla para reproducibilidad'
    )
    parser.add_argument(
        '--json',
        type=str,
        default='propiedades_mock.json',
        help='Nombre del archivo JSON de salida'
    )

    args = parser.parse_args()

    console.print("\n[bold blue]═══ Generador de Datos Mock ═══[/bold blue]\n")

    generator = MockDataGenerator(seed=args.seed)
    properties = generator.generate_multiple(args.count)
    generator.save_to_json(properties, args.json)

    console.print("\n[cyan]Ahora puedes analizar los datos con:[/cyan]")
    console.print(f"[green]python main.py --analyze-only --json {args.json}[/green]\n")
