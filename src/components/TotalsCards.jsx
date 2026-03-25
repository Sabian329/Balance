import { format } from "../utils/number";

function TotalsCards({ totals }) {
	return (
		<div>
			<div className="grid grid-cols-2 gap-3">
				<div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-100 to-white p-4 shadow-sm ring-1 ring-slate-900/5 sm:p-4">
					<p className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
						Mass
					</p>
					<p className="mt-1 text-xl font-bold tabular-nums tracking-tight text-slate-950">
						{format(totals.massKg, 1)}{" "}
						<span className="text-[15px] font-semibold text-slate-600">kg</span>
					</p>
					<p className="mt-1 text-[15px] font-medium tabular-nums text-slate-600">
						{format(totals.massLbs, 1)} lb
					</p>
				</div>
				<div className="rounded-2xl border border-blue-200/80 bg-gradient-to-b from-sky-100/90 to-white p-4 shadow-sm ring-1 ring-ios-blue/25 sm:p-4">
					<p className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
						Center of gravity
					</p>
					<p className="mt-1 text-xl font-bold tabular-nums tracking-tight text-slate-950">
						{format(totals.cgM, 3)}{" "}
						<span className="text-[15px] font-semibold text-slate-600">m</span>
					</p>
					<p className="mt-1 text-[15px] font-medium tabular-nums text-slate-600">
						{format(totals.cgIn, 2)} in
					</p>
				</div>
			</div>
		</div>
	);
}

export default TotalsCards;
