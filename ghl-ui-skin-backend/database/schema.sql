-- GHL UI Skin Database Schema
-- PostgreSQL 14+
-- Execute this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for plan tiers
CREATE TYPE plan_tier AS ENUM ('free', 'pro', 'agency', 'enterprise');

-- ============================================================================
-- AGENCIES TABLE
-- ============================================================================
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ghl_agency_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    plan_tier plan_tier DEFAULT 'free' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for agencies
CREATE INDEX idx_agencies_ghl_id ON agencies(ghl_agency_id);
CREATE INDEX idx_agencies_email ON agencies(email);
CREATE INDEX idx_agencies_plan_tier ON agencies(plan_tier);

-- ============================================================================
-- AGENCY_STYLES TABLE
-- ============================================================================
CREATE TABLE agency_styles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID UNIQUE NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,

    -- Colors (hex format)
    primary_color VARCHAR(7) DEFAULT '#4F46E5',
    secondary_color VARCHAR(7) DEFAULT '#10B981',
    accent_color VARCHAR(7) DEFAULT '#F59E0B',
    sidebar_bg VARCHAR(7) DEFAULT '#1F2937',
    sidebar_text VARCHAR(7) DEFAULT '#F9FAFB',

    -- Typography
    font_family VARCHAR(100) DEFAULT 'Inter',
    font_size_base INTEGER DEFAULT 14,

    -- Branding
    logo_url TEXT,
    favicon_url TEXT,

    -- Custom CSS/JS
    custom_css TEXT,
    custom_js TEXT,

    -- Timestamp
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for agency_styles
CREATE INDEX idx_agency_styles_agency_id ON agency_styles(agency_id);

-- ============================================================================
-- SUBACCOUNTS TABLE
-- ============================================================================
CREATE TABLE subaccounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    ghl_subaccount_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    plan_tier plan_tier DEFAULT 'free' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for subaccounts
CREATE INDEX idx_subaccounts_ghl_id ON subaccounts(ghl_subaccount_id);
CREATE INDEX idx_subaccounts_agency_id ON subaccounts(agency_id);
CREATE INDEX idx_subaccounts_plan_tier ON subaccounts(plan_tier);

-- ============================================================================
-- FEATURE_LOCKS TABLE
-- ============================================================================
CREATE TABLE feature_locks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subaccount_id UUID UNIQUE NOT NULL REFERENCES subaccounts(id) ON DELETE CASCADE,

    -- Sidebar menu items to hide
    hide_dashboard BOOLEAN DEFAULT FALSE,
    hide_conversations BOOLEAN DEFAULT FALSE,
    hide_calendar BOOLEAN DEFAULT FALSE,
    hide_contacts BOOLEAN DEFAULT FALSE,
    hide_opportunities BOOLEAN DEFAULT FALSE,
    hide_payments BOOLEAN DEFAULT FALSE,
    hide_sites BOOLEAN DEFAULT FALSE,
    hide_funnels BOOLEAN DEFAULT FALSE,
    hide_workflows BOOLEAN DEFAULT FALSE,
    hide_triggers BOOLEAN DEFAULT FALSE,
    hide_reporting BOOLEAN DEFAULT FALSE,
    hide_memberships BOOLEAN DEFAULT FALSE,
    hide_marketing BOOLEAN DEFAULT FALSE,

    -- Additional feature restrictions
    disable_exports BOOLEAN DEFAULT FALSE,
    disable_bulk_actions BOOLEAN DEFAULT FALSE,

    -- Timestamp
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for feature_locks
CREATE INDEX idx_feature_locks_subaccount_id ON feature_locks(subaccount_id);

-- ============================================================================
-- TRIGGERS FOR updated_at
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for agencies
CREATE TRIGGER update_agencies_updated_at
    BEFORE UPDATE ON agencies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for agency_styles
CREATE TRIGGER update_agency_styles_updated_at
    BEFORE UPDATE ON agency_styles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for feature_locks
CREATE TRIGGER update_feature_locks_updated_at
    BEFORE UPDATE ON feature_locks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (for testing)
