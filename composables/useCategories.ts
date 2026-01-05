// composables/useCategories.ts
// Updated with optimized data fetching

import type { Database } from '~/types/supabase'

type Category = Database['public']['Tables']['categories']['Row']

export const useCategories = () => {
  const supabase = useSupabaseClient<Database>()
  const nuxtApp = useNuxtApp()

  const { businessId } = useBusinessPreview()
  
  // Get current locale safely
  const getCurrentLocale = () => {
    try {
      if (nuxtApp && nuxtApp.$i18n) {
        return nuxtApp.$i18n.locale.value
      }
      return 'fr'
    } catch {
      return 'fr'
    }
  }

  /**
   * Fetch categories with filters and caching
   */
  const fetchCategories = async (filters: {
    featured?: boolean
    active?: boolean
    withProductCount?: boolean
  } = {}) => {
    const locale = getCurrentLocale()
    const { featured, active = true, withProductCount = false } = filters

    // If visitor selected a non-default business, force preview catalog
    if (businessId.value !== 'ecommerce') {
      const { getCatalogForBusiness } = await import('~/utils/business-catalogs')
      const catalog = getCatalogForBusiness(businessId.value as any)

      let cats = catalog.categories.filter(c => (active ? c.is_active : true))
      if (featured !== undefined) cats = cats.filter(c => Boolean(c.is_featured) === featured)

      return cats.map(c => ({
        ...c,
        name: c.name,
        description: c.description || '',
        name_translations: { fr: c.name, en: c.name, ar: c.name },
        description_translations: { fr: c.description || '', en: c.description || '', ar: c.description || '' },
        product_count: withProductCount ? catalog.products.filter(p => p.category_id === c.id).length : 0
      }))
    }

    // Preview-first: if backend is empty/unavailable, show business-specific catalog
    try {
      let query = supabase
        .from('categories')
        .select(withProductCount ? '*, products(count)' : '*')
        .eq('is_active', active)
        .order('name_translations->fr', { ascending: true })

      if (featured !== undefined) {
        query = query.eq('is_featured', featured)
      }

      const { data, error } = await query

      if (!error && data && data.length > 0) {
        return data.map(category => ({
          ...category,
          name: category.name_translations?.[locale] || category.name_translations?.['fr'] || '',
          description: category.description_translations?.[locale] || category.description_translations?.['fr'] || '',
          product_count: withProductCount && Array.isArray((category as any).products) ? (category as any).products.length : 0
        }))
      }
    } catch (e) {
      // ignore and fall back to preview
    }

    const { getCatalogForBusiness } = await import('~/utils/business-catalogs')
    const catalog = getCatalogForBusiness(businessId.value)

    let cats = catalog.categories.filter(c => (active ? c.is_active : true))
    if (featured !== undefined) cats = cats.filter(c => Boolean(c.is_featured) === featured)

    return cats.map(c => ({
      ...c,
      // mimic DB shape used by components
      name: c.name,
      description: c.description || '',
      name_translations: { fr: c.name, en: c.name, ar: c.name },
      description_translations: { fr: c.description || '', en: c.description || '', ar: c.description || '' },
      product_count: withProductCount ? catalog.products.filter(p => p.category_id === c.id).length : 0
    }))
  }

  /**
   * Fetch single category by ID or slug
   */
  const fetchCategory = async (idOrSlug: string, withProducts = false) => {
    const locale = getCurrentLocale()

    // If visitor selected a non-default business, force preview catalog
    if (businessId.value !== 'ecommerce') {
      const { getCatalogForBusiness } = await import('~/utils/business-catalogs')
      const catalog = getCatalogForBusiness(businessId.value as any)

      const match = catalog.categories.find(c => c.id === idOrSlug || c.slug === idOrSlug)
      if (!match) throw new Error('Category not found')

      return {
        ...match,
        name: match.name,
        description: match.description || '',
        name_translations: { fr: match.name, en: match.name, ar: match.name },
        description_translations: { fr: match.description || '', en: match.description || '', ar: match.description || '' },
        products: withProducts ? catalog.products.filter(p => p.category_id === match.id) : undefined
      } as any
    }

    try {
      let query = supabase
        .from('categories')
        .select(withProducts ? '*, products(*)' : '*')
        .eq('is_active', true)

      // Check if it's a UUID or slug
      if (idOrSlug.includes('-') && idOrSlug.length > 30) {
        query = query.eq('id', idOrSlug)
      } else {
        query = query.eq('slug', idOrSlug)
      }

      const { data, error } = await query.single()

      if (!error && data) {
        return {
          ...data,
          name: data.name_translations?.[locale] || data.name_translations?.['fr'] || '',
          description: data.description_translations?.[locale] || data.description_translations?.['fr'] || ''
        }
      }
    } catch (e) {
      // ignore and fall back to preview
    }

    const { getCatalogForBusiness } = await import('~/utils/business-catalogs')
    const catalog = getCatalogForBusiness(businessId.value)

    const match = catalog.categories.find(c => c.id === idOrSlug || c.slug === idOrSlug)
    if (!match) throw new Error('Category not found')

    return {
      ...match,
      name: match.name,
      description: match.description || '',
      name_translations: { fr: match.name, en: match.name, ar: match.name },
      description_translations: { fr: match.description || '', en: match.description || '', ar: match.description || '' },
      products: withProducts ? catalog.products.filter(p => p.category_id === match.id) : undefined
    } as any
  }

  /**
   * Create category
   */
  const createCategory = async (category: {
    name: string
    slug: string
    description?: string
    image?: string
    is_featured?: boolean
  }) => {
    const { name, description, ...rest } = category

    // Create translations object
    const name_translations = {
      en: name,
      fr: name,
      ar: name
    }

    const description_translations = description ? {
      en: description,
      fr: description,
      ar: description
    } : null

    const { data, error } = await supabase
      .from('categories')
      .insert({
        ...rest,
        name_translations,
        description_translations,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Update category
   */
  const updateCategory = async (id: string, updates: Partial<Category> & { 
    name?: string
    description?: string 
  }) => {
    const locale = getCurrentLocale()
    const { name, description, ...rest } = updates

    const updateData: any = { ...rest }

    // Update translations if name is provided
    if (name !== undefined) {
      const { data: current } = await supabase
        .from('categories')
        .select('name_translations')
        .eq('id', id)
        .single()

      updateData.name_translations = {
        ...current?.name_translations,
        [locale]: name
      }
    }

    // Update description translations if provided
    if (description !== undefined) {
      const { data: current } = await supabase
        .from('categories')
        .select('description_translations')
        .eq('id', id)
        .single()

      updateData.description_translations = {
        ...current?.description_translations,
        [locale]: description
      }
    }

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Delete category
   */
  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  /**
   * Toggle featured status
   */
  const toggleFeatured = async (id: string, featured: boolean) => {
    const { data, error } = await supabase
      .from('categories')
      .update({ is_featured: featured })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  return {
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleFeatured
  }
}