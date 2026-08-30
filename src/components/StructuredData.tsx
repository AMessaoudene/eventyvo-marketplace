import React from 'react'
import type { Product } from '@/data/catalog'

interface StructuredDataProps {
  type: 'Product' | 'Organization' | 'WebSite'
  data: any
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    }

    return baseData
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData(), null, 2),
      }}
    />
  )
}

export function buildProductSchema(product: Product, baseUrl: string) {
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : undefined

  const reviewCount = product.reviews.length

  return {
    name: product.title,
    description: product.description,
    image: `${baseUrl}/products/${product.slug}/image`,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/products/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: product.vendorName,
      },
    },
    ...(averageRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating,
        reviewCount: reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    ...(product.reviews.length > 0 && {
      review: product.reviews.map((review) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: '5',
          worstRating: '1',
        },
        reviewBody: review.text,
        datePublished: review.at,
      })),
    }),
  }
}

export function buildOrganizationSchema(baseUrl: string) {
  return {
    name: 'Eventyvo Marketplace',
    url: baseUrl,
    description: 'Buy and sell physical and digital goods across the Eventyvo ecosystem.',
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://x.com/eventyvo',
      'https://facebook.com/eventyvo',
      'https://instagram.com/eventyvo',
      'https://linkedin.com/company/eventyvo',
    ],
  }
}

export function buildWebSiteSchema(baseUrl: string) {
  return {
    name: 'Eventyvo Marketplace',
    url: baseUrl,
    description: 'Buy and sell physical and digital goods across the Eventyvo ecosystem.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}