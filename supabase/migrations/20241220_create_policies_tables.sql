-- Create policies table
CREATE TABLE IF NOT EXISTS policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_type VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  simple_content_translations JSONB DEFAULT '{}'::jsonb,
  short_description_translations JSONB DEFAULT '{}'::jsonb,
  meta_title_translations JSONB DEFAULT '{}'::jsonb,
  meta_description_translations JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create policy_sections table for detailed policy content
CREATE TABLE IF NOT EXISTS policy_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  section_key VARCHAR(100) NOT NULL,
  title_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(policy_id, section_key)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_policies_type ON policies(policy_type);
CREATE INDEX IF NOT EXISTS idx_policies_slug ON policies(slug);
CREATE INDEX IF NOT EXISTS idx_policies_active ON policies(is_active);
CREATE INDEX IF NOT EXISTS idx_policy_sections_policy_id ON policy_sections(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_sections_order ON policy_sections(display_order);

-- Enable Row Level Security
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_sections ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Public can view active policies"
  ON policies FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view active policy sections"
  ON policy_sections FOR SELECT
  USING (is_active = true);

-- Policies for authenticated users (admin) - full access
CREATE POLICY "Authenticated users can manage policies"
  ON policies FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage policy sections"
  ON policy_sections FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert default policies
INSERT INTO policies (policy_type, slug, title_translations, content_translations, simple_content_translations, is_active)
VALUES
  ('shipping', 'politique-de-livraison', 
   '{"fr": "Politique de Livraison", "en": "Shipping Policy", "ar": "سياسة الشحن"}', 
   '{"fr": "Détails de notre politique de livraison...", "en": "Our shipping policy details...", "ar": "تفاصيل سياسة الشحن..."}',
   '{"fr": "Détails de notre politique de livraison...", "en": "Our shipping policy details...", "ar": "تفاصيل سياسة الشحن..."}',
   true),
  ('return', 'politique-de-retour', 
   '{"fr": "Politique de Retour", "en": "Return Policy", "ar": "سياسة الإرجاع"}', 
   '{"fr": "Détails de notre politique de retour...", "en": "Our return policy details...", "ar": "تفاصيل سياسة الإرجاع..."}',
   '{"fr": "Détails de notre politique de retour...", "en": "Our return policy details...", "ar": "تفاصيل سياسة الإرجاع..."}',
   true),
  ('privacy', 'politique-de-confidentialite', 
   '{"fr": "Politique de Confidentialité", "en": "Privacy Policy", "ar": "سياسة الخصوصية"}', 
   '{"fr": "Détails de notre politique de confidentialité...", "en": "Our privacy policy details...", "ar": "تفاصيل سياسة الخصوصية..."}',
   '{"fr": "Détails de notre politique de confidentialité...", "en": "Our privacy policy details...", "ar": "تفاصيل سياسة الخصوصية..."}',
   true),
  ('terms', 'conditions-generales', 
   '{"fr": "Conditions Générales", "en": "Terms & Conditions", "ar": "الشروط والأحكام"}', 
   '{"fr": "Détails de nos conditions générales...", "en": "Our terms and conditions details...", "ar": "تفاصيل الشروط والأحكام..."}',
   '{"fr": "Détails de nos conditions générales...", "en": "Our terms and conditions details...", "ar": "تفاصيل الشروط والأحكام..."}',
   true)
ON CONFLICT (policy_type) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE policies IS 'Stores website policies like shipping, returns, privacy, terms';
COMMENT ON TABLE policy_sections IS 'Stores detailed sections for each policy';
COMMENT ON COLUMN policies.policy_type IS 'Type of policy: shipping, return, privacy, terms';
COMMENT ON COLUMN policies.slug IS 'URL-friendly identifier for the policy';
COMMENT ON COLUMN policies.title_translations IS 'Policy titles in different languages (JSON object)';
COMMENT ON COLUMN policies.content_translations IS 'Full policy content in different languages (JSON object)';
COMMENT ON COLUMN policies.simple_content_translations IS 'Simplified/rich-text content for editing (JSON object)';
