import type { MetadataRoute } from 'next'

const siteUrl = 'https://mudmy.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    { url: siteUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/home`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/explore`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
