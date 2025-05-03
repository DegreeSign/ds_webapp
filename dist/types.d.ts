export interface StringObj {
    [key: string]: string;
}
interface Page {
    /** URI of the page */
    uri: string;
    /** Name of the page */
    name: string;
    /** Short name of the page (optional) */
    short_name?: string;
    /** Description of the page */
    description: string;
    /** Icon associated with the page (optional) */
    icon?: string;
    /** Flag to indicate if the page is a shortcut (optional) */
    shortcut?: boolean;
    /** Flag to indicate if the page should be excluded from indexing (optional) */
    noindex?: boolean;
    /** Publication date of the page (optional) */
    publishDate?: string;
    /** URL or path to the cover image for the page (optional) */
    coverImage?: string;
    /** Description of the cover image (optional) */
    coverImageDescription?: string;
    /** Custom header HTML (optional) */
    headerHTML?: string;
    /** Custom menu HTML (optional) */
    menuHTML?: string;
    /** Custom footer HTML (optional) */
    footerHTML?: string;
    /** Custom body HTML Elements (optional) */
    customHTML?: string[];
}
export interface Config {
    /** Application mode, either development or production */
    mode: 'development' | 'production';
    /** Short name of the application */
    appShortName: string;
    /** Twitter username associated with the application */
    twitterUserName: string;
    /** Name of the website */
    websiteName: string;
    /** Domain of the website */
    websiteDomain: string;
    /** Publication time of the website */
    publishedTime: string;
    /** Author of the website */
    author: string;
    /** Title of the website */
    websiteTitle: string;
    /** Description of the website */
    websiteDescription: string;
    /** URL or path to the cover image */
    coverImage: string;
    /** Description of the cover image */
    coverImageDescription: string;
    /** Title for notifications */
    notificationTitle: string;
    /** Text content for notifications */
    notificationText: string;
    /** Background color for the application */
    background_color: string;
    /** Theme color for the application */
    theme_color: string;
    /** Path to the application icon */
    app_icon: string;
    /** Path to the favicon */
    fav_icon: string;
    /** Orientation of the application, either portrait or landscape */
    orientation: 'portrait' | 'landscape';
    /** Pages list array */
    pagesList: Page[];
    /** Array of common HTML elements to include */
    htmlCommonElements: (`header` | `footer` | `menu`)[];
    /** Flag to enable or disable obfuscation */
    obfuscateON: boolean;
    /** Source directory path */
    srcDir: string;
    /** Assets directory path */
    assetsDir: string;
    /** Common directory path */
    commonDir: string;
    /** Images directory path */
    imagesDir: string;
    /** Pages directory path */
    pagesDir: string;
    /** Home page identifier or path */
    pageHome: string;
    /** Production directory path */
    productionDir: string;
    /** Added to end of htaccess */
    htaccessCustom: string;
    /** App start URI */
    startURI?: string;
    /** App Language */
    language?: string;
    /** Port Number */
    port?: number;
}
interface Icon {
    /** Source URL or path to the icon */
    src: string;
    /** MIME type of the icon */
    type: string;
    /** Dimensions of the icon (e.g., '192x192') */
    sizes: string;
    /** Purpose of the icon, either maskable or any */
    purpose: 'maskable' | 'any';
}
interface Shortcut {
    /** Name of the shortcut */
    name: string;
    /** Short name of the shortcut */
    short_name: string;
    /** Description of the shortcut */
    description: string;
    /** URL the shortcut points to */
    url: string;
    /** Array of icons associated with the shortcut */
    icons: Icon[];
}
export interface WebManifest {
    /** Background color for the application */
    background_color: string;
    /** Theme color for the application */
    theme_color: string;
    /** Array of icons for the application */
    icons: Icon[];
    /** Array of shortcuts for the application */
    shortcuts: Shortcut[];
    /** Display mode for the application (e.g., 'standalone', 'fullscreen') */
    display: string;
    /** Orientation of the application, either portrait or landscape */
    orientation: 'portrait' | 'landscape';
    /** Short name of the application */
    short_name: string;
    /** Starting URL of the application */
    start_url: string;
    /** Description of the application */
    description: string;
    /** Full name of the application */
    name: string;
}
type MetaTag = string | false | {
    [attributeName: string]: string | boolean;
};
export interface MetaTags {
    /** Dictionary of meta tags, where the key is the tag name and value is the tag content or attributes */
    [key: string]: MetaTag;
}
export interface MetaTagsInput {
    /** Author of the website */
    author: string;
    /** Description of the website */
    websiteDescription: string;
    /** Name of the website */
    websiteName: string;
    /** Title of the website */
    websiteTitle: string;
    /** URL or path to the cover image */
    coverImageLink: string;
    /** Description of the cover image */
    coverImageDescription: string;
    /** Publication time of the website */
    publishedTime: string;
    /** URL of the website */
    websiteLink: string;
    /** Data string for additional metadata */
    dataString: string;
    /** Theme color for the website */
    theme_color: string;
    /** Twitter username associated with the website */
    twitterUserName: string;
    /** Path to the application icon file */
    appIconFile: string;
    /** Flag to indicate if the page should be excluded from indexing (optional) */
    noindex?: boolean;
    /** Language of the website */
    language: string;
}
export interface TemplateHTMLOptions {
    /** HTML for link tags (optional) */
    links?: string;
    /** HTML for the header section (optional) */
    headerHTML?: string;
    /** Title of the page (optional) */
    title?: string;
    /** HTML for the menu section (optional) */
    menuHTML?: string;
    /** Custom HTML content (optional) */
    bodyHTML?: string;
    /** HTML for the page body (optional) */
    pageBody?: string;
    /** HTML for the footer section (optional) */
    footerHTML?: string;
}
export {};
