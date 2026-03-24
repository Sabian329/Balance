export function toNumber(value) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

export function clampValue(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

export function format(value, digits = 3) {
	return value.toLocaleString("pl-PL", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	});
}
