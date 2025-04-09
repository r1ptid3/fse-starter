const fs = require('fs');
const path = require('path');

/**
 * Deep merges two objects.
 * @param {object} target - The target object.
 * @param {object} source - The source object.
 * @returns {object} Merged object.
 */
function deepMerge(target, source) {
	for (const key in source) {
		if (source[key] instanceof Object && key in target) {
			target[key] = deepMerge(target[key], source[key]);
		} else {
			target[key] = source[key];
		}
	}
	return target;
}

function mergeThemeJson(staticPath, dynamicPath, outputPath) {
	const staticTheme = JSON.parse(fs.readFileSync(staticPath, 'utf-8'));
	const dynamicTheme = JSON.parse(fs.readFileSync(dynamicPath, 'utf-8'));

	const finalTheme = deepMerge(staticTheme, dynamicTheme);

	fs.writeFileSync(outputPath, JSON.stringify(finalTheme, null, 2));
	console.log(`Successfully merged into ${outputPath}`);
}

// File paths
const staticPath = path.join(__dirname, 'static-theme.json');
const dynamicPath = path.join(__dirname, 'dynamic-theme.json');
const outputPath = path.join(__dirname, 'theme.json');

// Execute merge
mergeThemeJson(staticPath, dynamicPath, outputPath);
