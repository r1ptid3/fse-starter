<?php
/**
 * WPVIP Marketing functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage wpvip-marketing
 * @since 1.0.0
 */

define( 'WPVIP_DIR', get_template_directory() );
define( 'WPVIP_URL', get_template_directory_uri() );
define( 'WPVIP_TEMPLATES', get_template_directory() . '/template-parts/' );
define( 'WPVIP_DIST', get_template_directory_uri() . '/dist/' );
define( 'WPVIP_CSS', get_template_directory_uri() . '/dist/css/' );
define( 'WPVIP_JS', get_template_directory_uri() . '/dist/js/' );
define( 'WPVIP_IMG', get_template_directory_uri() . '/dist/img/' );
define( 'WPVIP_BUILD', get_template_directory_uri() . '/build/' );
define( 'WPVIP_VERSION', wp_get_theme()->get( 'Version' ) );

if ( ! defined( 'WP_ENVIRONMENT_TYPE' ) ) {
	define( 'WP_ENVIRONMENT_TYPE', 'local' );
}

require WPVIP_DIR . '/inc/after-theme-setup.php'; // All hooks that needs to be done on after_theme_setup.
require WPVIP_DIR . '/inc/plugin-hooks.php'; // All hooks that for different plugins.
require WPVIP_DIR . '/inc/custom-post-types/case-study.php'; // Include Case Study CTP.
require WPVIP_DIR . '/inc/custom-post-types/event.php'; // Include Event CTP.
require WPVIP_DIR . '/inc/custom-post-types/glossary.php'; // Include Glossary CTP.
require WPVIP_DIR . '/inc/custom-post-types/partner.php'; // Include Partner CTP.
require WPVIP_DIR . '/inc/custom-post-types/resource.php'; // Include Resource CTP.
require WPVIP_DIR . '/inc/disables.php'; // Disable of extra unwanted features.
require WPVIP_DIR . '/inc/editor.php'; // Editor functions.
require WPVIP_DIR . '/inc/helper-functions.php'; // Helper functions.
require WPVIP_DIR . '/inc/scripts-styles.php'; // Scripts and styles enqueue | dequeue.
require WPVIP_DIR . '/inc/class-svg-support.php'; // Adds support for SVG upload.
require WPVIP_DIR . '/inc/gutenberg-helper-functions.php'; // Gutenberg helper functions.
require WPVIP_DIR . '/inc/gutenberg.php'; // Gutenberg core functionality.
