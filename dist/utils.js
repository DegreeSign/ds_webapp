"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalTag = exports.metaTags = exports.readData = exports.writeData = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const writeData = (file, code) => {
    try {
        return code ? (fs_1.default.writeFileSync(path_1.default.resolve(process.cwd(), file), code, `utf8`),
            true) : (console.log(`no data to write to`, file),
            false);
    }
    catch (e) {
        console.log(`failed to write to`, file);
        return false;
    }
    ;
}, readData = (file, absolute) => {
    try {
        return fs_1.default.readFileSync(absolute ? file
            : path_1.default.resolve(process.cwd(), file), `utf8`);
    }
    catch (e) {
        console.log(`no data to read at`, file);
        return ``;
    }
    ;
}, metaTags = ({ author, websiteDescription, websiteName, websiteTitle, coverImageLink, coverImageDescription, publishedTime, websiteLink, dataString, theme_color, twitterUserName, appIconFile, noindex, }) => {
    return {
        noindexTag: noindex ? {
            name: `robots`,
            content: `noindex`,
        } : {},
        author,
        robots: `index, follow`,
        description: websiteDescription,
        viewport: `width=device-width, initial-scale=1.0`,
        charset: { charset: `UTF-8` },
        'http-equiv:X-UA-Compatible': {
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
        referrer: "origin",
        "theme-color": theme_color,
        "twitter:site": `@${twitterUserName}`,
        "mobile-web-app-capable": "yes",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-title": websiteName,
        "apple-mobile-web-app-status-bar-style": "black",
        "http-equiv:cache-control": {
            "http-equiv": "Cache-control",
            content: "NO-STORE",
        },
        "http-equiv:content-security-policy": {
            "http-equiv": "Content-Security-Policy",
            content: "",
        },
        "http-equiv:content-type": {
            "http-equiv": "Content-Type",
            content: "text/html; charset=UTF-8",
        },
        "og:locale": {
            property: "og:locale",
            content: "en_GB",
        },
        "og:image:width": {
            property: "og:image:width",
            content: "1400",
        },
        "og:image:height": {
            property: "og:image:height",
            content: "700",
        },
        "og:site_name": {
            property: "og:site_name",
            content: websiteName,
        },
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
    };
}, canonicalTag = ({ websiteDomain, page, }) => `<link rel="canonical" href="https://${websiteDomain}${page}">`;
exports.writeData = writeData;
exports.readData = readData;
exports.metaTags = metaTags;
exports.canonicalTag = canonicalTag;
