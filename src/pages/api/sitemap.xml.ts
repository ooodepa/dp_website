import { NextApiRequest, NextApiResponse } from 'next';

import FetchItems from '@/utils/FetchBackend/rest/api/items';
import FetchArticles from '@/utils/FetchBackend/rest/api/article';

const generateSitemap = (pages: string[]): string => {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // const d = new Date().toJSON();

  pages.forEach(page => {
    sitemap += `<url>`;
    sitemap += `<loc>${page}</loc>`;
    // sitemap += `<lastmod>${d}</lastmod>`;
    sitemap += '<changefreq>weekly</changefreq>';
    sitemap += '<priority>0.5</priority>';
    sitemap += `</url>`;
  });

  sitemap += `</urlset>`;
  return sitemap;
};

async function generatePages() {
  const arr: string[] = [];

  arr.push(`${process.env.NEXT_PUBLIC__SITE_URL}/`);

  const pages = await FetchArticles.get();
  for (let i = 0; i < pages.length; ++i) {
    if (pages[i].dp_isHidden) {
      continue;
    }

    arr.push(`${process.env.NEXT_PUBLIC__SITE_URL}/${pages[i].dp_urlSegment}`);
  }

  arr.push(`${process.env.NEXT_PUBLIC__SITE_URL}/nomenclature`);

  const items = (
    await FetchItems.getPagination({
      dp_1cParentId: '',
      limit: 10000,
      page: 1,
    })
  ).data;
  for (let i = 0; i < items.length; ++i) {
    if (items[i].dp_isHidden) {
      continue;
    }

    arr.push(
      `${process.env.NEXT_PUBLIC__SITE_URL}/nomenclature/${items[i].dp_seoUrlSegment}`,
    );
  }

  return arr;
}

export default async function SitemapXml(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const pages = await generatePages();
  const sitemap = generateSitemap(pages);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
}
