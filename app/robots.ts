import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/agent/', '/profile/', '/favorites/'],
    },
    sitemap: 'https://estatevista.com/sitemap.xml',
  };
}
