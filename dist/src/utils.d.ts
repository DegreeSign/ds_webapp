import { MetaTags, MetaTagsInput } from "./types";
declare const 
/** Write to files */
writeData: (file: string, code: string) => boolean, 
/** Write JSON files */
writeJSON: (file: string, code: any) => boolean, 
/** Read files */
readData: (file: string, internal?: boolean) => string, 
/** Read JSON files */
readJSON: (file: string, internal?: boolean) => any, metaTags: ({ author, websiteDescription, websiteName, websiteTitle, coverImageLink, coverImageDescription, publishedTime, websiteLink, dataString, theme_color, twitterUserName, appIconFile, noindex, language, isHome, keywords, }: MetaTagsInput) => MetaTags, linkTags: ({ favIconFile, timeNow, coverImageLink, canonicalURL, }: {
    coverImageLink: string;
    favIconFile: string;
    timeNow: number;
    canonicalURL: string;
}) => string;
export { writeData, writeJSON, readData, readJSON, metaTags, linkTags, };
