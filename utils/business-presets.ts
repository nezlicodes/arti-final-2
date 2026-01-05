export type BusinessId =
  | 'ecommerce'
  | 'restaurant'
  | 'artisan'
  | 'patisserie'
  | 'leather'
  | 'jewellery'
  | 'home-decor'
  | 'ready-to-wear'

export type ThemeColors = {
  primaryColor: string
  primaryContrastColor: string
  secondaryColor: string
  secondaryContrastColor: string
  bodyBg: string
  textColor: string
}

export type BusinessPreset = {
  id: BusinessId
  label: string
  description: string
  site: {
    siteNameTranslations: Record<string, string>
    siteDescriptionTranslations: Record<string, string>
    // Optional: use placeholders unless user uploads via admin
    logo?: string
    favicon?: string
  }
  colors: ThemeColors
}

export const BUSINESS_PRESETS: Record<BusinessId, BusinessPreset> = {
  ecommerce: {
    id: 'ecommerce',
    label: 'E-commerce',
    description: 'Boutique en ligne classique (défaut).',
    site: {
      siteNameTranslations: { fr: 'Boutique en ligne', en: 'Online Store', ar: 'متجر إلكتروني' },
      siteDescriptionTranslations: {
        fr: 'Découvrez des produits incroyables à des prix avantageux',
        en: 'Discover amazing products at great prices',
        ar: 'اكتشف منتجات رائعة بأسعار ممتازة'
      }
    },
    colors: {
      // modern storefront: blue + slate
      primaryColor: '37, 99, 235', // blue-600
      primaryContrastColor: '255, 255, 255',
      secondaryColor: '15, 23, 42', // slate-900
      secondaryContrastColor: '255, 255, 255',
      bodyBg: '255, 255, 255',
      textColor: '15, 23, 42'
    }
  },
  restaurant: {
    id: 'restaurant',
    label: 'Restaurant',
    description: 'Menu, plats, best-sellers, ambiance chaleureuse.',
    site: {
      siteNameTranslations: { fr: 'Restaurant', en: 'Restaurant', ar: 'مطعم' },
      siteDescriptionTranslations: {
        fr: 'Des plats faits maison, servis avec passion',
        en: 'Homemade dishes served with passion',
        ar: 'أطباق منزلية تُقدّم بشغف'
      }
    },
    colors: {
      // deep red + warm gold
      primaryColor: '153, 27, 27', // red-800
      primaryContrastColor: '255, 255, 255',
      secondaryColor: '202, 138, 4', // amber-600
      secondaryContrastColor: '255, 255, 255',
      bodyBg: '255, 253, 247',
      textColor: '17, 24, 39'
    }
  },
  artisan: {
    id: 'artisan',
    label: 'Artisan',
    description: 'Produits faits main, créations locales, authenticité.',
    site: {
      siteNameTranslations: { fr: 'Atelier Artisan', en: 'Artisan Studio', ar: 'ورشة حرفية' },
      siteDescriptionTranslations: {
        fr: 'Des créations uniques, faites à la main',
        en: 'Unique handcrafted creations',
        ar: 'إبداعات فريدة مصنوعة يدوياً'
      }
    },
    colors: {
      // forest green + clay
      primaryColor: '21, 128, 61', // green-700
      primaryContrastColor: '255, 255, 255',
      secondaryColor: '180, 83, 9', // amber-700
      secondaryContrastColor: '255, 255, 255',
      bodyBg: '253, 252, 250',
      textColor: '28, 25, 23'
    }
  },

  patisserie: {
    id: 'patisserie',
    label: 'Pâtisserie',
    description: 'Gâteaux, viennoiseries et douceurs.',
    site: {
      siteNameTranslations: { fr: 'Pâtisserie', en: 'Patisserie', ar: 'حلويات' },
      siteDescriptionTranslations: {
        fr: 'Des douceurs artisanales, fraîches chaque jour',
        en: 'Handcrafted sweets, fresh every day',
        ar: 'حلويات مصنوعة بحرفية وطازجة يومياً'
      }
    },
    colors: {
      // soft rose + cocoa
      primaryColor: '236, 72, 153', // pink-500
      primaryContrastColor: '255, 255, 255',
      secondaryColor: '120, 53, 15', // amber-900-ish
      secondaryContrastColor: '255, 255, 255',
      bodyBg: '255, 251, 253',
      textColor: '17, 24, 39'
    }
  },

  leather: {
    id: 'leather',
    label: 'Maroquinerie',
    description: 'Cuir, accessoires et articles premium.',
    site: {
      siteNameTranslations: { fr: 'Maroquinerie', en: 'Leather Goods', ar: 'منتجات جلدية' },
      siteDescriptionTranslations: {
        fr: 'Des pièces durables en cuir, au style intemporel',
        en: 'Durable leather pieces with timeless style',
        ar: 'قطع جلدية متينة بطابع كلاسيكي'
      }
    },
    colors: {
      // espresso + sand
      primaryColor: '69, 26, 3', // amber-950
      primaryContrastColor: '255, 255, 255',
      secondaryColor: '161, 98, 7', // amber-700
      secondaryContrastColor: '255, 255, 255',
      bodyBg: '255, 252, 248',
      textColor: '17, 24, 39'
    }
  },

  jewellery: {
    id: 'jewellery',
    label: 'Bijouterie',
    description: 'Bijoux modernes et élégants.',
    site: {
      siteNameTranslations: { fr: 'Bijouterie', en: 'Jewellery', ar: 'مجوهرات' },
      siteDescriptionTranslations: {
        fr: 'Des pièces éclatantes pour chaque occasion',
        en: 'Shining pieces for every occasion',
        ar: 'قطع لامعة لكل مناسبة'
      }
    },
    colors: {
      // royal indigo + champagne
      primaryColor: '79, 70, 229', // indigo-600
      primaryContrastColor: '255, 255, 255',
      secondaryColor: '180, 83, 9', // amber-700
      secondaryContrastColor: '255, 255, 255',
      bodyBg: '252, 252, 251',
      textColor: '17, 24, 39'
    }
  },

  'home-decor': {
    id: 'home-decor',
    label: 'Décoration',
    description: 'Maison, déco et ambiance.',
    site: {
      siteNameTranslations: { fr: 'Décoration', en: 'Home Decor', ar: 'ديكور المنزل' },
      siteDescriptionTranslations: {
        fr: 'Créez une ambiance unique chez vous',
        en: 'Create a unique atmosphere at home',
        ar: 'اصنع أجواءً مميزة في منزلك'
      }
    },
    colors: {
      // sage + charcoal
      primaryColor: '5, 150, 105', // emerald-600
      primaryContrastColor: '255, 255, 255',
      secondaryColor: '31, 41, 55', // gray-800
      secondaryContrastColor: '255, 255, 255',
      bodyBg: '252, 252, 249',
      textColor: '31, 41, 55'
    }
  },

  'ready-to-wear': {
    id: 'ready-to-wear',
    label: 'Prêt-à-porter',
    description: 'Mode, looks et tendances.',
    site: {
      siteNameTranslations: { fr: 'Prêt-à-porter', en: 'Ready to Wear', ar: 'أزياء' },
      siteDescriptionTranslations: {
        fr: 'Des pièces tendance, sélectionnées avec soin',
        en: 'Trendy pieces curated with care',
        ar: 'قطع عصرية مختارة بعناية'
      }
    },
    colors: {
      // monochrome with bold accent
      primaryColor: '17, 24, 39', // gray-900
      primaryContrastColor: '255, 255, 255',
      secondaryColor: '236, 72, 153', // pink-500
      secondaryContrastColor: '255, 255, 255',
      bodyBg: '255, 255, 255',
      textColor: '17, 24, 39'
    }
  }
}

export const DEFAULT_BUSINESS_ID: BusinessId = 'ecommerce'
