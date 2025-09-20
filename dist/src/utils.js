"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPHPTag = exports.linkTags = exports.metaTags = exports.readJSON = exports.readData = exports.writeJSON = exports.writeData = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const 
/** Write to files */
writeData = (file, code) => {
    try {
        return code ? (fs_1.default.writeFileSync(path_1.default.resolve(process.cwd(), file), code, `utf8`),
            true) : (console.log(`no data to write to`, file),
            false);
    }
    catch (e) {
        console.log(`failed to write data to`, file);
        return false;
    }
    ;
}, 
/** Write JSON files */
writeJSON = (file, code) => {
    try {
        if (!code) {
            console.log(`no JSON data to write to`, file);
            return false;
        }
        ;
        const data = JSON.stringify(code);
        writeData(file, data);
        return true;
    }
    catch (e) {
        console.log(`failed to write JSON at`, file);
        return false;
    }
    ;
}, 
/** Read files */
readData = (file, internal) => {
    try {
        const filePath = internal ? path_1.default.join(__dirname, file)
            : path_1.default.resolve(process.cwd(), file), data = fs_1.default.readFileSync(filePath, `utf8`);
        if (!data) {
            console.log(`no data to read at path`, filePath);
            return ``;
        }
        ;
        return data;
    }
    catch (e) {
        console.log(`failed to read data at`, file);
        return ``;
    }
    ;
}, 
/** Read JSON files */
readJSON = (file, internal) => {
    try {
        const data = readData(file, internal);
        return data ? JSON.parse(data) : undefined;
    }
    catch (e) {
        console.log(`failed to read JSON at`, file);
        return;
    }
    ;
}, metaTags = ({ author, websiteDescription, websiteName, websiteTitle, coverImageLink, coverImageDescription, publishedTime, websiteLink, dataString, theme_color, twitterUserName, appIconFile, noindex, language, isHome, keywords, }) => {
    const titleText = isHome ? `${websiteName} | ${websiteTitle}`
        : `${websiteTitle} | ${websiteName}`;
    return {
        // Character Encoding and Content
        charset: {
            charset: 'UTF-8',
        },
        "http-equiv:content-type": {
            "http-equiv": "Content-Type",
            content: "text/html; charset=UTF-8",
        },
        // Viewport and Device Compatibility
        viewport: `width=device-width, initial-scale=1.0`,
        'http-equiv:X-UA-Compatible': {
            'http-equiv': `X-UA-Compatible`,
            content: `ie=edge`,
        },
        "mobile-web-app-capable": "yes",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "black",
        // SEO Indexing
        robots: noindex ? `noindex` : `index,follow`,
        referrer: "origin",
        'googlebot-news': noindex ? `noindex` : `index,follow`,
        // Name and Title
        "apple-mobile-web-app-title": websiteName,
        author,
        description: websiteDescription,
        ...keywords ? { keywords, news_keywords: keywords } : {},
        // Open Graph (OG)
        'og:type': {
            property: 'og:type',
            content: `website`,
            name: `type`,
        },
        "og:locale": {
            property: "og:locale",
            content: language,
        },
        'og:title': {
            property: 'og:title',
            content: titleText,
            name: `title`,
        },
        "og:site_name": {
            property: "og:site_name",
            content: websiteName,
        },
        'og:description': {
            property: 'og:description',
            content: `${websiteDescription}`,
            name: `description`,
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
        'og:image': {
            property: 'og:image',
            content: coverImageLink,
            name: `image`,
        },
        "og:image:alt": {
            property: "og:image:alt",
            content: coverImageDescription,
        },
        // Twitter Tags
        'twitter:card': {
            property: 'twitter:card',
            content: `summary_large_image`
        },
        'twitter:site': {
            property: 'twitter:site',
            content: `@${twitterUserName}`,
        },
        'twitter:title': {
            property: 'twitter:title',
            content: titleText
        },
        'twitter:description': {
            property: 'twitter:description',
            content: websiteDescription,
        },
        'twitter:image': {
            property: 'twitter:image',
            content: coverImageLink,
        },
        'twitter:image:alt': {
            property: 'twitter:image:alt',
            content: coverImageDescription,
        },
        // App Icons
        "favicon-32": {
            href: appIconFile,
            rel: "icon",
            type: "image/png",
            sizes: "32x32",
        },
        "favicon-128": {
            href: appIconFile,
            rel: "icon",
            type: "image/png",
            sizes: "128x128",
        },
        "favicon-180": {
            href: appIconFile,
            rel: "icon",
            type: "image/png",
            sizes: "180x180",
        },
        "favicon-192": {
            href: appIconFile,
            rel: "icon",
            type: "image/png",
            sizes: "192x192",
        },
        "shortcut-icon-196": {
            href: appIconFile,
            rel: "shortcut icon",
            type: "image/png",
            sizes: "196x196",
        },
        "shortcut-icon-512": {
            href: appIconFile,
            rel: "shortcut icon",
            type: "image/png",
            sizes: "512x512",
        },
        "apple-touch-icon-120": {
            href: appIconFile,
            rel: "apple-touch-icon",
            type: "image/png",
            sizes: "120x120",
        },
        "apple-touch-icon-152": {
            href: appIconFile,
            rel: "apple-touch-icon",
            type: "image/png",
            sizes: "152x152",
        },
        "apple-touch-icon-180": {
            href: appIconFile,
            rel: "apple-touch-icon",
            type: "image/png",
            sizes: "180x180",
        },
        "apple-touch-icon-512": {
            href: appIconFile,
            rel: "apple-touch-icon",
            type: "image/png",
            sizes: "512x512",
        },
        // Image and Thumbnail
        'article:published_time': {
            property: 'article:published_time',
            content: publishedTime
        },
        'article:modified_time': {
            property: 'article:modified_time',
            content: dataString
        },
        thumbnailUrl: {
            itemprop: `thumbnailUrl`,
            content: coverImageLink
        },
        image: {
            itemprop: `image`,
            content: coverImageLink
        },
        // Cache and Security
        "http-equiv:cache-control": {
            "http-equiv": "Cache-control",
            content: "NO-STORE",
        },
        "http-equiv:content-security-policy": {
            "http-equiv": "Content-Security-Policy",
            content: "",
        },
        // Theme
        "theme-color": theme_color,
    };
}, linkTags = ({ favIconFile, timeNow, coverImageLink, canonicalURL, }) => `
        <link rel="icon" href="${favIconFile}" type="image/x-icon">
        <link rel="manifest" href="/app.json?v=${timeNow}">
        <link rel="image_src" href="${coverImageLink}">
        <link rel="canonical" href="${canonicalURL}">\n`, 
/** Check for PHP tag */
isPHPTag = (code) => code?.includes(`<?php`);
exports.writeData = writeData;
exports.writeJSON = writeJSON;
exports.readData = readData;
exports.readJSON = readJSON;
exports.metaTags = metaTags;
exports.linkTags = linkTags;
exports.isPHPTag = isPHPTag;
