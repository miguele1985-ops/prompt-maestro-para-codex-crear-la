-- Modo Crisis Survival licensing infrastructure.
-- Initial state is fail-safe: the app remains free and licenses are disabled.

CREATE TABLE IF NOT EXISTS app_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  licensing_enabled INTEGER NOT NULL DEFAULT 0,
  global_lock_enabled INTEGER NOT NULL DEFAULT 0,
  app_mode TEXT NOT NULL DEFAULT 'FREE' CHECK (app_mode IN ('FREE', 'NOTICE', 'GRACE_PERIOD', 'LICENSE_REQUIRED')),
  grace_period_enabled INTEGER NOT NULL DEFAULT 0,
  grace_period_end TEXT,
  minimum_supported_version INTEGER NOT NULL DEFAULT 1,
  latest_version INTEGER NOT NULL DEFAULT 1,
  purchase_url TEXT,
  support_url TEXT,
  configuration_version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO app_config (
  id,
  licensing_enabled,
  global_lock_enabled,
  app_mode,
  grace_period_enabled,
  minimum_supported_version,
  latest_version,
  purchase_url,
  support_url
) VALUES (
  1,
  0,
  0,
  'FREE',
  0,
  1,
  1,
  'https://modo-crisis-survival.pages.dev/donaciones',
  'https://modo-crisis-survival.pages.dev/contacto'
);

CREATE TABLE IF NOT EXISTS licenses (
  id TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL UNIQUE,
  code_last4 TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED', 'SUSPENDED', 'REFUNDED')),
  max_devices INTEGER NOT NULL DEFAULT 2,
  license_type TEXT NOT NULL DEFAULT 'PERMANENT' CHECK (license_type IN ('PERMANENT', 'ANNUAL', 'CUSTOM')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activated_at TEXT,
  expires_at TEXT,
  payment_reference TEXT,
  customer_reference TEXT,
  notes TEXT,
  created_by TEXT,
  revoked_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status);
CREATE INDEX IF NOT EXISTS idx_licenses_last4 ON licenses(code_last4);

CREATE TABLE IF NOT EXISTS license_devices (
  id TEXT PRIMARY KEY,
  license_id TEXT NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
  installation_id_hash TEXT NOT NULL,
  device_label TEXT,
  app_version TEXT,
  first_activated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  active INTEGER NOT NULL DEFAULT 1,
  released_at TEXT,
  UNIQUE(license_id, installation_id_hash)
);

CREATE INDEX IF NOT EXISTS idx_license_devices_license ON license_devices(license_id);
CREATE INDEX IF NOT EXISTS idx_license_devices_installation ON license_devices(installation_id_hash);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  button_text TEXT,
  button_url TEXT,
  type TEXT NOT NULL DEFAULT 'INFO' CHECK (type IN ('INFO', 'IMPORTANT', 'UPDATE', 'PROMOTION', 'LICENSE', 'BLOCKING')),
  dismissible INTEGER NOT NULL DEFAULT 1,
  blocking INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 0,
  starts_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ends_at TEXT,
  minimum_version INTEGER,
  maximum_version INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_enabled ON messages(enabled, starts_at, ends_at);

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'OWNER',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  admin_user_id TEXT REFERENCES admin_users(id) ON DELETE CASCADE,
  session_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  admin_user TEXT,
  ip TEXT,
  result TEXT NOT NULL DEFAULT 'OK',
  details TEXT
);

