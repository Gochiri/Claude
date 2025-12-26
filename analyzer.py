"""
Analizador de datos de propiedades
Procesa y analiza los datos scrapeados de Zonaprop
"""

import pandas as pd
import re
from typing import List, Dict
from rich.console import Console
from rich.table import Table
import config
import os

console = Console()


class PropertyAnalyzer:
    """Analizador de propiedades"""

    def __init__(self, properties: List[Dict]):
        """
        Inicializa el analizador

        Args:
            properties: Lista de propiedades a analizar
        """
        self.properties = properties
        self.df = self._create_dataframe()

    def _create_dataframe(self) -> pd.DataFrame:
        """Crea un DataFrame de pandas con los datos"""
        if not self.properties:
            console.print("[yellow]No hay propiedades para analizar[/yellow]")
            return pd.DataFrame()

        # Expandir características
        data = []
        for prop in self.properties:
            flat_prop = {
                'id': prop.get('id', 'N/A'),
                'titulo': prop.get('titulo', 'N/A'),
                'precio': prop.get('precio', 'N/A'),
                'ubicacion': prop.get('ubicacion', 'N/A'),
                'url': prop.get('url', 'N/A'),
            }

            # Agregar características
            caracteristicas = prop.get('caracteristicas', {})
            flat_prop['superficie'] = caracteristicas.get('superficie', 'N/A')
            flat_prop['ambientes'] = caracteristicas.get('ambientes', 'N/A')
            flat_prop['habitaciones'] = caracteristicas.get('habitaciones', 'N/A')
            flat_prop['baños'] = caracteristicas.get('baños', 'N/A')

            data.append(flat_prop)

        return pd.DataFrame(data)

    def _extract_numeric_price(self, price_str: str) -> float:
        """Extrae el valor numérico del precio"""
        if pd.isna(price_str) or price_str == 'N/A':
            return None

        # Remover todo excepto números, puntos y comas
        price_clean = re.sub(r'[^\d,.]', '', str(price_str))

        # Manejar formato argentino (punto para miles, coma para decimales)
        price_clean = price_clean.replace('.', '').replace(',', '.')

        try:
            return float(price_clean)
        except (ValueError, AttributeError):
            return None

    def _extract_numeric_value(self, value_str: str) -> float:
        """Extrae valor numérico de una cadena"""
        if pd.isna(value_str) or value_str == 'N/A':
            return None

        numbers = re.findall(r'\d+', str(value_str))
        if numbers:
            return float(numbers[0])
        return None

    def process_data(self):
        """Procesa y limpia los datos"""
        if self.df.empty:
            return

        # Extraer valores numéricos
        self.df['precio_numerico'] = self.df['precio'].apply(self._extract_numeric_price)
        self.df['superficie_numerico'] = self.df['superficie'].apply(self._extract_numeric_value)
        self.df['ambientes_numerico'] = self.df['ambientes'].apply(self._extract_numeric_value)

        # Calcular precio por m²
        self.df['precio_m2'] = self.df.apply(
            lambda row: row['precio_numerico'] / row['superficie_numerico']
            if row['precio_numerico'] and row['superficie_numerico']
            else None,
            axis=1
        )

        console.print("[green]✓ Datos procesados correctamente[/green]")

    def get_statistics(self) -> Dict:
        """Calcula estadísticas descriptivas"""
        if self.df.empty:
            return {}

        stats = {
            'total_propiedades': len(self.df),
            'con_precio': self.df['precio_numerico'].notna().sum(),
            'con_superficie': self.df['superficie_numerico'].notna().sum(),
        }

        # Estadísticas de precio
        if stats['con_precio'] > 0:
            stats['precio_promedio'] = self.df['precio_numerico'].mean()
            stats['precio_mediana'] = self.df['precio_numerico'].median()
            stats['precio_min'] = self.df['precio_numerico'].min()
            stats['precio_max'] = self.df['precio_numerico'].max()

        # Estadísticas de superficie
        if stats['con_superficie'] > 0:
            stats['superficie_promedio'] = self.df['superficie_numerico'].mean()
            stats['superficie_mediana'] = self.df['superficie_numerico'].median()

        # Estadísticas de precio por m²
        precio_m2_valid = self.df['precio_m2'].dropna()
        if len(precio_m2_valid) > 0:
            stats['precio_m2_promedio'] = precio_m2_valid.mean()
            stats['precio_m2_mediana'] = precio_m2_valid.median()

        return stats

    def display_statistics(self):
        """Muestra estadísticas en consola"""
        stats = self.get_statistics()

        if not stats:
            console.print("[yellow]No hay suficientes datos para mostrar estadísticas[/yellow]")
            return

        table = Table(title="📊 Estadísticas de Propiedades")
        table.add_column("Métrica", style="cyan")
        table.add_column("Valor", style="green")

        table.add_row("Total de propiedades", str(stats['total_propiedades']))
        table.add_row("Con precio", str(stats['con_precio']))
        table.add_row("Con superficie", str(stats['con_superficie']))

        if 'precio_promedio' in stats:
            table.add_row("", "")  # Separador
            table.add_row("Precio promedio", f"${stats['precio_promedio']:,.2f}")
            table.add_row("Precio mediana", f"${stats['precio_mediana']:,.2f}")
            table.add_row("Precio mínimo", f"${stats['precio_min']:,.2f}")
            table.add_row("Precio máximo", f"${stats['precio_max']:,.2f}")

        if 'superficie_promedio' in stats:
            table.add_row("", "")  # Separador
            table.add_row("Superficie promedio", f"{stats['superficie_promedio']:.2f} m²")
            table.add_row("Superficie mediana", f"{stats['superficie_mediana']:.2f} m²")

        if 'precio_m2_promedio' in stats:
            table.add_row("", "")  # Separador
            table.add_row("Precio/m² promedio", f"${stats['precio_m2_promedio']:,.2f}")
            table.add_row("Precio/m² mediana", f"${stats['precio_m2_mediana']:,.2f}")

        console.print("\n")
        console.print(table)
        console.print("\n")

    def get_top_properties(self, n: int = 10, by: str = 'precio_m2', ascending: bool = True):
        """
        Obtiene las mejores propiedades según un criterio

        Args:
            n: Número de propiedades a retornar
            by: Criterio de ordenamiento ('precio_m2', 'precio_numerico', 'superficie_numerico')
            ascending: Si True, ordena de menor a mayor
        """
        if self.df.empty or by not in self.df.columns:
            return pd.DataFrame()

        # Filtrar valores válidos
        valid_df = self.df[self.df[by].notna()].copy()

        if valid_df.empty:
            return pd.DataFrame()

        return valid_df.nsmallest(n, by) if ascending else valid_df.nlargest(n, by)

    def display_top_properties(self, n: int = 10, by: str = 'precio_m2'):
        """Muestra las mejores propiedades en consola"""
        top = self.get_top_properties(n, by, ascending=True)

        if top.empty:
            console.print("[yellow]No hay suficientes datos para mostrar propiedades[/yellow]")
            return

        table = Table(title=f"🏆 Top {n} Propiedades (Mejor precio/m²)")
        table.add_column("Ubicación", style="cyan", width=25)
        table.add_column("Precio", style="green", justify="right")
        table.add_column("Superficie", justify="right")
        table.add_column("Precio/m²", style="yellow", justify="right")
        table.add_column("Ambientes", justify="center")

        for _, row in top.iterrows():
            table.add_row(
                row['ubicacion'][:25] if row['ubicacion'] != 'N/A' else 'N/A',
                f"${row['precio_numerico']:,.0f}" if pd.notna(row['precio_numerico']) else 'N/A',
                f"{row['superficie_numerico']:.0f} m²" if pd.notna(row['superficie_numerico']) else 'N/A',
                f"${row['precio_m2']:,.0f}" if pd.notna(row['precio_m2']) else 'N/A',
                f"{row['ambientes_numerico']:.0f}" if pd.notna(row['ambientes_numerico']) else 'N/A'
            )

        console.print("\n")
        console.print(table)
        console.print("\n")

    def export_to_csv(self, filename: str = "analisis_propiedades.csv"):
        """Exporta los datos a CSV"""
        if self.df.empty:
            console.print("[yellow]No hay datos para exportar[/yellow]")
            return

        os.makedirs(config.OUTPUT_DIR, exist_ok=True)
        filepath = os.path.join(config.OUTPUT_DIR, filename)

        self.df.to_csv(filepath, index=False, encoding='utf-8-sig')
        console.print(f"[green]✓ Datos exportados a {filepath}[/green]")
        return filepath

    def export_to_excel(self, filename: str = "analisis_propiedades.xlsx"):
        """Exporta los datos a Excel"""
        if self.df.empty:
            console.print("[yellow]No hay datos para exportar[/yellow]")
            return

        os.makedirs(config.OUTPUT_DIR, exist_ok=True)
        filepath = os.path.join(config.OUTPUT_DIR, filename)

        with pd.ExcelWriter(filepath, engine='openpyxl') as writer:
            # Hoja principal con todos los datos
            self.df.to_excel(writer, sheet_name='Propiedades', index=False)

            # Hoja con estadísticas
            stats = self.get_statistics()
            if stats:
                stats_df = pd.DataFrame([stats])
                stats_df.to_excel(writer, sheet_name='Estadísticas', index=False)

            # Hoja con top propiedades
            top = self.get_top_properties(20, 'precio_m2')
            if not top.empty:
                top.to_excel(writer, sheet_name='Top 20 Precio_m2', index=False)

        console.print(f"[green]✓ Datos exportados a {filepath}[/green]")
        return filepath


if __name__ == "__main__":
    # Ejemplo de uso
    import json

    # Cargar datos del JSON
    json_path = os.path.join(config.OUTPUT_DIR, "propiedades.json")
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            properties = json.load(f)

        analyzer = PropertyAnalyzer(properties)
        analyzer.process_data()
        analyzer.display_statistics()
        analyzer.display_top_properties(10)
        analyzer.export_to_csv()
        analyzer.export_to_excel()
    else:
        console.print(f"[red]No se encontró el archivo {json_path}[/red]")
        console.print("[yellow]Primero ejecuta el scraper para obtener datos[/yellow]")
