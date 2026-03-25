import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { aircraftModelReport, constants } from "../data/balanceConfig";
import { buildBalanceReportHtml } from "../templates/balanceReportTemplate";

const CHART_PDF_CAPTURE_WIDTH = 960;
const CHART_PDF_CAPTURE_HEIGHT = 600;

async function waitForChartToRender(chartElement, { timeoutMs = 1000 } = {}) {
	const start = performance.now();

	while (performance.now() - start < timeoutMs) {
		const rect = chartElement.getBoundingClientRect();
		if (rect.width > 40 && rect.height > 40) {
			const svg = chartElement.querySelector("svg");
			if (svg) {
				const dashedSvgEl = svg.querySelector(
					'[stroke-dasharray]:not([stroke-dasharray="none"])',
				);
				if (dashedSvgEl) return;

				const lineCount = svg.querySelectorAll("line").length;
				if (lineCount >= 10) {
					const dashedByComputedStyle = Array.from(
						svg.querySelectorAll("*"),
					).some((el) => {
						try {
							const dash = window.getComputedStyle(el).strokeDasharray;
							return dash && dash !== "none" && dash !== "";
						} catch {
							return false;
						}
					});
					if (dashedByComputedStyle) return;
				}
			}
		}

		await new Promise((resolve) => setTimeout(resolve, 50));
	}
}

function svgToPngDataUrl(svg, width, height) {
	return new Promise((resolve, reject) => {
		try {
			const serializer = new XMLSerializer();
			let svgString = serializer.serializeToString(svg);

			if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
				svgString = svgString.replace(
					"<svg",
					'<svg xmlns="http://www.w3.org/2000/svg"',
				);
			}

			const svgBlob = new Blob([svgString], {
				type: "image/svg+xml;charset=utf-8",
			});
			const url = URL.createObjectURL(svgBlob);

			const img = new Image();
			img.decoding = "async";
			img.onload = () => {
				try {
					const canvas = document.createElement("canvas");
					canvas.width = width;
					canvas.height = height;
					const ctx = canvas.getContext("2d");
					if (!ctx) throw new Error("Missing 2D canvas context");

					ctx.fillStyle = "#ffffff";
					ctx.fillRect(0, 0, width, height);
					ctx.drawImage(img, 0, 0, width, height);

					const dataUrl = canvas.toDataURL("image/png");
					resolve(dataUrl);
				} catch (e) {
					reject(e);
				} finally {
					URL.revokeObjectURL(url);
				}
			};

			img.onerror = (e) => {
				URL.revokeObjectURL(url);
				reject(
					e instanceof Error ? e : new Error("Failed to render SVG image"),
				);
			};

			img.src = url;
		} catch (e) {
			reject(e);
		}
	});
}

function inputValueToNumber(value) {
	const n = Number(value);
	return Number.isFinite(n) ? n : 0;
}

/** INPUT column text in PDF + total input in kg (fuel/oil from density, others as kg). */
function buildInputColumnForPdf(inputFields, inputs, format) {
	const inputMap = {};
	let inputTotalKg = 0;

	for (const field of inputFields) {
		const raw = inputValueToNumber(inputs?.[field.key]);
		const literDecimals = field.step < 1 ? 1 : 0;

		if (field.key === "fuelL") {
			const kg = raw * constants.stations.fuel.densityKgPerL;
			inputTotalKg += kg;
			inputMap[field.label] =
				`${format(raw, literDecimals)} liters (${format(kg, 1)} kg)`;
		} else if (field.key === "oilL") {
			const kg = raw * constants.stations.oil.densityKgPerL;
			inputTotalKg += kg;
			inputMap[field.label] =
				`${format(raw, literDecimals)} liters (${format(kg, 1)} kg)`;
		} else {
			inputTotalKg += raw;
			inputMap[field.label] = `${format(raw, 0)} kg`;
		}
	}

	return { inputMap, inputTotalKg };
}

