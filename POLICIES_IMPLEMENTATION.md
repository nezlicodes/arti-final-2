# Policies Feature Implementation

This document describes the complete policies management feature implemented in arti-final, based on the xone-algeria repository.

## 📁 Files Created

### Database Migration
- `supabase/migrations/20241220_create_policies_tables.sql`
  - Creates `policies` table
  - Creates `policy_sections` table
  - Sets up Row Level Security (RLS)
  - Seeds default policies
  - Creates indexes for performance

### Composables
- `composables/usePolicies.ts`
  - `fetchPolicy()` - Fetch policy by type
  - `fetchPolicyBySlug()` - Fetch policy by URL slug
  - `fetchAllPolicies()` - Get all policies
  - `fetchPolicySections()` - Get sections for a policy
  - `upsertPolicy()` - Create or update policy
  - `deletePolicy()` - Delete policy
  - Translation helpers

### Admin Pages
- `pages/admin/policies/index.vue`
  - List all policies
  - Search and filter
  - Quick edit modal
  - Delete policies
  - Create new policies

- `pages/admin/policies/[...id]/edit.vue`
  - Full edit page with rich text editor
  - Multi-language support (FR, EN, AR)
  - Language switcher
  - Save and reset functionality

### Public Pages
- `pages/policies/[...slug].vue`
  - Display policy by slug
  - Multi-language content
  - SEO optimized

### Components
- `components/Admin/Policies/Modal.vue`
  - Quick edit modal
  - Form validation
  - Multi-language inputs
  - Built with Vue Transition (no external dependencies)

## 🗄️ Database Schema

### Policies Table
```sql
CREATE TABLE policies (
  id UUID PRIMARY KEY,
  policy_type VARCHAR(50) UNIQUE,
  slug VARCHAR(255) UNIQUE,
  title_translations JSONB,
  content_translations JSONB,
  simple_content_translations JSONB,
  short_description_translations JSONB,
  meta_title_translations JSONB,
  meta_description_translations JSONB,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Policy Sections Table
```sql
CREATE TABLE policy_sections (
  id UUID PRIMARY KEY,
  policy_id UUID REFERENCES policies(id),
  section_key VARCHAR(100),
  title_translations JSONB,
  content_translations JSONB,
  display_order INTEGER,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🚀 Setup Instructions

### 1. Apply Database Migration
```bash
cd supabase
supabase db push migrations/20241220_create_policies_tables.sql
```

### 2. Verify Tables
In your Supabase dashboard:
- Check that `policies` table exists
- Check that `policy_sections` table exists
- Verify default policies are seeded
- Confirm RLS policies are active

### 3. Test Admin Access
1. Navigate to `/admin/policies`
2. You should see 4 default policies:
   - Shipping (Livraison)
   - Return (Retour)
   - Privacy (Confidentialité)
   - Terms (Conditions)

### 4. Test Public Access
Visit any policy by slug:
- `/policies/politique-de-livraison`
- `/policies/politique-de-retour`
- `/policies/politique-de-confidentialite`
- `/policies/conditions-generales`

## 🎯 Features

### Admin Features
- ✅ List all policies with search and filtering
- ✅ Create new policies
- ✅ Edit policies (quick modal or full page)
- ✅ Delete policies with confirmation
- ✅ Multi-language support (FR, EN, AR)
- ✅ Active/inactive status toggle
- ✅ Rich text editor for content
- ✅ Language switcher in editor

### Public Features
- ✅ Display policies by slug
- ✅ Multi-language content rendering
- ✅ SEO meta tags
- ✅ Responsive design
- ✅ Automatic language detection

### Data Features
- ✅ Row Level Security (RLS)
- ✅ Public read access for active policies
- ✅ Admin full access for authenticated users
- ✅ Indexed queries for performance
- ✅ Soft delete with is_active flag

## 📝 Usage Examples

### Admin - Create New Policy
1. Go to `/admin/policies`
2. Click "Ajouter une politique"
3. Fill in:
   - Policy type (shipping, return, privacy, terms)
   - Slug (URL-friendly)
   - Titles in FR, EN, AR
   - Content in FR, EN, AR
   - Active status
4. Click "Enregistrer"

### Admin - Edit Policy
**Quick Edit:**
1. Click "Quick Edit" on any policy
2. Modify fields in modal
3. Save

**Full Edit:**
1. Click "Modifier" on any policy
2. Use rich text editor
3. Switch languages with language selector
4. Save changes

### Admin - Delete Policy
1. Click "Supprimer" on any policy
2. Confirm deletion
3. Policy is removed from database

### Composable Usage
```typescript
// Fetch all policies
const { fetchAllPolicies } = usePolicies();
const policies = await fetchAllPolicies();

// Fetch policy by slug
const { fetchPolicyBySlug } = usePolicies();
const { data } = await fetchPolicyBySlug('politique-de-livraison');

// Get translation
const { getTranslation } = usePolicies();
const title = getTranslation(policy.title_translations);
```

## 🔒 Security

### Row Level Security Policies
```sql
-- Public can view active policies
CREATE POLICY "Public can view active policies"
  ON policies FOR SELECT
  USING (is_active = true);

-- Authenticated users can manage all policies
CREATE POLICY "Authenticated users can manage policies"
  ON policies FOR ALL
  USING (auth.role() = 'authenticated');
```

## 🌐 Multi-Language Support

All text content is stored in JSONB fields with this structure:
```json
{
  "fr": "French text",
  "en": "English text",
  "ar": "Arabic text"
}
```

The `useTranslation` composable automatically selects the appropriate language based on the user's locale.

## 🎨 Styling

- Uses Tailwind CSS classes
- Responsive design (mobile-first)
- Consistent with existing admin UI
- Accessible (ARIA labels, keyboard navigation)

## 📦 Dependencies

**No external dependencies added!** The implementation uses:
- Vue 3 built-in features (Transition, Teleport)
- Existing project composables
- Existing UI components
- Nuxt 3 features
- Supabase client

## 🐛 Troubleshooting

### Modal not showing
- Check that parent component is passing correct props
- Verify `show` prop is reactive

### Policies not loading
- Verify Supabase migration ran successfully
- Check RLS policies are enabled
- Confirm user has authentication token

### Translation not working
- Verify `useTranslation` composable exists
- Check locale is set correctly
- Ensure translation data exists in database

## 🔄 Migration from xone-algeria

This implementation is a complete port from xone-algeria with:
- ✅ Same database structure
- ✅ Same admin interface
- ✅ Same public display
- ✅ Same composable functions
- ✅ Multi-language support
- ✅ No external dependencies (@headlessui/vue removed)

## 📞 Support

For questions or issues:
1. Check this documentation
2. Review the PR description
3. Examine the code comments
4. Test in development environment first
