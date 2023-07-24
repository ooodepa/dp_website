import { NextApiRequest, NextApiResponse } from 'next';

const robotsTxtFile = `
# *
User-agent: *
Allow: /
Disallow: /basket
Disallow: /user-profile
Disallow: /user-profile/*

# Host
Host: ${process.env.NEXT_PUBLIC__SITE_URL}

# Sitemaps
Sitemap: ${process.env.NEXT_PUBLIC__SITE_URL}/sitemap.xml
`;

export default async function SitemapXml(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader('Content-Type', 'text/text');
  res.write(robotsTxtFile);
  res.end();
}
