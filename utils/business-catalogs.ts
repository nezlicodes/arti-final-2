import type { BusinessId } from '~/utils/business-presets'

export type PreviewCategory = {
  id: string
  slug: string
  name: string
  description?: string
  image_url?: string
  is_active: boolean
  is_featured?: boolean
}

export type PreviewProduct = {
  id: string
  slug: string
  name: string
  description?: string
  price: number
  compare_at_price?: number | null
  quantity?: number
  has_variants?: boolean
  category_id: string
  category?: { id: string; name: string; slug: string }
  images?: { url: string; is_primary?: boolean; position?: number }[]
  is_active?: boolean
  is_featured?: boolean
  created_at?: string
}

export type PreviewCatalog = {
  categories: PreviewCategory[]
  products: PreviewProduct[]
}

// Uses the *real photos* already present in /public/images/placeholders/**
// Each business folder has: hero.jpg, cat1..3.jpg, prod1..3.jpg
// We generate 4 categories + 12 products by reusing/rotating images.

type BusinessAssets = {
  hero: string
  categories: string[]
  products: string[]
}

const ASSETS: Record<BusinessId, BusinessAssets> = {
  // "ecommerce" uses ready-to-wear + some home-decor photos for variety
  ecommerce: {
    hero: '/images/placeholders/ready-to-wear/hero.jpg',
    categories: [
      '/images/placeholders/ready-to-wear/cat1.jpg',
      '/images/placeholders/ready-to-wear/cat2.jpg',
      '/images/placeholders/ready-to-wear/cat3.jpg',
      '/images/placeholders/home-decor/spacejoy-IH7wPsjwomc-unsplash.jpg'
    ],
    products: [
      '/images/placeholders/ready-to-wear/prod1.jpg',
      '/images/placeholders/ready-to-wear/prod2.jpg',
      '/images/placeholders/ready-to-wear/prod3.jpg',
      '/images/placeholders/home-decor/spacejoy-KSfe2Z4REEM-unsplash.jpg',
      '/images/placeholders/home-decor/spacejoy-XpbtQfr9Skg-unsplash.jpg'
    ]
  },

  // NOTE: folder name in repo is "reataurant" (typo). We keep it.
  restaurant: {
    hero: '/images/placeholders/reataurant/hero.jpg',
    categories: [
      '/images/placeholders/reataurant/cat1.jpg',
      '/images/placeholders/reataurant/cat2.jpg',
      '/images/placeholders/reataurant/cat3.jpg',
      // 4th category image reused to create the illusion of more categories
      '/images/placeholders/reataurant/cat1.jpg'
    ],
    products: [
      '/images/placeholders/reataurant/prod1.jpg',
      '/images/placeholders/reataurant/prod2.jpg',
      '/images/placeholders/reataurant/prod3.jpg'
    ]
  },

  // artisan uses artisan folder + jewellery for variety
  artisan: {
    hero: '/images/placeholders/artisan/hero.jpg',
    categories: [
      '/images/placeholders/artisan/cat1.jpg',
      '/images/placeholders/artisan/cat2.jpg',
      '/images/placeholders/artisan/cat3.jpg',
      '/images/placeholders/jewellery/cat1.jpg'
    ],
    products: [
      '/images/placeholders/artisan/prod1.jpg',
      '/images/placeholders/artisan/prod2.jpg',
      '/images/placeholders/artisan/prod3.jpg',
      '/images/placeholders/jewellery/prod1.jpg',
      '/images/placeholders/jewellery/prod2.jpg'
    ]
  },

  patisserie: {
    hero: '/images/placeholders/patisserie/hero.jpg',
    categories: [
      '/images/placeholders/patisserie/cat1.jpg',
      '/images/placeholders/patisserie/cat2.jpg',
      '/images/placeholders/patisserie/cat3.jpg',
      '/images/placeholders/patisserie/cat1.jpg'
    ],
    products: [
      '/images/placeholders/patisserie/prod1.jpg',
      '/images/placeholders/patisserie/prod2.jpg',
      '/images/placeholders/patisserie/prod3.jpg'
    ]
  },

  leather: {
    hero: '/images/placeholders/leather/hero.jpg',
    categories: [
      '/images/placeholders/leather/cat1.jpg',
      '/images/placeholders/leather/cat2.jpg',
      '/images/placeholders/leather/cat3.jpg',
      '/images/placeholders/leather/cat1.jpg'
    ],
    products: [
      '/images/placeholders/leather/prod1.jpg',
      '/images/placeholders/leather/prod2.jpg',
      '/images/placeholders/leather/prod3.jpg'
    ]
  },

  jewellery: {
    hero: '/images/placeholders/jewellery/hero.jpg',
    categories: [
      '/images/placeholders/jewellery/cat1.jpg',
      '/images/placeholders/jewellery/cat2.jpg',
      '/images/placeholders/jewellery/cat3.jpg',
      '/images/placeholders/jewellery/cat1.jpg'
    ],
    products: [
      '/images/placeholders/jewellery/prod1.jpg',
      '/images/placeholders/jewellery/prod2.jpg',
      '/images/placeholders/jewellery/prod3.jpg'
    ]
  },

  'home-decor': {
    hero: '/images/placeholders/home-decor/spacejoy-IH7wPsjwomc-unsplash.jpg',
    categories: [
      '/images/placeholders/home-decor/spacejoy-IH7wPsjwomc-unsplash.jpg',
      '/images/placeholders/home-decor/spacejoy-KSfe2Z4REEM-unsplash.jpg',
      '/images/placeholders/home-decor/spacejoy-XpbtQfr9Skg-unsplash.jpg',
      '/images/placeholders/home-decor/spacejoy-RqO6kwm4tZY-unsplash.jpg'
    ],
    products: [
      '/images/placeholders/home-decor/spacejoy-IH7wPsjwomc-unsplash.jpg',
      '/images/placeholders/home-decor/spacejoy-KSfe2Z4REEM-unsplash.jpg',
      '/images/placeholders/home-decor/spacejoy-XpbtQfr9Skg-unsplash.jpg',
      '/images/placeholders/home-decor/spacejoy-RqO6kwm4tZY-unsplash.jpg',
      '/images/placeholders/home-decor/angela-bailey-tuJtzghMuEw-unsplash.jpg',
      '/images/placeholders/home-decor/linh-le-giP0e750Dr8-unsplash.jpg',
      '/images/placeholders/home-decor/minh-pham-OtXADkUh3-I-unsplash.jpg'
    ]
  },

  'ready-to-wear': {
    hero: '/images/placeholders/ready-to-wear/hero.jpg',
    categories: [
      '/images/placeholders/ready-to-wear/cat1.jpg',
      '/images/placeholders/ready-to-wear/cat2.jpg',
      '/images/placeholders/ready-to-wear/cat3.jpg',
      '/images/placeholders/ready-to-wear/cat1.jpg'
    ],
    products: [
      '/images/placeholders/ready-to-wear/prod1.jpg',
      '/images/placeholders/ready-to-wear/prod2.jpg',
      '/images/placeholders/ready-to-wear/prod3.jpg'
    ]
  }
}

