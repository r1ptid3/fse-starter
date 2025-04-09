WPVIP Marketing 1.0.0
===

**_WPVIP Marketing_** is a theme for web development. It depends on **Gutenberg** and **Full-Site Editor** for creating custom layouts.

##### Changelog:
*  no changelog yet...

##### Table of Contents:

*   [Prerequisites](#prerequisites)
*   [Gulp](#gulp)
*   [INC](#inc)
*   [Images](#images)
*   [CSS](#css)
*   [JavaScript](#javascript)
*   [PHP](#php)

## Prerequisites

Required plugins:

*   **Rank Math**.

**Not needed (!)** plugins (functionality is already bundled into the theme):

* SVG Support / Safe SVG.

## Gulp

Recommended setup:

* Node version: ^22.14.0
* NPM version: ^10.9.2

Available commands:

*   `gulp` : runs gulp watcher in Development mode.
*   `gulp watch` : start BrowserSync with gulp watcher in Development mode.
*   `gulp build-dev` : replace files in `dist` folder, compile assets for development purposes without running watcher. Created especially for non-production environments.
*   `gulp build` : re-create `dist` folder, compile assets for Production (optimized and minified).

## INC

All files from this folder should be included in **functions.php**.

* **after-theme-setup.php** - Custom image sizes registration and all other actions that should be run after the theme setup.
* **class-svg-support.php** - Replacement for SVG Support / Safe SVG plugins.
* **custom-post-types/\[cpt-name\].php** - Create needed custom post types and taxonomies. Make sure to set correct names, parameters for visibility, archive page, slug rewrite, etc.
* **disables.php** - default WordPress features that are disabled for the website.
* **help-func.php** - This theme comes with some predefined custom helper functions. Please put your reusable helper functions here.
* **plugin-hooks.php** - File with custom hooks that modifying plugins, if this file is large, you can separate it to `[plugin-name]-hooks.php`.
* **scripts-styles.php** - Scripts and styles enqueue | dequeue.
  **Important:** script version for `VIP_GO_APP_ENVIRONMENT` with `production` value is based on `version` in `style.css`.

## Images

Make sure to optimize images before adding them to `assets/img` folder.
Possible online tool for image optimization (jpg, png, gif, svg, webp): **[Compressor](https://compressor.io/)**.

**SVG sprite**: It's recommended to add constantly used SVG icons (e.g. socials, logo, navigation arrows, etc) into a single SVG sprite, for further inline usage in the templates (e.g. `<svg><use xlink:href="#logo"></use></svg>`). You can add correctly prepared icons into **template-parts/svg.php** file.

## CSS

SCSS syntax is used for speed up work with styles. This theme uses modified **[ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/#what-is-itcss)** approach. Please follow **[BEM](https://getbem.com/introduction/)** principles for CSS class naming (e.g. `.site-header`, `.site-header__section`, `.site-header__section--dark`).

Do not write classes and styles like this `[HTML] .header-image`, `[SCSS] &-image {...}`, please always use double dash `--` or double underscore `__`.

We are using REM units globally instead of pixels. You should use custom SASS `rem` function for this (syntax examples are provided in **scss/global/0-settings/_!rem-calc.scss**). Use REM units for everything, except small border-width values (e.g. keep `border-width: 1px`). You can use the following notation for declaring CSS variables with `rem` values: `--my-css-var: #{rem(50)};`.

For responsive font sizes, it's recommended to use the custom SASS `clamp-rem` function ((syntax examples are provided in **scss/global/0-settings/_!rem-calc.scss**)), which has two required attributes that describe min and max font sizes between and 2 optional attributes that describe min and max browser width. Default min-width is **md** breakpoint and max-width is **xl** breakpoint. Use only pixel values for `clamp-rem` function. Find more information about **[CSS Clamp](https://css-tricks.com/min-max-and-clamp-are-css-magic/)** and **[Online Clamp Calculator](https://websemantics.uk/tools/responsive-font-calculator/)**.

* **global.scss** - Main theme styles file, it will be loaded inside editor and on front-end.
* **admin.scss** - Custom styles for admin panel.
* **editor.scss** - Custom styles that will be loaded only inside gutenberg editor.
* **global/0-settings** - Setup theme SCSS variables, mixins, layout settings, etc..
* **global/1-generic** - Generic styles for the website
    *   **1-1-base** - Sanitizing, main HTML tag styles and core WP styles.
    *   **1-2-typography** - Additional styles for headings and styled HTML tags (ul, ol, etc.) Adjust custom editor style formats.
    *   **1-3-forms** - Styles for form elements and buttons.
    *   **1-4-utilities** - Describe custom animations, and styles for helper classes here.
* **global/2-layout** - Here you can find additional styles for global website layout ( footer, header, etc. ).
* **global/3-vendors** - 3rd party plugin styles should be added here (by importing styles from **node\_modules** or copying CSS/SCSS files).
* **global/4-components** - styles for reusable components on the website such as notifications, breadcrumbs, loaders, pagination, etc..
* **global/5-core-blocks** - custom styles for extending core-blocks functionality ( Do not redefine core blocks functionality, always try to keep their initial behaviour ).
* **global/6-templates** - additional styles for specific templates, CPT singles, archives, 404, search results, etc.

## JavaScript

* **components** folder - It's recommended to divide JS code into components (separated files with their own functionality). Place such files in the folder, and then import them in a `_common.js`.
* **utils** folder - helper functions from this folder should be imported into other component files.
* **editor** folder - contains custom scripts that will be executed only inside gutenberg editor.
* **admin** folder - contains custom scripts that will be executed only inside admin panel.
* **public.js** - this is a result file for front-end. Make sure that scripts will are enqueued inside this file.

## PHP

PHP version `>=8.3` is required

* All php files are written using `declare( strict_types = 1 )` mode. **Strict typing** mode will give you more control and understanding of what is going on with your functions, and what data types you should pass into the function and what you can expect. It's a good practice and it's really recommended to use strict type mode.
* Please left a proper description and variable / return types while writing PHP code, so any developer can maintain the project.
* Before starting development, please run `composer install` command from `wp-content` folder, it will install all required dependencies into the project. Currently we have PHPCS and PHP Stan installed and configured.
