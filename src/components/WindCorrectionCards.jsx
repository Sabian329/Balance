import { useMemo, useState } from "react";
import { format, toNumber } from "../utils/number";
import InputSection from "./wind/InputSection";
import WindFormField from "./wind/WindFormField";

function normalizeDeg(deg) {
	let d = deg % 360;
	if (d < 0) d += 360;
	return d;
}

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

function degToRad(deg) {
	return (deg * Math.PI) / 180;
}

function radToDeg(rad) {
	return (rad * 180) / Math.PI;
}

function formatTimeHours(hours) {
	if (!Number.isFinite(hours) || hours < 0) return "-";
	const totalMinutes = Math.round(hours * 60);
	const hh = Math.floor(totalMinutes / 60);
	const mm = totalMinutes % 60;
	if (hh <= 0) return `${mm} min`;
	return `${hh}h ${mm}m`;
}

function DegArrowIcon({ angleDeg }) {
	const rot = Number.isFinite(angleDeg) ? angleDeg : 0;
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			style={{ transform: `rotate(${rot}deg)`, transformOrigin: "8px 8px" }}
		>
			<path
				d="M8 2 L13 7 H10 V14 H6 V7 H3 Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function GripIcon() {
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
			<circle cx="4" cy="4" r="1.1" fill="currentColor" />
			<circle cx="7" cy="4" r="1.1" fill="currentColor" />
			<circle cx="10" cy="4" r="1.1" fill="currentColor" />
			<circle cx="4" cy="7" r="1.1" fill="currentColor" />
			<circle cx="7" cy="7" r="1.1" fill="currentColor" />
			<circle cx="10" cy="7" r="1.1" fill="currentColor" />
			<circle cx="4" cy="10" r="1.1" fill="currentColor" />
			<circle cx="7" cy="10" r="1.1" fill="currentColor" />
			<circle cx="10" cy="10" r="1.1" fill="currentColor" />
		</svg>
	);
}

function CourseCorrectionDiagram({
	courseTrue,
	headingTrue,
	windFromTrue,
	wcaDeg,
}) {
	const cx = 90;
	const cy = 90;
	const arrowLen = 58;

	const toPoint = (angleDeg, length) => {
		const rad = degToRad(angleDeg - 90);
		return {
			x: cx + Math.cos(rad) * length,
			y: cy + Math.sin(rad) * length,
		};
	};

	const courseP = toPoint(courseTrue, arrowLen);
	const headingP = toPoint(headingTrue, arrowLen);
	const windToP = toPoint(normalizeDeg(windFromTrue + 180), arrowLen - 4);
	const arrowHeadPoints = (from, to, size = 7) => {
		const dx = to.x - from.x;
		const dy = to.y - from.y;
		const len = Math.hypot(dx, dy) || 1;
		const ux = dx / len;
		const uy = dy / len;

		const bx = to.x - ux * size;
		const by = to.y - uy * size;
		const px = -uy;
		const py = ux;
		const halfWidth = size * 0.52;

		return `${to.x},${to.y} ${bx + px * halfWidth},${by + py * halfWidth} ${bx - px * halfWidth},${by - py * halfWidth}`;
	};

	return (
		<div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3 shadow-sm ring-1 ring-slate-900/5">
			<div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
				Course diagram
			</div>
			<svg
				width="180"
				height="180"
				viewBox="0 0 180 180"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				focusable="false"
				className="mx-auto"
			>
				<circle cx={cx} cy={cy} r="70" stroke="#cbd5e1" strokeWidth="1.5" />
				<circle cx={cx} cy={cy} r="48" stroke="#e2e8f0" strokeWidth="1" />
				<text
					x="90"
					y="18"
					textAnchor="middle"
					className="fill-slate-500 text-[10px]"
				>
					N
				</text>
				<text
					x="90"
					y="170"
					textAnchor="middle"
					className="fill-slate-500 text-[10px]"
				>
					S
				</text>
				<text
					x="12"
					y="94"
					textAnchor="middle"
					className="fill-slate-500 text-[10px]"
				>
					W
				</text>
				<text
					x="168"
					y="94"
					textAnchor="middle"
					className="fill-slate-500 text-[10px]"
				>
					E
				</text>

				<line
					x1={cx}
					y1={cy}
					x2={courseP.x}
					y2={courseP.y}
					stroke="#3b82f6"
					strokeWidth="2.5"
				/>
				<polygon
					points={arrowHeadPoints({ x: cx, y: cy }, courseP)}
					fill="#3b82f6"
				/>

				<line
					x1={cx}
					y1={cy}
					x2={headingP.x}
					y2={headingP.y}
					stroke="#16a34a"
					strokeWidth="2.5"
				/>
				<polygon
					points={arrowHeadPoints({ x: cx, y: cy }, headingP)}
					fill="#16a34a"
				/>

				<line
					x1={cx}
					y1={cy}
					x2={windToP.x}
					y2={windToP.y}
					stroke="#f97316"
					strokeWidth="2"
					strokeDasharray="4 3"
				/>
				<polygon
					points={arrowHeadPoints({ x: cx, y: cy }, windToP, 6.5)}
					fill="#f97316"
				/>
			</svg>
			<div className="mt-2 space-y-1.5 text-[11px] font-medium text-slate-600">
				<div className="flex items-center justify-between gap-3">
					<span className="inline-flex items-center gap-1">
						<span className="h-2 w-2 rounded-full bg-blue-500" /> Track
					</span>
					<span>{format(courseTrue, 0)}°T</span>
				</div>
				<div className="flex items-center justify-between gap-3">
					<span className="inline-flex items-center gap-1">
						<span className="h-2 w-2 rounded-full bg-green-600" /> Heading
					</span>
					<span>{format(headingTrue, 0)}°T</span>
				</div>
				<div className="flex items-center justify-between gap-3">
					<span className="inline-flex items-center gap-1">
						<span className="h-2 w-2 rounded-full bg-orange-500" /> Wind
					</span>
					<span>{format(windFromTrue, 0)}° from</span>
				</div>
				<div className="pt-1 text-center text-[11px] font-semibold text-slate-800">
					WCA {format(Math.abs(wcaDeg), 1)}°
				</div>
			</div>
		</div>
	);
}

