import { clampValue, toNumber } from "../utils/number";

function InputTable({ fields, inputs, setInputs }) {
	return (
		<div className="rounded-lg border border-slate-300">
			<div className="grid grid-cols-3 bg-yellow-200 p-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
				<span>Input</span>
				<span className="text-right">Value</span>
				<span className="text-right">Unit</span>
			</div>
			{fields.map((field) => (
				<label
					key={field.key}
					className="grid grid-cols-3 items-center gap-2 border-t border-slate-200 bg-yellow-100 px-2 py-2 text-sm"
				>
					<span className="font-medium">{field.label}</span>
					<input
						type="number"
						value={inputs[field.key]}
						min={field.min}
						max={field.max}
						step={field.step}
						onChange={(event) =>
							setInputs((prev) => ({
								...prev,
								[field.key]: clampValue(toNumber(event.target.value), field.min, field.max),
							}))
						}
						className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-right"
					/>
					<span className="text-right text-slate-600">{field.unit}</span>
				</label>
			))}
		</div>
	);
}

export default InputTable;
