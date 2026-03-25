import { useMemo, useState } from "react";
import { format, toNumber } from "../utils/number";

function WindCorrectionCards({ inputs }) {
	const fuelLiters = toNumber(inputs?.fuelL);

	const lowFuelBurnLph = 35; // 65% @ 2350 rpm
	const highFuelBurnLph = 40; // 75% @ 2450 rpm

	const lowSpeedKmh = 150; // lower range
	const highSpeedKmh = 200; // higher range

	// speedRegime:
	// - "low" => 65%
	// - "high" => 75%
	const [speedRegime, setSpeedRegime] = useState("low");

	// windFromDeg: direction FROM which the wind is blowing (0..360).
	// aircraftHeadingDeg: aircraft heading/track direction (0..360).
	const [windFromDeg, setWindFromDeg] = useState(0);
	const [aircraftHeadingDeg, setAircraftHeadingDeg] = useState(0);

	// Wind speed
	const [windSpeedKt, setWindSpeedKt] = useState(0);

	const knotsToKmh = 1.852;

	const selected = useMemo(() => {
		const tasKmh = speedRegime === "low" ? lowSpeedKmh : highSpeedKmh;
		const burnLph = speedRegime === "low" ? lowFuelBurnLph : highFuelBurnLph;
		const timeH = fuelLiters > 0 ? fuelLiters / burnLph : 0;

		// Relative wind angle w.r.t. aircraft nose:
		// 0 deg => headwind, 180 deg => tailwind.
		const relativeWindDeg = windFromDeg - aircraftHeadingDeg;
		const windAngleRad = (relativeWindDeg * Math.PI) / 180;

		// Positive windAlongKmh reduces GS (headwind component).
		const windAlongKmh = windSpeedKt * knotsToKmh * Math.cos(windAngleRad);
		const groundSpeedKmh = tasKmh - windAlongKmh;
		const correctedRangeKm =
			timeH > 0 ? Math.max(0, groundSpeedKmh) * timeH : 0;

		return {
			tasKmh,
			burnLph,
			timeH,
			windAlongKmh,
			relativeWindDeg,
			groundSpeedKmh,
			correctedRangeKm,
		};
	}, [speedRegime, fuelLiters, windFromDeg, aircraftHeadingDeg, windSpeedKt]);

	return (
		<section className="mt-6 rounded-[20px] bg-white p-4 shadow-card ring-1 ring-slate-900/10 sm:p-5">
			<h3 className="mb-2 px-0.5 text-[13px] font-semibold uppercase tracking-wide text-slate-600">
				Flight performance
			</h3>
			<div className="col-span-2 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-100 to-white p-4 shadow-sm ring-1 ring-slate-900/5 sm:p-4">
				<p className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
					Wind correction &amp; corrected range
				</p>

				<div className="mt-3 grid grid-cols-2 gap-3">
					<div className="space-y-1">
						<div className="text-[12px] font-medium text-slate-600">
							Speed regime
						</div>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => setSpeedRegime("low")}
								className={`rounded-xl border px-3 py-2 text-[13px] font-semibold ${
									speedRegime === "low"
										? "border-ios-blue bg-ios-blue text-white"
										: "border-slate-200 bg-white text-slate-700"
								}`}
							>
								65%
							</button>
							<button
								type="button"
								onClick={() => setSpeedRegime("high")}
								className={`rounded-xl border px-3 py-2 text-[13px] font-semibold ${
									speedRegime === "high"
										? "border-ios-blue bg-ios-blue text-white"
										: "border-slate-200 bg-white text-slate-700"
								}`}
							>
								75%
							</button>
						</div>
						<div className="text-[12px] font-medium text-slate-600">
							Used: {speedRegime === "low" ? "150 km/h" : "200 km/h"} TAS
						</div>
					</div>

					<div className="space-y-1">
						<div className="text-[12px] font-medium text-slate-600">
							Aircraft heading (deg)
						</div>
						<input
							type="number"
							min={0}
							max={360}
							step={1}
							value={aircraftHeadingDeg}
							onChange={(e) => setAircraftHeadingDeg(toNumber(e.target.value))}
							className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-900 shadow-sm outline-none"
						/>
						<div className="text-[12px] font-medium text-slate-600">
							0..360 degrees
						</div>
					</div>

					<div className="space-y-1">
						<div className="text-[12px] font-medium text-slate-600">
							Wind from (deg)
						</div>
						<input
							type="number"
							min={0}
							max={360}
							step={1}
							value={windFromDeg}
							onChange={(e) => setWindFromDeg(toNumber(e.target.value))}
							className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-900 shadow-sm outline-none"
						/>
						<div className="text-[12px] font-medium text-slate-600">
							Relative: 0 = headwind, 180 = tailwind
						</div>
					</div>

					<div className="space-y-1">
						<div className="text-[12px] font-medium text-slate-600">
							Wind speed (kt)
						</div>
						<input
							type="number"
							min={0}
							max={100}
							step={0.5}
							value={windSpeedKt}
							onChange={(e) => setWindSpeedKt(toNumber(e.target.value))}
							className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-900 shadow-sm outline-none"
						/>
						<div className="text-[12px] font-medium text-slate-600">
							{format(selected.windAlongKmh, 1)} km/h along track
						</div>
					</div>

					<div className="space-y-1">
						<div className="text-[12px] font-medium text-slate-600">
							Results
						</div>
						<div className="text-[13px] font-semibold text-slate-900">
							GS: {format(Math.max(0, selected.groundSpeedKmh), 0)} km/h
						</div>
						<div className="text-[12px] font-medium text-slate-600">
							Rel wind angle: {format(selected.relativeWindDeg, 0)} deg
						</div>
						<div className="text-[12px] font-medium text-slate-600">
							Range with wind: {format(selected.correctedRangeKm, 0)} km
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default WindCorrectionCards;
