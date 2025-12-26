"""
Generador de HTML personalizado para presentación de propiedades
Incluye branding del cliente (logo, nombre, teléfono, etc.)
"""

from typing import List, Dict, Optional
from datetime import datetime
import os
import base64
from rich.console import Console

console = Console()


class PropertyHTMLGenerator:
    """Generador de HTML personalizado con branding"""

    def __init__(
        self,
        business_name: str = "Inmobiliaria Premium",
        business_phone: str = "+54 11 1234-5678",
        business_email: str = "contacto@inmobiliaria.com",
        business_address: str = "Av. Santa Fe 1234, CABA",
        business_logo_path: Optional[str] = None,
        primary_color: str = "#2563eb",  # Azul
        secondary_color: str = "#1e40af"
    ):
        """
        Inicializa el generador de HTML

        Args:
            business_name: Nombre de la inmobiliaria/negocio
            business_phone: Teléfono de contacto
            business_email: Email de contacto
            business_address: Dirección física
            business_logo_path: Ruta al archivo del logo (opcional)
            primary_color: Color primario (hex)
            secondary_color: Color secundario (hex)
        """
        self.business_name = business_name
        self.business_phone = business_phone
        self.business_email = business_email
        self.business_address = business_address
        self.business_logo_path = business_logo_path
        self.primary_color = primary_color
        self.secondary_color = secondary_color

    def _encode_logo(self) -> Optional[str]:
        """Codifica el logo en base64 para embeber en HTML"""
        if not self.business_logo_path or not os.path.exists(self.business_logo_path):
            return None

        try:
            with open(self.business_logo_path, 'rb') as f:
                encoded = base64.b64encode(f.read()).decode('utf-8')
                ext = os.path.splitext(self.business_logo_path)[1].lower()
                mime_type = {
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.gif': 'image/gif',
                    '.svg': 'image/svg+xml'
                }.get(ext, 'image/png')
                return f"data:{mime_type};base64,{encoded}"
        except Exception as e:
            console.print(f"[yellow]Advertencia: No se pudo cargar el logo: {e}[/yellow]")
            return None

    def _format_price(self, price_str: str) -> str:
        """Formatea el precio para display"""
        import re
        numbers = re.findall(r'\d+', price_str.replace('.', '').replace(',', ''))
        if numbers:
            price = int(''.join(numbers))
            return f"USD {price:,}".replace(',', '.')
        return price_str

    def _calculate_price_per_m2(self, prop: Dict) -> Optional[str]:
        """Calcula el precio por m²"""
        import re
        price_str = prop.get('precio', '')
        surface_str = prop.get('caracteristicas', {}).get('superficie', '')

        # Extraer precio
        price_numbers = re.findall(r'\d+', price_str.replace('.', '').replace(',', ''))
        if not price_numbers:
            return None
        price = float(''.join(price_numbers))

        # Extraer superficie
        surface_numbers = re.findall(r'\d+', surface_str)
        if not surface_numbers:
            return None
        surface = float(surface_numbers[0])

        if surface > 0:
            price_m2 = price / surface
            return f"USD {price_m2:,.0f}".replace(',', '.')
        return None

    def generate_html(
        self,
        properties: List[Dict],
        title: str = "Propiedades Seleccionadas",
        subtitle: str = "Las mejores opciones según tus criterios",
        output_path: str = "propiedades_presentacion.html"
    ) -> str:
        """
        Genera HTML personalizado con las propiedades

        Args:
            properties: Lista de propiedades a incluir
            title: Título principal
            subtitle: Subtítulo
            output_path: Ruta donde guardar el HTML

        Returns:
            Ruta al archivo HTML generado
        """
        logo_data = self._encode_logo()
        fecha_generacion = datetime.now().strftime("%d/%m/%Y %H:%M")

        # Template HTML moderno y responsivo
        html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - {self.business_name}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: #333;
        }}

        .container {{
            max-width: 1200px;
            margin: 0 auto;
        }}

        .header {{
            background: white;
            padding: 30px;
            border-radius: 15px 15px 0 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }}

        .logo-section {{
            display: flex;
            align-items: center;
            gap: 20px;
        }}

        .logo {{
            max-width: 120px;
            max-height: 80px;
        }}

        .business-info h1 {{
            color: {self.primary_color};
            font-size: 28px;
            margin-bottom: 5px;
        }}

        .business-info p {{
            color: #666;
            font-size: 14px;
        }}

        .contact-info {{
            text-align: right;
            font-size: 14px;
            color: #666;
        }}

        .contact-info strong {{
            color: {self.primary_color};
            font-size: 16px;
        }}

        .title-section {{
            background: {self.primary_color};
            color: white;
            padding: 40px 30px;
            text-align: center;
        }}

        .title-section h2 {{
            font-size: 32px;
            margin-bottom: 10px;
        }}

        .title-section p {{
            font-size: 18px;
            opacity: 0.9;
        }}

        .properties-grid {{
            background: white;
            padding: 30px;
            border-radius: 0 0 15px 15px;
        }}

        .property-card {{
            background: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
            transition: transform 0.2s, box-shadow 0.2s;
            border-left: 4px solid {self.primary_color};
        }}

        .property-card:hover {{
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }}

        .property-header {{
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 15px;
            flex-wrap: wrap;
            gap: 10px;
        }}

        .property-title {{
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            flex: 1;
        }}

        .property-price {{
            font-size: 24px;
            font-weight: bold;
            color: {self.primary_color};
            white-space: nowrap;
        }}

        .property-details {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 15px 0;
        }}

        .detail-item {{
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #4b5563;
        }}

        .detail-icon {{
            width: 20px;
            height: 20px;
            color: {self.primary_color};
        }}

        .property-location {{
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }}

        .price-per-m2 {{
            background: {self.secondary_color};
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            margin-top: 10px;
        }}

        .property-link {{
            display: inline-block;
            margin-top: 15px;
            padding: 12px 24px;
            background: {self.primary_color};
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: background 0.2s;
        }}

        .property-link:hover {{
            background: {self.secondary_color};
        }}

        .footer {{
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            color: white;
            font-size: 14px;
        }}

        .ranking-badge {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
            margin-right: 15px;
            flex-shrink: 0;
        }}

        @media (max-width: 768px) {{
            .header {{
                flex-direction: column;
                text-align: center;
            }}

            .contact-info {{
                text-align: center;
                margin-top: 20px;
            }}

            .property-header {{
                flex-direction: column;
            }}

            .property-price {{
                width: 100%;
            }}
        }}

        @media print {{
            body {{
                background: white;
                padding: 0;
            }}

            .property-card {{
                break-inside: avoid;
                page-break-inside: avoid;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-section">
                {"<img src='" + logo_data + "' alt='Logo' class='logo'>" if logo_data else ""}
                <div class="business-info">
                    <h1>{self.business_name}</h1>
                    <p>{self.business_address}</p>
                </div>
            </div>
            <div class="contact-info">
                <p><strong>📞 {self.business_phone}</strong></p>
                <p>✉️ {self.business_email}</p>
            </div>
        </div>

        <div class="title-section">
            <h2>{title}</h2>
            <p>{subtitle}</p>
            <p style="margin-top: 10px; font-size: 14px; opacity: 0.8;">Generado el {fecha_generacion}</p>
        </div>

        <div class="properties-grid">
"""

        # Agregar cada propiedad
        for i, prop in enumerate(properties, 1):
            price_m2 = self._calculate_price_per_m2(prop)
            caracteristicas = prop.get('caracteristicas', {})

            html += f"""
            <div class="property-card">
                <div style="display: flex; align-items: start;">
                    <div class="ranking-badge">#{i}</div>
                    <div style="flex: 1;">
                        <div class="property-header">
                            <div class="property-title">{prop.get('titulo', 'Sin título')}</div>
                            <div class="property-price">{self._format_price(prop.get('precio', 'N/A'))}</div>
                        </div>

                        <div class="property-location">
                            <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            {prop.get('ubicacion', 'Ubicación no especificada')}
                        </div>

                        <div class="property-details">
                            <div class="detail-item">
                                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                </svg>
                                <strong>{caracteristicas.get('superficie', 'N/A')}</strong>
                            </div>
                            <div class="detail-item">
                                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <strong>{caracteristicas.get('ambientes', 'N/A')}</strong>
                            </div>
                            <div class="detail-item">
                                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                </svg>
                                <strong>{caracteristicas.get('habitaciones', 'N/A')}</strong>
                            </div>
                            <div class="detail-item">
                                <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <strong>{caracteristicas.get('baños', 'N/A')}</strong>
                            </div>
                        </div>

                        {f'<span class="price-per-m2">💎 {price_m2}/m²</span>' if price_m2 else ''}

                        <a href="{prop.get('url', '#')}" class="property-link" target="_blank">
                            Ver detalles completos →
                        </a>
                    </div>
                </div>
            </div>
"""

        html += f"""
        </div>

        <div class="footer">
            <p><strong>{self.business_name}</strong></p>
            <p>{self.business_phone} | {self.business_email}</p>
            <p style="margin-top: 10px; opacity: 0.8; font-size: 12px;">
                Este reporte fue generado automáticamente.
                Para más información, contáctenos.
            </p>
        </div>
    </div>
</body>
</html>
"""

        # Guardar HTML
        os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)

        console.print(f"[green]✓ HTML generado exitosamente: {output_path}[/green]")
        return output_path


if __name__ == "__main__":
    # Demo
    import json

    json_path = os.path.join('resultados', 'propiedades.json')
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            properties = json.load(f)

        # Tomar las primeras 5 propiedades
        top_5 = properties[:5]

        # Generar HTML
        generator = PropertyHTMLGenerator(
            business_name="Inmobiliaria Premium BA",
            business_phone="+54 11 4567-8900",
            business_email="ventas@premiuba.com",
            business_address="Av. Santa Fe 1234, CABA",
            primary_color="#2563eb",
            secondary_color="#1e40af"
        )

        output = generator.generate_html(
            top_5,
            title="Top 5 Propiedades Seleccionadas",
            subtitle="Las mejores opciones según análisis de precio/m²",
            output_path="resultados/presentacion_propiedades.html"
        )

        console.print(f"\n[cyan]Abre el archivo para ver el resultado:[/cyan]")
        console.print(f"[yellow]{output}[/yellow]\n")
    else:
        console.print(f"[red]No se encontró {json_path}[/red]")
