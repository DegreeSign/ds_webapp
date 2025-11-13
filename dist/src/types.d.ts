import { ResolveOptions } from "webpack";
import { Configuration, ModuleOptions } from "webpack";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
export interface StringObj {
    [key: string]: string;
}
export interface Page {
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
    /**
     * [Maskable] Icon associated with the page (optional)
     *
     * maskable icon should be centered in safe zone (inner 338x338 pixels of 512x512)
     * prevents masking from cropping important elements
    */
    iconMaskable?: string;
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
    /** Page code has PHP */
    isPHP?: boolean;
    /** Page keywords comma separated (optional) */
    keywords?: string;
    /** Custom Canonical URL */
    canonicalURL?: string;
}
export interface ConfigBase {
    /** Source directory path */
    srcDir: string;
    /** Production directory path */
    productionDir: string;
    /** Application mode, either development or production */
    mode?: 'development' | 'production';
    /** Flag to enable or disable obfuscation */
    obfuscateON?: boolean;
    /** Flag to enable or disable JS code minimisation */
    minimiseON?: boolean;
    /** Port Number */
    port?: number;
    /** File Size (MB) */
    maxFileSizeMB?: number;
    /** Resolve Options */
    resolveOptions?: ResolveOptions;
    /** License Text */
    licenseText?: string;
    /** Show Packages Analyser Window */
    openAnalyzer?: boolean;
}
export interface ConfigWebApp extends ConfigBase {
    /** Name of the website */
    websiteName: string;
    /** Domain of the website */
    websiteDomain: string;
    /** Short name of the application */
    appShortName: string;
    /** Twitter username associated with the application */
    twitterUserName: string;
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
    /** Background color for the application */
    background_color: string;
    /** Theme color for the application */
    theme_color: string;
    /** Path to the application icon */
    appIcon: string;
    /**
     * Path to the application icon (maskable)
     *
     * maskable icon should be centered in safe zone (inner 338x338 pixels of 512x512)
     * prevents masking from cropping important elements
    */
    appIconMaskable: string;
    /** favicon file name or path */
    fav_icon: string;
    /** Orientation of the application, either portrait or landscape */
    orientation: 'portrait' | 'landscape';
    /** Pages list array */
    pagesList: Page[];
    /** Array of common HTML elements to include */
    htmlCommonElements?: (`header` | `footer` | `menu`)[];
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
    /** Added to end of htaccess */
    htaccessCustom: string;
    /** App start URI */
    startURI?: string;
    /** App Language */
    language?: string;
    /** css Discard Unused */
    cssDiscardUnused?: boolean;
    /** Update service worker */
    updateServiceWorker?: boolean;
    /** Online reference file */
    onlineIndicatorFile?: string;
}
export interface ConfigServer extends ConfigBase {
    /** Server Files list */
    filesList: string[];
}
export type ConfigBuild = {
    type: `webapp`;
} & ConfigWebApp | {
    type: `server`;
} & ConfigServer;
/** Update Times */
export interface UpdateTimes {
    /** service worker */
    serviceWorker?: number;
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
    /** check if home */
    isHome: boolean;
    /** Keywords (optional) */
    keywords?: string;
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
export interface HtmlContent {
    id: string;
    content: string;
}
export interface WebConfig {
    entryPoints: StringObj;
    customWebRules: ModuleOptions["rules"];
    configWebPlugins: Configuration["plugins"];
    cssMinimise: CssMinimizerPlugin<CssMinimizerPlugin.CssNanoOptionsExtended>[];
}
export {};
