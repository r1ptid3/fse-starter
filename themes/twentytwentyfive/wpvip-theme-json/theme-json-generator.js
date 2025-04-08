const fs = require('fs');
const path = require('path');
const { setClampSize } = require('./utils');

/**
 * Class responsible for generating theme.generated.json file based on provided Figma tokens
 */
class ThemeJsonGenerator {
	/**
	 * @param {string} tokensPath - Path to the tokens.json file
	 */
	constructor(tokensPath) {
		this.tokensPath = tokensPath;
		this.outputPath = path.join(__dirname, 'dynamic-theme.json');
	}

	/**
	 * Loads tokens from tokens.json
	 * @returns {object} Parsed tokens object
	 */
	loadTokens() {
		return JSON.parse(fs.readFileSync(this.tokensPath, 'utf-8'));
	}

	/**
	 * Generates color palette array from tokens
	 * @param {object} tokens - Loaded tokens object
	 * @returns {Array<object>} Colors formatted for theme.json
	 */
	generateColors(tokens) {
		const palette = tokens['wpvip/static'].palette;
		const helperColors = tokens['wpvip/static'].helper;

		const paletteColors = Object.entries(palette).map(([key, value]) => ({
			name: key,
			slug: key.toLowerCase().replace(/\s+/g, '-'),
			color: value.value,
		}));

		const helperPaletteColors = Object.entries(helperColors).map(([key, value]) => ({
			name: key,
			slug: key.toLowerCase().replace(/\s+/g, '-'),
			color: value.value,
		}));

		return [...paletteColors, ...helperPaletteColors];
	}

	/**
	 * Generates layout settings from tokens
	 * @param {object} tokens - Loaded tokens object
	 * @returns {object} Layout settings for theme.json
	 */
	generateLayout(tokens) {
		const layout = tokens['wpvip/layout/value'];

		return {
			contentSize: `${layout.contentSize.value}px`,
			wideSize: `${layout.wideSize.value}px`,
		};
	}

	/**
	 * Helper method to sort items by numeric size value
	 * @param {Array<object>} items - Array of items to sort
	 * @returns {Array<object>} Sorted array
	 */
	sortByNumericValue(items) {
		return items.sort((a, b) => parseFloat(a.sortValue) - parseFloat(b.sortValue)).map(({ sortValue, ...rest }) => rest);
	}

	/**
	 * Generates responsive spacing sizes from tokens
	 * @param {object} tokens - Loaded tokens object
	 * @returns {Array<object>} Spacing sizes for theme.json
	 */
	generateSpacingSizes(tokens) {
		const desktop = tokens['wpvip/sizes/desktop'].spacings;
		const mobile = tokens['wpvip/sizes/mobile'].spacings;

		const spacingSizes = Object.keys(desktop).map((key) => ({
			size: setClampSize(desktop[key].value, mobile[key].value),
			slug: key.replace(/\s+/g, '-').toLowerCase(),
			name: key,
			sortValue: (parseFloat(desktop[key].value) + parseFloat(mobile[key].value)) / 2,
		}));

		return this.sortByNumericValue(spacingSizes);
	}

	/**
	 * Generates responsive font sizes from tokens
	 * @param {object} tokens - Loaded tokens object
	 * @returns {Array<object>} Font sizes for theme.json
	 */
	generateFontSizes(tokens) {
		const desktop = tokens['wpvip/sizes/desktop'].text;
		const mobile = tokens['wpvip/sizes/mobile'].text;

		const fontSizes = Object.keys(desktop).map((key) => ({
			name: key.replace(/\b\w/g, (c) => c.toUpperCase()),
			size: setClampSize(desktop[key].fontSize.value, mobile[key].fontSize.value),
			slug: key.replace(/\s+/g, '-').toLowerCase(),
			sortValue: (parseFloat(desktop[key].fontSize.value) + parseFloat(mobile[key].fontSize.value)) / 2,
		}));

		return this.sortByNumericValue(fontSizes);
	}

