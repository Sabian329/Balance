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
	const [isExportingPdf, setIsExportingPdf] = useState(false);
	const chartRef = useRef(null);

	const exportPdf = async () => {
		if (isExportingPdf) return;
		setIsExportingPdf(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			await exportBalancePdf({
				totals,
				rows,
				inputs,
				inputFields,
				registrationNumbers,
				chartElement: chartRef.current,
				format,
			});
		} finally {
			setIsExportingPdf(false);
		}
	};

	return (
		<>
			{isExportingPdf ? (
				<div
					aria-live="polite"
					className="fixed inset-0 z-[10000] flex items-center justify-center bg-black w-screen h-screen"
				>
					<div className="flex flex-col items-center gap-3 rounded-2xl bg-white/95 px-6 py-5 shadow-lg ring-1 ring-slate-900/10">
						<div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
						<div className="text-center">
							<div className="text-[15px] font-semibold text-slate-900">
								Generating PDF...
							</div>
							<div className="mt-1 text-[13px] font-medium text-slate-600">
								Please wait.
							</div>
						</div>
					</div>
				</div>
			) : null}

			<section className="rounded-[20px] bg-white p-4 shadow-card ring-1 ring-slate-900/10 sm:p-5">
				<div className="border-b border-slate-300 pb-4">
					<h2 className="text-[17px] font-semibold tracking-[-0.01em] text-slate-950">
						Envelope
					</h2>
					<p className="mt-0.5 text-[13px] font-semibold text-slate-600">
						MS 893 A · inch / lbs
					</p>
				</div>

				<div
					ref={chartRef}
					className="mt-4 h-[min(52vh,520px)] min-h-[260px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:min-h-[320px]"
				>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
							<CartesianGrid strokeDasharray="2 2" stroke="#cbd5e1" />
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
								animationDuration={0}
							/>
							<Line
								data={envelopeData2}
								type="linear"
								dataKey="yLbs"
								name=""
								stroke="#111827"
								strokeWidth={3}
								dot={false}
								animationDuration={0}
							/>
							<Line
								data={envelopeData3}
								type="linear"
								dataKey="yLbs"
								name=""
								stroke="#111827"
								strokeWidth={3}
								dot={false}
								animationDuration={0}
							/>
							<Line
								data={envelopeData4}
								type="linear"
								dataKey="yLbs"
								name=""
								stroke="#111827"
								strokeWidth={3}
								dot={false}
								animationDuration={0}
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

				<div className="mt-5 border-slate-300">
					<p className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-slate-600">
						PDF report
					</p>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3">
						<input
							type="text"
							value={registrationNumbers}
							onChange={(event) => setRegistrationNumbers(event.target.value)}
							placeholder="Registration (e.g. SP-...)"
							autoComplete="off"
							className="ios-input w-full min-w-0 flex-1 sm:max-w-md"
						/>
						<button
							type="button"
							onClick={exportPdf}
							disabled={isExportingPdf}
							aria-busy={isExportingPdf}
							className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-ios-blue px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition active:scale-[0.98] hover:bg-[#0066d6] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue/50"
						>
							{isExportingPdf ? "Generating..." : "Export PDF"}
						</button>
					</div>
				</div>
				<div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 px-3 py-2">
					<div className="flex items-start gap-2">
						<p className="text-[10px] leading-5 text-yellow-900/90 text-center">
							These values are generated automatically from the inputs entered
							before flight. The calculations are not an official
							document—please verify all data yourself to ensure everything is
							entered correctly.
						</p>
					</div>
				</div>
			</section>
		</>
	);
}

export default BalanceChart;
