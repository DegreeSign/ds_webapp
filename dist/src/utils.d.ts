import { MetaTags, MetaTagsInput } from "./types";
declare const 
/** Write to files */
writeData: (file: string, code: any) => boolean, 
/** Read files */
readData: (file: string, internal?: boolean) => string, 
/** Read JSON files */
readJSON: (file: string, internal?: boolean) => any, metaTags: ({ author, websiteDescription, websiteName, websiteTitle, coverImageLink, coverImageDescription, publishedTime, websiteLink, dataString, theme_color, twitterUserName, appIconFile, noindex, language, }: MetaTagsInput) => MetaTags, canonicalTag: ({ websiteDomain, page, coverImageLink, }: {
    coverImageLink: string;
    websiteDomain: string;
    page: string;
}) => string;
export { writeData, readData, metaTags, canonicalTag, readJSON, };