-- ============================================================================

-- Insert a test agency
-- Password: "test123" (hashed with bcrypt)
INSERT INTO agencies (ghl_agency_id, name, email, password_hash, plan_tier) VALUES
('test-agency-001', 'Test Agency', 'test@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5aq2bqxk8XOAK', 'pro');

-- Insert default styles for test agency
INSERT INTO agency_styles (agency_id, primary_color, secondary_color)
SELECT id, '#6366F1', '#10B981' FROM agencies WHERE ghl_agency_id = 'test-agency-001';

-- Insert a test sub-account
INSERT INTO subaccounts (agency_id, ghl_subaccount_id, name, plan_tier)
SELECT id, 'test-sub-001', 'Test Client', 'free' FROM agencies WHERE ghl_agency_id = 'test-agency-001';

-- Insert feature locks for test sub-account (hide some features)
INSERT INTO feature_locks (subaccount_id, hide_workflows, hide_reporting, hide_marketing)
SELECT id, TRUE, TRUE, TRUE FROM subaccounts WHERE ghl_subaccount_id = 'test-sub-001';

-- ============================================================================
-- GRANT PERMISSIONS (for Supabase)
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant permissions on tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON agencies, agency_styles, subaccounts, feature_locks TO authenticated;

-- Grant sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- ============================================================================
-- VIEWS (for analytics - optional)
-- ============================================================================

CREATE OR REPLACE VIEW agency_stats AS
SELECT
    a.id,
    a.name,
    a.plan_tier,
    COUNT(DISTINCT s.id) as subaccount_count,
    a.created_at
FROM agencies a
LEFT JOIN subaccounts s ON s.agency_id = a.id
GROUP BY a.id, a.name, a.plan_tier, a.created_at;

-- ============================================================================
-- COMMENTS (documentation)
-- ============================================================================

COMMENT ON TABLE agencies IS 'GHL agencies using the UI Skin service';
COMMENT ON TABLE agency_styles IS 'Visual customization settings per agency';
COMMENT ON TABLE subaccounts IS 'Sub-accounts (clients) within agencies';
COMMENT ON TABLE feature_locks IS 'Feature visibility controls per sub-account';

COMMENT ON COLUMN agencies.ghl_agency_id IS 'GoHighLevel agency ID';
COMMENT ON COLUMN agencies.plan_tier IS 'Subscription tier: free, pro, agency, enterprise';
COMMENT ON COLUMN agency_styles.custom_css IS 'Custom CSS injected into GHL dashboard';
COMMENT ON COLUMN agency_styles.custom_js IS 'Custom JavaScript injected into GHL dashboard';
COMMENT ON COLUMN feature_locks.hide_dashboard IS 'Hide dashboard menu item if TRUE';

-- ============================================================================
-- VALIDATION FUNCTIONS (optional but recommended)
-- ============================================================================

-- Function to validate hex colors
CREATE OR REPLACE FUNCTION is_valid_hex_color(color VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN color ~ '^#[0-9A-Fa-f]{6}$';
END;
$$ LANGUAGE plpgsql;

-- Add check constraints for hex colors (optional, for data integrity)
ALTER TABLE agency_styles
    ADD CONSTRAINT check_primary_color CHECK (is_valid_hex_color(primary_color)),
    ADD CONSTRAINT check_secondary_color CHECK (is_valid_hex_color(secondary_color)),
    ADD CONSTRAINT check_accent_color CHECK (is_valid_hex_color(accent_color)),
    ADD CONSTRAINT check_sidebar_bg CHECK (is_valid_hex_color(sidebar_bg)),
    ADD CONSTRAINT check_sidebar_text CHECK (is_valid_hex_color(sidebar_text));

-- ============================================================================
-- DONE!
-- ============================================================================
-- Schema created successfully.
-- Next steps:
-- 1. Run this script in your Supabase SQL editor
-- 2. Update DATABASE_URL in .env with your connection string
-- 3. Run the FastAPI server: uvicorn app.main:app --reload
