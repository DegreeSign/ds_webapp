# DegreeSign WebApp

The progressive web application template built with Webpack and TypeScript. Leverage `degreesign` package for streamlined configuration and deployment.

## Features
- **Webpack-powered**: Optimised bundling for production-ready applications.
- **TypeScript Support**: Ensures type safety and modern JavaScript features.
- **Modular Structure**: Organised folder layout for scalability.
- **SEO & PWA Ready**: Configurable metadata and manifest for progressive web apps.
- **Customisable**: Flexible Webpack configuration via `degreesign`.

## Recommended Setup
1. **Node.js**: Version 18.x or higher.
2. **Package Manager**: npm or Yarn.
3. **Dependencies**:
   - Install the `degreesign` package: `npm install degreesign`.
   - Install Webpack and TypeScript: `npm install webpack webpack-cli typescript ts-loader`.
4. **Environment**:
   - Create a `.env` file in the root directory with for any keys used in ts code.
   - Ensure a TypeScript configuration (`tsconfig.json`) is set up.
5. **IDE**: Use VS Code or any TypeScript-compatible editor for best experience.

## Folder Structure
```
app_folder/
├── public_html/                 # Output directory for production build
├── src/                         # Source files
│   ├── assets/                  # Static assets
│   │   ├── images/              # Image assets
│   │   │   ├── favicon.ico      # Favicon
│   │   │   ├── app_icon.png     # App icon for PWA
│   │   │   └── app_cover_image.webp  # Cover image for SEO
│   ├── code/                    # Utility scripts
│   │   └── utils.ts             # Shared TypeScript utilities
│   ├── pages/                   # Page-specific files
│   │   ├── home/                # Home page
│   │   │   ├── home.ts          # Home page logic
│   │   │   └── home.html        # Home page template
│   └── styles.css               # Global styles
├── webpack.config.ts            # Webpack configuration
├── .env                         # Environment variables
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project metadata and scripts
```

## Webpack Configuration
The `webpack.config.ts` file is the core of the build process, utilising the `degreesign` package for simplified setup. Below is the configuration:

```
import { build } from "degreesign";

module.exports = build({
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
  notificationTitle: "New Notification",
  notificationText: "You have a new notification!",
  background_color: "#ffffff",
  theme_color: "#000000",
  app_icon: "app_icon.png",
  fav_icon: "favicon.ico",
  orientation: "portrait",
  pagesList: [{
    
  }],
  htmlCommonElements: [],
  obfuscateON: false,
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

### Key Configuration Notes
- **Environment Variables**: Use `.env` to securely store sensitive data.
- **PWA Support**: Customise `app_icon`, `fav_icon`, and `orientation` for a native-like experience.
- **SEO Optimisation**: Set `websiteTitle`, `websiteDescription`, and `coverImage` for better search visibility.
- **Pages**: Add all pages to `pagesList`.
- **Development Server**: Runs on `port: 3210` by default.

## Getting Started
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd degreesign_webapp
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Development Server**:
   ```bash
   npm run start
   ```
4. **Build for Production**:
   ```bash
   npm run build
   ```
   Output will be in the `public_html/` directory.

## Scripts
- `npm run start`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs TypeScript and ESLint checks (if configured).

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m "Add feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.