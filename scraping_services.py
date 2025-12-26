"""
Integración con servicios de scraping profesionales
Soporta: ScraperAPI, ScrapingBee, Bright Data, Apify
"""

import os
import requests
from typing import Optional, Dict
from rich.console import Console
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

console = Console()


class ScraperAPIClient:
    """Cliente para ScraperAPI"""

    def __init__(self, api_key: Optional[str] = None):
        """
        Inicializa el cliente de ScraperAPI

        Args:
            api_key: API key de ScraperAPI (o usa variable de entorno SCRAPERAPI_KEY)
        """
        self.api_key = api_key or os.getenv('SCRAPERAPI_KEY')
        if not self.api_key:
            raise ValueError(
                "API key requerida. Configura SCRAPERAPI_KEY en .env o pásala como parámetro"
            )

        self.base_url = "http://api.scraperapi.com"

    def get(self, url: str, params: Optional[Dict] = None) -> requests.Response:
        """
        Hace request a través de ScraperAPI

        Args:
            url: URL a scrapear
            params: Parámetros adicionales

        Returns:
            Response object
        """
        payload = {
            'api_key': self.api_key,
            'url': url,
            'render': 'false',  # Cambia a 'true' si necesitas JavaScript
            'country_code': 'ar'  # Argentina
        }

        if params:
            payload.update(params)

        console.print(f"[cyan]ScraperAPI: Obteniendo {url}[/cyan]")

        try:
            response = requests.get(self.base_url, params=payload, timeout=60)
            response.raise_for_status()
            console.print(f"[green]✓ Respuesta obtenida: {response.status_code}[/green]")
            return response
        except requests.RequestException as e:
            console.print(f"[red]Error en ScraperAPI: {e}[/red]")
            raise


class ScrapingBeeClient:
    """Cliente para ScrapingBee"""

    def __init__(self, api_key: Optional[str] = None):
        """
        Inicializa el cliente de ScrapingBee

        Args:
            api_key: API key de ScrapingBee (o usa variable de entorno SCRAPINGBEE_KEY)
        """
        self.api_key = api_key or os.getenv('SCRAPINGBEE_KEY')
        if not self.api_key:
            raise ValueError(
                "API key requerida. Configura SCRAPINGBEE_KEY en .env o pásala como parámetro"
            )

        self.base_url = "https://app.scrapingbee.com/api/v1/"

    def get(self, url: str, params: Optional[Dict] = None) -> requests.Response:
        """
        Hace request a través de ScrapingBee

        Args:
            url: URL a scrapear
            params: Parámetros adicionales

        Returns:
            Response object
        """
        payload = {
            'api_key': self.api_key,
            'url': url,
            'render_js': 'true',  # JavaScript rendering activado para Zonaprop
            'premium_proxy': 'false',
            'country_code': 'ar'  # Argentina
        }

        if params:
            payload.update(params)

        console.print(f"[cyan]ScrapingBee: Obteniendo {url}[/cyan]")

        try:
            response = requests.get(self.base_url, params=payload, timeout=60)
            response.raise_for_status()
            console.print(f"[green]✓ Respuesta obtenida: {response.status_code}[/green]")
            return response
        except requests.RequestException as e:
            console.print(f"[red]Error en ScrapingBee: {e}[/red]")
            raise


class BrightDataClient:
    """Cliente para Bright Data (anteriormente Luminati)"""

    def __init__(
        self,
        username: Optional[str] = None,
        password: Optional[str] = None,
        host: str = "brd.superproxy.io",
        port: int = 22225
    ):
        """
        Inicializa el cliente de Bright Data

        Args:
            username: Usuario de Bright Data (o BRIGHTDATA_USERNAME en .env)
            password: Contraseña de Bright Data (o BRIGHTDATA_PASSWORD en .env)
            host: Host del proxy
            port: Puerto del proxy
        """
        self.username = username or os.getenv('BRIGHTDATA_USERNAME')
        self.password = password or os.getenv('BRIGHTDATA_PASSWORD')

        if not self.username or not self.password:
            raise ValueError(
                "Credenciales requeridas. Configura BRIGHTDATA_USERNAME y "
                "BRIGHTDATA_PASSWORD en .env o pásalas como parámetros"
            )

        self.proxy_url = f"http://{self.username}:{self.password}@{host}:{port}"

    def get(self, url: str, params: Optional[Dict] = None) -> requests.Response:
        """
        Hace request a través de Bright Data proxy

        Args:
            url: URL a scrapear
            params: Parámetros adicionales

        Returns:
            Response object
        """
        proxies = {
            'http': self.proxy_url,
            'https': self.proxy_url
        }

        console.print(f"[cyan]Bright Data: Obteniendo {url}[/cyan]")

        try:
            response = requests.get(
                url,
                params=params,
                proxies=proxies,
                timeout=60,
                verify=True
            )
            response.raise_for_status()
            console.print(f"[green]✓ Respuesta obtenida: {response.status_code}[/green]")
            return response
        except requests.RequestException as e:
            console.print(f"[red]Error en Bright Data: {e}[/red]")
            raise


