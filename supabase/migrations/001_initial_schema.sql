-- BloomYourGut Initial Schema
-- Migration: 001_initial_schema
-- Description: Full database schema for gut health content + subscription platform

-- Enable extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- Content Pipeline
-- ============================================================

create table studies (
  id uuid default uuid_generate_v4() primary key,
  pmid text unique not null,
  title text not null,
  abstract text,
  authors text[],
  journal text,
  published_date date,
  relevance_score numeric(3,2) default 0,
  topics text[],
  status text default 'new' check (status in ('new', 'queued', 'processed', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table articles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  author text default 'BloomYourGut Team',
  category text not null,
  tags text[],
  seo_title text,
  seo_description text,
  seo_keywords text[],
  schema_markup jsonb,
  study_id uuid references studies(id),
  reading_time_minutes int,
  quality_score numeric(3,1),
  language text default 'en',
  status text default 'draft' check (status in ('draft', 'review', 'approved', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table article_translations (
  id uuid default uuid_generate_v4() primary key,
  article_id uuid references articles(id) on delete cascade,
  language text not null,
  title text not null,
  slug text not null,
  content text not null,
  excerpt text,
  seo_title text,
  seo_description text,
  status text default 'draft' check (status in ('draft', 'review', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(article_id, language)
);

create table affiliate_products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  brand text,
  url text not null,
  affiliate_url text not null,
  image_url text,
  commission_rate numeric(5,2),
  category text,
  description text,
  is_active boolean default true,
  last_checked_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- User App Tables
-- ============================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  avatar_url text,
  conditions text[],
  goals text[],
  country text,
  timezone text,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'bloom', 'pro')),
  articles_read_this_month int default 0,
  articles_read_reset_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table symptom_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  date date not null,
  bloating int check (bloating between 0 and 10),
  pain int check (pain between 0 and 10),
  energy int check (energy between 0 and 10),
  stool_type int check (stool_type between 1 and 7), -- Bristol scale
  gas int check (gas between 0 and 10),
  mood int check (mood between 0 and 10),
  notes text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

create table food_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  date date not null,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  foods text[] not null,
  ingredients text[],
  notes text,
  created_at timestamptz default now()
);

create table supplement_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  date date not null,
  supplement text not null,
  dose text,
  timing text check (timing in ('morning', 'afternoon', 'evening', 'with_meal', 'empty_stomach')),
  notes text,
  created_at timestamptz default now()
);

create table gut_scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  date date not null,
  score int check (score between 0 and 100) not null,
  components jsonb not null, -- {symptom_avg, trend, consistency, food_diversity}
  created_at timestamptz default now(),
  unique(user_id, date)
);

create table protocols (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  supplements jsonb, -- [{name, dose, timing, duration}]
  diet_rules jsonb, -- [{rule, category}]
  duration_weeks int,
  is_public boolean default false,
  upvotes int default 0,
  status text default 'active' check (status in ('active', 'completed', 'paused')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- Monetization
-- ============================================================

create table subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null unique,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  tier text default 'free' check (tier in ('free', 'bloom', 'pro')),
  status text default 'active' check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  country text,
  currency text default 'usd',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table consultations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  date timestamptz not null,
  type text check (type in ('async', 'live')),
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'canceled')),
  stripe_payment_id text,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- Analytics
-- ============================================================

create table correlations (
  id uuid default uuid_generate_v4() primary key,
  food text not null,
  symptom text not null,
  correlation_coefficient numeric(5,4),
  sample_size int not null,
  direction text check (direction in ('positive', 'negative', 'neutral')),
  confidence numeric(5,4),
  computed_at timestamptz default now()
);

create table treatment_outcomes (
  id uuid default uuid_generate_v4() primary key,
  condition text not null,
  treatment text not null,
  improvement_pct numeric(5,2),
  sample_size int not null,
  avg_duration_weeks numeric(5,1),
  computed_at timestamptz default now()
);

-- ============================================================
-- Indexes
-- ============================================================

create index idx_articles_slug on articles(slug);
create index idx_articles_status on articles(status);
create index idx_articles_category on articles(category);
create index idx_articles_language on articles(language);
create index idx_articles_published_at on articles(published_at desc);
create index idx_article_translations_slug on article_translations(slug);
create index idx_article_translations_language on article_translations(language);
create index idx_studies_pmid on studies(pmid);
create index idx_studies_status on studies(status);
create index idx_symptom_logs_user_date on symptom_logs(user_id, date desc);
create index idx_food_logs_user_date on food_logs(user_id, date desc);
create index idx_supplement_logs_user_date on supplement_logs(user_id, date desc);
create index idx_gut_scores_user_date on gut_scores(user_id, date desc);
create index idx_subscriptions_stripe_customer on subscriptions(stripe_customer_id);
create index idx_correlations_food on correlations(food);
create index idx_treatment_outcomes_condition on treatment_outcomes(condition);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table profiles enable row level security;
alter table symptom_logs enable row level security;
alter table food_logs enable row level security;
alter table supplement_logs enable row level security;
alter table gut_scores enable row level security;
alter table protocols enable row level security;
alter table subscriptions enable row level security;
alter table consultations enable row level security;
alter table articles enable row level security;
alter table article_translations enable row level security;
alter table correlations enable row level security;
alter table treatment_outcomes enable row level security;
alter table affiliate_products enable row level security;

-- ============================================================
-- RLS Policies: Profiles
-- ============================================================

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- ============================================================
-- RLS Policies: Symptom Logs
-- ============================================================

create policy "Users can view own symptom logs" on symptom_logs for select using (auth.uid() = user_id);
create policy "Users can insert own symptom logs" on symptom_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own symptom logs" on symptom_logs for update using (auth.uid() = user_id);
create policy "Users can delete own symptom logs" on symptom_logs for delete using (auth.uid() = user_id);

-- ============================================================
-- RLS Policies: Food Logs
-- ============================================================

create policy "Users can view own food logs" on food_logs for select using (auth.uid() = user_id);
create policy "Users can insert own food logs" on food_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own food logs" on food_logs for update using (auth.uid() = user_id);
create policy "Users can delete own food logs" on food_logs for delete using (auth.uid() = user_id);

-- ============================================================
-- RLS Policies: Supplement Logs
-- ============================================================

create policy "Users can view own supplement logs" on supplement_logs for select using (auth.uid() = user_id);
create policy "Users can insert own supplement logs" on supplement_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own supplement logs" on supplement_logs for update using (auth.uid() = user_id);
create policy "Users can delete own supplement logs" on supplement_logs for delete using (auth.uid() = user_id);

-- ============================================================
-- RLS Policies: Gut Scores
-- ============================================================

create policy "Users can view own gut scores" on gut_scores for select using (auth.uid() = user_id);
create policy "Users can insert own gut scores" on gut_scores for insert with check (auth.uid() = user_id);

-- ============================================================
-- RLS Policies: Protocols
-- ============================================================

create policy "Users can view own protocols" on protocols for select using (auth.uid() = user_id);
create policy "Users can view public protocols" on protocols for select using (is_public = true);
create policy "Users can insert own protocols" on protocols for insert with check (auth.uid() = user_id);
create policy "Users can update own protocols" on protocols for update using (auth.uid() = user_id);

-- ============================================================
-- RLS Policies: Subscriptions
-- ============================================================

create policy "Users can view own subscriptions" on subscriptions for select using (auth.uid() = user_id);

-- ============================================================
-- RLS Policies: Consultations
-- ============================================================

create policy "Users can view own consultations" on consultations for select using (auth.uid() = user_id);
create policy "Users can insert own consultations" on consultations for insert with check (auth.uid() = user_id);

-- ============================================================
-- RLS Policies: Public Content
-- ============================================================

create policy "Anyone can view published articles" on articles for select using (status = 'published');
create policy "Anyone can view published translations" on article_translations for select using (status = 'published');
create policy "Anyone can view correlations" on correlations for select using (true);
create policy "Anyone can view treatment outcomes" on treatment_outcomes for select using (true);
create policy "Anyone can view active affiliate products" on affiliate_products for select using (is_active = true);

-- Service role insert policies for cron jobs (they use service role key)
-- No RLS policy needed -- service role bypasses RLS

-- ============================================================
-- Triggers: updated_at
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger studies_updated_at before update on studies for each row execute function update_updated_at();
create trigger articles_updated_at before update on articles for each row execute function update_updated_at();
create trigger article_translations_updated_at before update on article_translations for each row execute function update_updated_at();
create trigger profiles_updated_at before update on profiles for each row execute function update_updated_at();
create trigger protocols_updated_at before update on protocols for each row execute function update_updated_at();
create trigger subscriptions_updated_at before update on subscriptions for each row execute function update_updated_at();