export async function exportBalancePdf({
	totals,
	rows,
	inputs,
	inputFields,
	registrationNumbers,
	chartElement,
	format,
	onProgress,
}) {
	try {
		const report =
			typeof onProgress === "function"
				? (value) => {
						const n = Number(value);
						if (Number.isFinite(n)) onProgress(Math.max(0, Math.min(100, n)));
					}
				: () => {};

		report(0);
		const { inputMap, inputTotalKg } = buildInputColumnForPdf(
			inputFields,
			inputs,
			format,
		);
		report(10);
		let chartDataUrl = "";
		if (chartElement) {
			const originalInlineStyles = {
				width: chartElement.style.width,
				height: chartElement.style.height,
				boxSizing: chartElement.style.boxSizing,
				minWidth: chartElement.style.minWidth,
				minHeight: chartElement.style.minHeight,
				maxWidth: chartElement.style.maxWidth,
				maxHeight: chartElement.style.maxHeight,
			};

			chartElement.style.width = `${CHART_PDF_CAPTURE_WIDTH}px`;
			chartElement.style.height = `${CHART_PDF_CAPTURE_HEIGHT}px`;
			chartElement.style.boxSizing = "border-box";
			chartElement.style.minWidth = `${CHART_PDF_CAPTURE_WIDTH}px`;
			chartElement.style.minHeight = `${CHART_PDF_CAPTURE_HEIGHT}px`;
			chartElement.style.maxWidth = `${CHART_PDF_CAPTURE_WIDTH}px`;
			chartElement.style.maxHeight = `${CHART_PDF_CAPTURE_HEIGHT}px`;

			await new Promise((resolve) => requestAnimationFrame(() => resolve()));
			await new Promise((resolve) => setTimeout(resolve, 80));

			await waitForChartToRender(chartElement, { timeoutMs: 2000 });

			try {
				const svg = chartElement.querySelector("svg");
				if (svg) {
					chartDataUrl = await svgToPngDataUrl(
						svg,
						CHART_PDF_CAPTURE_WIDTH,
						CHART_PDF_CAPTURE_HEIGHT,
					);
				} else {
					const chartCanvas = await html2canvas(chartElement, {
						backgroundColor: "#ffffff",
						scale: 1.5,
					});
					chartDataUrl = chartCanvas.toDataURL("image/png");
				}
			} catch (err) {
				console.error("Balance PDF: failed to render chart PNG", err);
				chartDataUrl = "";
			}
			report(55);

			chartElement.style.width = originalInlineStyles.width;
			chartElement.style.height = originalInlineStyles.height;
			chartElement.style.boxSizing = originalInlineStyles.boxSizing;
			chartElement.style.minWidth = originalInlineStyles.minWidth;
			chartElement.style.minHeight = originalInlineStyles.minHeight;
			chartElement.style.maxWidth = originalInlineStyles.maxWidth;
			chartElement.style.maxHeight = originalInlineStyles.maxHeight;
		}
		report(70);

		const html = buildBalanceReportHtml({
			aircraftModel: aircraftModelReport,
			registration: registrationNumbers,
			rows: rows || [],
			inputMap,
			inputTotal: inputTotalKg,
			totals,
			chartDataUrl,
			format,
		});

		const renderRoot = document.createElement("div");
		renderRoot.style.position = "fixed";
		renderRoot.style.left = "-10000px";
		renderRoot.style.top = "0";
		renderRoot.style.width = "794px";
		renderRoot.style.height = "1123px";
		renderRoot.style.background = "#fff";
		renderRoot.innerHTML = html;
		document.body.appendChild(renderRoot);

		report(80);
		const pageCanvas = await html2canvas(renderRoot, {
			backgroundColor: "#ffffff",
			scale: 2,
			useCORS: true,
		});
		document.body.removeChild(renderRoot);

		report(95);
		const pageImage = pageCanvas.toDataURL("image/jpeg", 0.95);
		const doc = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: "a4",
		});
		const pageWidth = doc.internal.pageSize.getWidth();
		const pageHeight = doc.internal.pageSize.getHeight();
		doc.addImage(pageImage, "JPEG", 0, 0, pageWidth, pageHeight);

		report(100);
		doc.save("master-balance.pdf");
	} catch (err) {
		console.error("Balance PDF: export failed", err);
		if (typeof onProgress === "function") onProgress(100);
	}
}
