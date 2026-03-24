import { format } from "../utils/number";

function CalculationTable({ rows, totals }) {
	return (
		<div className="rounded-lg border border-slate-300">
			<div className="grid grid-cols-4 bg-slate-200 p-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
				<span>Item</span>
				<span className="text-right">Mass (kg)</span>
				<span className="text-right">Arm (m)</span>
				<span className="text-right">Moment (kgm)</span>
			</div>
			{rows.map((row) => (
				<div key={row.label} className="grid grid-cols-4 border-t border-slate-200 px-2 py-1.5 text-sm">
					<span>{row.label}</span>
					<span className="text-right">{format(row.massKg, 1)}</span>
					<span className="text-right">{row.armM === null ? "-" : format(row.armM, 3)}</span>
					<span className="text-right">{format(row.momentKgm, 3)}</span>
				</div>
			))}
			<div className="grid grid-cols-4 border-t-2 border-slate-400 bg-yellow-200 px-2 py-2 text-sm font-semibold">
				<span>SUM</span>
				<span className="text-right">{format(totals.massKg, 1)}</span>
				<span className="text-right">-</span>
				<span className="text-right">{format(totals.momentKgm, 3)}</span>
			</div>
		</div>
	);
}

export default CalculationTable;
