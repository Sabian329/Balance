import { clampValue, toNumber } from "../utils/number";

function InputTable({ fields, inputs, setInputs }) {
	const updateFieldValue = (field, rawValue) => {
		setInputs((prev) => ({
			...prev,
			[field.key]: clampValue(toNumber(rawValue), field.min, field.max),
		}));
	};

	return (
		<div>
			<h3 className="mb-2 px-0.5 text-[13px] font-semibold uppercase tracking-wide text-slate-600">
				Inputs
			</h3>
			<div className="divide-y divide-slate-200 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-900/10">
				<div className="grid grid-cols-[1fr_auto_auto] gap-2 bg-slate-100 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-700 sm:px-4">
					<span>Item</span>
					<span className="text-right tabular-nums">Value</span>
					<span className="text-right">Unit</span>
				</div>
				{fields.map((field) => (
					<div
						key={field.key}
						className="bg-white px-3 py-3 transition-colors sm:px-4 sm:py-3.5"
					>
						<div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 sm:gap-3">
							<span className="min-w-0 text-[15px] font-semibold text-slate-900">{field.label}</span>
							<input
								type="number"
								inputMode="decimal"
								value={inputs[field.key]}
								min={field.min}
								max={field.max}
								step={field.step}
								onChange={(event) => updateFieldValue(field, event.target.value)}
								className="ios-input w-[5.5rem] text-right tabular-nums sm:w-28"
							/>
							<span className="w-12 shrink-0 text-right text-[13px] font-medium text-slate-600 sm:w-14">
								{field.unit}
							</span>
						</div>

						{field.key === "fuelL" ? (
							<div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
								{[1, 2, 3, 4].map((part) => (
									<button
										key={part}
										type="button"
										onClick={() => updateFieldValue(field, (field.max / 4) * part)}
										className="rounded-full border border-slate-300/80 bg-slate-200 px-3 py-1.5 text-[12px] font-semibold text-slate-800 transition active:scale-95 hover:bg-slate-300/90"
									>
										{part}/4
									</button>
								))}
							</div>
						) : null}

						<div className="mt-3 px-0.5">
							<input
								type="range"
								min={field.min}
								max={field.max}
								step={field.step}
								value={inputs[field.key]}
								onChange={(event) => updateFieldValue(field, event.target.value)}
								className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-300 accent-ios-blue"
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default InputTable;
