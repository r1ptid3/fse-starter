/**
 * Generate clampRem style string.
 * @param {number} fontSizeMin
 * @param {number} fontSizeMax
 * @param {number} viewportMinPx
 * @param {number} viewportMaxPx
 */
export const clampRem = (
	fontSizeMin,
	fontSizeMax,
	viewportMinPx = 640,
	viewportMaxPx = 1440
) => {
	const fontSizeMinRem = fontSizeMin / 16;
	const fontSizeMaxRem = fontSizeMax / 16;

	const var1 = `1vw - ${(viewportMinPx / 100).toFixed(4)}px`;
	const var2 = `${(
		((fontSizeMax - fontSizeMin) / (viewportMaxPx - viewportMinPx)) *
		100
	).toFixed(4)}`;
	const fluid = `calc(${fontSizeMinRem}rem + (${var1}) * ${var2})`;

	return `clamp(${fontSizeMinRem}rem, ${fluid}, ${fontSizeMaxRem}rem)`;
};

export const setClampSize = (size, mobSize) => {
	return clampRem(mobSize, size);
};
