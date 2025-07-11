import { MetaTags, MetaTagsInput } from "./types";
import fs from "fs"
import path from "path"

const
    /** Write to files */
    writeData = (file: string, code: string) => {
        try {
            return code ? (
                fs.writeFileSync(path.resolve(process.cwd(), file), code, `utf8`),
                true
            ) : (
                console.log(`no data to write to`, file),
                false
            )
        } catch (e) {
            console.log(`failed to write data to`, file);
            return false
        };
    },
    /** Write JSON files */
    writeJSON = (file: string, code: any) => {
        try {
            if (!code) {
                console.log(`no JSON data to write to`, file);
                return false
            };
            const data = JSON.stringify(code);
            writeData(file, data);
            return true
        } catch (e) {
            console.log(`failed to write JSON at`, file);
            return false
        };
    },
    /** Read files */
    readData = (file: string, internal?: boolean) => {
        try {
            const
                filePath =
                    internal ? path.join(__dirname, file)
                        : path.resolve(process.cwd(), file),
                data = fs.readFileSync(
                    filePath,
                    `utf8`
                );
            if (!data) {
                console.log(`no data to read at path`, filePath);
                return ``;
            };
            return data
        } catch (e) {
            console.log(`failed to read data at`, file);
            return ``;
        };
    },
    /** Read JSON files */
    readJSON = (file: string, internal?: boolean) => {
        try {
            const data = readData(file, internal);
            return data ? JSON.parse(data) : undefined;
        } catch (e) {
            console.log(`failed to read JSON at`, file);
            return
        };
    },
    metaTags = ({
        author,
        websiteDescription,
        websiteName,
        websiteTitle,
        coverImageLink,
        coverImageDescription,
        publishedTime,
        websiteLink,
        dataString,
        theme_color,
        twitterUserName,
        appIconFile,
        noindex,
        language,
        isHome,
    }: MetaTagsInput): MetaTags => {
        const titleText = isHome ? `${websiteName} | ${websiteTitle}`
            : `${websiteTitle} | ${websiteName}`;
        return {
            ...noindex ? {
                noindexTag: {
                    name: `robots`,
                    content: `noindex`,
                },
            } : {},
            author,
            robots: `index, follow`,
            description: websiteDescription,
            viewport: `width=device-width, initial-scale=1.0`,
            'http-equiv:X-UA-Compatible': {
                'http-equiv': `X-UA-Compatible`,
                content: `ie=edge`,
            },
            'twitter:card': `summary_large_image`,
            'twitter:title': {
                property: 'twitter:title',
                content: titleText
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
                content: titleText,
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
                content: language,
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
        }
    },
    canonicalTag = ({
        websiteDomain,
        page,
        coverImageLink,
    }: {
        coverImageLink: string,
        websiteDomain: string,
        page: string
    }) => `<link href="${coverImageLink}" rel="image_src">
        <link rel="canonical" href="https://${websiteDomain}${page}">`;

export {
    writeData,
    writeJSON,
    readData,
    readJSON,
    metaTags,
    canonicalTag,
}