import { Field, Input, Label, Select } from "@headlessui/react";

function SelectChevronIcon() {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M4 5.5L7 8.5L10 5.5"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default function WindFormField({
	label,
	labelAccessory = null,
	type = "number",
	value,
	onChange,
	placeholder,
	min,
	max,
	step,
	inputMode,
	icon = null,
	select = null,
	showSlider = false,
	slider = null,
	note = null,
	wrapperClassName = "",
}) {
	const handleChange = (event) => {
		if (type !== "number") {
			onChange(event);
			return;
		}

		const rawValue = event.target.value;
		if (rawValue === "") {
			onChange(event);
			return;
		}

		const parsed = Number(rawValue);
		if (!Number.isFinite(parsed)) return;

		const minValue = min === undefined ? -Infinity : Number(min);
		const maxValue = max === undefined ? Infinity : Number(max);
		const clamped = Math.min(Math.max(parsed, minValue), maxValue);

		onChange({
			...event,
			target: {
				...event.target,
				value: String(clamped),
			},
		});
	};

	const canShowSlider =
		showSlider &&
		type === "number" &&
		slider &&
		Number.isFinite(Number(slider.min)) &&
		Number.isFinite(Number(slider.max));
	const sliderMin = canShowSlider ? Number(slider.min) : 0;
	const sliderMax = canShowSlider ? Number(slider.max) : 100;
	const sliderStep = canShowSlider
		? Number.isFinite(Number(slider.step))
			? Number(slider.step)
			: Number.isFinite(Number(step))
				? Number(step)
				: 1
		: 1;
	const parsedValue = Number(value);
	const sliderValue =
		canShowSlider && Number.isFinite(parsedValue)
			? Math.min(Math.max(parsedValue, sliderMin), sliderMax)
			: sliderMin;

	return (
		<Field className={["space-y-1", wrapperClassName].join(" ").trim()}>
			<div className="flex items-center gap-2">
				<Label className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
					{label}
				</Label>
				{labelAccessory}
			</div>

			<div className="flex items-center gap-2">
				<div className={["relative w-full", icon ? "pr-0" : ""].join(" ")}>
					<Input
						type={type}
						value={value}
						onChange={handleChange}
						placeholder={placeholder}
						min={min}
						max={max}
						step={step}
						inputMode={inputMode}
						className={[
							"ios-input w-full",
							type === "number" ? "no-number-spin" : "",
							icon ? "pr-10" : "",
						].join(" ")}
					/>
					{icon ? (
						<div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
							{icon}
						</div>
					) : null}
				</div>

				{select ? (
					<div className="ios-select-wrap">
						<Select
							value={select.value}
							onChange={select.onChange}
							className={select.className ?? "ios-select w-[82px]"}
						>
							{select.options.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Select>
						<div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-500">
							<SelectChevronIcon />
						</div>
					</div>
				) : null}
			</div>

			{canShowSlider ? (
				<input
					type="range"
					value={sliderValue}
					min={sliderMin}
					max={sliderMax}
					step={sliderStep}
					onChange={handleChange}
					className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-300 accent-ios-blue"
				/>
			) : null}

			{note ? (
				<div className="text-[12px] font-medium text-slate-600">{note}</div>
			) : null}
		</Field>
	);
}
