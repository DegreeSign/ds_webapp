import { MetaTags, MetaTagsInput } from "./types";
declare const writeData: (file: string, code: any) => boolean, readData: (file: string, absolute?: boolean) => string, metaTags: ({ author, websiteDescription, websiteName, websiteTitle, coverImageLink, coverImageDescription, publishedTime, websiteLink, dataString, theme_color, twitterUserName, appIconFile, noindex, }: MetaTagsInput) => MetaTags, canonicalTag: ({ websiteDomain, page, }: {
    websiteDomain: string;
    page: string;
}) => string;
export { writeData, readData, metaTags, canonicalTag, };