	/**
	 * Generates heading styles and assigns them to h1-h6 keys
	 * @param {object} tokens - Loaded tokens object
	 * @returns {object} Heading styles formatted for theme.json
	 */
	generateHeadingElements(tokens) {
		const desktop = tokens['wpvip/sizes/desktop'].headings;
		const mobile = tokens['wpvip/sizes/mobile'].headings;

		const headings = {};

		['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((heading) => {
			const desktopLetterSpacing = desktop[heading]?.letterSpacing?.value ?? null;
			const mobileLetterSpacing = mobile[heading]?.letterSpacing?.value ?? '0';
			const desktopLineHeight = desktop[heading]?.lineHeight?.value ?? null;
			const mobileLineHeight = mobile[heading]?.lineHeight?.value ?? null;

			headings[heading] = {
				typography: {
					fontSize: setClampSize(desktop[heading].fontSize.value, mobile[heading].fontSize.value),
					letterSpacing: desktopLetterSpacing && mobileLetterSpacing ? setClampSize(desktopLetterSpacing, mobileLetterSpacing) : 'initial',
					lineHeight: desktopLineHeight && mobileLineHeight ? setClampSize(desktopLineHeight, mobileLineHeight) : 'initial',
				}
			};
		});

		return headings;
	}

	/**
	 * Generates custom CSS variables from tokens
	 * @param {object} tokens - Loaded tokens object
	 * @returns {object} Custom CSS variables formatted for theme.json
	 */
	generateCustomCSSVariables(tokens) {
		const desktop = tokens['wpvip/sizes/desktop'];
		const mobile = tokens['wpvip/sizes/mobile'];

		const customVars = {};

		// Border radius clamp
		if (desktop.border?.radius?.value && mobile.border?.radius?.value) {
			customVars['--wpvip-border-radius'] = setClampSize(desktop.border.radius.value, mobile.border.radius.value);
		}

		// Lead typography clamps (fontSize, letterSpacing, lineHeight)
		const desktopLead = desktop.headings.lead;
		const mobileLead = mobile.headings.lead;

		if (desktopLead?.fontSize?.value && mobileLead?.fontSize?.value) {
			customVars['--wpvip-lead-font-size'] = setClampSize(desktopLead.fontSize.value, mobileLead.fontSize.value);
		}

		if (desktopLead?.letterSpacing?.value && mobileLead?.letterSpacing?.value) {
			customVars['--wpvip-lead-letter-spacing'] = setClampSize(desktopLead.letterSpacing.value, mobileLead.letterSpacing.value);
		}

		if (desktopLead?.lineHeight?.value && mobileLead?.lineHeight?.value) {
			customVars['--wpvip-lead-line-height'] = setClampSize(desktopLead.lineHeight.value, mobileLead.lineHeight.value);
		}

		return customVars;
	}

	/**
	 * Generates complete minimal theme.json object
	 * @param {Array<object>} colors - Colors array formatted for theme.json
	 * @param {object} layout - Layout settings
	 * @param {Array<object>} spacingSizes - Responsive spacing sizes
	 * @param {Array<object>} fontSizes - Responsive font sizes
	 * @param {Array<object>} headingElements - Responsive heading styles
	 * @param {Array<object>} customVars - Custom CSS variables
	 * @returns {object} Minimal theme.json structure
	 */
	generateMinimalThemeJson(colors, layout, spacingSizes, fontSizes, headingElements, customVars) {
		return {
			"settings": {
				"color": {
					"palette": colors
				},
				"layout": layout,
				"spacing": {
					"spacingSizes": spacingSizes,
				},
				"typography": {
					"fontSizes": fontSizes,
				},
				"custom": customVars,
			},
			"styles": {
				"elements": {
					...headingElements
				}
			}
		};
	}

	/**
	 * Saves generated theme.json to file
	 * @param {object} theme - Generated theme.json object
	 */
	saveThemeJson(theme) {
		fs.writeFileSync(this.outputPath, JSON.stringify(theme, null, 2));
		console.log('dynamic-theme.json was created successfully');
	}

	/**
	 * Generates theme.json object
	 */
	generate() {
		const tokens = this.loadTokens();
		const colors = this.generateColors(tokens);
		const layout = this.generateLayout(tokens);
		const spacingSizes = this.generateSpacingSizes(tokens);
		const fontSizes = this.generateFontSizes(tokens);
		const headingElements = this.generateHeadingElements(tokens);
		const customVars = this.generateCustomCSSVariables(tokens);

		const themeJson = this.generateMinimalThemeJson(
			colors,
			layout,
			spacingSizes,
			fontSizes,
			headingElements,
			customVars
		);

		this.saveThemeJson(themeJson);
	}
}

if (require.main === module) {
	const generator = new ThemeJsonGenerator(path.join(__dirname, 'tokens.json'));
	generator.generate();
}

module.exports = ThemeJsonGenerator;