const slugify = (s: string) => {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const makeCatalog = (business: BusinessId, prefix: string, categoryDefs: { slug: string; name: string; description?: string }[], productNamePool: string[]) => {
  const assets = ASSETS[business]

  const categories: PreviewCategory[] = categoryDefs.slice(0, 4).map((c, idx) => ({
    id: `${prefix}-cat-${idx + 1}`,
    slug: c.slug,
    name: c.name,
    description: c.description,
    image_url: assets.categories[idx % assets.categories.length],
    is_active: true,
    is_featured: idx < 2
  }))

  const products: PreviewProduct[] = Array.from({ length: 12 }).map((_, idx) => {
    const cat = categories[idx % categories.length]
    const baseName = productNamePool[idx % productNamePool.length]
    const name = `${baseName} ${idx + 1}`

    return {
      id: `${prefix}-prod-${idx + 1}`,
      slug: `${slugify(baseName)}-${idx + 1}`,
      name,
      description: `Description de ${baseName.toLowerCase()} (aperçu).`,
      // Deterministic price (avoid SSR/client hydration mismatch)
      price: Number((((idx % 12) + 1) * 7.5 + 2.9).toFixed(2)),
      compare_at_price: null,
      quantity: 999,
      category_id: cat.id,
      images: [{ url: assets.products[idx % assets.products.length], is_primary: true, position: 0 }],
      is_active: true,
      is_featured: idx < 3,
      created_at: new Date(Date.now() - idx * 86400000).toISOString()
    }
  })

  return { categories, products } satisfies PreviewCatalog
}

const ecommerce = makeCatalog(
  'ecommerce',
  'ec',
  [
    { slug: 'ready-to-wear', name: 'Prêt-à-porter' },
    { slug: 'shoes', name: 'Chaussures' },
    { slug: 'accessories', name: 'Accessoires' },
    { slug: 'home-decor', name: 'Décoration' }
  ],
  ['Veste', 'Sneakers', 'Sac', 'Chemise', 'Parfum', 'Montre']
)

const restaurant = makeCatalog(
  'restaurant',
  'rs',
  [
    { slug: 'starters', name: 'Entrées' },
    { slug: 'mains', name: 'Plats' },
    { slug: 'desserts', name: 'Desserts' },
    { slug: 'drinks', name: 'Boissons' }
  ],
  ['Salade', 'Burger', 'Pâtes', 'Pizza', 'Tiramisu', 'Citronnade']
)

const artisan = makeCatalog(
  'artisan',
  'ar',
  [
    { slug: 'ceramics', name: 'Céramique' },
    { slug: 'leather', name: 'Cuir' },
    { slug: 'jewellery', name: 'Bijoux' },
    { slug: 'home-decor', name: 'Décoration' }
  ],
  ['Mug', 'Porte-cartes', 'Collier', 'Bracelet', 'Bougie', 'Vase']
)

const patisserie = makeCatalog(
  'patisserie',
  'pt',
  [
    { slug: 'cakes', name: 'Gâteaux' },
    { slug: 'pastries', name: 'Viennoiseries' },
    { slug: 'cookies', name: 'Biscuits' },
    { slug: 'drinks', name: 'Boissons' }
  ],
  ['Éclair', 'Tarte', 'Croissant', 'Cupcake', 'Cookie', 'Macaron']
)

const leather = makeCatalog(
  'leather',
  'lg',
  [
    { slug: 'bags', name: 'Sacs' },
    { slug: 'wallets', name: 'Portefeuilles' },
    { slug: 'belts', name: 'Ceintures' },
    { slug: 'accessories', name: 'Accessoires' }
  ],
  ['Sac', 'Porte-cartes', 'Ceinture', 'Portefeuille', 'Pochette', 'Étui']
)

const jewellery = makeCatalog(
  'jewellery',
  'jw',
  [
    { slug: 'rings', name: 'Bagues' },
    { slug: 'necklaces', name: 'Colliers' },
    { slug: 'bracelets', name: 'Bracelets' },
    { slug: 'earrings', name: 'Boucles' }
  ],
  ['Bague', 'Collier', 'Bracelet', 'Boucles', 'Pendentif', 'Set']
)

const homeDecor = makeCatalog(
  'home-decor',
  'hd',
  [
    { slug: 'living-room', name: 'Salon' },
    { slug: 'bedroom', name: 'Chambre' },
    { slug: 'lighting', name: 'Luminaires' },
    { slug: 'accessories', name: 'Accessoires' }
  ],
  ['Lampe', 'Vase', 'Cadre', 'Coussin', 'Bougie', 'Tapis']
)

const readyToWear = makeCatalog(
  'ready-to-wear',
  'rtw',
  [
    { slug: 'new', name: 'Nouveautés' },
    { slug: 'women', name: 'Femme' },
    { slug: 'men', name: 'Homme' },
    { slug: 'accessories', name: 'Accessoires' }
  ],
  ['Veste', 'Robe', 'Chemise', 'Sneakers', 'Sac', 'Montre']
)

export const BUSINESS_CATALOGS: Record<BusinessId, PreviewCatalog> = {
  ecommerce,
  restaurant,
  artisan,
  patisserie,
  leather,
  jewellery,
  'home-decor': homeDecor,
  'ready-to-wear': readyToWear
}

export const getCatalogForBusiness = (businessId: BusinessId): PreviewCatalog => {
  return BUSINESS_CATALOGS[businessId] || BUSINESS_CATALOGS.ecommerce
}
