/**
 * GHL UI Skin - Injection Script
 * Version: 1.0.0
 *
 * This script is injected into GoHighLevel dashboards to:
 * 1. Apply custom styling (colors, fonts, logos)
 * 2. Implement feature locks (hide menu items based on plan)
 * 3. Handle dynamic DOM changes (GHL is a SPA)
 *
 * Performance target: <100ms total execution time
 * Size target: <5KB minified
 *
 * Usage:
 * <script src="https://cdn.yourdominio.com/inject.js"></script>
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        API_URL: 'https://api.tudominio.com/api/v1/config',
        CACHE_DURATION: 300000, // 5 minutes
        FETCH_TIMEOUT: 3000, // 3 seconds
        DEBUG: false
    };

    // Logging utility
    const log = (message, data = null) => {
        if (CONFIG.DEBUG) {
            console.log(`[GHL UI Skin] ${message}`, data || '');
        }
    };

    /**
     * Detects GHL agency and location IDs from URL and localStorage
     */
    function getGHLIds() {
        const url = window.location.href;

        // Extract location ID (sub-account ID) from URL
        // Patterns: /location/ABC123/... or /location=ABC123
        const locationMatch = url.match(/location[=/]([a-zA-Z0-9_-]+)/);
        const locationId = locationMatch ? locationMatch[1] : null;

        // Extract agency ID from localStorage (GHL stores it there)
        const agencyId = localStorage.getItem('ghl_agency_id') ||
                        localStorage.getItem('agency_id') ||
                        sessionStorage.getItem('agency_id');

        log('Detected IDs', { agencyId, locationId });

        return { agencyId, locationId };
    }

    /**
     * Fetches configuration from API with caching
     */
    async function fetchConfig(agencyId, locationId) {
        const cacheKey = `uiskin_config_${agencyId}_${locationId || 'default'}`;

        // Try cache first
        try {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CONFIG.CACHE_DURATION) {
                    log('Using cached config');
                    return data;
                }
            }
        } catch (e) {
            log('Cache read error', e);
        }

        // Fetch from API
        try {
            const params = new URLSearchParams({
                agency: agencyId,
                ...(locationId && { location: locationId })
            });

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT);

            const response = await fetch(`${CONFIG.API_URL}?${params}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            // Cache the response
            try {
                sessionStorage.setItem(cacheKey, JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));
            } catch (e) {
                log('Cache write error', e);
            }

            log('Config fetched from API', data);
            return data;

        } catch (error) {
            log('Config fetch failed', error.message);
            return null;
        }
    }

    /**
     * Applies custom styles to the page
     */
    function applyStyles(config) {
        if (!config) return;

        const styleId = 'uiskin-styles';
        let styleEl = document.getElementById(styleId);

        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }

        // Build CSS using CSS variables (most resilient approach)
        const css = `
            /* GHL UI Skin - Custom Styles */

            :root {
                --uiskin-primary: ${config.primaryColor} !important;
                --uiskin-secondary: ${config.secondaryColor} !important;
                --uiskin-accent: ${config.accentColor} !important;
                --uiskin-sidebar-bg: ${config.sidebarBg} !important;
                --uiskin-sidebar-text: ${config.sidebarText} !important;
            }

            /* Sidebar background */
            aside[class*="sidebar"],
            aside[class*="Sidebar"],
            aside[class*="navigation"],
            nav[class*="sidebar"],
            [data-sidebar="true"] {
                background-color: var(--uiskin-sidebar-bg) !important;
                color: var(--uiskin-sidebar-text) !important;
            }

            /* Sidebar links */
            aside a,
            aside button,
            nav[class*="sidebar"] a,
            nav[class*="sidebar"] button {
                color: var(--uiskin-sidebar-text) !important;
            }

            /* Primary buttons */
            button[class*="primary"],
            [class*="btn-primary"],
            [class*="button--primary"] {
                background-color: var(--uiskin-primary) !important;
                border-color: var(--uiskin-primary) !important;
            }

            /* Secondary buttons */
            button[class*="secondary"],
            [class*="btn-secondary"] {
                background-color: var(--uiskin-secondary) !important;
                border-color: var(--uiskin-secondary) !important;
            }

            /* Typography */
            ${config.fontFamily ? `
            body, input, textarea, select, button {
                font-family: ${config.fontFamily}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            }
            ` : ''}

            ${config.fontSizeBase ? `
            html {
                font-size: ${config.fontSizeBase}px !important;
            }
            ` : ''}

            /* Custom logo */
            ${config.logoUrl ? `
            [class*="logo"] img,
            [data-logo="true"] img {
                content: url(${config.logoUrl}) !important;
                max-height: 40px;
                width: auto;
            }
            ` : ''}

            /* Custom CSS from user */
            ${config.customCSS || ''}
        `;

        styleEl.textContent = css;
        log('Styles applied');
    }

    /**
     * Feature Lock Manager
     * Hides menu items based on configuration
     */
    class FeatureLockManager {
        constructor(config) {
            this.config = config;
            this.locks = config?.featureLocks || {};
            this.hiddenElements = new Set();

            // Selector strategies for each feature
            this.selectors = {
                dashboard: [
                    '[data-menu="dashboard"]',
                    '[data-menu-item="dashboard"]',
                    'a[href*="/dashboard"]:not([href*="/settings"])',
                    'nav a:has-text("Dashboard")'
                ],
                conversations: [
                    '[data-menu="conversations"]',
                    '[data-menu="inbox"]',
                    'a[href*="/conversations"]',
                    'a[href*="/inbox"]',
                    'nav a:has-text("Conversations")'
                ],
                calendar: [
                    '[data-menu="calendar"]',
                    'a[href*="/calendar"]',
                    'nav a:has-text("Calendar")'
                ],
                contacts: [
                    '[data-menu="contacts"]',
                    'a[href*="/contacts"]',
                    'nav a:has-text("Contacts")'
                ],
                opportunities: [
                    '[data-menu="opportunities"]',
                    'a[href*="/opportunities"]',
                    'a[href*="/launchpad"]',
                    'nav a:has-text("Opportunities")'
                ],
                payments: [
                    '[data-menu="payments"]',
                    'a[href*="/payments"]',
                    'nav a:has-text("Payments")'
                ],
                sites: [
                    '[data-menu="sites"]',
                    'a[href*="/sites"]',
                    'nav a:has-text("Sites")'
                ],
                funnels: [
                    '[data-menu="funnels"]',
                    'a[href*="/funnels"]',
                    'nav a:has-text("Funnels")'
                ],
                workflows: [
                    '[data-menu="workflows"]',
                    'a[href*="/workflows"]',
                    'nav a:has-text("Workflows")'
                ],
                reporting: [
                    '[data-menu="reporting"]',
                    '[data-menu="analytics"]',
                    'a[href*="/reporting"]',
                    'nav a:has-text("Reporting")'
                ],
                marketing: [
                    '[data-menu="marketing"]',
                    'a[href*="/marketing"]',
                    'nav a:has-text("Marketing")'
                ]
            };
        }

        /**
         * Finds elements by text content (for :has-text pseudo-selector)
         */
        findByText(text, parentSelector = 'nav') {
            const elements = [];
            const parent = document.querySelector(parentSelector);
            if (!parent) return elements;

            const walker = document.createTreeWalker(
                parent,
                NodeFilter.SHOW_TEXT
            );

            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.trim().toLowerCase().includes(text.toLowerCase())) {
                    let element = node.parentElement;
                    while (element && element !== parent && element.tagName !== 'A') {
                        element = element.parentElement;
                    }
                    if (element && element.tagName === 'A') {
                        elements.push(element);
                    }
                }
            }

            return elements;
        }

        /**
         * Finds elements for a specific feature
         */
        findElements(feature) {
            const selectors = this.selectors[feature];
            if (!selectors) return [];

            const elements = new Set();

            for (const selector of selectors) {
                try {
                    // Handle :has-text() pseudo-selector
                    if (selector.includes(':has-text')) {
                        const match = selector.match(/has-text\("([^"]+)"\)/);
                        if (match) {
                            const found = this.findByText(match[1]);
                            found.forEach(el => elements.add(el));
                        }
                    } else {
                        // Standard query selector
                        const found = document.querySelectorAll(selector);
                        found.forEach(el => elements.add(el));
                    }
                } catch (e) {
                    // Invalid selector, skip
                }
            }

            return Array.from(elements);
        }

        /**
         * Hides an element and its parent list item
         */
        hideElement(element) {
            element.style.cssText = `
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            `;
            element.setAttribute('data-uiskin-locked', 'true');
            this.hiddenElements.add(element);

            // Also hide parent <li> if exists
            const parentLi = element.closest('li');
            if (parentLi) {
                parentLi.style.display = 'none';
                parentLi.setAttribute('data-uiskin-locked', 'true');
                this.hiddenElements.add(parentLi);
            }
        }

        /**
         * Applies all feature locks
         */
        apply() {
            Object.keys(this.locks).forEach(feature => {
                if (this.locks[feature] === true) {
                    const elements = this.findElements(feature);
                    elements.forEach(el => this.hideElement(el));
                    log(`Locked feature: ${feature}`, `${elements.length} elements`);
                }
            });
        }

        /**
         * Observes DOM changes and re-applies locks
         */
        observe() {
            const observer = new MutationObserver(() => {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    this.apply();
                }, 100);
            });

            // Observe sidebar and navigation
            const targets = document.querySelectorAll('aside, nav, [role="navigation"]');
            targets.forEach(target => {
                observer.observe(target, {
                    childList: true,
                    subtree: true
                });
            });

            log('DOM observer started');
            return observer;
        }
    }

    /**
     * Main initialization function
     */
    async function init() {
        log('Initializing GHL UI Skin...');

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        const { agencyId, locationId } = getGHLIds();

        if (!agencyId) {
            log('No agency ID detected - skipping initialization');
            return;
        }

        // Fetch configuration
        const config = await fetchConfig(agencyId, locationId);

        if (!config) {
            log('No configuration available - skipping initialization');
            return;
        }

        // Apply styles
        applyStyles(config);

        // Apply feature locks
        if (config.featureLocks && Object.keys(config.featureLocks).length > 0) {
            const lockManager = new FeatureLockManager(config);
            lockManager.apply();
            lockManager.observe();
        }

        // Execute custom JS (if any)
        if (config.customJS) {
            try {
                eval(config.customJS);
                log('Custom JS executed');
            } catch (e) {
                log('Custom JS error', e.message);
            }
        }

        log('✅ Initialization complete');
    }

    // Start initialization
    init();

})();
