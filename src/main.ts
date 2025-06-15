import path from "path"
import webpack, { Configuration } from "webpack"
import { CleanWebpackPlugin } from "clean-webpack-plugin"
import * as HtmlInlineCssWebpackPlugin from "html-inline-css-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import TerserPlugin from "terser-webpack-plugin"
import {
    ConfigBuild,
    StringObj,
} from "./types"
import dotenv from "dotenv"
import { webConfig } from "./web"
import { obfuscationSettings } from "./obfuscate"
dotenv.config();

const build = (params: ConfigBuild): Configuration => {

    const
        isWebApp = params.type != `server`,
        {
            mode = `production`,
            obfuscateON = false,
            minimiseON = true,
            srcDir = `src`,
            productionDir = `public_html`,
            port = 3210,
            maxFileSizeMB = 2,
            resolveOptions = {},
        } = params,
        {
            filesList = [],
        } = isWebApp ? {} : params,
        {
            entryPoints = {},
            pagesHTML = [],
            imageRules = [],
            configWebPlugins = [],
            siteMapData = [],
            cssMinimise = []
        } = isWebApp ? webConfig(params) : {},
        fileSize = maxFileSizeMB * 1024 ** 2,
        envKeys: StringObj = {};

    // Environment keys
    for (const key in process.env)
        envKeys[`process.env.${key}`] = JSON.stringify(process.env[key]);

    // entry points
    if (!isWebApp)
        for (let i = 0; i < filesList.length; i++) {
            const fileName = filesList[i];
            entryPoints[fileName] =
                `./${srcDir}/${fileName}.ts`;
        };

    return {
        entry: entryPoints,
        performance: {
            maxAssetSize: fileSize,
            maxEntrypointSize: fileSize,
        },
        output: {
            path: path.resolve(process.cwd(), productionDir),
            filename: `code/[name].[contenthash].js`,
            publicPath: '/', // Ensures assets are referenced with absolute paths starting from the root
        },
        resolve: {
            extensions: [`.tsx`, `.ts`, `.js`, `.json`], // Resolve files
            ...resolveOptions,
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: `ts-loader`,
                },
                {
                    test: /\.css$/, // For CSS files
                    exclude: /node_modules/,
                    use: [
                        MiniCssExtractPlugin.loader, // Extract CSS into files
                        `css-loader`, // Process CSS files
                    ],
                },
                ...imageRules
            ],
        },
        plugins: [
            new webpack.DefinePlugin(envKeys),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['code/*.js', 'code/*.js.LICENSE.txt'],
            }),
            ...obfuscateON ? [obfuscationSettings] : [],
            new HtmlInlineCssWebpackPlugin.default(), // Inline CSS into the HTML
            ...pagesHTML,
            ...siteMapData,
            ...configWebPlugins,
        ],
        optimization: {
            minimize: minimiseON, // Enable minimization
            minimizer: [
                new TerserPlugin({ // Minify JavaScript
                    terserOptions: {
                        compress: {
                            drop_console: false, // Do not remove console logs
                        },
                    },
                }),
                ...cssMinimise,
            ],
        }, // @ts-ignore
        devServer: {
            static: {
                directory: path.join(process.cwd(), productionDir),
            },
            port, // Specify your desired port
            open: true, // Automatically open the browser
            compress: true, // Enable gzip compression for files served
        },
        mode
    };
};

export { build };