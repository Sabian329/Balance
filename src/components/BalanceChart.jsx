import { useRef, useState } from "react";
import {
	CartesianGrid,
	Label,
	Line,
	LineChart,
	ReferenceDot,
	ReferenceLine,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";
import {
	envelopeData,
	envelopeData2,
	envelopeData3,
	envelopeData4,
	inputFields,
	xTicks,
	yTicks,
} from "../data/balanceConfig";
import { exportBalancePdf } from "../utils/exportBalancePdf";
import { format } from "../utils/number";

function BalanceChart({ totals, rows, inputs }) {
	const [registrationNumbers, setRegistrationNumbers] = useState("");
	const chartRef = useRef(null);

	const exportPdf = async () =>
		exportBalancePdf({
			totals,
			rows,
			inputs,
			inputFields,
			registrationNumbers,
			chartElement: chartRef.current,
			format,
		});

	return (
		<section className="rounded-xl bg-white p-4 shadow-md">
			<div className="mb-3 flex flex-wrap items-center gap-2">
				<h2 className="mr-auto text-lg font-semibold">Envelope / MS 893 A</h2>
				<input
					type="text"
					value={registrationNumbers}
					onChange={(event) => setRegistrationNumbers(event.target.value)}
					placeholder="Numery rejestracyjne"
					className="rounded border border-slate-300 px-2 py-1 text-sm"
				/>
				<button
					type="button"
					onClick={exportPdf}
					className="rounded bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
				>
					Eksport PDF
				</button>
			</div>
			<div ref={chartRef} className="h-[520px] w-full bg-white">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
						<CartesianGrid strokeDasharray="2 2" />
						<XAxis
							type="number"
							dataKey="xIn"
							domain={[28, 41.2]}
							ticks={xTicks}
						>
							<Label value="inch" position="insideBottom" offset={-16} />
						</XAxis>
						<YAxis
							type="number"
							dataKey="yLbs"
							domain={[1200, 2400]}
							ticks={yTicks}
						>
							<Label
								value="lbs"
								angle={-90}
								position="insideLeft"
								style={{ textAnchor: "middle" }}
							/>
						</YAxis>

						<Line
							data={envelopeData}
							type="linear"
							dataKey="yLbs"
							name="MS 893 A"
							stroke="#111827"
							strokeWidth={3}
							dot={false}
						/>
						<Line
							data={envelopeData2}
							type="linear"
							dataKey="yLbs"
							name=""
							stroke="#111827"
							strokeWidth={3}
							dot={false}
						/>
						<Line
							data={envelopeData3}
							type="linear"
							dataKey="yLbs"
							name=""
							stroke="#111827"
							strokeWidth={3}
							dot={false}
						/>
						<Line
							data={envelopeData4}
							type="linear"
							dataKey="yLbs"
							name=""
							stroke="#111827"
							strokeWidth={3}
							dot={false}
						/>
						<ReferenceLine
							x={totals.cgIn}
							stroke="#334155"
							strokeDasharray="4 4"
							ifOverflow="extendDomain"
						/>

						<ReferenceLine
							y={totals.massLbs}
							stroke="#334155"
							strokeDasharray="4 4"
							ifOverflow="extendDomain"
						/>
						<ReferenceDot
							x={totals.cgIn}
							y={totals.massLbs}
							r={6}
							fill="#111827"
							stroke="white"
							label={{
								value: `${format(totals.cgIn, 2)}, ${format(totals.massLbs, 0)}`,
								position: "bottom",
								fill: "#111827",
							}}
							ifOverflow="extendDomain"
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</section>
	);
}

export default BalanceChart;
