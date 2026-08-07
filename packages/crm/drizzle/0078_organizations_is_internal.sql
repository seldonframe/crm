-- packages/crm/drizzle/0078_organizations_is_internal.sql
-- Funnel observability — organizations.is_internal (2026-08-06). Excludes
-- founder/internal workspaces from growth metrics (signed_up /
-- workspace_created / checkout_started rollups). Backfills founder-owned
-- orgs to true via two idempotent UPDATEs keyed off the founder's email.
--
-- HAND-WRITTEN (house rule: never drizzle-kit generate in this repo).
-- Additive only + idempotent (IF NOT EXISTS / re-runnable UPDATEs) so a
-- re-run after an out-of-band apply is a no-op. Mirrors 0077's style.

ALTER TABLE organizations ADD COLUMN IF NOT EXISTS is_internal boolean NOT NULL DEFAULT false;

UPDATE organizations
SET is_internal = true
WHERE owner_id IN (SELECT id FROM users WHERE email = 'maximehoule100@gmail.com')
  AND is_internal = false;

UPDATE organizations
SET is_internal = true
WHERE parent_user_id IN (SELECT id FROM users WHERE email = 'maximehoule100@gmail.com')
  AND is_internal = false;
