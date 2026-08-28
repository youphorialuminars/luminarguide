

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const paths = ['', '/about', '/features', '/solutions', '/pricing', '/faq', '/contact', '/get-started', '/book-demo'];
  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: path === '' ? 1.0 : 0.7,
  }));
}