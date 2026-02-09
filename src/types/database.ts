// BloomYourGut Database Types
// Auto-generated from 001_initial_schema.sql
// These types mirror the Supabase PostgreSQL schema exactly.

// ============================================================
// Status & Category Union Types
// ============================================================

export type StudyStatus = 'new' | 'queued' | 'processed' | 'rejected'
export type ArticleStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived'
export type TranslationStatus = 'draft' | 'review' | 'published'
export type SubscriptionTier = 'free' | 'bloom' | 'pro'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type SupplementTiming = 'morning' | 'afternoon' | 'evening' | 'with_meal' | 'empty_stomach'
export type ProtocolStatus = 'active' | 'completed' | 'paused'
export type ConsultationType = 'async' | 'live'
export type ConsultationStatus = 'pending' | 'confirmed' | 'completed' | 'canceled'
export type CorrelationDirection = 'positive' | 'negative' | 'neutral'

// ============================================================
// Content Pipeline
// ============================================================

export interface Study {
  id: string
  pmid: string
  title: string
  abstract: string | null
  authors: string[] | null
  journal: string | null
  published_date: string | null
  relevance_score: number
  topics: string[] | null
  status: StudyStatus
  created_at: string
  updated_at: string
}

export type StudyInsert = Omit<Study, 'id' | 'created_at' | 'updated_at' | 'relevance_score' | 'status'> & {
  id?: string
  created_at?: string
  updated_at?: string
  relevance_score?: number
  status?: StudyStatus
}

export type StudyUpdate = Partial<Omit<Study, 'id' | 'created_at'>> & {
  updated_at?: string
}

// ------------------------------------------------------------

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  author: string
  category: string
  tags: string[] | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  schema_markup: Record<string, unknown> | null
  study_id: string | null
  reading_time_minutes: number | null
  quality_score: number | null
  language: string
  status: ArticleStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export type ArticleInsert = Omit<Article, 'id' | 'created_at' | 'updated_at' | 'author' | 'language' | 'status' | 'published_at' | 'schema_markup' | 'quality_score' | 'study_id' | 'reading_time_minutes' | 'excerpt' | 'tags' | 'seo_title' | 'seo_description' | 'seo_keywords'> & {
  id?: string
  created_at?: string
  updated_at?: string
  author?: string
  language?: string
  status?: ArticleStatus
  published_at?: string | null
  schema_markup?: Record<string, unknown> | null
  quality_score?: number | null
  study_id?: string | null
  reading_time_minutes?: number | null
  excerpt?: string | null
  tags?: string[] | null
  seo_title?: string | null
  seo_description?: string | null
  seo_keywords?: string[] | null
}

export type ArticleUpdate = Partial<Omit<Article, 'id' | 'created_at'>> & {
  updated_at?: string
}

// ------------------------------------------------------------

export interface ArticleTranslation {
  id: string
  article_id: string | null
  language: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  seo_title: string | null
  seo_description: string | null
  status: TranslationStatus
  created_at: string
  updated_at: string
}

export type ArticleTranslationInsert = Omit<ArticleTranslation, 'id' | 'created_at' | 'updated_at' | 'status'> & {
  id?: string
  created_at?: string
  updated_at?: string
  status?: TranslationStatus
}

export type ArticleTranslationUpdate = Partial<Omit<ArticleTranslation, 'id' | 'created_at'>> & {
  updated_at?: string
}

// ------------------------------------------------------------

export interface AffiliateProduct {
  id: string
  name: string
  brand: string | null
  url: string
  affiliate_url: string
  image_url: string | null
  commission_rate: number | null
  category: string | null
  description: string | null
  is_active: boolean
  last_checked_at: string | null
  created_at: string
}

export type AffiliateProductInsert = Omit<AffiliateProduct, 'id' | 'created_at' | 'is_active'> & {
  id?: string
  created_at?: string
  is_active?: boolean
}

export type AffiliateProductUpdate = Partial<Omit<AffiliateProduct, 'id' | 'created_at'>>

// ============================================================
// User App Tables
// ============================================================

export interface Profile {
  id: string
  display_name: string | null
  email: string | null
  avatar_url: string | null
  conditions: string[] | null
  goals: string[] | null
  country: string | null
  timezone: string | null
  subscription_tier: SubscriptionTier
  articles_read_this_month: number
  articles_read_reset_at: string
  created_at: string
  updated_at: string
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at' | 'subscription_tier' | 'articles_read_this_month' | 'articles_read_reset_at'> & {
  created_at?: string
  updated_at?: string
  subscription_tier?: SubscriptionTier
  articles_read_this_month?: number
  articles_read_reset_at?: string
}

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>> & {
  updated_at?: string
}

// ------------------------------------------------------------

export interface SymptomLog {
  id: string
  user_id: string
  date: string
  bloating: number | null
  pain: number | null
  energy: number | null
  stool_type: number | null
  gas: number | null
  mood: number | null
  notes: string | null
  created_at: string
}

export type SymptomLogInsert = Omit<SymptomLog, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type SymptomLogUpdate = Partial<Omit<SymptomLog, 'id' | 'user_id' | 'created_at'>>

// ------------------------------------------------------------

export interface FoodLog {
  id: string
  user_id: string
  date: string
  meal_type: MealType | null
  foods: string[]
  ingredients: string[] | null
  notes: string | null
  created_at: string
}

export type FoodLogInsert = Omit<FoodLog, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type FoodLogUpdate = Partial<Omit<FoodLog, 'id' | 'user_id' | 'created_at'>>

// ------------------------------------------------------------

export interface SupplementLog {
  id: string
  user_id: string
  date: string
  supplement: string
  dose: string | null
  timing: SupplementTiming | null
  notes: string | null
  created_at: string
}

