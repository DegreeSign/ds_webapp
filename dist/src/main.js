"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const HtmlInlineCssWebpackPlugin = __importStar(require("html-inline-css-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const dotenv_1 = __importDefault(require("dotenv"));
const web_1 = require("./web");
const obfuscate_1 = require("./obfuscate");
dotenv_1.default.config();
const build = (params) => {
    const isWebApp = params.type != `server`, { mode = `production`, obfuscateON = false, minimiseON = true, srcDir = `src`, productionDir = `public_html`, port = 3210, maxFileSizeMB = 2, resolveOptions = {}, } = params, { filesList = [], } = isWebApp ? {} : params, { entryPoints = {}, pagesHTML = [], imageRules = [], configWebPlugins = [], siteMapData = [], cssMinimise = [] } = isWebApp ? (0, web_1.webConfig)(params) : {}, fileSize = maxFileSizeMB * 1024 ** 2, envKeys = {};
    // Environment keys
    for (const key in process.env)
        envKeys[`process.env.${key}`] = JSON.stringify(process.env[key]);
    // entry points
    if (!isWebApp)
        for (let i = 0; i < filesList.length; i++) {
            const fileName = filesList[i];
            entryPoints[fileName] =
                `./${srcDir}/${fileName}.ts`;
        }
    ;
    return {
        entry: entryPoints,
        performance: {
            maxAssetSize: fileSize,
            maxEntrypointSize: fileSize,
        },
        output: {
            path: path_1.default.resolve(process.cwd(), productionDir),
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
                        mini_css_extract_plugin_1.default.loader, // Extract CSS into files
                        `css-loader`, // Process CSS files
                    ],
                },
                ...imageRules
            ],
        },
        plugins: [
            new webpack_1.default.DefinePlugin(envKeys),
            new clean_webpack_plugin_1.CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['code/*.js', 'code/*.js.LICENSE.txt'],
            }),
            ...obfuscateON ? [obfuscate_1.obfuscationSettings] : [],
            new HtmlInlineCssWebpackPlugin.default(), // Inline CSS into the HTML
            ...pagesHTML,
            ...siteMapData,
            ...configWebPlugins,
        ],
        optimization: {
            minimize: minimiseON, // Enable minimization
            minimizer: [
                new terser_webpack_plugin_1.default({
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
                directory: path_1.default.join(process.cwd(), productionDir),
            },
            port, // Specify your desired port
            open: true, // Automatically open the browser
            compress: true, // Enable gzip compression for files served
        },
        mode
    };
};
exports.build = build;
