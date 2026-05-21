# Propuesta de Implementación — Omnia & Business

**Sistema operativo comercial sobre GoHighLevel + Agente CEO (IA)**

---

Hola Víctor,

Con base en lo que conversamos, te detallamos la propuesta para montar el sistema
operativo completo de Omnia sobre GoHighLevel, incluyendo el **agente de análisis**
que reduce el tiempo entre la reunión con el cliente y la propuesta final.

## El problema que resuelve

Hoy, después de cada reunión, el proceso de armar el presupuesto, coordinarlo con
el equipo y dejarlo listo para presentar te consume horas. El objetivo de este
sistema es claro:

> **Pasar de horas a ~15 minutos** entre la reunión y la propuesta lista para
> revisar, sin perder el control: el agente propone, vos validás y decidís.

**Flujo objetivo:**

```
Reunión con cliente (grabada con Fathom)
        +                ──►  Agente CEO  ──►  Borrador de propuesta  ──►  Víctor valida (15 min)
Briefing escrito              (IA)              · solución recomendada
                                                · presupuesto orientativo      ──►  PDF + agendamiento
                                                · timing                            + (opcional) link de pago
                                                · preguntas para vos
```

---

## Bloque 1 — Implementación GHL

El sistema operativo comercial de Omnia dentro de GoHighLevel.

- **CRM comercial completo** — pipeline con todas las etapas del proceso de ventas
  (Nuevo Lead → Reunión → En Análisis → Propuesta → Negociación → Cerrado), con
  vistas y filtros personalizados.
- **5 automatizaciones de proceso** — entrada de nuevos leads, secuencia previa a
  la reunión, disparador post-reunión, seguimiento de propuestas y proceso de cierre.
- **Integración con Fathom** — conexión directa para que las transcripciones de las
  reuniones lleguen automáticamente al sistema, sin pasos manuales.
- **Plantillas de comunicación** — propuesta en PDF lista para enviar, email de
  propuesta y email de seguimiento, todo configurado dentro de GHL.
- **Sistema de agendamiento** — calendario integrado para que los prospectos
  agenden reuniones directamente.
- **2 sesiones de capacitación** — para que tu equipo domine el sistema desde el día uno.
- **Soporte post-implementación** — acompañamiento mensual para ajustes y consultas.

| | Inversión |
|---|---|
| **Setup único** (incluye setup de subcuenta GHL) | **$2,268 USD** |
| **Cuota mensual** (soporte + integración) | **$200 USD/mes** |

---

## Bloque 2 — Agente CEO (app externa con IA)

El núcleo del sistema. Una aplicación que recibe la **transcripción de la reunión**
(vía Fathom) junto con el **briefing escrito** del cliente, analiza ambos inputs
contra el catálogo de Omnia y genera un **borrador de propuesta estratégica**:
diagnóstico del cliente, solución recomendada, presupuesto orientativo y timing.

> La validación y decisión final siempre quedan en tus manos. El agente hace de
> "CEO": analiza, recomienda y te plantea las preguntas clave — vos ajustás y cerrás.

Se ofrece en dos versiones para que puedas arrancar liviano o ir directo a la
experiencia completa:

### Versión MVP — $800
- Interfaz simple: pegás transcripción + briefing manualmente.
- La IA analiza y genera el borrador de propuesta en pantalla.
- Sin integración con GHL — copiás el output y lo aplicás.

### Versión Completa — $1,200
- La transcripción llega automáticamente vía webhook de Fathom.
- Subís o escribís el briefing desde la app.
- La IA genera: diagnóstico del cliente + solución recomendada + borrador de propuesta.
- **Push automático a GHL**: deja la nota en el contacto y mueve el stage del pipeline.
- UI con sección de validación ("¿confirmar esta propuesta?").

| | Inversión |
|---|---|
| **Desarrollo (versión completa)** | **$1,200 USD** |
| **Uso de IA (API)** | **~$10–15 USD/mes**, facturado directo por el proveedor según volumen |

> El uso de IA es marginal: para ~10–20 propuestas/mes ronda los $10–15 USD/mes.

---

## Inversión total

| | Setup | Mensual |
|---|---|---|
| **Bloque 1 — GHL** | $2,268 | $200 |
| **Bloque 2 — Agente CEO (versión completa)** | $1,200 | ~$10–15 (API)\* |
| **TOTAL** | **$3,468 USD** | **~$210 USD/mes** |

\* *El uso de IA se factura directamente por el proveedor (Anthropic) según consumo.*

La separación en dos bloques te da flexibilidad: podés aprobar el **Bloque 1 (GHL)**
primero y sumar el **Bloque 2 (Agente CEO)** en una fase posterior si el presupuesto
lo requiere.

---

## Tiempos y validez

- **Implementación estimada:** 3 a 4 semanas desde la aprobación.
- **Validez de la cotización:** 30 días.

Quedamos disponibles para cualquier ajuste o pregunta.

— Equipo GHL Team Latam
