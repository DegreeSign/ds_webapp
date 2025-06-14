import { Configuration } from "webpack";
import { Config } from "./types";
declare const build: ({ mode, appShortName, twitterUserName, websiteName, websiteDomain, publishedTime, author, websiteTitle, websiteDescription, coverImage, coverImageDescription, background_color, theme_color, app_icon, fav_icon, orientation, pagesList, htmlCommonElements, obfuscateON, minimiseON, srcDir, assetsDir, commonDir, imagesDir, pagesDir, pageHome, productionDir, htaccessCustom, startURI, language, port, cssDiscardUnused, updateServiceWorker, onlineIndicatorFile, maxFileSizeMB, resolveOptions, }: Config) => Configuration;
export { build };
