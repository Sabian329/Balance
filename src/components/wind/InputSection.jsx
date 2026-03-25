const SHADE_STYLES = {
	green:
		"border-blue-200 bg-gradient-to-b from-green-300/40 to-white ring-ios-blue/20",
	sky: "border-blue-200 bg-gradient-to-b from-sky-400/20 to-white ring-ios-blue/20",
	orange:
		"border-blue-200/80 bg-gradient-to-b from-orange-400/20 to-white ring-ios-blue/20",
};

export default function InputSection({
	shade = "green",
	className = "",
	children,
}) {
	const shadeClass = SHADE_STYLES[shade] ?? SHADE_STYLES.green;
	return (
		<div
			className={[
				"col-span-2 rounded-2xl border p-3 shadow-sm ring-1",
				shadeClass,
				className,
			]
				.join(" ")
				.trim()}
		>
			{children}
		</div>
	);
}
