# 🏗️ ARQUITECTURA MVP: UI SKIN PARA GOHIGHLEVEL

**Documento de Arquitectura Técnica**
**Versión:** 1.0
**Fecha:** Diciembre 2025
**Objetivo:** MVP para mercado latinoamericano - 6 semanas

---

## 📋 TABLA DE CONTENIDOS

1. [Stack Tecnológico](#stack-tecnológico)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Mecanismo de Inyección](#mecanismo-de-inyección)
4. [Feature Lock: Lógica Detallada](#feature-lock-lógica-detallada)
5. [Estrategia Anti-Breaking Changes](#estrategia-anti-breaking-changes)
6. [Roadmap de 6 Semanas](#roadmap-de-6-semanas)
7. [Costos Estimados](#costos-estimados)

---

## 🛠️ STACK TECNOLÓGICO

### **Backend** (API + Base de Datos)

```yaml
Framework: FastAPI (Python 3.11+)
  - Justificación: Rápido desarrollo, auto-documentación, async nativo
  - Alternativa: Node.js + Express (si prefieres JavaScript full-stack)

Base de Datos: PostgreSQL (Supabase Free Tier)
  - 500MB storage + 2GB bandwidth/mes
  - Row Level Security (RLS) para multi-tenancy
  - Realtime subscriptions (útil para futuras features)

ORM: SQLAlchemy + Alembic
  - Migraciones versionadas
  - Queries tipo-seguras

Autenticación: JWT + bcrypt
  - Tokens con expiración de 7 días
  - Refresh tokens en httpOnly cookies

Cache: Redis (Upstash Free Tier)
  - 10,000 requests/día
  - Cacheo de configuraciones de UI (TTL: 5 minutos)

CDN: Cloudflare (Free Tier)
  - Cacheo del script de inyección
  - Edge caching para CSS/JS customizados
```

### **Frontend** (Constructor Visual)

```yaml
Framework: React 18 + Vite
  - Build ultra-rápido
  - Hot Module Replacement (HMR)

UI Library: Shadcn/ui + Tailwind CSS
  - Componentes copiables (sin npm bloat)
  - Personalización total
  - DaisyUI como alternativa más rápida

Color Picker: react-colorful (2KB)
  - Sin dependencias pesadas

Icon Picker: Lucide React
  - Tree-shakeable, solo importas lo que usas

State Management: Zustand
  - Más simple que Redux
  - Persist middleware para localStorage

Form Handling: React Hook Form + Zod
  - Validación en runtime
  - Type-safe
```

### **Hosting & Deployment**

```yaml
Backend API: Railway.app (Free Tier)
  - $5/mes después de créditos
  - Deploy automático desde GitHub

Frontend: Vercel (Free Tier)
  - Edge network global
  - Preview deployments automáticos

Script CDN: Cloudflare Workers (Free Tier)
  - 100,000 requests/día
  - <1ms latency con edge caching
```

### **Monitoreo & Logs**

```yaml
Error Tracking: Sentry (Free Tier)
  - 5,000 eventos/mes

Analytics: Plausible o PostHog (self-hosted)
  - Evita problemas GDPR de Google Analytics

Uptime Monitoring: UptimeRobot (Free Tier)
  - 50 monitores, 5 min interval
```

---

## 🏛️ ARQUITECTURA DEL SISTEMA

### **Diagrama de Flujo**

```
┌─────────────────────────────────────────────────────────────┐
│                    GHL DASHBOARD (Cliente)                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  <script src="https://cdn.tudominio.com/inject.js"> │   │
│  └──────────────────────┬──────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
            ┌─────────────────────────────┐
            │  Cloudflare CDN (Edge)      │
            │  Cache: 5 min               │
            └──────────────┬──────────────┘
                          │
                          ▼
            ┌─────────────────────────────┐
            │  API Backend (Railway)      │
            │  GET /api/v1/config/:id     │
            └──────────────┬──────────────┘
                          │
            ┌─────────────┴─────────────┐
            │                           │
            ▼                           ▼
    ┌───────────────┐         ┌─────────────────┐
    │ Redis Cache   │         │  PostgreSQL     │
    │ (Upstash)     │         │  (Supabase)     │
    └───────────────┘         └─────────────────┘
            │
            ▼
    ┌───────────────────────────────┐
    │  Respuesta JSON               │
    │  {                            │
    │    "primaryColor": "#FF6B35",│
    │    "sidebarHidden": ["contacts"],│
    │    "customCSS": "..."         │
    │  }                            │
    └───────────────────────────────┘
```

### **Base de Datos: Esquema Core**

```sql
-- Tabla principal: Agencias
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ghl_agency_id VARCHAR(50) UNIQUE NOT NULL,  -- ID de GHL
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    plan_tier VARCHAR(20) DEFAULT 'free',  -- free, pro, enterprise
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuraciones de estilo por agencia
CREATE TABLE agency_styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,

    -- Colores
    primary_color VARCHAR(7) DEFAULT '#4F46E5',
    secondary_color VARCHAR(7) DEFAULT '#10B981',
    accent_color VARCHAR(7) DEFAULT '#F59E0B',
    sidebar_bg VARCHAR(7) DEFAULT '#1F2937',
    sidebar_text VARCHAR(7) DEFAULT '#F9FAFB',

    -- Tipografía
    font_family VARCHAR(100) DEFAULT 'Inter',
    font_size_base INTEGER DEFAULT 14,

    -- Logo
    logo_url TEXT,
    favicon_url TEXT,

    -- CSS/JS custom
    custom_css TEXT,
    custom_js TEXT,

    -- Metadata
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(agency_id)
);

-- Sub-cuentas (clientes de las agencias)
CREATE TABLE subaccounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    ghl_subaccount_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    plan_tier VARCHAR(20) DEFAULT 'basic',  -- basic, pro, enterprise
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature Locks (qué features están bloqueadas por plan)
CREATE TABLE feature_locks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subaccount_id UUID REFERENCES subaccounts(id) ON DELETE CASCADE,

    -- Features del sidebar de GHL (basado en selectores)
    hide_dashboard BOOLEAN DEFAULT false,
    hide_conversations BOOLEAN DEFAULT false,
    hide_calendar BOOLEAN DEFAULT false,
    hide_contacts BOOLEAN DEFAULT false,
    hide_opportunities BOOLEAN DEFAULT false,
    hide_payments BOOLEAN DEFAULT false,
    hide_sites BOOLEAN DEFAULT false,
    hide_funnels BOOLEAN DEFAULT false,
    hide_workflows BOOLEAN DEFAULT false,
    hide_triggers BOOLEAN DEFAULT false,
    hide_reporting BOOLEAN DEFAULT false,
    hide_memberships BOOLEAN DEFAULT false,
    hide_marketing BOOLEAN DEFAULT false,

    -- Features adicionales (botones, acciones)
    disable_exports BOOLEAN DEFAULT false,
    disable_bulk_actions BOOLEAN DEFAULT false,

    -- Metadata
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(subaccount_id)
);

-- Índices para performance
CREATE INDEX idx_agencies_ghl_id ON agencies(ghl_agency_id);
CREATE INDEX idx_subaccounts_ghl_id ON subaccounts(ghl_subaccount_id);
CREATE INDEX idx_subaccounts_agency ON subaccounts(agency_id);
CREATE INDEX idx_feature_locks_subaccount ON feature_locks(subaccount_id);
```

---

## 💉 MECANISMO DE INYECCIÓN

### **Script de Inyección (inject.js)**

Este es el script que el usuario pegará en GHL. Debe ser:
- **Pequeño** (<5KB minificado)
- **Rápido** (carga async)
- **Resiliente** (maneja errores silenciosamente)

```javascript
// inject.js - Versión simplificada
(function() {
    'use strict';

    // 1. Detectar IDs de GHL desde la URL o localStorage
    function getGHLIds() {
        const url = window.location.href;

        // Parsear location_id (sub-account ID)
        const locationMatch = url.match(/location[=/]([a-zA-Z0-9_-]+)/);
        const locationId = locationMatch ? locationMatch[1] : null;

        // Agency ID desde localStorage (GHL lo guarda)
        const agencyId = localStorage.getItem('ghl_agency_id') ||
                        sessionStorage.getItem('agency_id');

        return { agencyId, locationId };
    }

    // 2. Fetch configuración desde tu API
    async function fetchConfig(agencyId, locationId) {
        try {
            const cacheKey = `uiskin_${agencyId}_${locationId}`;

            // Intentar cache primero (reduce requests)
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                // Cache válido por 5 minutos
                if (Date.now() - timestamp < 300000) {
                    return data;
                }
            }

            // Fetch desde API
            const response = await fetch(
                `https://api.tudominio.com/api/v1/config?` +
                `agency=${agencyId}&location=${locationId}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    // Timeout de 3 segundos
                    signal: AbortSignal.timeout(3000)
                }
            );

            if (!response.ok) throw new Error('Config fetch failed');

            const data = await response.json();

            // Guardar en cache
            sessionStorage.setItem(cacheKey, JSON.stringify({
                data,
                timestamp: Date.now()
            }));

            return data;

        } catch (error) {
            console.warn('[UI Skin] Failed to load config:', error);
            return null;
        }
    }

    // 3. Aplicar estilos
    function applyStyles(config) {
        if (!config) return;

        // Crear hoja de estilos dinámica
        const styleId = 'uiskin-custom-styles';
        let styleEl = document.getElementById(styleId);

        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }

        // CSS Variables (método más resiliente)
        const cssVars = `
            :root {
                --uiskin-primary: ${config.primaryColor} !important;
                --uiskin-secondary: ${config.secondaryColor} !important;
                --uiskin-accent: ${config.accentColor} !important;
                --uiskin-sidebar-bg: ${config.sidebarBg} !important;
                --uiskin-sidebar-text: ${config.sidebarText} !important;
            }

            /* Aplicar a selectores comunes de GHL */
            [class*="sidebar"],
            [class*="Sidebar"],
            aside[class*="navigation"] {
                background-color: var(--uiskin-sidebar-bg) !important;
                color: var(--uiskin-sidebar-text) !important;
            }

            button[class*="primary"],
            [class*="btn-primary"] {
                background-color: var(--uiskin-primary) !important;
            }

            /* CSS custom del usuario */
            ${config.customCSS || ''}
        `;

        styleEl.textContent = cssVars;
    }

    // 4. Aplicar Feature Locks
    function applyFeatureLocks(config) {
        if (!config || !config.featureLocks) return;

        const locks = config.featureLocks;

        // Mapeo de features a selectores (ver sección siguiente)
        const selectorMap = {
            'dashboard': ['[href*="/dashboard"]', '[data-menu="dashboard"]'],
            'conversations': ['[href*="/conversations"]', '[data-menu="conversations"]'],
            'calendar': ['[href*="/calendar"]', '[data-menu="calendar"]'],
            'contacts': ['[href*="/contacts"]', '[data-menu="contacts"]'],
            'opportunities': ['[href*="/opportunities"]', '[data-menu="opportunities"]'],
            'payments': ['[href*="/payments"]', '[data-menu="payments"]'],
            'sites': ['[href*="/sites"]', '[data-menu="sites"]'],
            'funnels': ['[href*="/funnels"]', '[data-menu="funnels"]'],
            'workflows': ['[href*="/workflows"]', '[data-menu="workflows"]'],
            'reporting': ['[href*="/reporting"]', '[data-menu="analytics"]']
        };

        // Ocultar elementos bloqueados
        Object.keys(locks).forEach(feature => {
            if (locks[feature] === true && selectorMap[feature]) {
                const selectors = selectorMap[feature].join(', ');
                hideElements(selectors);
            }
        });
    }

    // Helper: Ocultar elementos
    function hideElements(selectors) {
        const elements = document.querySelectorAll(selectors);
        elements.forEach(el => {
            // Usar !important para sobrescribir estilos de GHL
            el.style.cssText = 'display: none !important; visibility: hidden !important;';
            // Marcar como bloqueado (para debugging)
            el.setAttribute('data-uiskin-locked', 'true');
        });
    }

    // 5. Observer para cambios dinámicos (GHL es SPA)
    function observeDOMChanges(config) {
        const observer = new MutationObserver((mutations) => {
            // Re-aplicar locks cuando el DOM cambia
            applyFeatureLocks(config);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Limpieza al descargar página
        window.addEventListener('beforeunload', () => observer.disconnect());
    }

    // 6. Inicialización
    async function init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        const { agencyId, locationId } = getGHLIds();

        if (!agencyId) {
            console.warn('[UI Skin] No agency ID detected');
            return;
        }

        // Fetch y aplicar configuración
        const config = await fetchConfig(agencyId, locationId);

        if (config) {
            applyStyles(config);
            applyFeatureLocks(config);
            observeDOMChanges(config);

            console.log('[UI Skin] Loaded successfully');
        }
    }

    // Ejecutar inmediatamente
    init();
})();
```

### **Endpoints de API**

```python
# FastAPI - main.py
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import redis
import json

app = FastAPI(title="GHL UI Skin API", version="1.0.0")

# CORS para permitir requests desde GHL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://*.gohighlevel.com", "https://*.leadconnectorhq.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["*"],
)

# Redis client (Upstash)
redis_client = redis.from_url(
    "redis://default:xxxxx@upstash.io:6379",
    decode_responses=True
)

@app.get("/api/v1/config")
async def get_config(
    agency: str = Query(..., min_length=1),
    location: str = Query(None),
    db: Session = Depends(get_db)
):
    """
    Retorna la configuración de UI para una agencia/sub-cuenta.
    Usa cache Redis para minimizar queries a DB.
    """
    cache_key = f"config:{agency}:{location or 'default'}"

    # Intentar cache primero
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    # Query a DB
    agency_obj = db.query(Agency).filter_by(ghl_agency_id=agency).first()
    if not agency_obj:
        raise HTTPException(status_code=404, detail="Agency not found")

    # Obtener estilos
    styles = db.query(AgencyStyle).filter_by(agency_id=agency_obj.id).first()

    # Obtener feature locks si hay location
    feature_locks = {}
    if location:
        subaccount = db.query(Subaccount).filter_by(
            ghl_subaccount_id=location
        ).first()

        if subaccount:
            locks = db.query(FeatureLock).filter_by(
                subaccount_id=subaccount.id
            ).first()

            if locks:
                feature_locks = {
                    "dashboard": locks.hide_dashboard,
                    "conversations": locks.hide_conversations,
                    "calendar": locks.hide_calendar,
                    "contacts": locks.hide_contacts,
                    "opportunities": locks.hide_opportunities,
                    "payments": locks.hide_payments,
                    "sites": locks.hide_sites,
                    "funnels": locks.hide_funnels,
                    "workflows": locks.hide_workflows,
                    "reporting": locks.hide_reporting
                }

    # Construir respuesta
    config = {
        "primaryColor": styles.primary_color if styles else "#4F46E5",
        "secondaryColor": styles.secondary_color if styles else "#10B981",
        "accentColor": styles.accent_color if styles else "#F59E0B",
        "sidebarBg": styles.sidebar_bg if styles else "#1F2937",
        "sidebarText": styles.sidebar_text if styles else "#F9FAFB",
        "logoUrl": styles.logo_url if styles else None,
        "customCSS": styles.custom_css if styles else "",
        "customJS": styles.custom_js if styles else "",
        "featureLocks": feature_locks
    }

    # Guardar en cache (5 minutos)
    redis_client.setex(cache_key, 300, json.dumps(config))

    return config

@app.post("/api/v1/styles")
async def update_styles(
    styles_data: dict,
    current_agency: Agency = Depends(get_current_agency),
    db: Session = Depends(get_db)
):
    """
    Actualiza los estilos de una agencia.
    Requiere autenticación JWT.
    """
    # Validar datos con Pydantic model
    # ...

    # Actualizar DB
    # ...

    # Invalidar cache
    cache_pattern = f"config:{current_agency.ghl_agency_id}:*"
    for key in redis_client.scan_iter(match=cache_pattern):
        redis_client.delete(key)

    return {"success": True, "message": "Styles updated"}
```

---

## 🔒 FEATURE LOCK: LÓGICA DETALLADA

### **Problema: Selectores CSS de GHL**

GHL usa class names generados dinámicamente (ej: `jsx-123456`), que cambian entre builds. La solución es usar **múltiples estrategias de selección**.

### **Estrategia Multi-Selector**

```javascript
/**
 * Sistema de selección resiliente para Feature Lock
 * Usa 4 estrategias en cascada:
 * 1. Atributos data-* (si GHL los usa)
 * 2. href patterns (más estable)
 * 3. Text content (último recurso)
 * 4. Structure-based (posición en el árbol DOM)
 */

class FeatureLockManager {
    constructor(config) {
        this.config = config;
        this.selectorStrategies = this.buildStrategies();
        this.hiddenElements = new Set();
    }

    /**
     * Estrategias de selección por feature
     */
    buildStrategies() {
        return {
            'dashboard': [
                // Estrategia 1: Atributos data
                '[data-menu-item="dashboard"]',
                '[data-route="dashboard"]',

                // Estrategia 2: href patterns
                'a[href*="/location/"][href*="/dashboard"]:not([href*="/settings"])',
                'a[href$="/dashboard"]',

                // Estrategia 3: Text content + contexto
                'nav a:has-text("Dashboard")',  // Pseudo-selector, ver implementación abajo

                // Estrategia 4: Structure (sidebar > list > item)
                'aside nav > ul > li:first-child a'
            ],

            'conversations': [
                '[data-menu-item="conversations"]',
                'a[href*="/conversations"]',
                'a[href*="/inbox"]',
                'nav a:has-text("Conversations")',
                'aside nav > ul > li:nth-child(2) a'
            ],

            'calendar': [
                '[data-menu-item="calendar"]',
                'a[href*="/calendar"]',
                'nav a:has-text("Calendar")',
                'aside nav a[href*="/appointment"]'
            ],

            'contacts': [
                '[data-menu-item="contacts"]',
                'a[href*="/contacts"]',
                'a[href*="/contacts/smart_list"]',
                'nav a:has-text("Contacts")'
            ],

            'opportunities': [
                '[data-menu-item="opportunities"]',
                'a[href*="/opportunities"]',
                'a[href*="/launchpad"]',
                'nav a:has-text("Opportunities")'
            ],

            'payments': [
                '[data-menu-item="payments"]',
                'a[href*="/payments"]',
                'a[href*="/subscriptions"]',
                'nav a:has-text("Payments")'
            ],

            'sites': [
                '[data-menu-item="sites"]',
                'a[href*="/sites"]',
                'a[href*="/funnels-websites"]',
                'nav a:has-text("Sites")'
            ],

            'funnels': [
                '[data-menu-item="funnels"]',
                'a[href*="/funnels"]',
                'nav a:has-text("Funnels")'
            ],

            'workflows': [
                '[data-menu-item="workflows"]',
                'a[href*="/workflows"]',
                'a[href*="/automation"]',
                'nav a:has-text("Workflows")'
            ],

            'reporting': [
                '[data-menu-item="reporting"]',
                '[data-menu-item="analytics"]',
                'a[href*="/reporting"]',
                'a[href*="/analytics"]',
                'nav a:has-text("Reporting")'
            ]
        };
    }

    /**
     * Selector por texto (compatible con todos los browsers)
     */
    findByText(text, parentSelector = 'nav') {
        const parent = document.querySelector(parentSelector);
        if (!parent) return [];

        const walker = document.createTreeWalker(
            parent,
            NodeFilter.SHOW_TEXT,
            null
        );

        const matches = [];
        let node;

        while (node = walker.nextNode()) {
            if (node.textContent.trim().toLowerCase().includes(text.toLowerCase())) {
                // Encontrar el elemento <a> más cercano
                let element = node.parentElement;
                while (element && element.tagName !== 'A') {
                    element = element.parentElement;
                }
                if (element) matches.push(element);
            }
        }

        return matches;
    }

    /**
     * Encuentra elementos usando todas las estrategias
     */
    findElements(feature) {
        const strategies = this.selectorStrategies[feature];
        if (!strategies) return [];

        const elements = new Set();

        for (const selector of strategies) {
            try {
                // Handle :has-text() pseudo-selector
                if (selector.includes(':has-text')) {
                    const match = selector.match(/has-text\("([^"]+)"\)/);
                    if (match) {
                        const found = this.findByText(match[1]);
                        found.forEach(el => elements.add(el));
                    }
                } else {
                    // Query normal
                    const found = document.querySelectorAll(selector);
                    found.forEach(el => elements.add(el));
                }
            } catch (error) {
                // Selector inválido, continuar
                console.debug(`[UI Skin] Invalid selector: ${selector}`);
            }
        }

        return Array.from(elements);
    }

    /**
     * Aplica locks a las features configuradas
     */
    applyLocks() {
        const locks = this.config.featureLocks || {};

        Object.keys(locks).forEach(feature => {
            if (locks[feature] === true) {
                this.lockFeature(feature);
            }
        });
    }

    /**
     * Bloquea una feature específica
     */
    lockFeature(feature) {
        const elements = this.findElements(feature);

        elements.forEach(element => {
            // Ocultar elemento
            element.style.cssText = `
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            `;

            // Marcar como bloqueado
            element.setAttribute('data-uiskin-locked', 'true');
            element.setAttribute('data-uiskin-feature', feature);

            // Agregar a set para tracking
            this.hiddenElements.add(element);

            // Ocultar también el padre <li> si existe
            const parentLi = element.closest('li');
            if (parentLi) {
                parentLi.style.cssText = 'display: none !important;';
                parentLi.setAttribute('data-uiskin-locked', 'true');
                this.hiddenElements.add(parentLi);
            }
        });

        console.log(`[UI Skin] Locked feature: ${feature} (${elements.length} elements)`);
    }

    /**
     * Re-aplica locks (útil después de cambios en el DOM)
     */
    reapplyLocks() {
        // Limpiar elementos anteriores que ya no existen
        this.hiddenElements.forEach(el => {
            if (!document.contains(el)) {
                this.hiddenElements.delete(el);
            }
        });

        // Re-aplicar locks
        this.applyLocks();
    }

    /**
     * Observa cambios en el DOM (GHL es SPA)
     */
    observe() {
        const observer = new MutationObserver((mutations) => {
            // Debounce para evitar re-aplicar en cada cambio
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.reapplyLocks();
            }, 100);
        });

        // Observar sidebar y navigation
        const targets = document.querySelectorAll('aside, nav, [role="navigation"]');
        targets.forEach(target => {
            observer.observe(target, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });
        });

        return observer;
    }
}

// Uso en inject.js
const lockManager = new FeatureLockManager(config);
lockManager.applyLocks();
lockManager.observe();
```

### **Prevención de Bypass**

```javascript
/**
 * Protecciones adicionales para evitar que usuarios técnicos
 * bypasseen el Feature Lock
 */

class FeatureLockProtection {
    constructor(lockManager) {
        this.lockManager = lockManager;
        this.setupProtections();
    }

    setupProtections() {
        // 1. Interceptar navigation
        this.interceptNavigation();

        // 2. Bloquear acceso directo por URL
        this.blockDirectURLAccess();

        // 3. Prevenir modificación de estilos
        this.protectStyles();
    }

    /**
     * Intercepta clicks en elementos bloqueados
     */
    interceptNavigation() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a');
            if (!target) return;

            // Verificar si es un elemento bloqueado
            const isLocked = target.hasAttribute('data-uiskin-locked');

            if (isLocked) {
                e.preventDefault();
                e.stopPropagation();

                // Mostrar mensaje (opcional)
                this.showLockedMessage(target);

                return false;
            }
        }, true);  // useCapture = true para interceptar antes
    }

    /**
     * Bloquea acceso directo por URL
     */
    blockDirectURLAccess() {
        const locks = this.lockManager.config.featureLocks || {};
        const blockedPaths = [];

        // Construir lista de paths bloqueados
        Object.keys(locks).forEach(feature => {
            if (locks[feature] === true) {
                blockedPaths.push(feature);
            }
        });

        // Observar cambios de URL (SPA)
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                this.checkURL(url, blockedPaths);
            }
        }).observe(document, { subtree: true, childList: true });

        // También escuchar popstate
        window.addEventListener('popstate', () => {
            this.checkURL(location.href, blockedPaths);
        });
    }

    checkURL(url, blockedPaths) {
        for (const path of blockedPaths) {
            if (url.includes(`/${path}`)) {
                // Redirect a dashboard
                console.warn(`[UI Skin] Access denied to: ${path}`);
                window.location.href = window.location.origin + '/location/' +
                    this.getLocationId() + '/dashboard';
                break;
            }
        }
    }

    /**
     * Previene que el usuario modifique los estilos
     */
    protectStyles() {
        const styleEl = document.getElementById('uiskin-custom-styles');
        if (!styleEl) return;

        // Observar cambios en el elemento <style>
        new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' ||
                    mutation.type === 'characterData') {
                    // Re-aplicar estilos si fueron modificados
                    this.lockManager.applyLocks();
                }
            });
        }).observe(styleEl, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }

    showLockedMessage(element) {
        const feature = element.getAttribute('data-uiskin-feature');

        // Crear tooltip temporal
        const tooltip = document.createElement('div');
        tooltip.textContent = `Esta función está bloqueada. Contacta a tu administrador.`;
        tooltip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #DC2626;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 999999;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(tooltip);

        setTimeout(() => tooltip.remove(), 3000);
    }

    getLocationId() {
        const match = location.href.match(/location[=/]([a-zA-Z0-9_-]+)/);
        return match ? match[1] : '';
    }
}
```

---

## 🛡️ ESTRATEGIA ANTI-BREAKING CHANGES

### **Problema**

GHL actualiza su UI cada 2-4 semanas, cambiando class names y estructura DOM.

### **Solución: Sistema de Versionado de Selectores**

```javascript
/**
 * Selector Version Manager
 * Mantiene múltiples versiones de selectores y auto-detecta cuál usar
 */

class SelectorVersionManager {
    constructor() {
        this.versions = this.loadVersions();
        this.currentVersion = null;
    }

    /**
     * Versiones de selectores
     * Cada versión tiene fecha y selectores específicos
     */
    loadVersions() {
        return {
            'v1.0': {
                date: '2025-01-01',
                selectors: {
                    'dashboard': ['aside > nav a[href*="/dashboard"]'],
                    'conversations': ['aside > nav a[href*="/conversations"]'],
                    // ...
                }
            },
            'v1.1': {
                date: '2025-02-15',
                selectors: {
                    'dashboard': ['nav [data-nav-item="dashboard"]'],
                    'conversations': ['nav [data-nav-item="conversations"]'],
                    // ...
                }
            },
            'v2.0': {
                date: '2025-03-01',
                selectors: {
                    'dashboard': ['[data-menu="dashboard"]'],
                    'conversations': ['[data-menu="conversations"]'],
                    // ...
                }
            }
        };
    }

    /**
     * Auto-detecta la versión correcta basándose en el DOM actual
     */
    detectVersion() {
        // Probar cada versión en orden inverso (más reciente primero)
        const versions = Object.keys(this.versions).reverse();

        for (const version of versions) {
            const selectors = this.versions[version].selectors;
            let matchCount = 0;

            // Probar algunos selectores clave
            const testFeatures = ['dashboard', 'conversations', 'contacts'];

            for (const feature of testFeatures) {
                const selectorList = selectors[feature];
                if (!selectorList) continue;

                for (const selector of selectorList) {
                    try {
                        if (document.querySelector(selector)) {
                            matchCount++;
                            break;
                        }
                    } catch (e) {
                        // Selector inválido
                    }
                }
            }

            // Si encontramos al menos 2 de 3, usamos esta versión
            if (matchCount >= 2) {
                console.log(`[UI Skin] Detected GHL UI version: ${version}`);
                this.currentVersion = version;
                return version;
            }
        }

        // Fallback a la versión más reciente
        const latest = Object.keys(this.versions).pop();
        console.warn(`[UI Skin] Could not detect version, using latest: ${latest}`);
        this.currentVersion = latest;
        return latest;
    }

    /**
     * Obtiene selectores para la versión actual
     */
    getSelectors(feature) {
        if (!this.currentVersion) {
            this.detectVersion();
        }

        return this.versions[this.currentVersion]?.selectors[feature] || [];
    }
}
```

### **Backend: API de Notificación de Cambios**

```python
# Endpoint para que los usuarios reporten cuando algo se rompe
@app.post("/api/v1/report-broken")
async def report_broken(
    data: dict,
    db: Session = Depends(get_db)
):
    """
    Los usuarios pueden reportar features que dejaron de funcionar.
    Esto te alerta para actualizar selectores.
    """
    # Guardar reporte
    report = BrokenFeatureReport(
        agency_id=data['agencyId'],
        feature=data['feature'],
        user_agent=data['userAgent'],
        ghl_version=data.get('ghlVersion'),
        screenshot_url=data.get('screenshot'),
        created_at=datetime.utcnow()
    )
    db.add(report)
    db.commit()

    # Enviar alerta a Slack/email
    send_alert(f"🚨 Feature broken: {data['feature']}")

    return {"success": True, "message": "Reporte recibido"}

# Endpoint para actualizar selectores sin re-deploy
@app.put("/api/v1/selectors")
async def update_selectors(
    version: str,
    selectors: dict,
    admin_key: str = Header(...)
):
    """
    Permite actualizar selectores en caliente, sin re-deploy del inject.js
    """
    if admin_key != os.getenv("ADMIN_API_KEY"):
        raise HTTPException(401, "Unauthorized")

    # Guardar en Redis (el inject.js los fetchea)
    redis_client.set(f"selectors:version:{version}", json.dumps(selectors))

    # Invalidar cache de configs
    redis_client.delete("config:*")

    return {"success": True, "message": f"Selectors updated for {version}"}
```

### **Monitoreo Proactivo**

```python
# Script de monitoreo (ejecutar cada 6 horas con cron)
import requests
from bs4 import BeautifulSoup

def check_ghl_structure():
    """
    Simula login a GHL y verifica que los selectores sigan funcionando
    """
    # Login a cuenta de prueba
    session = requests.Session()
    # ... login logic ...

    # Navegar a dashboard
    response = session.get("https://app.gohighlevel.com/location/TEST/dashboard")
    soup = BeautifulSoup(response.text, 'html.parser')

    # Verificar selectores críticos
    critical_selectors = [
        'aside > nav a[href*="/dashboard"]',
        'aside > nav a[href*="/conversations"]',
        '[data-menu="contacts"]'
    ]

    broken = []
    for selector in critical_selectors:
        if not soup.select(selector):
            broken.append(selector)

    if broken:
        send_alert(f"🚨 Selectores rotos: {', '.join(broken)}")
        # Auto-trigger re-detection
        trigger_version_update()

# Ejecutar con GitHub Actions cada 6 horas
```

---

## 🗓️ ROADMAP DE 6 SEMANAS

### **Semana 1: Setup & Infraestructura**

**Objetivos:**
- ✅ Configurar repositorio y CI/CD
- ✅ Desplegar backend en Railway
- ✅ Configurar PostgreSQL (Supabase)
- ✅ Configurar Redis (Upstash)

**Tareas (40 horas):**

| Día | Tarea | Horas |
|-----|-------|-------|
| L | Inicializar proyecto FastAPI + React | 4h |
| L | Configurar Supabase + crear esquema DB | 4h |
| M | Implementar autenticación JWT | 6h |
| M | Setup Railway deployment + env vars | 2h |
| X | Configurar Redis + caché logic | 4h |
| J | Crear endpoints básicos (CRUD agencies) | 6h |
| J | Setup Cloudflare CDN | 2h |
| V | Testing de endpoints con Postman | 4h |
| V | Documentación de API (Swagger) | 4h |
| S | Buffer para debugging | 4h |

**Entregables:**
- ✅ API funcionando en https://api.tudominio.com
- ✅ Base de datos con esquema completo
- ✅ Autenticación funcionando
- ✅ Documentación de API

---

### **Semana 2: Script de Inyección Core**

**Objetivos:**
- ✅ Desarrollar inject.js v1.0
- ✅ Implementar aplicación de estilos básicos
- ✅ Configurar CDN para servir script

**Tareas (40 horas):**

| Día | Tarea | Horas |
|-----|-------|-------|
| L | Desarrollar lógica de detección de IDs | 6h |
| M | Implementar fetch de configuración + cache | 6h |
| X | Desarrollar aplicación de estilos dinámicos | 8h |
| J | Testing en entorno de prueba GHL | 6h |
| V | Optimización y minificación (<5KB) | 4h |
| S | Deploy a Cloudflare Workers | 4h |
| S | Testing de latencia y performance | 4h |
| D | Buffer | 2h |

**Entregables:**
- ✅ inject.js funcionando en CDN
- ✅ Aplicación básica de colores/fuentes
- ✅ Latencia <100ms (cold start)

---

### **Semana 3: Feature Lock System**

**Objetivos:**
- ✅ Implementar lógica de Feature Lock
- ✅ Crear sistema de selectores resilientes
- ✅ Sistema de versionado de selectores

**Tareas (40 horas):**

| Día | Tarea | Horas |
|-----|-------|-------|
| L | Mapear todos los elementos del sidebar de GHL | 6h |
| M | Implementar FeatureLockManager class | 8h |
| X | Desarrollar estrategias multi-selector | 6h |
| J | Implementar DOM observer para SPA | 4h |
| V | Desarrollar protecciones anti-bypass | 6h |
| S | Testing exhaustivo con diferentes planes | 6h |
| D | Debugging y refinamiento | 4h |

**Entregables:**
- ✅ Feature Lock funcionando para 10+ features
- ✅ Sistema resiliente a cambios de DOM
- ✅ Protecciones anti-bypass

---

### **Semana 4: Constructor Visual (Frontend)**

**Objetivos:**
- ✅ Desarrollar dashboard para agencias
- ✅ Color picker y logo uploader
- ✅ Preview en tiempo real

**Tareas (45 horas):**

| Día | Tarea | Horas |
|-----|-------|-------|
| L | Setup proyecto React + Vite + Tailwind | 4h |
| L | Implementar autenticación (login/register) | 4h |
| M | Desarrollar página de configuración de estilos | 8h |
| X | Integrar color picker (react-colorful) | 4h |
| X | Implementar logo/favicon uploader (Cloudinary) | 4h |
| J | Desarrollar preview iframe con postMessage | 8h |
| V | Página de gestión de sub-cuentas | 6h |
| S | Página de configuración de Feature Locks | 4h |
| D | Testing de UX y refinamiento | 3h |

**Entregables:**
- ✅ Dashboard funcionando en https://app.tudominio.com
- ✅ Configuración de estilos completa
- ✅ Preview en tiempo real

---

### **Semana 5: Gestión de Planes & Sub-cuentas**

**Objetivos:**
- ✅ Sistema de planes (Free, Pro, Enterprise)
- ✅ Gestión de sub-cuentas
- ✅ Feature Lock basado en plan

**Tareas (40 horas):**

| Día | Tarea | Horas |
|-----|-------|-------|
| L | Diseñar lógica de planes en DB | 4h |
| M | Implementar endpoints de sub-cuentas | 6h |
| X | Desarrollar UI para asignar planes | 6h |
| J | Implementar lógica de Feature Lock por plan | 6h |
| V | Página de configuración de límites por plan | 6h |
| S | Testing de flujo completo | 6h |
| D | Documentación de uso | 4h |
| D | Buffer | 2h |

**Entregables:**
- ✅ Sistema de planes funcionando
- ✅ Asignación de planes a sub-cuentas
- ✅ Feature Lock dinámico por plan

---

### **Semana 6: Testing, Optimización & Launch**

**Objetivos:**
- ✅ Testing exhaustivo con agencias beta
- ✅ Optimización de performance
- ✅ Preparar materiales de lanzamiento

**Tareas (40 horas):**

| Día | Tarea | Horas |
|-----|-------|-------|
| L | Invitar 5 agencias beta | 2h |
| L | Configurar analytics (Plausible) | 2h |
| M | Testing con agencias beta + feedback | 8h |
| X | Optimizar queries de DB (índices) | 4h |
| X | Optimizar tamaño del inject.js | 4h |
| J | Implementar error tracking (Sentry) | 4h |
| V | Crear video tutorial de setup | 4h |
| S | Escribir guía de troubleshooting | 4h |
| S | Setup sistema de soporte (email/chat) | 4h |
| D | Launch en redes sociales + comunidad GHL | 2h |
| D | Buffer para emergencias | 2h |

**Entregables:**
- ✅ MVP estable y probado con usuarios reales
- ✅ Documentación completa
- ✅ Video tutorial
- ✅ 🚀 **LANZAMIENTO PÚBLICO**

---

## 💰 COSTOS ESTIMADOS (MENSUAL)

### **Tier Free (MVP - Primeros 3 meses)**

| Servicio | Costo | Límites |
|----------|-------|---------|
| **Backend (Railway)** | $5/mes | 500 horas, 1GB RAM |
| **DB (Supabase)** | $0 | 500MB, 2GB bandwidth |
| **Redis (Upstash)** | $0 | 10,000 commands/día |
| **CDN (Cloudflare)** | $0 | Ilimitado con cache |
| **Frontend (Vercel)** | $0 | 100GB bandwidth |
| **Storage (Cloudinary)** | $0 | 25GB, 25k transformaciones |
| **Monitoring (Sentry)** | $0 | 5,000 eventos/mes |
| **Analytics (Plausible)** | $0 (self-hosted) | Ilimitado |
| **Email (SendGrid)** | $0 | 100 emails/día |
| **Domain** | $12/año | .com |

**TOTAL: ~$6/mes + $12/año (dominio)**

### **Tier Escalado (100+ agencias)**

| Servicio | Costo | Límites |
|----------|-------|---------|
| **Backend (Railway)** | $20/mes | 2GB RAM, autoscale |
| **DB (Supabase)** | $25/mes | 8GB, 250GB bandwidth |
| **Redis (Upstash)** | $10/mes | 100,000 commands/día |
| **CDN (Cloudflare)** | $0 | Ilimitado |
| **Frontend (Vercel)** | $20/mes | Pro plan |
| **Storage (Cloudinary)** | $18/mes | 50GB |
| **Monitoring (Sentry)** | $26/mes | 50k eventos |
| **Email (SendGrid)** | $15/mes | 40k emails/mes |

**TOTAL: ~$134/mes**

### **Proyección de Ingresos**

```
Precios sugeridos:
- Plan Free: $0 (1 sub-cuenta, branding "Powered by")
- Plan Pro: $29/mes (10 sub-cuentas, sin branding)
- Plan Agency: $79/mes (50 sub-cuentas, white label)
- Plan Enterprise: $199/mes (ilimitadas, soporte prioritario)

Break-even con:
- 5 clientes en Plan Pro ($145/mes)
- 2 clientes en Plan Agency ($158/mes)

Proyección conservadora (mes 6):
- 10 Free (leads)
- 15 Pro ($435)
- 8 Agency ($632)
- 2 Enterprise ($398)

TOTAL: $1,465/mes
Costos: $134/mes
Profit: $1,331/mes (90% margen)
```

---

## 📌 PRÓXIMOS PASOS INMEDIATOS

### **Acción 1: Validar Concepto (Semana 0)**

Antes de empezar el desarrollo, valida el mercado:

1. **Crear landing page simple** (Carrd.co - $19/año)
   - Título: "Personaliza tu GHL Dashboard en 2 minutos"
   - CTA: "Únete a la beta (50% descuento)"
   - Recoger emails

2. **Publicar en comunidades GHL**
   - Facebook Groups: "GoHighLevel Experts"
   - Reddit: r/gohighlevel
   - GHL Official Community

3. **Objetivo:** 50 emails en 7 días = validación positiva

### **Acción 2: Setup Inicial (Día 1)**

```bash
# 1. Clonar template de FastAPI
git clone https://github.com/tiangolo/full-stack-fastapi-postgresql
cd full-stack-fastapi-postgresql

# 2. Crear proyecto React
npm create vite@latest ghl-ui-skin-frontend -- --template react
cd ghl-ui-skin-frontend
npm install

# 3. Registrar cuentas gratuitas
- Supabase: https://supabase.com
- Upstash: https://upstash.com
- Railway: https://railway.app
- Cloudflare: https://cloudflare.com

# 4. Configurar repositorio
gh repo create ghl-ui-skin --private
git remote add origin <URL>
```

### **Acción 3: Primera Feature (Día 2-3)**

Desarrolla el "Happy Path" más simple:

1. API que retorna un JSON con colores
2. Script que aplica esos colores a GHL
3. Dashboard que permite editar esos colores

**Objetivo:** Demo funcionando en 48 horas para mostrar a early adopters

---

## 🎯 MÉTRICAS DE ÉXITO (MVP)

### **Técnicas**

- ✅ Latencia de inject.js: <100ms (P95)
- ✅ Uptime de API: >99.5%
- ✅ Tamaño de inject.js: <5KB gzipped
- ✅ Feature Lock efectividad: >95% (no bypasses)

### **Producto**

- ✅ 30 agencias activas en mes 1
- ✅ NPS >50
- ✅ <5% churn mensual
- ✅ Tiempo de setup: <10 minutos

### **Negocio**

- ✅ MRR: $1,500 en mes 6
- ✅ CAC: <$50 (organic + community marketing)
- ✅ LTV/CAC ratio: >3x

---

## 📚 RECURSOS ADICIONALES

### **Documentación de GHL**

- API Docs: https://highlevel.stoplight.io
- Community: https://community.gohighlevel.com
- OAuth 2.0: Para integración futura

### **Templates de Código**

- FastAPI + SQLAlchemy: https://github.com/tiangolo/full-stack-fastapi-postgresql
- React + Tailwind: https://github.com/shadcn-ui/ui

### **Inspiración**

- HL Pro Tools: https://www.hlprotools.com (estudiar su positioning)
- Extended: https://www.tryextended.com (competidor directo)

---

## ⚠️ RIESGOS & MITIGACIONES

### **Riesgo 1: GHL cambia estructura constantemente**

**Mitigación:**
- Sistema de versionado de selectores
- Monitoreo automatizado cada 6 horas
- Notificaciones a usuarios cuando algo se rompe
- Actualizaciones hot-swap sin re-deploy

### **Riesgo 2: Violación de TOS de GHL**

**Mitigación:**
- Estudiar TOS cuidadosamente (actualmente no prohíben scripts)
- No modificar funcionalidad core, solo estética
- Mantener buena relación con GHL team
- Tener plan de contingencia (whitelist de IPs)

### **Riesgo 3: Competidores con más recursos**

**Mitigación:**
- Enfoque en nicho latinoamericano (español, soporte local)
- Pricing más agresivo (30% menos que competencia)
- Onboarding más simple (1 script vs instalación compleja)
- Soporte humano 7 días/semana

### **Riesgo 4: Escalabilidad**

**Mitigación:**
- Cache agresivo (Redis + Cloudflare)
- DB sharding por agency_id cuando >1000 agencias
- Migrar a Cloudflare Workers si inject.js tiene >100k requests/día
- Load balancing con Railway auto-scale

---

## 🚀 CONCLUSIÓN

Este MVP está diseñado para:

1. **Bajo costo inicial:** <$10/mes en infraestructura
2. **Desarrollo rápido:** 6 semanas para MVP funcional
3. **Fácil mantenimiento:** Sistema resiliente a cambios de GHL
4. **Escalabilidad:** Arquitectura preparada para 1000+ agencias

**Next Step:** Ejecutar Semana 0 (Validación) antes de escribir una línea de código.

**¿Listo para empezar?** 🎉

---

*Documento creado por Claude - Arquitecto de Software Senior*
*Última actualización: Diciembre 2025*
