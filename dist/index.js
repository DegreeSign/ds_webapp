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
exports.writeData = exports.readData = exports.build = void 0;
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
const utils_1 = require("./src/utils");
Object.defineProperty(exports, "readData", { enumerable: true, get: function () { return utils_1.readData; } });
Object.defineProperty(exports, "writeData", { enumerable: true, get: function () { return utils_1.writeData; } });
const build = ({ mode = `production`, appShortName = `WebApp`, twitterUserName = `degreesign`, websiteName = `DegreeSign WebApp`, websiteDomain = `degreesign.com`, publishedTime = `2025-01-01T00:00:00+00:00`, author = `DegreeSign Team`, websiteTitle = `progressive webapp`, websiteDescription = `Webpack progressive web app`, coverImage = `degreesign_screenshot.webp`, coverImageDescription = `Screenshot of website`, background_color = `#fff`, theme_color = '#000', app_icon = `app_icon.png`, fav_icon = `favicon.ico`, orientation = 'portrait', pagesList = [], htmlCommonElements = [], obfuscateON = false, srcDir = `src`, assetsDir = `assets`, commonDir = `common`, imagesDir = `images`, pagesDir = `pages`, pageHome = `home`, productionDir = `public_html`, htaccessCustom = ``, startURI = ``, language = `en_GB`, port = 3210, cssDiscardUnused = false, updateServiceWorker = false, onlineIndicatorFile = `https://degreesign.com/assets/images/Degree_Sign_Logo_2022.svg`, }) => {
    const latestUpdates = (0, utils_1.readJSON)(`./updateTimes.json`) || {}, updateTimes = () => (0, utils_1.writeJSON)(`./updateTimes.json`, latestUpdates), dataString = new Date().toISOString(), timeNow = Date.now(), websiteLink = `https://${websiteDomain}`, getImageURI = (image) => image?.includes(`/`) ? image
        : `/${assetsDir}/${imagesDir}/${image}`, getImageLink = (image) => image?.includes(`/`) ? image
        : `${websiteLink}/${assetsDir}/${imagesDir}/${image}`, coverImageLink = getImageLink(coverImage), appIconFile = getImageURI(app_icon), favIconFile = getImageURI(fav_icon), htmlElements = (() => {
        const updateSW = !latestUpdates.serviceWorker || !updateServiceWorker, swTime = updateSW ? timeNow : latestUpdates.serviceWorker, elements = {
            headerHTML: `<script>`
                + `"serviceWorker" in navigator && navigator.serviceWorker?.register(`
                + `"/sw.js?v=${swTime}", { scope: "/" }`
                + `);</script>`
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
    })(), envKeys = {}, entryPoints = {
        [`${pageHome}`]: `./${srcDir}/${pagesDir}/${pageHome}/${pageHome}.ts`, // Entry file for TypeScript
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

Sitemap: https://${websiteDomain}/sitemap.xml`, getServiceWorkerContent = () => {
        const urlsToCache = ['/', '/index.html', '/app.json'].concat(pagesList.map(pageData => {
            return `/${pageData?.uri}`;
        })), file = (0, utils_1.readData)(`./src/sw.js`, true);
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
    (0, utils_1.writeData)(`./${productionDir}/sw.js`, getServiceWorkerContent());
    // Environment keys
    dotenv_1.default.config();
    for (const key in process.env)
        envKeys[`process.env.${key}`] = JSON.stringify(process.env[key]);
    // entry points
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
            extensions: [`.ts`, `.js`, `.json`], // Resolve files
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
                        mini_css_extract_plugin_1.default.loader, // Extract CSS into files
                        `css-loader`, // Process CSS files
                    ],
                }, {
                    test: /\.(png|jpe?g|gif|svg|ico)$/, // For images
                    exclude: /node_modules/,
                    type: `${assetsDir}/${imagesDir}`,
                    include: path_1.default.resolve(process.cwd(), `${srcDir}/${assetsDir}/${imagesDir}`), // Only include files from the assets folder
                    generator: {
                        filename: `${assetsDir}/${imagesDir}/[name][ext][query]`, // Output to dist/assets folder
                    },
                }],
        },
        plugins: [
            new mini_css_extract_plugin_1.default({
                filename: `styles/styles.css`, // Output CSS file with original name
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
                const { noindex, uri: fileName, coverImage: coverImagePage, coverImageDescription: coverImageDescriptionPage, } = pageData, isHome = pageHome == fileName, coverImageLinkNew = coverImagePage ? getImageURI(coverImagePage) : coverImageLink;
                return new html_webpack_plugin_1.default({
                    chunks: [fileName],
                    title: isHome ? `${websiteName || ``} | ${websiteTitle || ``}`
                        : `${pageData?.name} | ${websiteName || ``}`,
                    links: (0, utils_1.canonicalTag)({
                        websiteDomain,
                        page: isHome ? `` : `/${fileName}`,
                        coverImageLink: coverImageLinkNew,
                    }),
                    pageBody: (0, utils_1.readData)(`./${srcDir}/${pagesDir}/${fileName}/${fileName}.html`),
                    filename: isHome ? `index.html` : fileName,
                    meta: (0, utils_1.metaTags)({
                        author,
                        websiteDescription,
                        websiteName,
                        websiteTitle,
                        coverImageLink: coverImageLinkNew,
                        coverImageDescription: (coverImagePage ? coverImageDescriptionPage : coverImageDescription) || ``,
                        publishedTime,
                        websiteLink: isHome ? websiteLink : `${websiteLink}/fileName`,
                        dataString,
                        theme_color,
                        twitterUserName,
                        appIconFile,
                        noindex,
                        language,
                    }),
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
                });
            }),
            ...obfuscateON ? [new webpack_obfuscator_1.default({
                    rotateStringArray: true,
                    stringArray: true,
                    stringArrayThreshold: 0.8, // Percentage of strings to obfuscate
                })] : [],
            new SitemapPlugin.default({
                base: websiteLink, // Replace with your site base URL
                paths: siteMap,
                options: {
                    filename: `sitemap.xml`, // The name of the generated sitemap
                },
            }),
            new HtmlInlineCssWebpackPlugin.default(), // Inline CSS into the HTML
        ],
        optimization: {
            minimize: true, // Enable minimization
            minimizer: [
                // Minify JavaScript
                new terser_webpack_plugin_1.default({
                    terserOptions: {
                        compress: {
                            drop_console: false, // Do not remove console logs
                        },
                    },
                }),
                // Add the CSS minimizer plugin
                new css_minimizer_webpack_plugin_1.default({
                    minimizerOptions: {
                        preset: ['default', { discardUnused: cssDiscardUnused }], // Prevent removing unused styles
                    },
                }),
            ],
        },
        devServer: {
            static: {
                directory: path_1.default.join(process.cwd(), productionDir),
            },
            port, // Specify your desired port
            open: true, // Automatically open the browser
            compress: true, // Enable gzip compression for files served
        },
        mode
    };
};
exports.build = build;
