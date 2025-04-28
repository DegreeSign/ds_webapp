export interface StringObj {
    [key: string]: string;
}
interface Page {
    uri: string;
    name: string;
    short_name: string;
    description: string;
    icon: string;
    shortcut: boolean;
}
export interface Config {
    mode: 'development' | 'production';
    appShortName: string;
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
    orientation: 'portrait' | 'landscape';
    pagesList: Page[];
    htmlCommonElements: string[];
    obfuscateON: boolean;
    srcDir: string;
    assetsDir: string;
    developDir: string;
    commonDir: string;
    imagesDir: string;
    pagesDir: string;
    pageHome: string;
    productionDir: string;
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
export {};
