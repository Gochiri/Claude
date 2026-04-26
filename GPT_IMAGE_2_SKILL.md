# GPT Image 2 Skill — Setup

Skill instalada globalmente en `~/.claude/skills/gpt-image-2/` para generación y edición de imágenes con OpenAI GPT Image 2 vía Fal AI.

## Uso

```
/gpt-image-2   → generar imagen desde texto
```

Casos de uso para este proyecto:
- Logos y material de marca para clientes
- Banners y piezas de marketing de propiedades
- Carteles con texto legible (precios, nombres, eslóganes)
- Mockups de packaging o señalética

## Parámetros clave

| Parámetro | Default | Opciones |
|-----------|---------|---------|
| `quality` | medium (~$0.05) | low / medium / high |
| `image_size` | landscape_4_3 | portrait, square, landscape, custom |
| `num_images` | 1 | 1–4 |
| `output_format` | png | jpeg / png / webp |

## Notas

- La API key `FAL_KEY` está configurada en `~/.claude/settings.json` (global).
- Las URLs de imágenes generadas expiran — descargar inmediatamente.
- Para logos con texto: especificar el texto entre comillas en el prompt y el estilo de lettering.
- Fuente del skill: https://github.com/robonuggets/gpt-image-2-skill