class ApifyClient:
    """Cliente para Apify"""

    def __init__(self, api_token: Optional[str] = None):
        """
        Inicializa el cliente de Apify

        Args:
            api_token: Token de API de Apify (o APIFY_TOKEN en .env)
        """
        self.api_token = api_token or os.getenv('APIFY_TOKEN')

        if not self.api_token:
            raise ValueError(
                "Token requerido. Configura APIFY_TOKEN en .env o pásalo como parámetro"
            )

        self.base_url = "https://api.apify.com/v2"

    def run_actor(
        self,
        actor_id: str,
        run_input: Dict,
        wait_for_finish: int = 120
    ) -> Dict:
        """
        Ejecuta un actor de Apify

        Args:
            actor_id: ID del actor (ej: 'apify/web-scraper')
            run_input: Input para el actor
            wait_for_finish: Segundos a esperar

        Returns:
            Resultado del actor
        """
        console.print(f"[cyan]Apify: Ejecutando actor {actor_id}[/cyan]")

        # Iniciar el actor
        url = f"{self.base_url}/acts/{actor_id}/runs"
        headers = {'Authorization': f'Bearer {self.api_token}'}

        try:
            response = requests.post(
                url,
                json=run_input,
                headers=headers,
                params={'waitForFinish': wait_for_finish}
            )
            response.raise_for_status()

            run_data = response.json()
            console.print(f"[green]✓ Actor ejecutado exitosamente[/green]")

            # Obtener resultados
            dataset_id = run_data['data']['defaultDatasetId']
            items_url = f"{self.base_url}/datasets/{dataset_id}/items"

            items_response = requests.get(items_url, headers=headers)
            items_response.raise_for_status()

            return items_response.json()

        except requests.RequestException as e:
            console.print(f"[red]Error en Apify: {e}[/red]")
            raise

    def scrape_url(self, url: str) -> str:
        """
        Scrapea una URL simple usando Apify

        Args:
            url: URL a scrapear

        Returns:
            HTML de la página
        """
        run_input = {
            "startUrls": [{"url": url}],
            "maxCrawlingDepth": 0
        }

        results = self.run_actor('apify/web-scraper', run_input)

        if results and len(results) > 0:
            return results[0].get('html', '')

        return ''


def get_scraper_client(service: str = 'scraperapi'):
    """
    Factory function para obtener el cliente correcto

    Args:
        service: Servicio a usar ('scraperapi', 'scrapingbee', 'brightdata', 'apify')

    Returns:
        Cliente del servicio seleccionado
    """
    service = service.lower()

    if service == 'scraperapi':
        return ScraperAPIClient()
    elif service == 'scrapingbee':
        return ScrapingBeeClient()
    elif service == 'brightdata':
        return BrightDataClient()
    elif service == 'apify':
        return ApifyClient()
    else:
        raise ValueError(f"Servicio desconocido: {service}")


if __name__ == "__main__":
    # Demo
    console.print("\n[bold blue]═══ Demo de Servicios de Scraping ═══[/bold blue]\n")

    # Verificar qué servicios están configurados
    services_available = []

    if os.getenv('SCRAPERAPI_KEY'):
        services_available.append('ScraperAPI')
    if os.getenv('SCRAPINGBEE_KEY'):
        services_available.append('ScrapingBee')
    if os.getenv('BRIGHTDATA_USERNAME') and os.getenv('BRIGHTDATA_PASSWORD'):
        services_available.append('Bright Data')
    if os.getenv('APIFY_TOKEN'):
        services_available.append('Apify')

    if services_available:
        console.print(f"[green]Servicios configurados: {', '.join(services_available)}[/green]")
    else:
        console.print("[yellow]No hay servicios configurados en .env[/yellow]")
        console.print("\nConfigura al menos uno:")
        console.print("1. ScraperAPI: SCRAPERAPI_KEY=tu_api_key")
        console.print("2. ScrapingBee: SCRAPINGBEE_KEY=tu_api_key")
        console.print("3. Bright Data: BRIGHTDATA_USERNAME=tu_usuario y BRIGHTDATA_PASSWORD=tu_password")
        console.print("4. Apify: APIFY_TOKEN=tu_token")
