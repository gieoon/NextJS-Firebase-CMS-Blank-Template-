/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://ineednature.co.nz', //process.env.SITE_URL || 
    generateRobotsTxt: true,
    exclude: ['/login'],
}