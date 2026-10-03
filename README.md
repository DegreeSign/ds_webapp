# @degreesign/webapp

**A TypeScript-first development standard for building a webapp — production-ready Progressive Web Apps and Node.js servers in pure HTML, CSS and TypeScript, engineered for the fastest possible renders and sub-second page loads; one config generates optimized bundles, SEO meta tags, a PWA manifest, service worker, `sitemap.xml`, `robots.txt`, `.htaccess` and optional JavaScript obfuscation.**

[![npm version](https://img.shields.io/npm/v/@degreesign/webapp.svg)](https://www.npmjs.com/package/@degreesign/webapp)
[![npm downloads](https://img.shields.io/npm/dm/@degreesign/webapp.svg)](https://www.npmjs.com/package/@degreesign/webapp)
[![license](https://img.shields.io/npm/l/@degreesign/webapp.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6.svg)](https://www.typescriptlang.org/)
[![Webpack 5](https://img.shields.io/badge/webpack-5-8dd6f9.svg)](https://webpack.js.org/)
[![Node.js 18+](https://img.shields.io/badge/node-%3E%3D18-339933.svg)](https://nodejs.org/)

## Table of Contents

- [What is @degreesign/webapp?](#what-is-degreesignwebapp)
- [Why @degreesign/webapp?](#why-degreesignwebapp)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Build API](#build-api)
- [File Utilities](#file-utilities)
- [Types](#types)
- [Configuration Options](#configuration-options)
- [FAQ](#faq)
- [Keywords](#keywords)
- [License](#license)

## What is @degreesign/webapp?

`@degreesign/webapp` defines a **TypeScript-first development standard** for shipping **Progressive Web Apps (PWAs)** and **Node.js server bundles** from a single `build()` call: it is a small, dependency-light Webpack and TypeScript toolkit for building a webapp from **pure HTML, CSS and TypeScript**, with no framework runtime to ship or hydrate, so first render is immediate and page loads stay sub-second. Instead of hand-writing hundreds of lines of Webpack config, you pass one typed config object and get a production-ready build: TypeScript compilation, CSS extraction and inlining, asset copying, HTML templating, SEO and Open Graph/Twitter meta tags, `app.json` manifest, auto-registered service worker, sitemap, `robots.txt`, `.htaccess` security policies, bundle analysis and optional code obfuscation. It is a build-time developer tool — it runs in Node.js during your build, not in the browser.

## Why @degreesign/webapp?

- **One config, whole build** — a single typed object replaces a full `webpack.config.ts` with plugins, loaders and rules.
- **PWA out of the box** — generates the web app manifest, service worker, icons, orientation and install metadata automatically.
- **SEO built in** — per-page title, description, canonical URL, Open Graph, Twitter Cards, `robots.txt` and `sitemap.xml`.
- **Typed configuration** — ships type definitions and typed configuration (`ConfigBuild`, `Page`, `PreconnectLink`).
- **Web and server bundling** — build the front-end to `public_html/` and the Node.js back-end to `server_build/` from the same package.
- **Performance defaults** — Terser minification, CSS minification, tree-shaking, content hashing and a 2 MB asset budget (configurable).
- **Optional obfuscation** — toggle `obfuscateON` to protect shipped JavaScript with `webpack-obfuscator`.
- **Secure by default** — emits `.htaccess` with HSTS, `X-Frame-Options`, Referrer-Policy, Permissions-Policy and HTTPS redirects.
- **Pure HTML + CSS + TypeScript** — no framework runtime, hydration or virtual DOM to download; pages are generated as real markup at build time for the fastest possible first paint and sub-second page loads.
- **MIT licensed and free forever.**

## Installation

Requires **Node.js 18 or higher**.

```bash
# npm
npm install --save-dev @degreesign/webapp webpack webpack-cli typescript ts-loader

# yarn
yarn add --dev @degreesign/webapp webpack webpack-cli typescript ts-loader

# pnpm
pnpm add -D @degreesign/webapp webpack webpack-cli typescript ts-loader
```

### CDN

The package is a Node.js build tool, so it is normally installed via a package manager. For quick inspection or utilities in a bundler that supports ESM CDNs, load it directly:

```html
<script type="module">
  import { readJSON, writeJSON } from "https://esm.sh/@degreesign/webapp";
</script>
```

> **Note:** the file utilities and `build()` rely on Node.js `fs`/`path`, so CDN usage is only suitable for Node-targeted environments, not the browser runtime.

## Quick Start

**1. Add build scripts to `package.json`:**

```json
{
  "scripts": {
    "build": "webpack --config webpack.web.ts",
    "start": "webpack serve --config webpack.web.ts",
    "build_server": "webpack --config webpack.server.ts",
    "start_server": "webpack serve --config webpack.server.ts"
  },
  "devDependencies": {
    "@degreesign/webapp": "latest"
  }
}
```

**2. Create `webpack.web.ts` — a complete, copy-paste PWA build:**

```typescript
import { build } from "@degreesign/webapp";

module.exports = build({
  type: "webapp",
  websiteDomain: "example.com",
  websiteName: "Your App Name",
  appShortName: "AppName",
  twitterUserName: "YourApp",
  publishedTime: "2025-01-01T00:00:00+00:00",
  author: "Your Name",
  websiteTitle: "Your App Slogan",
  websiteDescription: "A brief description of your app.",
  coverImage: "app_cover_image.webp",
  coverImageDescription: "A descriptive alt text for the cover image.",
  background_color: "#ffffff",
  theme_color: "#000000",
  appIcon: "app_icon.png",
  appIconMaskable: "app_icon_maskable.png",
  fav_icon: "favicon.ico",
  orientation: "portrait",
  pagesList: [{
    uri: "home",
    name: "HomePage",
    description: "Progressive Web App (PWA) HomePage",
  }],
  htmlCommonElements: [],
  obfuscateON: false,
  preconnectLinks: [
    "https://api.example.com",
    { href: "https://cdn.example.com", crossorigin: true },
  ],
  srcDir: "src",
  assetsDir: "assets",
  commonDir: "code",
  imagesDir: "images",
  pagesDir: "pages",
  pageHome: "home",
  productionDir: "public_html",
  htaccessCustom: "",
  startURI: "/",
  language: "en_GB",
  port: 3210,
});
```

**3. Create `webpack.server.ts` — a Node.js back-end bundle:**

```typescript
import { build } from "@degreesign/webapp";

module.exports = build({
  type: "server",
  obfuscateON: true,
  srcDir: "server",
  productionDir: "server_build",
  filesList: ["main"],
  port: 3211,
});
```

**4. Add the expected source layout:**

```
app_folder/
├── public_html/                  # Web output
├── server_build/                 # Server output
├── src/
│   ├── assets/images/            # favicon.ico, app_icon.png, cover images
│   ├── code/                     # common HTML + ts utils
│   ├── pages/home/
│   │   ├── home.ts
│   │   └── home.html
│   └── styles.css
├── server/
│   └── main.ts
├── webpack.web.ts
├── webpack.server.ts
├── .env
└── tsconfig.json
```

**5. Build and run:**

```bash
npm start          # web dev server on port 3210
npm run build      # web build → public_html/
npm run start_server
npm run build_server  # server build → server_build/
```

### Use the file helper API

```typescript
import { readJSON, writeJSON, readData, writeData } from "@degreesign/webapp";

const config = readJSON("./config.json");         // parse a JSON file
writeJSON("./dist/output.json", { built: true }); // serialize + write JSON
const html = readData("./src/pages/home/home.html"); // read a text file
writeData("./dist/robots.txt", "User-agent: *");     // write a text file
```

## Build API

### `build(params)`

Creates and returns a Webpack `Configuration` object. Pass `type: "webapp"` for a front-end PWA build, or `type: "server"` for a Node.js bundle.

| Export | Type | Returns | Description |
| --- | --- | --- | --- |
| `build` | `(params: ConfigBuild) => webpack.Configuration` | Webpack configuration | Central entry point. Accepts `ConfigWebApp` or `ConfigServer` (discriminated by `type`) and returns a ready-to-export Webpack config for `--config webpack.web.ts` / `webpack.server.ts`. |

## File Utilities

Small, dependency-free Node.js helpers used internally and exported for reuse in your own build scripts.

| Export | Signature | Returns | Description |
| --- | --- | --- | --- |
| `writeData` | `(file: string, code: string) => boolean` | `true` on success, `false` on empty data or failure | Writes a UTF-8 string to `file` resolved against `process.cwd()`. |
| `writeJSON` | `(file: string, code: any) => boolean` | `true` on success, `false` on empty data or failure | Serializes a value with `JSON.stringify` and writes it via `writeData`. |
| `readData` | `(file: string, internal?: boolean) => string` | File contents or `""` on failure | Reads a UTF-8 file. When `internal` is `true`, the path is resolved relative to the package directory instead of `process.cwd()`. |
| `readJSON` | `(file: string, internal?: boolean) => any` | Parsed JSON or `undefined` on failure | Reads a file via `readData` and parses it as JSON. |

## Types

| Export | Kind | Description |
| --- | --- | --- |
| `Page` | `interface` | A page in `pagesList`: `uri`, `name`, `description`, plus optional `short_name`, `icon`, `iconMaskable`, `shortcut`, `noindex`, `publishDate`, `coverImage`, `coverImageDescription`, `headerHTML`, `menuHTML`, `footerHTML`, `customHTML`, `isPHP`, `keywords` and `canonicalURL`. Drives per-page HTML, SEO tags, shortcuts and sitemap entries. |
| `PreconnectLink` | `interface` | A `<link rel="preconnect">` entry: `{ href: string; crossorigin?: boolean }`. `crossorigin` defaults to `true`; `preconnectLinks` also accepts a plain URL string. |

Additional public types `ConfigBuild`, `ConfigBase`, `ConfigWebApp`, `ConfigServer`, `MetaTags`, `MetaTagsInput` and `WebManifest` are exported from the package source for advanced typing.

## Configuration Options

### Base options (`ConfigBase`)

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `srcDir` | `string` | `src` | Source directory. |
| `productionDir` | `string` | `public_html` | Build output directory. |
| `mode` | `"development" \| "production"` | `production` | Webpack mode. |
| `obfuscateON` | `boolean` | `false` | Enable JavaScript obfuscation. |
| `minimiseON` | `boolean` | `true` | Enable JS/CSS minification. |
| `port` | `number` | `3210` | Dev server port. |
| `maxFileSizeMB` | `number` | `2` | Asset/entry performance budget in MB. |
| `resolveOptions` | `ResolveOptions` | `{}` | Extra Webpack resolve options. |
| `licenseText` | `string` | `""` | Banner text prepended to bundles. |
| `openAnalyzer` | `boolean` | `false` | Open the bundle analyzer window. |
| `includeServerModules` | `boolean` | `false` | Bundle `node_modules` into server output instead of externalizing. |

### Web app options (`ConfigWebApp`)

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `websiteName` | `string` | yes | Application name. |
| `websiteDomain` | `string` | yes | Domain used for canonical URLs, sitemap and Open Graph. |
| `appShortName` | `string` | yes | Manifest short name. |
| `twitterUserName` | `string` | yes | Twitter handle for `twitter:site`. |
| `publishedTime` | `string` | yes | Publication timestamp (ISO 8601). |
| `author` | `string` | yes | Site author meta tag. |
| `websiteTitle` | `string` | yes | Default title / slogan. |
| `websiteDescription` | `string` | yes | Default meta description. |
| `coverImage` | `string` | yes | Social cover image (Open Graph / Twitter). |
| `coverImageDescription` | `string` | yes | Cover image alt text. |
| `background_color` | `string` | yes | Manifest background color. |
| `theme_color` | `string` | yes | Manifest/`theme-color`. |
| `appIcon` | `string` | yes | App icon path. |
| `appIconMaskable` | `string` | yes | Maskable icon path. |
| `fav_icon` | `string` | yes | Favicon path. |
| `orientation` | `"portrait" \| "landscape"` | yes | Screen orientation. |
| `pagesList` | `Page[]` | yes | Pages to generate. |
| `htmlCommonElements` | `("header"\|"footer"\|"menu")[]` | no | Shared HTML partials to inject. |
| `assetsDir` | `string` | yes | Assets directory. |
| `commonDir` | `string` | yes | Shared code/HTML directory. |
| `imagesDir` | `string` | yes | Images directory. |
| `pagesDir` | `string` | yes | Pages directory. |
| `pageHome` | `string` | yes | Home page identifier. |
| `htaccessCustom` | `string` | yes | Appended to generated `.htaccess`. |
| `startURI` | `string` | no | PWA `start_url`. |
| `language` | `string` | no | Open Graph locale. |
| `preconnectLinks` | `(string \| PreconnectLink)[]` | no | Origins to `preconnect`, CORS on by default. |
| `cssDiscardUnused` | `boolean` | no | Discard unused CSS. |
| `updateServiceWorker` | `boolean` | no | Re-version the service worker on build. |
| `onlineIndicatorFile` | `string` | no | Reference file used by the service worker. |

### Server options (`ConfigServer`)

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `"server"` | yes | Selects the Node.js target. |
| `srcDir` | `string` | yes | Server source directory (e.g. `server`). |
| `productionDir` | `string` | yes | Server output directory (e.g. `server_build`). |
| `filesList` | `string[]` | yes | Entry names, each compiled from `./<srcDir>/<name>.ts`. |
| `includeServerModules` | `boolean` | no | Bundle dependencies instead of externalizing them. |

## FAQ

**What is `@degreesign/webapp`?**
A TypeScript-first Webpack + TypeScript build toolkit that turns one typed config object into a production-ready webapp — a Progressive Web App built from pure HTML, CSS and TypeScript — and/or a Node.js server bundle, including SEO metadata, a PWA manifest, service worker, sitemap and security headers.

**Is it free?**
Yes. It is open source under the MIT License and free to use in personal and commercial projects.

**Does it work with Node.js and the browser?**
It is a Node.js build-time tool. `build()` and the file helpers run in Node.js (18+) during your build. The generated output — HTML, JS, CSS, manifest and service worker — is what runs in the browser.

**Does it have dependencies?**
Yes. It wraps and configures Webpack plugins such as `terser-webpack-plugin`, `clean-webpack-plugin`, `copy-webpack-plugin`, `html-webpack-plugin`, `mini-css-extract-plugin`, `css-minimizer-webpack-plugin`, `sitemap-webpack-plugin`, `webpack-obfuscator` and `webpack-bundle-analyzer`. Install it alongside `webpack`, `webpack-cli`, `typescript` and `ts-loader`.

**Does it support TypeScript?**
Yes. It ships type definitions, compiles TypeScript via `ts-loader`, and exposes fully typed configuration (`ConfigBuild`, `ConfigWebApp`, `ConfigServer`, `Page`, `PreconnectLink`).

**How are pages built?**
Each page is an `.html` fragment plus a same-named `.ts` entry, styled by CSS, compiled to real markup at build time. There is no UI runtime to ship or hydrate, so first render is immediate. The package handles bundling, assets, PWA and SEO concerns rather than UI.

**Can I use it for a Node.js back-end?**
Yes. Set `type: "server"` with `filesList` to bundle one or more Node.js entry files, with `node_modules` externalized by default.

**Can I disable minification or enable obfuscation?**
Yes. Toggle `minimiseON` and `obfuscateON` in the config.

**Where does the build output go?**
Web builds default to `public_html/` and server builds to `server_build/`; both are configurable via `productionDir`.

## Keywords

webpack, webpack config, webpack 5, typescript, ts-loader, progressive web app, PWA, webapp, web app, webapp boilerplate, PWA boilerplate, web app template, build tool, bundler, node.js server bundling, SEO, meta tags, open graph, twitter cards, sitemap, robots.txt, service worker, web manifest, app manifest, code obfuscation, webpack-bundle-analyzer, static site, front-end build, degreesign.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
