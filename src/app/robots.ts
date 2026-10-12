import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'http://localhost:3000'; // Replace with production URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/my-list/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
