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
import {
    Config,
    StringObj,
    TemplateHTMLOptions,
    UpdateTimes,
    WebManifest
} from "./types"
import {
    canonicalTag,
    metaTags,
    readData,
    readJSON,
    writeData,
    writeJSON
} from "./utils"

const
    build = ({
        mode = `production`,
        appShortName = `WebApp`,
        twitterUserName = `degreesign`,
        websiteName = `DegreeSign WebApp`,
        websiteDomain = `degreesign.com`,
        publishedTime = `2025-01-01T00:00:00+00:00`,
        author = `DegreeSign Team`,
        websiteTitle = `progressive webapp`,
        websiteDescription = `Webpack progressive web app`,
        coverImage = `degreesign_screenshot.webp`,
        coverImageDescription = `Screenshot of website`,
        background_color = `#fff`,
        theme_color = '#000',
        app_icon = `app_icon.png`,
        fav_icon = `favicon.ico`,
        orientation = 'portrait',
        pagesList = [],
        htmlCommonElements = [],
        obfuscateON = false,
        srcDir = `src`,
        assetsDir = `assets`,
        commonDir = `common`,
        imagesDir = `images`,
        pagesDir = `pages`,
        pageHome = `home`,
        productionDir = `public_html`,
        htaccessCustom = ``,
        startURI = ``,
        language = `en_GB`,
        port = 3210,
        cssDiscardUnused = false,
        updateServiceWorker = false,
        onlineIndicatorFile = `https://degreesign.com/assets/images/Degree_Sign_Logo_2022.svg`,
    }: Config) => {

        const
            latestUpdates: UpdateTimes = readJSON(`./updateTimes.json`) || {},
            updateTimes = () => writeJSON(`./updateTimes.json`, latestUpdates),
            dataString = new Date().toISOString(),
            timeNow = Date.now(),
            websiteLink = `https://${websiteDomain}`,
            getImageURI = (image: string) => image?.includes(`/`) ? image
                : `/${assetsDir}/${imagesDir}/${image}`,
            getImageLink = (image: string) => image?.includes(`/`) ? image
                : `${websiteLink}/${assetsDir}/${imagesDir}/${image}`,
            coverImageLink = getImageLink(coverImage),
            appIconFile = getImageURI(app_icon),
            favIconFile = getImageURI(fav_icon),
            htmlElements = (() => {
                const
                    updateSW = !latestUpdates.serviceWorker || !updateServiceWorker,
                    swTime = updateSW ? timeNow : latestUpdates.serviceWorker,
                    elements: TemplateHTMLOptions = {
                        headerHTML: `<script>${readData(`sw_register.js`, true)
                            ?.replaceAll(`TIME_UPDATED`, `${swTime}`)}</script>`
                    };
                if (updateSW) {
                    latestUpdates.serviceWorker = timeNow;
                    updateTimes();
                };
                if (htmlCommonElements?.length)
                    for (let i = 0; i < htmlCommonElements.length; i++) {
                        const elm = htmlCommonElements[i];
                        elements[`${elm}HTML`] =
                            (elm == `header` ? elements.headerHTML : ``)
                            + readData(`./${srcDir}/${commonDir}/${elm}.html`);
                    };
                return elements
            })(),

            envKeys: StringObj = {},

            entryPoints = {
                [`${pageHome}`]: `./${srcDir}/${pagesDir}/${pageHome}/${pageHome}.ts`, // Entry file for TypeScript
            },

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
                start_url: `/${startURI}`,
                description: websiteDescription,
                name: websiteName
            },
            siteMap = [{ path: `/`, priority: 1.0, lastmod: dataString }],

            templateContent = ({ htmlWebpackPlugin }: any) => {
                const {
                    links,
                    headerHTML,
                    title,
                    menuHTML,
                    bodyHTML,
                    pageBody,
                    footerHTML,
                }: TemplateHTMLOptions = htmlWebpackPlugin.options || {};
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
                    </html>`
            },

            robots = `User-agent: *
Allow: /
Disallow: /404

Sitemap: https://${websiteDomain}/sitemap.xml`,
            getServiceWorkerContent = () => {
                const
                    urlsToCache = ['/', '/index.html', '/app.json'].concat(pagesList.map(pageData => {
                        return `/${pageData?.uri}`
                    })),
                    file = readData(`sw.js`, true);
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
            };

            htaccessFile += `<Files ${pageData.uri}>
    Header set Content-Type "text/html"
</Files>
`
            if (!pageData.noindex && pageData.uri != pageHome)
                siteMap.push({
                    path: `/${pageData.uri}`,
                    priority: 0.8,
                    lastmod: dataString
                });
        };

        htaccessFile += htaccessCustom;

        writeData(`./${productionDir}/robots.txt`, robots);
        writeData(`./${productionDir}/.htaccess`, htaccessFile);
        writeData(`./${productionDir}/app.json`, JSON.stringify(appManifest));
        writeData(`./${productionDir}/sw.js`, getServiceWorkerContent());

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
                filename: `code/[name].[contenthash].js`,
                publicPath: '/', // Ensures assets are referenced with absolute paths starting from the root
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
                    filename: `styles/styles.css`, // Output CSS file with original name
                }),
                new webpack.DefinePlugin(envKeys),
                new CleanWebpackPlugin({
                    cleanOnceBeforeBuildPatterns: ['code/*.js'],
                }),
                new CopyWebpackPlugin({
                    patterns: [
                        { from: `${srcDir}/${assetsDir}`, to: `${assetsDir}` },
                    ],
                }),
                ...pagesList.map(pageData => {
                    const
                        {
                            noindex,
                            uri: fileName,
                            coverImage: coverImagePage,
                            coverImageDescription: coverImageDescriptionPage,
                        } = pageData,
                        isHome = pageHome == fileName,
                        coverImageLinkNew = coverImagePage ? getImageURI(coverImagePage) : coverImageLink;
                    return new HtmlWebpackPlugin({
                        chunks: [fileName],
                        title: isHome ? `${websiteName || ``} | ${websiteTitle || ``}`
                            : `${pageData?.name} | ${websiteName || ``}`,
                        links: canonicalTag({
                            websiteDomain,
                            page: isHome ? `` : `/${fileName}`,
                            coverImageLink: coverImageLinkNew,
                        }),
                        pageBody: readData(`./${srcDir}/${pagesDir}/${fileName}/${fileName}.html`),
                        filename: isHome ? `index.html` : fileName,
                        meta: metaTags({
                            author,
                            websiteDescription,
                            websiteName,
                            websiteTitle,
                            coverImageLink: coverImageLinkNew,
                            coverImageDescription: (coverImagePage ? coverImageDescriptionPage : coverImageDescription) || ``,
                            publishedTime,
                            websiteLink: isHome ? websiteLink : `${websiteLink}/${fileName}`,
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
                            bodyHTML: pageData.customHTML.map(
                                elm => readData(`./${srcDir}/${commonDir}/${elm}.html`)
                            )?.join(``),
                        } : {},
                        templateContent,
                    })
                }),
                ...obfuscateON ? [new WebpackObfuscator({
                    compact: true, // Minify the output
                    controlFlowFlattening: false, // Disable control flow flattening to avoid errors
                    deadCodeInjection: false, // Disable dead code injection
                    debugProtection: false, // Disable debug protection
                    debugProtectionInterval: 0,
                    disableConsoleOutput: false, // Allow console output
                    identifierNamesGenerator: 'hexadecimal', // Use hexadecimal names for identifiers
                    log: false,
                    numbersToExpressions: false, // Disable numbers to expressions to reduce bloat
                    renameGlobals: false, // Avoid renaming global variables
                    selfDefending: false, // Disable self-defending code
                    simplify: true, // Simplify code structure
                    splitStrings: true, // Split strings into chunks
                    splitStringsChunkLength: 8, // chunk length
                    stringArray: true, // Enable string array transformation
                    stringArrayCallsTransform: false,
                    stringArrayEncoding: [], // No encoding for string array
                    stringArrayIndexShift: false, // Disable index shifting
                    stringArrayRotate: false, // Disable rotation to avoid potential issues
                    stringArrayShuffle: false, // Disable shuffling for stability
                    stringArrayWrappersCount: 1, // Match wrapper count
                    stringArrayWrappersChainedCalls: false, // Disable chained calls
                    stringArrayWrappersParametersMaxCount: 2, // Match max parameters
                    stringArrayWrappersType: `variable`, // Use variable wrappers
                    stringArrayThreshold: 1, // Obfuscate all strings
                    unicodeEscapeSequence: false // Disable unicode escape sequences
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
                    new TerserPlugin({
                        terserOptions: {
                            compress: {
                                drop_console: false, // Do not remove console logs
                            },
                        },
                    }),

                    // Add the CSS minimizer plugin
                    new CssMinimizerPlugin({
                        minimizerOptions: {
                            preset: ['default', { discardUnused: cssDiscardUnused }], // Prevent removing unused styles
                        },
                    }),
                ],
            },
            devServer: {
                static: {
                    directory: path.join(process.cwd(), productionDir),
                },
                port, // Specify your desired port
                open: true, // Automatically open the browser
                compress: true, // Enable gzip compression for files served
            },
            mode
        };
    };

export { build };