export type SupplementLogInsert = Omit<SupplementLog, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type SupplementLogUpdate = Partial<Omit<SupplementLog, 'id' | 'user_id' | 'created_at'>>

// ------------------------------------------------------------

export interface GutScoreComponents {
  symptom_avg: number
  trend: number
  consistency: number
  food_diversity: number
}

export interface GutScore {
  id: string
  user_id: string
  date: string
  score: number
  components: GutScoreComponents
  created_at: string
}

export type GutScoreInsert = Omit<GutScore, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type GutScoreUpdate = Partial<Omit<GutScore, 'id' | 'user_id' | 'created_at'>>

// ------------------------------------------------------------

export interface ProtocolSupplement {
  name: string
  dose: string
  timing: string
  duration: string
}

export interface ProtocolDietRule {
  rule: string
  category: string
}

export interface Protocol {
  id: string
  user_id: string
  title: string
  description: string | null
  supplements: ProtocolSupplement[] | null
  diet_rules: ProtocolDietRule[] | null
  duration_weeks: number | null
  is_public: boolean
  upvotes: number
  status: ProtocolStatus
  created_at: string
  updated_at: string
}

export type ProtocolInsert = Omit<Protocol, 'id' | 'created_at' | 'updated_at' | 'is_public' | 'upvotes' | 'status'> & {
  id?: string
  created_at?: string
  updated_at?: string
  is_public?: boolean
  upvotes?: number
  status?: ProtocolStatus
}

export type ProtocolUpdate = Partial<Omit<Protocol, 'id' | 'user_id' | 'created_at'>> & {
  updated_at?: string
}

// ============================================================
// Monetization
// ============================================================

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  tier: SubscriptionTier
  status: SubscriptionStatus
  current_period_end: string | null
  cancel_at_period_end: boolean
  country: string | null
  currency: string
  created_at: string
  updated_at: string
}

export type SubscriptionInsert = Omit<Subscription, 'id' | 'created_at' | 'updated_at' | 'tier' | 'status' | 'cancel_at_period_end' | 'currency'> & {
  id?: string
  created_at?: string
  updated_at?: string
  tier?: SubscriptionTier
  status?: SubscriptionStatus
  cancel_at_period_end?: boolean
  currency?: string
}

export type SubscriptionUpdate = Partial<Omit<Subscription, 'id' | 'user_id' | 'created_at'>> & {
  updated_at?: string
}

// ------------------------------------------------------------

export interface Consultation {
  id: string
  user_id: string
  date: string
  type: ConsultationType | null
  status: ConsultationStatus
  stripe_payment_id: string | null
  notes: string | null
  created_at: string
}

export type ConsultationInsert = Omit<Consultation, 'id' | 'created_at' | 'status'> & {
  id?: string
  created_at?: string
  status?: ConsultationStatus
}

export type ConsultationUpdate = Partial<Omit<Consultation, 'id' | 'user_id' | 'created_at'>>

// ============================================================
// Analytics
// ============================================================

export interface Correlation {
  id: string
  food: string
  symptom: string
  correlation_coefficient: number | null
  sample_size: number
  direction: CorrelationDirection | null
  confidence: number | null
  computed_at: string
}

export type CorrelationInsert = Omit<Correlation, 'id' | 'computed_at'> & {
  id?: string
  computed_at?: string
}

export type CorrelationUpdate = Partial<Omit<Correlation, 'id'>>

// ------------------------------------------------------------

export interface TreatmentOutcome {
  id: string
  condition: string
  treatment: string
  improvement_pct: number | null
  sample_size: number
  avg_duration_weeks: number | null
  computed_at: string
}

export type TreatmentOutcomeInsert = Omit<TreatmentOutcome, 'id' | 'computed_at'> & {
  id?: string
  computed_at?: string
}

export type TreatmentOutcomeUpdate = Partial<Omit<TreatmentOutcome, 'id'>>

// ============================================================
// Database Type Wrapper (Supabase-compatible)
// ============================================================

export interface Database {
  public: {
    Tables: {
      studies: {
        Row: Study
        Insert: StudyInsert
        Update: StudyUpdate
      }
      articles: {
        Row: Article
        Insert: ArticleInsert
        Update: ArticleUpdate
      }
      article_translations: {
        Row: ArticleTranslation
        Insert: ArticleTranslationInsert
        Update: ArticleTranslationUpdate
      }
      affiliate_products: {
        Row: AffiliateProduct
        Insert: AffiliateProductInsert
        Update: AffiliateProductUpdate
      }
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      symptom_logs: {
        Row: SymptomLog
        Insert: SymptomLogInsert
        Update: SymptomLogUpdate
      }
      food_logs: {
        Row: FoodLog
        Insert: FoodLogInsert
        Update: FoodLogUpdate
      }
      supplement_logs: {
        Row: SupplementLog
        Insert: SupplementLogInsert
        Update: SupplementLogUpdate
      }
      gut_scores: {
        Row: GutScore
        Insert: GutScoreInsert
        Update: GutScoreUpdate
      }
      protocols: {
        Row: Protocol
        Insert: ProtocolInsert
        Update: ProtocolUpdate
      }
      subscriptions: {
        Row: Subscription
        Insert: SubscriptionInsert
        Update: SubscriptionUpdate
      }
      consultations: {
        Row: Consultation
        Insert: ConsultationInsert
        Update: ConsultationUpdate
      }
      correlations: {
        Row: Correlation
        Insert: CorrelationInsert
        Update: CorrelationUpdate
      }
      treatment_outcomes: {
        Row: TreatmentOutcome
        Insert: TreatmentOutcomeInsert
        Update: TreatmentOutcomeUpdate
      }
    }
  }
}
