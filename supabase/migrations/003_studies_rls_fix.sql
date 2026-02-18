-- BloomYourGut: Fix missing RLS on studies table
-- Migration: 003_studies_rls_fix
-- Description: Enable RLS on studies table (was accidentally omitted from 001)

alter table public.studies enable row level security;

-- No user-facing policies needed — studies are written by cron jobs
-- using service role (which bypasses RLS) and not queried directly
-- by frontend users.
