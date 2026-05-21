# Cotización Interna — Omnia & Business

> **USO INTERNO — NO ENVIAR A VÍCTOR.**
> Costo base de implementación, antes de aplicar el margen de Omnia como intermediario.

**Fecha:** 21 de mayo
**Cliente:** Omnia & Business (sub-línea de Omibu, agencia de marketing, España)
**Contacto:** Víctor Molina Ángel
**Origen:** Call del 20 de mayo (Víctor, Henry, Germán, Oliver)

---

## Decisión de arquitectura

El Agente CEO **NO** se construye dentro del Agent Studio de GHL. Se construye como
**app externa con Claude API (Claude Code)**, que tiene mucho más margen para
razonamiento complejo (analizar transcripción + briefing, inferir lo no dicho,
comparar contra catálogo, redactar la propuesta).

Por eso la cotización va **separada en dos bloques**:
- **Bloque 1** — Implementación GHL (entra en la tabla de precios estándar).
- **Bloque 2** — Desarrollo custom de la app (se cotiza aparte).

---

## BLOQUE 1 — Implementación GHL

| Módulo | Setup | Mensual | Detalle |
|---|---|---|---|
| Setup de Subcuenta | $250 | — | DNS + dominio + WhatsApp + correos |
| CRM & Pipelines | $290 | — | 1 etapa extra + 1 vista extra |
| Automatizaciones (5 WFs) | $598 | — | 2 WF extra + nodos en SP01/SP02/SP03 |
| Integración Fathom | $300 | $50 | Webhook de entrada de transcripciones |
| Documentos & Templates | $250 | — | 3 plantillas (propuesta PDF + 2 emails) |
| Calendarios | $180 | — | Agendamiento de reuniones |
| Capacitación (2 sesiones) | $400 | — | 2 × $200 |
| Soporte | — | $150 | Mensual |
| **TOTAL BLOQUE 1** | **$2,268** | **$200/mes** | |

### Workflows incluidos (5)
- **LS01** — entrada de nuevos leads
- **SP01** — secuencia pre-reunión
- **SP02** — disparo post-reunión (envía datos al Agente CEO)
- **SP03** — seguimiento de propuesta
- **SP04** — proceso de cierre

### Pipeline (6 etapas)
`Nuevo Lead → Reunión → En Análisis → Propuesta → Negociación → Cerrado`

---

## BLOQUE 2 — Agente CEO (app externa, Claude API)

| Componente | Setup | Notas |
|---|---|---|
| Desarrollo de la app | $800 – $1,200 | Según versión (ver abajo) |
| API Anthropic (uso mensual) | Variable | Lo paga Omnia directo a Anthropic |

### Versión MVP — $800
- Interfaz simple: Víctor pega transcripción + briefing manualmente.
- Claude analiza y genera el borrador en pantalla.
- Sin integración GHL — copia/pega manual del output.

### Versión Completa — $1,200
- Webhook de Fathom → transcripción automática.
- Briefing cargado desde la app.
- Claude genera: diagnóstico + solución recomendada + borrador de propuesta.
- Push automático a GHL: nota en el contacto + cambio de stage.
- UI con sección de validación.

> **Atención (no doble cobro):** la integración Fathom ya está cotizada en el
> Bloque 1 ($300). Si Víctor toma la versión completa de la app, ese módulo cubre
> el webhook compartido — no se paga dos veces.

### Referencia de costos API
Volumen estimado: 10–20 propuestas/mes, ~5,000 tokens de transcripción + ~2,000 de
output. Costo mensual aproximado: **$5–15 USD/mes**. Marginal.

---

## RESUMEN TOTAL

| | Setup | Mensual |
|---|---|---|
| Bloque 1 — GHL | $2,268 | $200 |
| Bloque 2 — Agente CEO (versión completa) | $1,200 | ~$10–15 (API)\* |
| **TOTAL** | **$3,468** | **~$210/mes** |

\* API Anthropic facturada directamente por Omnia — no pasa por nosotros.

---

## Comparación de paquetes (Bloque 1) — referencia

Para el scope de GHL, **ningún paquete cerrado genera ahorro real**. À la carte gana
en los tres horizontes de tiempo.

| | À la carte | Starter | Pro | Enterprise |
|---|---|---|---|---|
| Setup base | — | $900 | $1,800 | $3,200 |
| + Subcuenta | $250 | $250 | $250 | $250 |
| + Extras | — | $1,863 | $618 | $318 |
| **Setup total** | **$2,268\*** | $3,013 | $2,668 | $3,768 |
| Mensual | $200\* | $280 | $410 | $530 |
| Ahorro año 1 | — | ❌ -$75 | ❌ -$1,290 | ❌ -$3,830 |

\* *Cifras à la carte ya sin el módulo de chatbot GHL (movido al Bloque 2).*

El "Pro" baja el setup pero sube el mensual $130 → pérdida de **$1,290 en el primer
año**. **Recomendación: à la carte.**

---

## Notas internas / palancas de negociación

- **Margen de Omnia:** estas cifras son el costo base **antes** del margen que Omnia
  aplica como intermediario hacia su cliente final.
- **Flexibilidad de fases:** se puede aprobar Bloque 1 ahora y Bloque 2 en fase 2.
  Buen argumento si Víctor necesita reducir el desembolso inicial.
- **Palancas para bajar el setup inicial:**
  1. Versión MVP de la app en vez de la completa (−$400).
  2. Bajar capacitación a 1 sesión (−$200).
  3. Diferir la integración Fathom a fase 2 (−$300 setup / −$50 mes; obliga a carga
     manual de transcripciones por un tiempo).
- **El Bloque 2 es producto replicable:** literalmente el mismo sistema que Omnia
  podría revender a sus propios clientes. Usarlo como argumento de valor — no es solo
  un gasto, es un activo comercial.
- **Urgencia detectada:** Víctor tiene convivencia directiva de Omibu el fin de
  semana y necesita llegar con algo concreto. La velocidad de respuesta juega a favor.
- **Blocker latente:** la conversación con Adel quedó pendiente y puede frenar la
  aprobación de presupuesto. Confirmar antes de comprometer fechas.

---

## Contexto de escala (para fase 2)

- **Primera ola:** 200–300 prospectos = clientes activos de Omibu contactados por los
  account managers (no es marketing aún, es cartera existente).
- **Base de datos:** 800 clientes activos + 2.000 históricos, exportables y listos
  para cargar a GHL.
- **Expansión Latam (fin de año):** posibles sucursales — México, Venezuela,
  Argentina. Relevante para dimensionar el sistema desde el diseño.
