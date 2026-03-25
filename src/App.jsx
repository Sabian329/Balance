import { useMemo, useState } from "react";
import BalanceChart from "./components/BalanceChart";
import CalculationTable from "./components/CalculationTable";
import InputTable from "./components/InputTable";
import TotalsCards from "./components/TotalsCards";
import FlightPerformanceCards from "./components/FlightPerformanceCards";
import {
	constants,
	initialInputs,
	inputFields,
	KG_TO_LBS,
	M_TO_IN,
} from "./data/balanceConfig";
import { toNumber } from "./utils/number";
import WindCorrectionCards from "./components/WindCorrectionCards";

function App() {
	const [inputs, setInputs] = useState(initialInputs);

	const rows = useMemo(() => {
		const fuelMass =
			toNumber(inputs.fuelL) * constants.stations.fuel.densityKgPerL;
		const oilMass =
			toNumber(inputs.oilL) * constants.stations.oil.densityKgPerL;
		const frontMass = toNumber(inputs.frontSeatsKg);
		const backMass = toNumber(inputs.backSeatsKg);
		const trunkMass = toNumber(inputs.trunkKg);

		const emptyMomentKgm = constants.emptyMassKg * constants.emptyArmM;

		return [
			{
				label: "Empty",
				massKg: constants.emptyMassKg,
				armM: constants.emptyArmM,
				momentKgm: emptyMomentKgm,
			},
			{
				label: "Fuel",
				massKg: fuelMass,
				armM: constants.stations.fuel.armM,
				momentKgm: fuelMass * constants.stations.fuel.armM,
			},
			{
				label: "Oil",
				massKg: oilMass,
				armM: constants.stations.oil.armM,
				momentKgm: oilMass * constants.stations.oil.armM,
			},
			{
				label: "Front Seats",
				massKg: frontMass,
				armM: constants.stations.frontSeats.armM,
				momentKgm: frontMass * constants.stations.frontSeats.armM,
			},
			{
				label: "Back Seats",
				massKg: backMass,
				armM: constants.stations.backSeats.armM,
				momentKgm: backMass * constants.stations.backSeats.armM,
			},
			{
				label: "Trunk",
				massKg: trunkMass,
				armM: constants.stations.trunk.armM,
				momentKgm: trunkMass * constants.stations.trunk.armM,
			},
		];
	}, [inputs]);

	const totals = useMemo(() => {
		const massKg = rows.reduce((acc, row) => acc + row.massKg, 0);
		const momentKgm = rows.reduce((acc, row) => acc + row.momentKgm, 0);
		const cgM = massKg > 0 ? momentKgm / massKg : 0;

		return {
			massKg,
			massLbs: massKg * KG_TO_LBS,
			momentKgm,
			cgM,
			cgIn: cgM * M_TO_IN,
		};
	}, [rows]);

	return (
		<main className="min-h-0 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]">
			<div className="mx-auto w-full max-w-6xl px-4 sm:px-5 md:px-6 lg:px-8">
				<header className="mb-5 text-center sm:mb-6 sm:text-left">
					<h1 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-slate-900 sm:text-[26px]">
						Master balance
					</h1>
					<p className="mt-1 text-[15px] font-medium text-slate-600">
						Weight and balance calculator · MS 893 A
					</p>
				</header>

				<div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,400px)_1fr] lg:items-start lg:gap-6">
					<section className="space-y-5 min-h-[1160px] rounded-[20px] bg-white p-4 shadow-card ring-1 ring-slate-900/10 sm:p-5">
						<InputTable
							fields={inputFields}
							inputs={inputs}
							setInputs={setInputs}
						/>
						<CalculationTable rows={rows} totals={totals} />
						<TotalsCards totals={totals} />
					</section>
					<section className=" min-h-[1150px]  flex flex-col justify-between gap-5">
						<BalanceChart totals={totals} rows={rows} inputs={inputs} />
						<FlightPerformanceCards totals={totals} inputs={inputs} />
					</section>
				</div>
				{/* <section className="">
					<WindCorrectionCards inputs={inputs} />
				</section> */}
			</div>
		</main>
	);
}

export default App;