// Conversion constants (stable across renders).
const KNOTS_TO_KMH = 1.852;
const KM_TO_NM = 1 / 1.852;
const MI_TO_NM = 1.609344 / 1.852; // statute miles -> NM

export default function WindCorrectionCards({ inputs }) {
	// East declination is positive: True = Magnetic + declination
	const [declinationAbsDeg, setDeclinationAbsDeg] = useState("");
	const [declinationSide, setDeclinationSide] = useState("E"); // "E" | "W"

	// Wind: "from" direction in TRUE degrees + speed in KT
	const [windFromDeg, setWindFromDeg] = useState("");
	const [windSpeedKt, setWindSpeedKt] = useState("");

	// Navigation course (true, from map)
	const [courseTrueDeg, setCourseTrueDeg] = useState("");

	// TAS input
	const [speedUnit, setSpeedUnit] = useState("kt"); // "kt" | "kmh"
	const [tasValue, setTasValue] = useState("");

	// Distance of the leg
	const [distanceUnit, setDistanceUnit] = useState("nm"); // "km" | "nm" | "mi"
	const [distanceValue, setDistanceValue] = useState("");

	const computed = useMemo(() => {
		const decl =
			declinationSide === "E"
				? toNumber(declinationAbsDeg)
				: -toNumber(declinationAbsDeg);
		const windFromTrue = normalizeDeg(toNumber(windFromDeg));
		const courseTrue = normalizeDeg(toNumber(courseTrueDeg));
		const courseMag = normalizeDeg(courseTrue - decl);

		const tasKt =
			speedUnit === "kt"
				? Math.max(0, toNumber(tasValue))
				: Math.max(0, toNumber(tasValue) / KNOTS_TO_KMH);

		const windKt = Math.max(0, toNumber(windSpeedKt));
		const distanceNm = (() => {
			const v = Math.max(0, toNumber(distanceValue));
			if (distanceUnit === "nm") return v;
			if (distanceUnit === "km") return v * KM_TO_NM;
			// miles
			return v * MI_TO_NM;
		})();

		// Relative wind angle to track:
		// 0 => headwind, 180 => tailwind.
		const relativeWindDeg = windFromTrue - courseTrue;
		const theta = degToRad(relativeWindDeg);

		// Components relative to track:
		// headwindKt positive reduces GS
		// crosswindKt sign indicates wind-from side
		const headwindKt = windKt * Math.cos(theta);
		const crosswindKt = windKt * Math.sin(theta);

		// Crosswind correction angle (WCA)
		const crosswindRatio = tasKt > 0 ? crosswindKt / tasKt : 0;
		const canCompute = tasKt > 0 && Math.abs(crosswindRatio) <= 1;
		const wcaDeg = canCompute
			? radToDeg(Math.asin(clamp(crosswindRatio, -1, 1)))
			: 0;

		// Required heading so ground track stays on the desired course.
		// Depending on sign convention, WCA sign adjusts the heading direction.
		const headingTrue = normalizeDeg(courseTrue + wcaDeg);
		const headingMag = normalizeDeg(headingTrue - decl);

		// GS = TAS*cos(WCA) - headwind
		const groundSpeedKt = canCompute
			? tasKt * Math.cos(degToRad(wcaDeg)) - headwindKt
			: 0;

		const timeH =
			groundSpeedKt > 0 && Number.isFinite(groundSpeedKt)
				? distanceNm / groundSpeedKt
				: Infinity;

		return {
			decl,
			windFromTrue,
			courseMag,
			courseTrue,
			tasKt,
			tasKmh: tasKt * KNOTS_TO_KMH,
			windKt,
			distanceNm,
			headwindKt,
			crosswindKt,
			canCompute,
			wcaDeg,
			headingTrue,
			headingMag,
			groundSpeedKt,
			groundSpeedKmh: groundSpeedKt * KNOTS_TO_KMH,
			timeH,
		};
	}, [
		declinationAbsDeg,
		declinationSide,
		windFromDeg,
		windSpeedKt,
		courseTrueDeg,
		speedUnit,
		tasValue,
		distanceUnit,
		distanceValue,
	]);

	const wcaDirection = computed.wcaDeg >= 0 ? "Right" : "Left";
	const crosswindSide = computed.crosswindKt >= 0 ? "from left" : "from right";
	const headwindLabel = computed.headwindKt >= 0 ? "headwind" : "tailwind";

	const [planLegs, setPlanLegs] = useState([]);

	const [dragFromLegId, setDragFromLegId] = useState(null);
	const [dragOverLegId, setDragOverLegId] = useState(null);

	const removeLeg = (id) => {
		setPlanLegs((prev) => prev.filter((leg) => leg.id !== id));
	};

	const reorderLegs = (fromId, toId) => {
		if (!fromId || !toId || fromId === toId) return;
		setPlanLegs((prev) => {
			const fromIndex = prev.findIndex((l) => l.id === fromId);
			const toIndex = prev.findIndex((l) => l.id === toId);
			if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return prev;

			const next = [...prev];
			const [moved] = next.splice(fromIndex, 1);
			next.splice(toIndex, 0, moved);
			return next;
		});
	};

	const isReadyForLeg =
		courseTrueDeg !== "" &&
		windFromDeg !== "" &&
		windSpeedKt !== "" &&
		tasValue !== "" &&
		distanceValue !== "";

	const canAddLeg =
		isReadyForLeg &&
		computed.canCompute &&
		computed.groundSpeedKt > 0 &&
		Number.isFinite(computed.timeH);

	const planTotals = useMemo(() => {
		const totalDistanceNm = planLegs.reduce(
			(acc, leg) => acc + (Number(leg.distanceNm) || 0),
			0,
		);
		const totalTimeH = planLegs.reduce(
			(acc, leg) => acc + (Number.isFinite(leg.timeH) ? leg.timeH : 0),
			0,
		);
		const avgGroundSpeedKt = totalTimeH > 0 ? totalDistanceNm / totalTimeH : 0;

		return { totalDistanceNm, totalTimeH, avgGroundSpeedKt };
	}, [planLegs]);

	// Fuel model (same data as in FlightPerformance section):
	// 65% (~2350 rpm): 35 l/h @ 150 km/h
	// 75% (~2450 rpm): 40 l/h @ 200 km/h
	const availableFuelL = Math.max(0, toNumber(inputs?.fuelL));
	const fuelPlan = useMemo(() => {
		const burnLowLph = 35;
		const burnHighLph = 40;
		const speedLowKmh = 150;
		const speedHighKmh = 200;

		const estimateBurnLph = (tasKt) => {
			const tasKmh = (Number(tasKt) || 0) * KNOTS_TO_KMH;
			if (tasKmh <= 0) return 0;
			if (tasKmh <= speedLowKmh) return burnLowLph;
			if (tasKmh >= speedHighKmh) return burnHighLph;
			const t = (tasKmh - speedLowKmh) / (speedHighKmh - speedLowKmh);
			return burnLowLph + t * (burnHighLph - burnLowLph);
		};

		const legsWithFuel = planLegs.map((leg) => {
			const burnLph = estimateBurnLph(leg.tasKt ?? 0);
			const timeH = Number.isFinite(leg.timeH) ? leg.timeH : 0;
			return {
				...leg,
				fuelBurnLph: burnLph,
				fuelUsedL: burnLph * timeH,
			};
		});

		const totalFuelUsedL = legsWithFuel.reduce(
			(acc, leg) => acc + (Number(leg.fuelUsedL) || 0),
			0,
		);
		const remainingFuelL = availableFuelL - totalFuelUsedL;
		const canFlyRoute =
			planLegs.length > 0 && totalFuelUsedL > 0 ? remainingFuelL >= 0 : false;

		return { legsWithFuel, totalFuelUsedL, remainingFuelL, canFlyRoute };
	}, [planLegs, availableFuelL]);

	const addCurrentLeg = () => {
		if (!canAddLeg) return;

		const newId =
			typeof crypto !== "undefined" && crypto.randomUUID
				? crypto.randomUUID()
				: `${Date.now()}-${Math.random().toString(16).slice(2)}`;

		setPlanLegs((prev) => [
			...prev,
			{
				id: newId,
				createdAt: Date.now(),
				// Keep original user inputs (as entered).
				inputs: {
					declinationAbsDeg:
						declinationAbsDeg === "" ? "" : Number(declinationAbsDeg),
					declinationSide,
					courseTrueDeg: Number(courseTrueDeg),
					windFromDeg: Number(windFromDeg),
					windSpeedKt: Number(windSpeedKt),
					speedUnit,
					tasValue: Number(tasValue),
					distanceUnit,
					distanceValue: Number(distanceValue),
				},
				// Keep computed outputs (for table + sums).
				// Note: "kt" == "NM/h".
				distanceNm: computed.distanceNm,
				groundSpeedKt: computed.groundSpeedKt,
				timeH: computed.timeH,
				tasKt: computed.tasKt,
				wcaDeg: computed.wcaDeg,
				headingTrue: computed.headingTrue,
				headingMag: computed.headingMag,
				courseMag: computed.courseMag,
				headwindKt: computed.headwindKt,
				crosswindKt: computed.crosswindKt,
			},
		]);
	};

	return (
		<section className="rounded-[20px] bg-white p-4 shadow-card ring-1 ring-slate-900/10 sm:p-5">
			<div className="border-b border-slate-300 pb-4">
				<h3 className="px-0.5 text-[13px] font-semibold uppercase tracking-wide text-slate-600">
					Flight navigation computer
				</h3>
			</div>
			<div className="grid grid-cols-2 gap-3 pt-4">
				<InputSection
					shade="green"
					className="flex justify-center items-center md:flex-row flex-col gap-3"
				>
					<WindFormField
						label="Magnetic declination (E/W)"
						value={declinationAbsDeg}
						onChange={(e) => setDeclinationAbsDeg(e.target.value)}
						placeholder="2.5"
						step={0.1}
						min={0}
						max={30}
						slider={{ min: 0, max: 30, step: 0.1 }}
						wrapperClassName="w-full"
						showSlider
						note={<>EPWR 6° E</>}
						select={{
							value: declinationSide,
							onChange: (e) => setDeclinationSide(e.target.value),
							options: [
								{ value: "E", label: "E" },
								{ value: "W", label: "W" },
							],
						}}
					/>
					<WindFormField
						label="TAS"
						value={tasValue}
						onChange={(e) => setTasValue(e.target.value)}
						placeholder="e.g. 80"
						step={1}
						min={0}
						max={500}
						slider={{ min: 0, max: 500, step: 1 }}
						wrapperClassName="w-full"
						select={{
							value: speedUnit,
							onChange: (e) => setSpeedUnit(e.target.value),
							options: [
								{ value: "kt", label: "kt" },
								{ value: "kmh", label: "km/h" },
							],
						}}
						note={
							<>
								TAS: {format(computed.tasKt, 0)} kt /{" "}
								{format(computed.tasKmh, 0)} km/h
							</>
						}
					/>
				</InputSection>

				<InputSection
					shade="sky"
					className="flex justify-center items-center md:flex-row flex-col gap-3"
				>
					<WindFormField
						label="Wind from (true, deg)"
						value={windFromDeg}
						onChange={(e) => setWindFromDeg(e.target.value)}
						placeholder="e.g. 180"
						step={1}
						min={0}
						max={359}
						slider={{ min: 0, max: 359, step: 1 }}
						wrapperClassName="w-full"
						icon={
							<DegArrowIcon
								angleDeg={windFromDeg === "" ? 0 : Number(windFromDeg) + 180}
							/>
						}
					/>
					<WindFormField
						label="Wind speed (kt)"
						value={windSpeedKt}
						onChange={(e) => setWindSpeedKt(e.target.value)}
						placeholder="e.g. 15"
						step={0.5}
						min={0}
						max={200}
						slider={{ min: 0, max: 200, step: 0.5 }}
						wrapperClassName="w-full"
					/>
				</InputSection>

				<InputSection
					shade="orange"
					className="flex justify-center items-center md:flex-row flex-col gap-3"
				>
					<WindFormField
						label="Navigation course (true, deg)"
						value={courseTrueDeg}
						onChange={(e) => setCourseTrueDeg(e.target.value)}
						placeholder="e.g. 45"
						step={1}
						min={0}
						max={359}
						slider={{ min: 0, max: 359, step: 1 }}
						wrapperClassName="w-full"
						icon={
							<DegArrowIcon
								angleDeg={courseTrueDeg === "" ? 0 : Number(courseTrueDeg)}
							/>
						}
						note={
							<div className="flex w-full gap-2">
								<div>Track true: {format(computed.courseTrue, 0)}°</div>
								<div>
									Computed magnetic course: {format(computed.courseMag, 0)}°
								</div>
							</div>
						}
					/>

					<WindFormField
						label="Distance"
						value={distanceValue}
						onChange={(e) => setDistanceValue(e.target.value)}
						placeholder="e.g. 24"
						step={1}
						min={0}
						max={5000}
						slider={{ min: 0, max: 5000, step: 1 }}
						wrapperClassName="w-full"
						select={{
							value: distanceUnit,
							onChange: (e) => setDistanceUnit(e.target.value),
							options: [
								{ value: "km", label: "km" },
								{ value: "nm", label: "NM" },
								{ value: "mi", label: "mi" },
							],
						}}
						note={<>Leg: {format(computed.distanceNm, 1)} NM</>}
					/>
				</InputSection>
				<div className="col-span-2 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_236px]">
					<section className="w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 shadow-sm ring-1 ring-slate-900/5">
						<div className="mb-3 flex items-center justify-between">
							<p className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
								Outputs
							</p>
						</div>

						<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
							<div className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 shadow-sm ring-1 ring-slate-900/5">
								<div className="space-y-1">
									<div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
										Heading correction (WCA)
									</div>
									<div className="text-[16px] font-semibold leading-none text-slate-900">
										{format(Math.abs(computed.wcaDeg), 1)}° {wcaDirection}
									</div>
									<div className="pt-1 text-[12px] font-medium text-slate-600">
										Heading true: {format(computed.headingTrue, 0)}°
									</div>
									<div className="text-[12px] font-medium text-slate-600">
										Heading mag: {format(computed.headingMag, 0)}°
									</div>
								</div>
							</div>

							<div className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 shadow-sm ring-1 ring-slate-900/5">
								<div className="space-y-1">
									<div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
										Ground speed (GS)
									</div>
									<div className="text-[16px] font-semibold leading-none text-slate-900">
										{format(Math.max(0, computed.groundSpeedKt), 0)} kt
									</div>
									<div className="pt-1 text-[12px] font-medium text-slate-600">
										= {format(Math.max(0, computed.groundSpeedKmh), 0)} km/h
									</div>
									<div className="text-[12px] font-medium text-slate-600">
										Time for leg: {formatTimeHours(computed.timeH)}
									</div>
								</div>
							</div>

							<div className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 shadow-sm ring-1 ring-slate-900/5">
								<div className="space-y-1">
									<div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
										Headwind / tailwind
									</div>
									<div className="text-[16px] font-semibold leading-none text-slate-900">
										{format(Math.abs(computed.headwindKt), 1)} kt{" "}
										<span className="text-[12px] font-semibold text-slate-600">
											({headwindLabel})
										</span>
									</div>
								</div>
							</div>

							<div className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 shadow-sm ring-1 ring-slate-900/5">
								<div className="space-y-1">
									<div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
										Crosswind
									</div>
									<div className="text-[16px] font-semibold leading-none text-slate-900">
										{format(Math.abs(computed.crosswindKt), 1)} kt{" "}
										<span className="text-[12px] font-semibold text-slate-600">
											({crosswindSide})
										</span>
									</div>
								</div>
							</div>
						</div>

						{!computed.canCompute ? (
							<div className="mt-3">
								<p className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-center font-medium text-rose-700">
									Crosswind component is larger than TAS. Holding the track is
									not possible with the given TAS.
								</p>
							</div>
						) : (
							<div className="mt-3">
								<p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-center font-medium text-emerald-700">
									Track can be maintained with current TAS and wind.
								</p>
							</div>
						)}
					</section>
					<section className="mx-auto w-full max-w-[236px] self-start lg:mx-0">
						<CourseCorrectionDiagram
							courseTrue={computed.courseTrue}
							headingTrue={computed.headingTrue}
							windFromTrue={computed.windFromTrue}
							wcaDeg={computed.wcaDeg}
						/>
					</section>
				</div>
				{/* Route plan */}
				<div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
					<div className="flex items-start justify-between gap-3">
						<div>
							<p className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
								Route plan (legs)
							</p>
							<p className="mt-1 text-[12px] font-medium text-slate-600">
								Add each leg to sum distance and time.
							</p>
						</div>

						<button
							type="button"
							onClick={addCurrentLeg}
							disabled={!canAddLeg}
							className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-ios-blue px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition active:scale-[0.98] hover:bg-[#0066d6] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue/50"
							aria-disabled={!canAddLeg}
						>
							<span className="mr-2 text-[16px] leading-none">+</span>
							Add leg
						</button>
					</div>

					{!canAddLeg && isReadyForLeg && !computed.canCompute ? (
						<p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] font-medium text-rose-700">
							Crosswind component is larger than TAS. Holding the track is not
							possible.
						</p>
					) : null}

					{!canAddLeg && !isReadyForLeg ? (
						<p className="mt-3 text-[12px] font-medium text-slate-600">
							Fill: navigation course, wind from, wind speed, TAS and leg
							distance.
						</p>
					) : null}

					{planLegs.length > 0 ? (
						<div className="mt-4">
							<div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
								<div className="flex flex-wrap items-center gap-x-6 gap-y-1">
									<div className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
										Total distance
									</div>
									<div className="text-[14px] font-bold tabular-nums text-slate-950">
										{format(planTotals.totalDistanceNm, 1)} NM
									</div>
									<div className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
										Total time
									</div>
									<div className="text-[14px] font-bold tabular-nums text-slate-950">
										{formatTimeHours(planTotals.totalTimeH)}
									</div>
								</div>
							</div>

							<div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
								<div className="flex flex-wrap items-center gap-x-6 gap-y-1">
									<div className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
										Fuel available
									</div>
									<div className="text-[14px] font-bold tabular-nums text-slate-950">
										{format(availableFuelL, 1)} L
									</div>
									<div className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
										Estimated used
									</div>
									<div className="text-[14px] font-bold tabular-nums text-slate-950">
										{format(fuelPlan.totalFuelUsedL, 1)} L
									</div>
									<div className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
										Remaining
									</div>
									<div
										className={[
											"text-[14px] font-bold tabular-nums",
											fuelPlan.remainingFuelL >= 0
												? "text-slate-950"
												: "text-rose-700",
										].join(" ")}
									>
										{format(fuelPlan.remainingFuelL, 1)} L
									</div>
								</div>

								{availableFuelL <= 0 ? (
									<p className="mt-2 text-[12px] font-medium text-slate-600">
										Set fuel in the main inputs (Fuel) to check if the route is
										possible.
									</p>
								) : fuelPlan.canFlyRoute ? (
									<p className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] font-medium text-emerald-800">
										Route is possible with current fuel (estimated).
									</p>
								) : (
									<p className="mt-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] font-medium text-rose-700">
										Not enough fuel for this route (estimated).
									</p>
								)}
							</div>

							{/* Mobile: cards */}
							<div className="mt-3 space-y-2 sm:hidden">
								{fuelPlan.legsWithFuel.map((leg, idx) => {
									const legWcaDir = leg.wcaDeg >= 0 ? "Right" : "Left";
									return (
										<div
											key={leg.id}
											className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3 shadow-sm ring-1 ring-slate-900/5"
										>
											<div className="flex items-start justify-between gap-3">
												<div>
													<div className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">
														Leg {idx + 1}
													</div>
													<div className="mt-1 text-[12px] font-semibold text-slate-700">
														{format(leg.distanceNm, 1)} NM ·{" "}
														{formatTimeHours(leg.timeH)}
													</div>
												</div>

												<button
													type="button"
													onClick={() => removeLeg(leg.id)}
													aria-label={`Remove leg ${idx + 1}`}
													className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[16px] font-bold text-slate-500 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
												>
													×
												</button>
											</div>

											<div className="mt-2 grid grid-cols-2 gap-2 text-[13px]">
												<div>
													<div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
														Course (T)
													</div>
													<div className="font-semibold text-slate-900">
														{format(leg.inputs.courseTrueDeg, 0)}°
													</div>
												</div>
												<div>
													<div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
														Wind from
													</div>
													<div className="font-semibold text-slate-900">
														{format(leg.inputs.windFromDeg, 0)}°
													</div>
												</div>
												<div>
													<div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
														GS
													</div>
													<div className="font-semibold text-slate-900">
														{format(leg.groundSpeedKt, 0)} kt
													</div>
												</div>
												<div>
													<div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
														WCA
													</div>
													<div className="font-semibold text-slate-900">
														{format(Math.abs(leg.wcaDeg), 1)}° {legWcaDir}
													</div>
												</div>
												<div className="col-span-2">
													<div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
														Fuel (est.)
													</div>
													<div className="font-semibold text-slate-900">
														{format(leg.fuelUsedL, 1)} L{" "}
														<span className="text-[12px] font-semibold text-slate-600">
															({format(leg.fuelBurnLph, 1)} L/h)
														</span>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{/* Desktop: table */}
							<div className="mt-3 hidden sm:block">
								<div className="overflow-x-auto lg:overflow-visible">
									<div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-900/10">
										<table className="w-full border-collapse table-fixed">
											<thead>
												<tr className="bg-slate-100 text-[10px] font-semibold uppercase leading-tight tracking-wide text-slate-700 sm:text-[11px]">
													<th className="w-[56px] pl-1 py-2.5 text-left">
														Leg
													</th>
													<th className="w-[92px] py-2.5 text-right pr-1">
														Course (true)
													</th>
													<th className="w-[92px] py-2.5 text-right pr-1">
														Wind from
													</th>
													<th className="w-[116px] py-2.5 text-right pr-1">
														Distance
													</th>
													<th className="w-[84px] py-2.5 text-right pr-1">
														GS
													</th>
													<th className="w-[96px] py-2.5 text-right pr-1">
														Time
													</th>
													<th className="w-[108px] py-2.5 text-right pr-1">
														WCA
													</th>
													<th className="w-[164px] py-2.5 text-right pr-1">
														Fuel (est.)
													</th>
													<th className="w-[44px] pr-1 py-2.5 text-right">
														Del
													</th>
												</tr>
											</thead>

											<tbody>
												{fuelPlan.legsWithFuel.map((leg, idx) => {
													const legWcaDir = leg.wcaDeg >= 0 ? "Right" : "Left";
													const isOver = dragOverLegId === leg.id;
													const isDragging = dragFromLegId === leg.id;

													return (
														<tr
															key={leg.id}
															onDragOver={(e) => {
																e.preventDefault();
																setDragOverLegId(leg.id);
															}}
															onDrop={(e) => {
																e.preventDefault();
																const fromId =
																	e.dataTransfer.getData("text/plain") ||
																	dragFromLegId;
																reorderLegs(fromId, leg.id);
																setDragFromLegId(null);
																setDragOverLegId(null);
															}}
															onDragLeave={() => {
																setDragOverLegId((prev) =>
																	prev === leg.id ? null : prev,
																);
															}}
															className={[
																"border-b border-slate-200",
																isOver ? "bg-slate-50" : "",
																isDragging ? "opacity-60" : "opacity-100",
															].join(" ")}
														>
															<td className="w-[56px] pl-1 py-2.5 text-left">
																<div className="flex items-center gap-2">
																	<button
																		type="button"
																		draggable
																		onDragStart={(e) => {
																			setDragFromLegId(leg.id);
																			setDragOverLegId(leg.id);
																			e.dataTransfer.setData(
																				"text/plain",
																				leg.id,
																			);
																			e.dataTransfer.effectAllowed = "move";
																		}}
																		onDragEnd={() => {
																			setDragFromLegId(null);
																			setDragOverLegId(null);
																		}}
																		className="cursor-grab text-slate-400 active:cursor-grabbing"
																		aria-label={`Drag leg ${idx + 1}`}
																	>
																		<GripIcon />
																	</button>
																	<div className="font-semibold text-slate-900">
																		{idx + 1}
																	</div>
																</div>
															</td>

															<td className="w-[92px] pr-1 py-2.5 text-right tabular-nums font-semibold text-slate-900 text-[13px] sm:text-[14px]">
																{format(leg.inputs.courseTrueDeg, 0)}°
															</td>
															<td className="w-[92px] pr-1 py-2.5 text-right tabular-nums font-semibold text-slate-900 text-[13px] sm:text-[14px]">
																{format(leg.inputs.windFromDeg, 0)}°
															</td>
															<td className="w-[116px] pr-1 py-2.5 text-right tabular-nums font-semibold text-slate-900 text-[13px] sm:text-[14px]">
																{format(leg.distanceNm, 1)} NM
															</td>
															<td className="w-[84px] pr-1 py-2.5 text-right tabular-nums font-semibold text-slate-900 text-[13px] sm:text-[14px]">
																{format(leg.groundSpeedKt, 0)} kt
															</td>
															<td className="w-[96px] pr-1 py-2.5 text-right tabular-nums font-semibold text-slate-900 text-[13px] sm:text-[14px]">
																{formatTimeHours(leg.timeH)}
															</td>
															<td className="w-[108px] pr-1 py-2.5 text-right tabular-nums font-semibold text-slate-900 text-[13px] sm:text-[14px]">
																{format(Math.abs(leg.wcaDeg), 1)}° {legWcaDir}
															</td>
															<td className="w-[164px] pr-1 py-2.5 text-right tabular-nums font-semibold text-slate-900 text-[13px] sm:text-[14px]">
																{format(leg.fuelUsedL, 1)} L{" "}
																<span className="ml-1 text-[12px] font-semibold text-slate-600">
																	({format(leg.fuelBurnLph, 1)} L/h)
																</span>
															</td>

															<td className="w-[44px] pr-1 py-2.5 text-right">
																<button
																	type="button"
																	onClick={() => removeLeg(leg.id)}
																	aria-label={`Remove leg ${idx + 1}`}
																	className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[18px] font-bold text-slate-500 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
																>
																	×
																</button>
															</td>
														</tr>
													);
												})}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					) : (
						<p className="mt-4 text-[12px] font-medium text-slate-600">
							No legs added yet.
						</p>
					)}
				</div>
			</div>
		</section>
	);
}
