import { MetaTags, MetaTagsInput } from "./types";
declare const 
/** Write to files */
writeData: (file: string, code: any) => boolean, 
/** Read files */
readData: (file: string, absolute?: boolean) => string, metaTags: ({ author, websiteDescription, websiteName, websiteTitle, coverImageLink, coverImageDescription, publishedTime, websiteLink, dataString, theme_color, twitterUserName, appIconFile, noindex, language, }: MetaTagsInput) => MetaTags, canonicalTag: ({ websiteDomain, page, coverImageLink, }: {
    coverImageLink: string;
    websiteDomain: string;
    page: string;
}) => string, 
/** Simple parser for .htaccess */
parseHtaccess: (filePath: string) => {
    type: string;
    from: string | RegExp;
    to: string;
    status?: string;
}[];
export { writeData, readData, metaTags, canonicalTag, parseHtaccess, };
