import { NextApiRequest, NextApiResponse } from 'next';

import FetchItems from '@/utils/FetchBackend/rest/api/items';
import FetchArticles from '@/utils/FetchBackend/rest/api/article';
import FetchItemBrand from '@/utils/FetchBackend/rest/api/item-brands';
import FetchItemCategories from '@/utils/FetchBackend/rest/api/item-categories';

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

  arr.push(`${process.env.SITE_URL}/`);

  const pages = await FetchArticles.get();
  for (let i = 0; i < pages.length; ++i) {
    if (pages[i].dp_isHidden) {
      continue;
    }

    arr.push(`${process.env.SITE_URL}/${pages[i].dp_urlSegment}`);
  }

  arr.push(`${process.env.SITE_URL}/products`);

  const brands = await FetchItemBrand.get();
  for (let i = 0; i < brands.length; ++i) {
    if (brands[i].dp_isHidden) {
      continue;
    }

    arr.push(`${process.env.SITE_URL}/products/${brands[i].dp_urlSegment}`);
  }

  const categories = await FetchItemCategories.get();
  for (let i = 0; i < categories.length; ++i) {
    if (categories[i].dp_isHidden) {
      continue;
    }

    for (let j = 0; j < brands.length; ++j) {
      if (brands[j].dp_isHidden) {
        continue;
      }

      if (brands[j].dp_id === categories[i].dp_itemBrandId) {
        arr.push(
          `${process.env.SITE_URL}/products/${brands[j].dp_urlSegment}/${categories[i].dp_urlSegment}`,
        );
        break;
      }
    }
  }

  const items = await FetchItems.get();
  for (let i = 0; i < items.length; ++i) {
    if (items[i].dp_isHidden === '1') {
      continue;
    }

    for (let j = 0; j < categories.length; ++j) {
      if (categories[j].dp_isHidden) {
        continue;
      }

      if (items[i].dp_itemCategoryId === categories[j].dp_id) {
        for (let k = 0; k < brands.length; ++k) {
          if (brands[k].dp_isHidden) {
            continue;
          }

          if (brands[k].dp_id === categories[j].dp_itemBrandId) {
            arr.push(
              `${process.env.SITE_URL}/products/${brands[k].dp_urlSegment}/${categories[j].dp_urlSegment}/${items[i].dp_model}`,
            );

            break;
          }
        }

        break;
      }
    }
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
