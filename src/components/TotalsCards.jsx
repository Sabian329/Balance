import { format } from "../utils/number";

function TotalsCards({ totals }) {
	return (
		<div className="grid grid-cols-2 gap-2 text-sm">
			<div className="rounded-lg border border-slate-300 bg-emerald-50 p-3">
				<p className="text-slate-600">Mass</p>
				<p className="font-semibold">{format(totals.massKg, 3)} kg</p>
				<p className="text-slate-600">{format(totals.massLbs, 3)} lbs</p>
			</div>
			<div className="rounded-lg border border-slate-300 bg-violet-50 p-3">
				<p className="text-slate-600">CG</p>
				<p className="font-semibold">{format(totals.cgM, 3)} m</p>
				<p className="text-slate-600">{format(totals.cgIn, 3)} inch</p>
			</div>
		</div>
	);
}

export default TotalsCards;
