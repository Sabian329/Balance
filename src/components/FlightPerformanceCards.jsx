import { format, toNumber } from "../utils/number";

function FlightPerformanceCards({ totals, inputs }) {
	const MAX_MASS_KG = 1050;

	const fuelLiters = toNumber(inputs?.fuelL);
	const lowFuelBurnLph = 35;
	const highFuelBurnLph = 40;

	const lowSpeedKmh = 150;
	const highSpeedKmh = 200;

	const tLowH = fuelLiters > 0 ? fuelLiters / lowFuelBurnLph : 0;
	const tHighH = fuelLiters > 0 ? fuelLiters / highFuelBurnLph : 0;

	const rLowKm = fuelLiters > 0 ? tLowH * lowSpeedKmh : 0;
	const rHighKm = fuelLiters > 0 ? tHighH * highSpeedKmh : 0;

	const reserveKg = MAX_MASS_KG - totals.massKg;

	return (
		<section className=" rounded-[20px] bg-white p-4 shadow-card ring-1 ring-slate-900/10 sm:p-5">
			<h3 className="mb-2 px-0.5 text-[13px] font-semibold uppercase tracking-wide text-slate-600">
				Flight performance
			</h3>

			<div className="grid grid-cols-2 gap-3">
				{/* Range */}
				<div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-100 to-white p-4 shadow-sm ring-1 ring-slate-900/5 sm:p-4">
					<p className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
						Range (km)
					</p>

					{fuelLiters <= 0 ? (
						<p className="mt-2 text-[15px] font-medium text-slate-600">-</p>
					) : (
						<div className="mt-2 space-y-2">
							<div className="text-[15px] font-bold tabular-nums text-slate-950">
								{format(rLowKm, 0)} - {format(rHighKm, 0)}{" "}
								<span className="text-[12px] font-semibold text-slate-600">
									km
								</span>
							</div>
							<div className="text-[12px] font-medium text-slate-600">
								65% (2350 rpm): 35 l/h · 150km/h
							</div>
							<div className="text-[12px] font-medium text-slate-600">
								75% (2450 rpm): 40 l/h · 200km/h
							</div>
						</div>
					)}
				</div>

				{/* Flight time */}
				<div className="rounded-2xl border border-blue-200/80 bg-gradient-to-b from-sky-100/90 to-white p-4 shadow-sm ring-1 ring-ios-blue/25 sm:p-4">
					<p className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
						Flight time
					</p>

					{fuelLiters <= 0 ? (
						<p className="mt-2 text-[15px] font-medium text-slate-600">-</p>
					) : (
						<div className="mt-2 space-y-2">
							<div className="text-[15px] font-bold tabular-nums text-slate-950">
								{format(tHighH, 1)}h - {format(tLowH, 1)}h
								<span className="text-[12px] font-semibold text-slate-600">
									(up to)
								</span>
							</div>
							<div className="text-[12px] font-medium text-slate-600">
								65% (2350 rpm): {format(tLowH, 1)}h{" "}
								{Math.round((tLowH - Math.floor(tLowH)) * 60)}m · 35 l/h
							</div>
							<div className="text-[12px] font-medium text-slate-600">
								75% (2450 rpm): {format(tHighH, 1)}h{" "}
								{Math.round((tHighH - Math.floor(tHighH)) * 60)}m · 40 l/h
							</div>
						</div>
					)}
				</div>

				{/* Wind correction */}

				{/* Weight reserve */}
				<div className="col-span-2 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-100 to-white p-4 shadow-sm ring-1 ring-slate-900/5 sm:p-4">
					<p className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
						Weight reserve (max {MAX_MASS_KG} kg)
					</p>

					<div className="mt-2 space-y-2">
						{reserveKg >= 0 ? (
							<div className="text-[15px] font-bold tabular-nums text-slate-950">
								{format(reserveKg, 0)}{" "}
								<span className="text-[12px] font-semibold text-slate-600">
									kg
								</span>
							</div>
						) : (
							<div className="text-[15px] font-bold tabular-nums text-rose-700">
								Over max by {format(Math.abs(reserveKg), 0)}{" "}
								<span className="text-[12px] font-semibold text-slate-600">
									kg
								</span>
							</div>
						)}

						<div className="text-[12px] font-medium text-slate-600">
							Current mass: {format(totals.massKg, 1)} kg
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default FlightPerformanceCards;
