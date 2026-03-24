import { clampValue, toNumber } from "../utils/number";

function InputTable({ fields, inputs, setInputs }) {
	const updateFieldValue = (field, rawValue) => {
		setInputs((prev) => ({
			...prev,
			[field.key]: clampValue(toNumber(rawValue), field.min, field.max),
		}));
	};

	return (
		<div className="rounded-lg border border-slate-300">
			<div className="grid grid-cols-3 bg-yellow-200 p-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
				<span>Input</span>
				<span className="text-right">Value</span>
				<span className="text-right">Unit</span>
			</div>
			{fields.map((field) => (
				<div
					key={field.key}
					className="border-t border-slate-200 bg-yellow-100 px-2 py-2 text-sm"
				>
					<div className="grid grid-cols-3 items-center gap-2">
						<span className="font-medium">{field.label}</span>
						<input
							type="number"
							value={inputs[field.key]}
							min={field.min}
							max={field.max}
							step={field.step}
							onChange={(event) => updateFieldValue(field, event.target.value)}
							className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-right"
						/>
						<span className="text-right text-slate-600">{field.unit}</span>
					</div>

					{field.key === "fuelL" ? (
						<div className="mt-2 flex flex-wrap items-center justify-center gap-1  ">
							{[1, 2, 3, 4].map((part) => (
								<button
									key={part}
									type="button"
									onClick={() =>
										updateFieldValue(field, (field.max / 4) * part)
									}
									className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium hover:bg-slate-50"
								>
									{part}/4
								</button>
							))}
						</div>
					) : null}

					<div className="mt-2">
						<input
							type="range"
							min={field.min}
							max={field.max}
							step={field.step}
							value={inputs[field.key]}
							onChange={(event) => updateFieldValue(field, event.target.value)}
							className="w-full accent-slate-800"
						/>
					</div>
				</div>
			))}
		</div>
	);
}

export default InputTable;
