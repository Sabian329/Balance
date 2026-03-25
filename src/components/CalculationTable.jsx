import { format } from "../utils/number";

function CalculationTable({ rows, totals }) {
	return (
		<div>
			<div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-900/10">
				<div className="grid grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))] gap-x-1 border-b border-slate-300 bg-slate-100 px-2 py-2.5 text-[10px] font-semibold uppercase leading-tight tracking-wide text-slate-700 sm:gap-x-2 sm:px-3 sm:text-[11px]">
					<span className="pl-1">Item</span>
					<span className="text-right tabular-nums">kg</span>
					<span className="text-right tabular-nums">Arm</span>
					<span className="pr-1 text-right tabular-nums">Moment</span>
				</div>
				<div className="divide-y divide-slate-200">
					{rows.map((row) => (
						<div
							key={row.label}
							className="grid grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))] gap-x-1 px-2 py-2.5 text-[13px] sm:gap-x-2 sm:px-3 sm:py-2.5 sm:text-[14px]"
						>
							<span className="truncate font-medium text-slate-900">
								{row.label}
							</span>
							<span className="text-right tabular-nums font-medium text-slate-900">
								{format(row.massKg, 1)}
							</span>
							<span className="text-right tabular-nums font-medium text-slate-800">
								{row.armM === null ? "–" : format(row.armM, 3)}
							</span>
							<span className="text-right tabular-nums font-medium text-slate-900">
								{format(row.momentKgm, 3)}
							</span>
						</div>
					))}
				</div>
				<div
					className="grid grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))] gap-x-1 border-t-2 border-orange-200 bg-gradient-to-b from-orange-100 to-white px-2 py-3 text-[13px] font-bold sm:gap-x-2 sm:px-3 sm:text-[14px]"
					title="CG in total row = total moment / total mass"
				>
					<span className="pl-1 text-slate-900">Total</span>
					<span className="text-right tabular-nums text-slate-900">
						{format(totals.massKg, 1)}
					</span>
					<span className="text-right tabular-nums text-slate-900">
						{totals.massKg > 0 ? format(totals.cgM, 3) : "–"}
					</span>
					<span className="pr-1 text-right tabular-nums text-slate-900">
						{format(totals.momentKgm, 3)}
					</span>
				</div>
			</div>
		</div>
	);
}

export default CalculationTable;
