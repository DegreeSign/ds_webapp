export interface StringObj {
    [key: string]: string;
}
interface Page {
    uri: string;
    name: string;
    short_name?: string;
    description: string;
    icon?: string;
    shortcut?: boolean;
    noindex?: boolean;
    headerCode?: string;
    publishDate?: string;
    coverImage?: string;
    coverImageDescription?: string;
    customHTML?: string[];
}
export interface Config {
    mode: 'development' | 'production';
    appShortName: string;
    twitterUserName: string;
    websiteName: string;
    websiteDomain: string;
    publishedTime: string;
    author: string;
    websiteTitle: string;
    websiteDescription: string;
    coverImage: string;
    coverImageDescription: string;
    notificationTitle: string;
    notificationText: string;
    background_color: string;
    theme_color: string;
    app_icon: string;
    fav_icon: string;
    orientation: 'portrait' | 'landscape';
    pagesList: Page[];
    htmlCommonElements: (`header` | `footer` | `menu`)[];
    obfuscateON: boolean;
    srcDir: string;
    assetsDir: string;
    developDir: string;
    commonDir: string;
    imagesDir: string;
    pagesDir: string;
    pageHome: string;
    productionDir: string;
    htaccessCustom: string;
    startURI?: string;
    language?: string;
    port?: number;
}
interface Icon {
    src: string;
    type: string;
    sizes: string;
    purpose: 'maskable' | 'any';
}
interface Shortcut {
    name: string;
    short_name: string;
    description: string;
    url: string;
    icons: Icon[];
}
export interface WebManifest {
    background_color: string;
    theme_color: string;
    icons: Icon[];
    shortcuts: Shortcut[];
    display: string;
    orientation: 'portrait' | 'landscape';
    short_name: string;
    start_url: string;
    description: string;
    name: string;
}
type MetaTag = string | false | {
    [attributeName: string]: string | boolean;
};
export interface MetaTags {
    [key: string]: MetaTag;
}
export interface MetaTagsInput {
    author: string;
    websiteDescription: string;
    websiteName: string;
    websiteTitle: string;
    coverImageLink: string;
    coverImageDescription: string;
    publishedTime: string;
    websiteLink: string;
    dataString: string;
    theme_color: string;
    twitterUserName: string;
    appIconFile: string;
    noindex?: boolean;
    language: string;
}
export interface TemplateHTMLOptions {
    links?: string;
    headerHTML?: string;
    title?: string;
    menuHTML?: string;
    customHTML?: string;
    pageBody?: string;
    footerHTML?: string;
}
export {};
