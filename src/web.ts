import path from "path";
import { Configuration, ModuleOptions } from "webpack"
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as SitemapPlugin from "sitemap-webpack-plugin"
import * as HtmlInlineCssWebpackPlugin from "html-inline-css-webpack-plugin"
import {
    ConfigWebApp,
    StringObj,
    TemplateHTMLOptions,
    UpdateTimes,
    WebConfig,
    WebManifest
} from "./types";
import {
    readJSON,
    writeJSON,
    readData,
    writeData,
    metaTags,
    linkTags,
    isPHPTag
} from "./utils";

export const webConfig = (params: ConfigWebApp): WebConfig => {

    const
        {
            srcDir = `src`,
            productionDir = `public_html`,
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
            assetsDir = `assets`,
            commonDir = `common`,
            imagesDir = `images`,
            pagesDir = `pages`,
            pageHome = `home`,
            htaccessCustom = ``,
            startURI = ``,
            language = `en_GB`,
            cssDiscardUnused = false,
            updateServiceWorker = false,
            onlineIndicatorFile = `https://degreesign.com/assets/images/Degree_Sign_Logo_2022.svg`,
        } = params || {};

    const
        latestUpdates: UpdateTimes = readJSON(`./updateTimes.json`) || {},
        updateTimes = () => writeJSON(`./updateTimes.json`, latestUpdates),
        dataString = new Date().toISOString(),
        timeNow = Date.now(),
        websiteLink = `https://${websiteDomain}`,
        /** Update Image URL */
        getImageURI = (image: string, full?: boolean) =>
            // raw link string
            image?.includes(`/`) || image?.includes(`<`) ? image
                // assets link
                : `${full ? websiteLink : ``}/${assetsDir}/${imagesDir}/${image}`,
        coverImageLink = getImageURI(coverImage, true),
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
${pagesList?.map(page => page.noindex ? `Disallow: /${page.uri}` : ``)?.join(`\n`)}

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

        const
            pageData = pagesList[i],
            pageURI = pageData.uri,
            isHome = pageHome == pageURI;

        // app shortcut
        if (pageData.shortcut) {
            const icon = pageData.icon ?
                pageData.icon?.includes(`/`) ? pageData.icon
                    : `/${assetsDir}/${imagesDir}/${pageData.icon}`
                : appIconFile;
            appManifest.shortcuts.push({
                name: (isPHPTag(pageData.name) ? pageData.short_name : undefined)
                    || pageData.name,
                short_name: pageData.short_name || pageData.name,
                description: (isPHPTag(pageData.description) ? pageData.short_name : undefined)
                    || pageData.description,
                url: isHome ? `/` : `/${pageURI}`,
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

        // file type (includes all children)
        htaccessFile += `<Files ${isHome ? "index.html" : pageURI}>
    ${pageData?.isPHP ? `SetHandler application/x-httpd-php
    ` : ``}Header set Content-Type "text/html; charset=UTF-8"
</Files>\n`

        // site map
        if (!pageData.noindex && !isHome)
            siteMap.push({
                path: `/${pageURI}`,
                priority: 0.8,
                lastmod: dataString
            });
    };

    htaccessFile += htaccessCustom;

    writeData(`./${productionDir}/robots.txt`, robots);
    writeData(`./${productionDir}/.htaccess`, htaccessFile);
    writeData(`./${productionDir}/app.json`, JSON.stringify(appManifest));
    writeData(`./${productionDir}/sw.js`, getServiceWorkerContent());

    const
        pagesHTML: HtmlWebpackPlugin[] = pagesList.map(pageData => {
            const
                {
                    noindex,
                    uri: fileName,
                    coverImage: coverImagePage,
                    coverImageDescription: coverImageDescriptionPage,
                    description,
                    name: pageTitle,
                    publishDate,
                } = pageData,
                isHome = pageHome == fileName,
                coverImageLinkNew = coverImagePage ? getImageURI(coverImagePage) : coverImageLink;
            return new HtmlWebpackPlugin({
                chunks: [fileName],
                title: isHome ? `${websiteName || ``} | ${pageData?.name || websiteTitle || ``}`
                    : `${pageData?.name} | ${websiteName || ``}`,
                meta: metaTags({
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
                    keywords: pageData.keywords,
                }),
                links: linkTags({
                    favIconFile,
                    timeNow,
                    coverImageLink: coverImageLinkNew,
                    canonicalURL: pageData.canonicalURL
                        || `https://${websiteDomain}${isHome ? `` : `/${fileName}`}`,
                }),
                pageBody: readData(`./${srcDir}/${pagesDir}/${fileName}/${fileName}.html`),
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
                    bodyHTML: pageData.customHTML.map(
                        elm => readData(`./${srcDir}/${commonDir}/${elm}.html`)
                    )?.join(``),
                } : {},
                templateContent,
                minify: {
                    collapseWhitespace: true,
                    removeComments: false, // Preserve comments during minification
                },
            })
        }),
        configWebPlugins: Configuration["plugins"] = [
            ...pagesHTML,
            new SitemapPlugin.default({
                base: websiteLink, // Replace with your site base URL
                paths: siteMap,
                options: {
                    filename: `sitemap.xml`, // The name of the generated sitemap
                },
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: `${srcDir}/${assetsDir}`, to: `${assetsDir}` },
                ],
            }),
            new MiniCssExtractPlugin({
                filename: `styles/styles.css`, // Output CSS file with original name
            }),
            new HtmlInlineCssWebpackPlugin.default() // Inline CSS into the HTML
        ],
        customWebRules: ModuleOptions["rules"] = [{
            test: /\.(png|jpe?g|gif|svg|ico)$/, // For images
            exclude: /node_modules/,
            type: `${assetsDir}/${imagesDir}`,
            include: path.resolve(process.cwd(), `${srcDir}/${assetsDir}/${imagesDir}`), // Only include files from the assets folder
            generator: {
                filename: `${assetsDir}/${imagesDir}/[name][ext][query]`, // Output to dist/assets folder
            },
        }, {
            test: /\.css$/, // For CSS files
            exclude: /node_modules/,
            use: [
                MiniCssExtractPlugin.loader, // Extract CSS into files
                `css-loader`, // Process CSS files
            ],
        }],
        cssMinimise: CssMinimizerPlugin<
            CssMinimizerPlugin.CssNanoOptionsExtended
        >[] = [new CssMinimizerPlugin({ // Add the CSS minimizer plugin
            minimizerOptions: {
                preset: ['default', { discardUnused: cssDiscardUnused }], // Prevent removing unused styles
            },
        })],
        entryPoints: StringObj = {};

    // entry points
    entryPoints[`${pageHome}`] = `./${srcDir}/${pagesDir}/${pageHome}/${pageHome}.ts`;
    for (let i = 0; i < pagesList.length; i++) {
        const { uri: fileName } = pagesList[i];
        entryPoints[fileName] =
            `./${srcDir}/${pagesDir}/${fileName}/${fileName}.ts`;
    };

    return {
        entryPoints,
        customWebRules,
        configWebPlugins,
        cssMinimise,
    };
};