import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import WebpackObfuscator from "webpack-obfuscator";
import CopyWebpackPlugin from "copy-webpack-plugin";
import * as SitemapPlugin from "sitemap-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";
import { Config } from "./src/types";
import { readData, writeData } from "./src/utils";
declare const build: ({ mode, appShortName, twitterUserName, websiteName, websiteDomain, publishedTime, author, websiteTitle, websiteDescription, coverImage, coverImageDescription, notificationTitle, notificationText, background_color, theme_color, app_icon, fav_icon, orientation, pagesList, htmlCommonElements, obfuscateON, srcDir, assetsDir, commonDir, imagesDir, pagesDir, pageHome, productionDir, htaccessCustom, startURI, language, port, cssDiscardUnused, updateServiceWorker, onlineIndicatorFile, }: Config) => {
    entry: {
        [x: string]: string;
    };
    performance: {
        maxAssetSize: number;
        maxEntrypointSize: number;
    };
    output: {
        path: string;
        filename: string;
    };
    resolve: {
        extensions: string[];
    };
    module: {
        rules: ({
            test: RegExp;
            exclude: RegExp;
            use: string;
            type?: undefined;
            include?: undefined;
            generator?: undefined;
        } | {
            test: RegExp;
            exclude: RegExp;
            use: string[];
            type?: undefined;
            include?: undefined;
            generator?: undefined;
        } | {
            test: RegExp;
            exclude: RegExp;
            type: string;
            include: string;
            generator: {
                filename: string;
            };
            use?: undefined;
        })[];
    };
    plugins: (HtmlWebpackPlugin | WebpackObfuscator | CopyWebpackPlugin | MiniCssExtractPlugin | webpack.DefinePlugin | CleanWebpackPlugin | SitemapPlugin.default | import("html-inline-css-webpack-plugin/build/core").PluginForHtmlWebpackPluginV3 | import("html-inline-css-webpack-plugin/build/core").PluginForHtmlWebpackPluginV4)[];
    optimization: {
        minimize: boolean;
        minimizer: (TerserPlugin<import("terser").MinifyOptions> | CssMinimizerPlugin<CssMinimizerPlugin.CssNanoOptionsExtended>)[];
    };
    devServer: {
        static: {
            directory: string;
        };
        port: number;
        open: boolean;
        compress: boolean;
    };
    mode: "development" | "production";
};
export { build, readData, writeData };
