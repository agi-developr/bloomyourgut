-- BloomYourGut: Subscribers & Contact Messages
-- Migration: 002_subscribers_contact
-- Description: Tables for email newsletter signups and contact form submissions

-- ============================================================
-- Subscribers (email capture)
-- ============================================================

create table subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz,
  source text default 'website',
  created_at timestamptz default now()
);

create index idx_subscribers_email on subscribers(email);

-- ============================================================
-- Contact Messages
-- ============================================================

create table contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz default now()
);

create index idx_contact_messages_status on contact_messages(status);
create index idx_contact_messages_created on contact_messages(created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table subscribers enable row level security;
alter table contact_messages enable row level security;

-- Both tables are written to via service role (admin client) which bypasses RLS.
-- No user-facing RLS policies needed — these are admin-only tables.
