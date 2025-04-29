"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const webpack_obfuscator_1 = __importDefault(require("webpack-obfuscator"));
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const SitemapPlugin = __importStar(require("sitemap-webpack-plugin"));
const dotenv_1 = __importDefault(require("dotenv"));
const css_minimizer_webpack_plugin_1 = __importDefault(require("css-minimizer-webpack-plugin"));
const HtmlInlineCssWebpackPlugin = __importStar(require("html-inline-css-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const utils_1 = require("./utils");
const build = ({ mode = `production`, appShortName = `WebApp`, twitterUserName = `degreesign`, websiteName = `DegreeSign WebApp`, websiteDomain = `degreesign.com`, publishedTime = `2025-01-01T00:00:00+00:00`, author = `DegreeSign Team`, websiteTitle = `progressive webapp`, websiteDescription = `Webpack progressive web app`, coverImage = `degreesign_screenshot.webp`, coverImageDescription = `Screenshot of website`, notificationTitle = `New Notification`, notificationText = `You have a new notification!`, background_color = `#fff`, theme_color = '#000', app_icon = `app_icon.png`, fav_icon = `favicon.ico`, orientation = 'portrait', pagesList = [], htmlCommonElements = [], obfuscateON = false, srcDir = `src`, assetsDir = `assets`, developDir = `build`, commonDir = `common`, imagesDir = `images`, pagesDir = `pages`, pageHome = `home`, productionDir = `public_html`, htaccessCustom = ``, }) => {
    const dataString = new Date().toISOString(), timeNow = Date.now(), websiteLink = `https://${websiteDomain}`, getImageURI = (image) => image?.includes(`/`) ? image
        : `/${assetsDir}/${imagesDir}/${image}`, getImageLink = (image) => image?.includes(`/`) ? image
        : `${websiteLink}/${assetsDir}/${imagesDir}/${image}`, coverImageLink = getImageLink(coverImage), appIconFile = getImageURI(app_icon), favIconFile = getImageURI(fav_icon), htmlElements = (() => {
        const elements = {
            headerHTML: `<link href="${coverImageLink}" rel="image_src"><link rel="icon" href="${favIconFile}" type="image/x-icon"><link rel="manifest" href="app.json?v=${timeNow}"><script>"serviceWorker" in navigator && navigator.serviceWorker.register("./sw.js?v=${timeNow}", { scope: "/" });</script>`
        };
        if (htmlCommonElements?.length)
            for (let i = 0; i < htmlCommonElements.length; i++) {
                const elm = htmlCommonElements[i];
                elements[`${elm}HTML`] =
                    (elm == `header` ? elements.headerHTML : ``)
                        + (0, utils_1.readData)(`./${srcDir}/${commonDir}/${elm}.html`);
            }
        ;
        return elements;
    })(), envKeys = {}, entryPoints = {
        [`${pageHome}`]: `./${srcDir}/${pagesDir}/${pageHome}/${pageHome}.ts`,
    }, appManifest = {
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
    }, siteMap = [{ path: `/`, priority: 1.0, lastmod: dataString }], templateContent = ({ htmlWebpackPlugin }) => {
        const { links, headerHTML, title, menuHTML, customHTML, pageBody, footerHTML, } = htmlWebpackPlugin.options || {};
        return `<!-- Copyright © ${websiteName}, All rights reserved. -->
                    <!DOCTYPE html>
                    <!-- Last Published: ${dataString} (Coordinated Universal Time) -->
                    <html lang="en" prefix="og: https://ogp.me/">
                    <head>
                        ${links || ``}
                        ${headerHTML || ``}
                        <title>${title || ``}</title>
                    </head>
                    <body>
                        ${menuHTML || ``}
                        ${customHTML || ``}
                        ${pageBody || ``}
                        ${footerHTML || ``}
                    </body>
                    </html>`;
    }, robots = `User-agent: *
Allow: /
Disallow: /404

Sitemap: https://${websiteDomain}/sitemap.xml`, getServiceWorkerContent = ({ cacheName = websiteName, urlsToCache = ['/', '/index.html', '/app.json'].concat(pagesList.map(pageData => {
        return `/${pageData?.uri}`;
    })), fallbackUrl = '/index.html', notificationIcon = `${websiteLink}${appIconFile}`, notificationBadge = `${websiteLink}${appIconFile}`, defaultNotificationData = {
        title: notificationTitle,
        body: notificationText,
    }, rootUrl = '/' }) => {
        return `const CACHE_NAME='${cacheName}';const urlsToCache=${JSON.stringify(urlsToCache)};self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(urlsToCache))));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(n=>Promise.all(n.map(n=>n!==CACHE_NAME?caches.delete(n):null))).then(()=>self.clients.claim())));self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('${fallbackUrl}')))));self.addEventListener('notificationclick',e=>{e.notification.close();const u=new URL('${rootUrl}',self.location.origin).href;e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(c=>{for(const t of c)if(t.url===u&&'focus' in t)return t.focus();if(clients.openWindow)return clients.openWindow(u);}));});self.addEventListener('notificationclose',e=>console.log('Notification closed:',e.notification));self.addEventListener('push',e=>{let d=${JSON.stringify(defaultNotificationData)};if(e.data)d=e.data.json();const o={body:d.body,icon:'${notificationIcon}',badge:'${notificationBadge}',data:{url:new URL('${rootUrl}',self.location.origin).href}};e.waitUntil(self.registration.showNotification(d.title,o));});`;
    };
    let htaccessFile = `# Policies
<IfModule mod_headers.c>
  SetEnvIf Origin ^*\\.${websiteDomain?.replaceAll(`.`, `\\.`)}$ ORIGIN=$0
  Header always set Access-Control-Allow-Origin %{ORIGIN}e env=ORIGIN
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Content-Security-Policy ""
  Header set Permissions-Policy ""
  Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

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
ErrorDocument 403 /404

# Add content type
`;
    for (let i = 0; i < pagesList.length; i++) {
        const pageData = pagesList[i];
        if (pageData.shortcut) {
            const icon = pageData.icon ?
                pageData.icon?.includes(`/`) ? pageData.icon
                    : `/${assetsDir}/${imagesDir}/${pageData.icon}`
                : appIconFile;
            appManifest.shortcuts.push({
                name: pageData.name,
                short_name: pageData.short_name || pageData.name,
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
        }
        ;
        htaccessFile += `<Files ${pageData.uri}>
    Header set Content-Type "text/html"
</Files>
`;
        if (!pageData.noindex)
            siteMap.push({
                path: `/${pageData.uri}`,
                priority: 0.8,
                lastmod: dataString
            });
    }
    ;
    htaccessFile += htaccessCustom;
    (0, utils_1.writeData)(`./${productionDir}/robots.txt`, robots);
    (0, utils_1.writeData)(`./${productionDir}/.htaccess`, htaccessFile);
    (0, utils_1.writeData)(`./${productionDir}/app.json`, JSON.stringify(appManifest));
    (0, utils_1.writeData)(`./${productionDir}/sw.js`, getServiceWorkerContent({}));
    dotenv_1.default.config();
    for (const key in process.env)
        envKeys[`process.env.${key}`] = JSON.stringify(process.env[key]);
    for (let i = 0; i < pagesList.length; i++) {
        const { uri: fileName } = pagesList[i];
        entryPoints[fileName] =
            `./${srcDir}/${pagesDir}/${fileName}/${fileName}.ts`;
    }
    ;
    return {
        entry: entryPoints,
        performance: {
            maxAssetSize: 2 * 1024 ** 2,
            maxEntrypointSize: 2 * 1024 ** 2,
        },
        output: {
            path: path_1.default.resolve(process.cwd(), productionDir),
            filename: `code/[name].[contenthash].js`,
        },
        resolve: {
            extensions: [`.ts`, `.js`, `.json`],
        },
        module: {
            rules: [{
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: `ts-loader`,
                }, {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: [
                        mini_css_extract_plugin_1.default.loader,
                        `css-loader`,
                    ],
                }, {
                    test: /\.(png|jpe?g|gif|svg|ico)$/,
                    exclude: /node_modules/,
                    type: `${assetsDir}/${imagesDir}`,
                    include: path_1.default.resolve(process.cwd(), `${srcDir}/${assetsDir}/${imagesDir}`),
                    generator: {
                        filename: `${assetsDir}/${imagesDir}/[name][ext][query]`,
                    },
                }],
        },
        plugins: [
            new mini_css_extract_plugin_1.default({
                filename: `styles/styles.css`,
            }),
            new webpack_1.default.DefinePlugin(envKeys),
            new clean_webpack_plugin_1.CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['code/*.js'],
            }),
            new copy_webpack_plugin_1.default({
                patterns: [
                    { from: `${srcDir}/${assetsDir}`, to: `${assetsDir}` },
                ],
            }),
            ...pagesList.map(pageData => {
                const { noindex, uri: fileName, coverImage: coverImagePage, coverImageDescription: coverImageDescriptionPage, } = pageData, isHome = pageHome == fileName;
                return new html_webpack_plugin_1.default({
                    chunks: [fileName],
                    title: isHome ? `${websiteName} | ${websiteTitle}`
                        : `${fileName?.toUpperCase()} | ${websiteName}`,
                    links: (0, utils_1.canonicalTag)({ websiteDomain, page: isHome ? `` : `/${fileName}` }),
                    pageBody: (0, utils_1.readData)(`./${srcDir}/${pagesDir}/${fileName}/${fileName}.html`),
                    filename: fileName,
                    meta: (0, utils_1.metaTags)({
                        author,
                        websiteDescription,
                        websiteName,
                        websiteTitle,
                        coverImageLink: coverImagePage ? getImageURI(coverImagePage) : coverImageLink,
                        coverImageDescription: (coverImagePage ? coverImageDescriptionPage : coverImageDescription) || ``,
                        publishedTime,
                        websiteLink,
                        dataString,
                        theme_color,
                        twitterUserName,
                        appIconFile,
                        noindex,
                    }),
                    ...htmlElements,
                    ...pageData.headerCode ? {
                        headerHTML: htmlElements.headerHTML
                            + pageData.headerCode
                    } : {},
                    ...pageData.customHTML?.length ? {
                        customHTML: pageData.customHTML.map(elm => (0, utils_1.readData)(`./${srcDir}/${commonDir}/${elm}.html`))?.join(``),
                    } : {},
                    templateContent,
                });
            }),
            ...obfuscateON ? [new webpack_obfuscator_1.default({
                    rotateStringArray: true,
                    stringArray: true,
                    stringArrayThreshold: 0.8,
                })] : [],
            new SitemapPlugin.default({
                base: websiteLink,
                paths: siteMap,
                options: {
                    filename: `sitemap.xml`,
                },
            }),
            new HtmlInlineCssWebpackPlugin.default(),
        ],
        optimization: {
            minimize: true,
            minimizer: [
                new terser_webpack_plugin_1.default({
                    terserOptions: {
                        compress: {
                            drop_console: false,
                        },
                    },
                }),
                new css_minimizer_webpack_plugin_1.default(),
            ],
        },
        devServer: {
            static: {
                directory: path_1.default.join(process.cwd(), developDir),
            },
            port: 3000,
            open: true,
            compress: true,
        },
        mode
    };
};
exports.build = build;
