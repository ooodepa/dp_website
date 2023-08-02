/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC__SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  priority: 0.5,
  changefreq: 'weekly',
  exclude: [],
};
