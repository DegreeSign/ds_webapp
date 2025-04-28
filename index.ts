import path from "path"
import webpack from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"
import { CleanWebpackPlugin } from "clean-webpack-plugin"
import WebpackObfuscator from "webpack-obfuscator"
import CopyWebpackPlugin from "copy-webpack-plugin"
import * as SitemapPlugin from "sitemap-webpack-plugin"
import dotenv from "dotenv"
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import * as HtmlInlineCssWebpackPlugin from "html-inline-css-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import TerserPlugin from "terser-webpack-plugin"
import fs from "fs"
import { Config, StringObj, WebManifest } from "./types"

const
    read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), `utf8`),
    write = (file: string, code: string) => fs.writeFileSync(path.resolve(process.cwd(), file), code, `utf8`),
    build = ({
        mode = `production`, // `development` | `production` 
        appShortName = `WebApp`,
        websiteName = `DegreeSign WebApp`,
        websiteDomain = `degreesign.com`,
        publishedTime = `2025-01-01T00:00:00+00:00`,
        author = `DegreeSign Team`,
        websiteTitle = `progressive webapp`,
        websiteDescription = `Webpack progressive web app`,
        coverImage = `degreesign_screenshot.webp`,
        coverImageDescription = `Screenshot of website`,
        notificationTitle = `New Notification`,
        notificationText = `You have a new notification!`,
        background_color = `#fff`,
        theme_color = '#000',
        app_icon = `app_icon.png`,
        orientation = 'portrait', // `portrait` | `landscape`
        /** Pages list array */
        pagesList = [],
        htmlCommonElements = [],
        obfuscateON = false,

        // directories
        srcDir = `src`,
        assetsDir = `assets`,
        developDir = `build`,
        commonDir = `common`,
        imagesDir = `images`,
        pagesDir = `pages`,
        pageHome = `home`,
        productionDir = `public_html`,
    }: Config) => {

        const
            canonical = (page: string) => `<link rel="canonical" href="https://${websiteDomain}${page}">`,
            htmlElements = (() => {
                const elements: StringObj = {};
                for (let i = 0; i < htmlCommonElements.length; i++) {
                    const elm = htmlCommonElements[i];
                    elements[`${elm}HTML`] = read(`./${srcDir}/${commonDir}/${elm}.html`);
                };
                return elements
            })(),
            dataString = new Date().toISOString(),
            websiteLink = `https://${websiteDomain}`,
            coverImageLink = coverImage?.includes(`/`) ? coverImage
                : `${websiteLink}/${assetsDir}/${imagesDir}/${coverImage}`,
            appIconFile = app_icon?.includes(`/`) ? app_icon
                : `/${assetsDir}/${imagesDir}/${app_icon}`,
            meta = {
                author,
                robots: `index, follow`,
                description: `${websiteDescription}`,
                viewport: `width=device-width, initial-scale=1.0`,
                charset: { charset: `UTF-8` },
                'http-equiv': {
                    'http-equiv': `X-UA-Compatible`,
                    content: `ie=edge`,
                },
                'twitter:card': `summary_large_image`,
                'twitter:title': {
                    property: 'twitter:title',
                    content: `${websiteName} | ${websiteTitle}`
                },
                'twitter:description': {
                    property: 'twitter:description',
                    content: `${websiteDescription}`
                },
                'twitter:image': {
                    property: 'twitter:image',
                    content: coverImageLink
                },
                'twitter:image:alt': {
                    property: 'twitter:image:alt',
                    content: coverImageDescription
                },
                thumbnailUrl: {
                    itemprop: `thumbnailUrl`,
                    content: coverImageLink
                },
                image: {
                    itemprop: `image`,
                    content: coverImageLink
                },
                'article:published_time': {
                    property: 'article:published_time',
                    content: publishedTime
                },
                'article:modified_time': {
                    property: 'article:modified_time',
                    content: dataString
                },
                'og:type': {
                    property: 'og:type',
                    content: `website`,
                    name: `type`,
                },
                'og:title': {
                    property: 'og:title',
                    content: `${websiteName} | ${websiteTitle}`,
                    name: `title`,
                },
                'og:description': {
                    property: 'og:description',
                    content: `${websiteDescription}`,
                    name: `description`,
                },
                'og:image': {
                    property: 'og:image',
                    content: coverImageLink,
                    name: `image`,
                },
                'og:publish_date': {
                    content: publishedTime,
                    property: `og:publish_date`,
                    name: `publish_date`,
                },
                'og:modified_date': {
                    content: dataString,
                    property: `og:modified_date`,
                    name: `modified_date`,
                },
                'og:url': {
                    content: websiteLink,
                    property: `og:url`,
                    name: `url`,
                },
            },

            envKeys: StringObj = {},

            entryPoints = {
                [`${pageHome}`]: `./${srcDir}/${pagesDir}/${pageHome}/${pageHome}.ts`, // Entry file for TypeScript
            },

            htaccessFile = `# Policies
<IfModule mod_headers.c>
  SetEnvIf Origin ^*\\.${websiteDomain?.replaceAll(`.`, `\\.`)}$ ORIGIN=$0
  Header always set Access-Control-Allow-Origin %{ORIGIN}e env=ORIGIN
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Content-Security-Policy ""
  Header set Permissions-Policy ""
  Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# Add content type
<Files about>
  Header set Content-Type "text/html"
</Files>

# disable indexing
Options -Indexes

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off

  # Unique files
  # RewriteRule ^sw.js /code/sw.js [L,NC]
</IfModule>

# Errors
ErrorDocument 404 /404
ErrorDocument 403 /404`,

            appManifest: WebManifest = {
                background_color,
                theme_color,
                icons: [{
                    src: appIconFile,
                    type: 'image/png',
                    sizes: '512x512',
                    purpose: 'maskable'
                }, {
                    src: appIconFile,
                    type: 'image/png',
                    sizes: '512x512',
                    purpose: 'any'
                }],
                shortcuts: [],
                display: 'standalone',
                orientation,
                short_name: appShortName,
                start_url: '/',
                description: websiteDescription,
                name: websiteName
            },

            robots = `User-agent: *
Allow: /
Disallow: /404

Sitemap: https://${websiteDomain}/sitemap.xml`,
            getServiceWorkerContent = ({
                cacheName = websiteName,
                urlsToCache = ['/', '/index.html', '/app.json'].concat(pagesList.map(pageData => {
                    return `/${pageData?.uri}`
                })),
                fallbackUrl = '/index.html',
                notificationIcon = `${websiteLink}${appIconFile}`,
                notificationBadge = `${websiteLink}${appIconFile}`,
                defaultNotificationData = {
                    title: notificationTitle,
                    body: notificationText,
                },
                rootUrl = '/'
            }) => {
                return `const CACHE_NAME='${cacheName}';const urlsToCache=${JSON.stringify(urlsToCache)};self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(urlsToCache))));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(n=>Promise.all(n.map(n=>n!==CACHE_NAME?caches.delete(n):null))).then(()=>self.clients.claim())));self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('${fallbackUrl}')))));self.addEventListener('notificationclick',e=>{e.notification.close();const u=new URL('${rootUrl}',self.location.origin).href;e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(c=>{for(const t of c)if(t.url===u&&'focus' in t)return t.focus();if(clients.openWindow)return clients.openWindow(u);}));});self.addEventListener('notificationclose',e=>console.log('Notification closed:',e.notification));self.addEventListener('push',e=>{let d=${JSON.stringify(defaultNotificationData)};if(e.data)d=e.data.json();const o={body:d.body,icon:'${notificationIcon}',badge:'${notificationBadge}',data:{url:new URL('${rootUrl}',self.location.origin).href}};e.waitUntil(self.registration.showNotification(d.title,o));});`;
            };

        for (let i = 0; i < pagesList.length; i++) {
            const pageData = pagesList[i];
            if (pageData.shortcut) {
                const icon = pageData.icon ?
                    pageData.icon?.includes(`/`) ? pageData.icon
                        : `/${assetsDir}/${imagesDir}/${pageData.icon}`
                    : appIconFile;
                appManifest.shortcuts.push({
                    name: pageData.name,
                    short_name: pageData.short_name,
                    description: pageData.description,
                    url: `/${pageData.uri}`,
                    icons: [{
                        src: icon,
                        type: 'image/png',
                        sizes: '512x512',
                        purpose: 'maskable'
                    }, {
                        src: icon,
                        type: 'image/png',
                        sizes: '512x512',
                        purpose: 'any'
                    }]
                });
            };
        };

        write(`./${productionDir}/robots.txt`, robots);
        write(`./${productionDir}/.htaccess`, htaccessFile);
        write(`./${productionDir}/app.json`, JSON.stringify(appManifest));
        write(`./${productionDir}/sw.js`, getServiceWorkerContent({}));

        // Environment keys
        dotenv.config();
        for (const key in process.env)
            envKeys[`process.env.${key}`] = JSON.stringify(process.env[key]);

        // entry points
        for (let i = 0; i < pagesList.length; i++) {
            const { uri: fileName } = pagesList[i];
            entryPoints[fileName] =
                `./${srcDir}/${pagesDir}/${fileName}/${fileName}.ts`;
        };

        return {
            entry: entryPoints,
            performance: {
                maxAssetSize: 2 * 1024 ** 2,
                maxEntrypointSize: 2 * 1024 ** 2,
            },
            output: {
                path: path.resolve(process.cwd(), productionDir),
                filename: `[name].[contenthash].js`,
            },
            resolve: {
                extensions: [`.ts`, `.js`], // Resolve .ts and .js files
            },
            module: {
                rules: [{
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: `ts-loader`,
                }, {
                    test: /\.css$/, // For CSS files
                    exclude: /node_modules/,
                    use: [
                        MiniCssExtractPlugin.loader, // Extract CSS into files
                        `css-loader`, // Process CSS files
                    ],
                }, {
                    test: /\.(png|jpe?g|gif|svg|ico)$/, // For images
                    exclude: /node_modules/,
                    type: `${assetsDir}/${imagesDir}`,
                    include: path.resolve(process.cwd(), `${srcDir}/${assetsDir}/${imagesDir}`), // Only include files from the assets folder
                    generator: {
                        filename: `${assetsDir}/${imagesDir}/[name][ext][query]`, // Output to dist/assets folder
                    },
                }],
            },
            plugins: [
                new MiniCssExtractPlugin({
                    filename: `styles.css`, // Output CSS file with original name
                }),
                new webpack.DefinePlugin(envKeys),
                new CleanWebpackPlugin({
                    cleanOnceBeforeBuildPatterns: [],
                }),
                new CopyWebpackPlugin({
                    patterns: [
                        { from: `${srcDir}/${assetsDir}`, to: `${assetsDir}` },
                    ],
                }),
                new HtmlWebpackPlugin({
                    chunks: [`${pageHome}`],
                    title: `${websiteName} | ${websiteTitle}`,
                    links: canonical(``),
                    template: `./${srcDir}/${pagesDir}/${pageHome}/${pageHome}.html`,
                    meta,
                    ...htmlElements,
                }),
                ...pagesList.map(pageData => {
                    const { uri: fileName } = pageData;
                    return new HtmlWebpackPlugin({
                        chunks: [fileName],
                        title: `${fileName?.toUpperCase()} | ${websiteName}`,
                        links: canonical(`/${fileName}`),
                        template: `./${srcDir}/${pagesDir}/${fileName}/${fileName}.html`,
                        filename: fileName,
                        meta,
                        ...htmlElements,
                    })
                }),
                ...obfuscateON ? [new WebpackObfuscator(
                    {
                        rotateStringArray: true,
                        stringArray: true,
                        stringArrayThreshold: 0.8, // Percentage of strings to obfuscate
                    },
                )] : [],
                new SitemapPlugin.default({
                    base: websiteLink, // Replace with your site base URL
                    paths: [
                        { path: `/`, priority: 1.0, lastmod: dataString },
                        ...pagesList.map(pageData => {
                            const { uri: fileName } = pageData;
                            return { path: `/${fileName}`, priority: 0.8, lastmod: dataString }
                        })
                    ],
                    options: {
                        filename: `sitemap.xml`, // The name of the generated sitemap
                    },
                }),
                new HtmlInlineCssWebpackPlugin.default(), // Inline CSS into the HTML
            ],
            optimization: {
                minimize: true, // Enable minimization
                minimizer: [
                    new TerserPlugin({ // Minify JavaScript
                        terserOptions: {
                            compress: {
                                drop_console: false, // Do not remove console logs
                            },
                        },
                    }),
                    new CssMinimizerPlugin(), // Add the CSS minimizer plugin
                ],
            },
            devServer: {
                static: {
                    directory: path.join(process.cwd(), developDir),
                },
                port: 3000, // Specify your desired port
                open: true, // Automatically open the browser
                compress: true, // Enable gzip compression for files served
            },
            mode
        };
    };

export { build };