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
exports.webConfig = void 0;
const path_1 = __importDefault(require("path"));
const css_minimizer_webpack_plugin_1 = __importDefault(require("css-minimizer-webpack-plugin"));
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const SitemapPlugin = __importStar(require("sitemap-webpack-plugin"));
const HtmlInlineCssWebpackPlugin = __importStar(require("html-inline-css-webpack-plugin"));
const utils_1 = require("./utils");
const webConfig = (params) => {
    const { srcDir = `src`, productionDir = `public_html`, appShortName = `WebApp`, twitterUserName = `degreesign`, websiteName = `DegreeSign WebApp`, websiteDomain = `degreesign.com`, publishedTime = `2025-01-01T00:00:00+00:00`, author = `DegreeSign Team`, websiteTitle = `progressive webapp`, websiteDescription = `Webpack progressive web app`, coverImage = `degreesign_screenshot.webp`, coverImageDescription = `Screenshot of website`, background_color = `#fff`, theme_color = '#000', app_icon = `app_icon.png`, fav_icon = `favicon.ico`, orientation = 'portrait', pagesList = [], htmlCommonElements = [], assetsDir = `assets`, commonDir = `common`, imagesDir = `images`, pagesDir = `pages`, pageHome = `home`, htaccessCustom = ``, startURI = ``, language = `en_GB`, cssDiscardUnused = false, updateServiceWorker = false, onlineIndicatorFile = `https://degreesign.com/assets/images/Degree_Sign_Logo_2022.svg`, } = params || {};
    const latestUpdates = (0, utils_1.readJSON)(`./updateTimes.json`) || {}, updateTimes = () => (0, utils_1.writeJSON)(`./updateTimes.json`, latestUpdates), dataString = new Date().toISOString(), timeNow = Date.now(), websiteLink = `https://${websiteDomain}`, getImageURI = (image) => image?.includes(`/`) ? image
        : `/${assetsDir}/${imagesDir}/${image}`, getImageLink = (image) => image?.includes(`/`) ? image
        : `${websiteLink}/${assetsDir}/${imagesDir}/${image}`, coverImageLink = getImageLink(coverImage), appIconFile = getImageURI(app_icon), favIconFile = getImageURI(fav_icon), htmlElements = (() => {
        const updateSW = !latestUpdates.serviceWorker || !updateServiceWorker, swTime = updateSW ? timeNow : latestUpdates.serviceWorker, elements = {
            headerHTML: `<script>${(0, utils_1.readData)(`sw_register.js`, true)
                ?.replaceAll(`TIME_UPDATED`, `${swTime}`)}</script>`
        };
        if (updateSW) {
            latestUpdates.serviceWorker = timeNow;
            updateTimes();
        }
        ;
        if (htmlCommonElements?.length)
            for (let i = 0; i < htmlCommonElements.length; i++) {
                const elm = htmlCommonElements[i];
                elements[`${elm}HTML`] =
                    (elm == `header` ? elements.headerHTML : ``)
                        + (0, utils_1.readData)(`./${srcDir}/${commonDir}/${elm}.html`);
            }
        ;
        return elements;
    })(), appManifest = {
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
        start_url: `/${startURI}`,
        description: websiteDescription,
        name: websiteName
    }, siteMap = [{ path: `/`, priority: 1.0, lastmod: dataString }], templateContent = ({ htmlWebpackPlugin }) => {
        const { links, headerHTML, title, menuHTML, bodyHTML, pageBody, footerHTML, } = htmlWebpackPlugin.options || {};
        return `<!-- Copyright © ${new Date(publishedTime).getFullYear()}-present ${websiteName}, All rights reserved. -->
                    <!DOCTYPE html>
                    <!-- Last Published: ${new Date().toUTCString()}+0000 (Coordinated Universal Time) -->
                    <html lang="en" prefix="og: https://ogp.me/">
                    <head>
                        <meta charset="UTF-8">
                        <link rel="manifest" href="/app.json?v=${timeNow}">
                        <link rel="icon" href="${favIconFile}" type="image/x-icon">
                        ${links || ``}
                        ${headerHTML || ``}
                        <title>${title || ``}</title>
                    </head>
                    <body>
                        ${menuHTML || ``}
                        ${bodyHTML || ``}
                        ${pageBody || ``}
                        ${footerHTML || ``}
                    </body>
                    </html>`;
    }, robots = `User-agent: *
Allow: /
Disallow: /404
${pagesList?.map(page => page.noindex ? `Disallow: /${page.uri}` : ``)?.join(`\n`)}

Sitemap: https://${websiteDomain}/sitemap.xml`, getServiceWorkerContent = () => {
        const urlsToCache = ['/', '/index.html', '/app.json'].concat(pagesList.map(pageData => {
            return `/${pageData?.uri}`;
        })), file = (0, utils_1.readData)(`sw.js`, true);
        return file
            ?.replaceAll(`APP_URL`, `/${startURI}`)
            ?.replaceAll(`APP_ICON`, appIconFile)
            ?.replaceAll(`APP_BADGE`, appIconFile)
            ?.replaceAll(`NOTIFICATION_URI`, `/${startURI}`)
            ?.replaceAll(`REFERENCE_FILE`, onlineIndicatorFile);
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
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
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
    Header set Content-Type "text/html; charset=UTF-8"
</Files>
`;
        if (!pageData.noindex && pageData.uri != pageHome)
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
    (0, utils_1.writeData)(`./${productionDir}/sw.js`, getServiceWorkerContent());
    const pagesHTML = pagesList.map(pageData => {
        const { noindex, uri: fileName, coverImage: coverImagePage, coverImageDescription: coverImageDescriptionPage, description, name: pageTitle, publishDate, } = pageData, isHome = pageHome == fileName, coverImageLinkNew = coverImagePage ? getImageURI(coverImagePage) : coverImageLink;
        return new html_webpack_plugin_1.default({
            chunks: [fileName],
            title: isHome ? `${websiteName || ``} | ${websiteTitle || ``}`
                : `${pageData?.name} | ${websiteName || ``}`,
            meta: (0, utils_1.metaTags)({
                author,
                websiteName,
                websiteTitle: pageTitle || websiteTitle,
                websiteDescription: description || websiteDescription,
                coverImageLink: coverImageLinkNew,
                coverImageDescription: (coverImagePage ? coverImageDescriptionPage : coverImageDescription) || ``,
                publishedTime: publishDate || publishedTime,
                websiteLink: isHome ? websiteLink : `${websiteLink}/${fileName}`,
                dataString,
                theme_color,
                twitterUserName,
                appIconFile,
                noindex,
                language,
                isHome,
            }),
            links: (0, utils_1.canonicalTag)({
                websiteDomain,
                page: isHome ? `` : `/${fileName}`,
                coverImageLink: coverImageLinkNew,
            }),
            pageBody: (0, utils_1.readData)(`./${srcDir}/${pagesDir}/${fileName}/${fileName}.html`),
            filename: isHome ? `index.html` : fileName,
            ...htmlElements,
            ...pageData.headerHTML ? {
                headerHTML: pageData.headerHTML
                    + (htmlElements.headerHTML || ``)
            } : {},
            ...pageData.menuHTML ? {
                menuHTML: pageData.menuHTML
                    + (htmlElements.menuHTML || ``)
            } : {},
            ...pageData.footerHTML ? {
                footerHTML: pageData.footerHTML
                    + (htmlElements.footerHTML || ``)
            } : {},
            ...pageData.customHTML?.length ? {
                bodyHTML: pageData.customHTML.map(elm => (0, utils_1.readData)(`./${srcDir}/${commonDir}/${elm}.html`))?.join(``),
            } : {},
            templateContent,
            minify: {
                collapseWhitespace: true,
                removeComments: false, // Preserve comments during minification
            },
        });
    }), configWebPlugins = [
        ...pagesHTML,
        new SitemapPlugin.default({
            base: websiteLink, // Replace with your site base URL
            paths: siteMap,
            options: {
                filename: `sitemap.xml`, // The name of the generated sitemap
            },
        }),
        new copy_webpack_plugin_1.default({
            patterns: [
                { from: `${srcDir}/${assetsDir}`, to: `${assetsDir}` },
            ],
        }),
        new mini_css_extract_plugin_1.default({
            filename: `styles/styles.css`, // Output CSS file with original name
        }),
        new HtmlInlineCssWebpackPlugin.default() // Inline CSS into the HTML
    ], customWebRules = [{
            test: /\.(png|jpe?g|gif|svg|ico)$/, // For images
            exclude: /node_modules/,
            type: `${assetsDir}/${imagesDir}`,
            include: path_1.default.resolve(process.cwd(), `${srcDir}/${assetsDir}/${imagesDir}`), // Only include files from the assets folder
            generator: {
                filename: `${assetsDir}/${imagesDir}/[name][ext][query]`, // Output to dist/assets folder
            },
        }, {
            test: /\.css$/, // For CSS files
            exclude: /node_modules/,
            use: [
                mini_css_extract_plugin_1.default.loader, // Extract CSS into files
                `css-loader`, // Process CSS files
            ],
        }], cssMinimise = [new css_minimizer_webpack_plugin_1.default({
            minimizerOptions: {
                preset: ['default', { discardUnused: cssDiscardUnused }], // Prevent removing unused styles
            },
        })], entryPoints = {};
    // entry points
    entryPoints[`${pageHome}`] = `./${srcDir}/${pagesDir}/${pageHome}/${pageHome}.ts`;
    for (let i = 0; i < pagesList.length; i++) {
        const { uri: fileName } = pagesList[i];
        entryPoints[fileName] =
            `./${srcDir}/${pagesDir}/${fileName}/${fileName}.ts`;
    }
    ;
    return {
        entryPoints,
        customWebRules,
        configWebPlugins,
        cssMinimise,
    };
};
exports.webConfig = webConfig;
