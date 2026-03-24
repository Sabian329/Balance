import { useMemo, useState } from "react";
import BalanceChart from "./components/BalanceChart";
import CalculationTable from "./components/CalculationTable";
import InputTable from "./components/InputTable";
import TotalsCards from "./components/TotalsCards";
import {
	constants,
	initialInputs,
	inputFields,
	KG_TO_LBS,
	M_TO_IN,
} from "./data/balanceConfig";
import { toNumber } from "./utils/number";

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
		<main className="min-h-screen p-4 md:p-8">
			<div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[420px_1fr]">
				<section className="space-y-4 rounded-xl bg-white p-4 shadow-md">
					<h1 className="text-xl font-bold">Master Balance Calculator</h1>

					<InputTable
						fields={inputFields}
						inputs={inputs}
						setInputs={setInputs}
					/>
					<CalculationTable rows={rows} totals={totals} />
					<TotalsCards totals={totals} />
				</section>
				<BalanceChart totals={totals} rows={rows} inputs={inputs} />
			</div>
		</main>
	);
}

export default App;
