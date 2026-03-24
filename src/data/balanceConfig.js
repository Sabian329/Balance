export const KG_TO_LBS = 2.20462;
export const M_TO_IN = 39.3701;

export const constants = {
	emptyMassKg: 605,
	emptyMomentKgm: 473.11,
	stations: {
		fuel: { armM: 1.067, densityKgPerL: 0.72 },
		oil: { armM: -0.48, densityKgPerL: 0.9 },
		frontSeats: { armM: 0.95 },
		backSeats: { armM: 1.78 },
		trunk: { armM: 2.45 },
	},
};

export const envelopeData = [
	{ xIn: 30.7, yLbs: 1510 },
	{ xIn: 33.0, yLbs: 2095 },
	{ xIn: 35.4, yLbs: 2205 },
	{ xIn: 38.2, yLbs: 2314 },
	{ xIn: 41.2, yLbs: 2314 },
];

export const envelopeData2 = [
	{ xIn: 30.7, yLbs: 1510 },
	{ xIn: 28, yLbs: 1510 },
];
export const envelopeData3 = [
	{ xIn: 30.7, yLbs: 1510 },
	{ xIn: 30.7, yLbs: 1200 },
];
export const envelopeData4 = [
	{ xIn: 35.4, yLbs: 2205 },
	{ xIn: 41.2, yLbs: 2205 },
];
export const xTicks = [30.7, 33, 33.4, 35.4, 38.2, 41.2];
export const yTicks = [1510, 2095, 2205, 2314];

export const inputFields = [
	{
		key: "fuelL",
		label: "Fuel",
		unit: "liters",
		type: "volume",
		min: 0,
		max: 170,
		step: 1,
	},
	{
		key: "oilL",
		label: "Oil",
		unit: "liters",
		type: "volume",
		min: 0,
		max: 7.6,
		step: 0.1,
	},
	{
		key: "frontSeatsKg",
		label: "Front Seats",
		unit: "kg",
		type: "mass",
		min: 0,
		max: 200,
		step: 1,
	},
	{
		key: "backSeatsKg",
		label: "Back Seats",
		unit: "kg",
		type: "mass",
		min: 0,
		max: 160,
		step: 1,
	},
	{
		key: "trunkKg",
		label: "Trunk",
		unit: "kg",
		type: "mass",
		min: 0,
		max: 45,
		step: 1,
	},
];

export const initialInputs = {
	fuelL: 120,
	oilL: 7,
	frontSeatsKg: 177,
	backSeatsKg: 0,
	trunkKg: 5,
};
