import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { constants } from "../data/balanceConfig";
import { buildBalanceReportHtml } from "../templates/balanceReportTemplate";

function inputValueToNumber(value) {
	const n = Number(value);
	return Number.isFinite(n) ? n : 0;
}

/** Teksty kolumny INPUT w PDF + suma „wejścia” w kg (paliwo/olej z gęstości, reszta kg). */
function buildInputColumnForPdf(inputFields, inputs, format) {
	const inputMap = {};
	let inputTotalKg = 0;

	for (const field of inputFields) {
		const raw = inputValueToNumber(inputs?.[field.key]);
		const literDecimals = field.step < 1 ? 1 : 0;

		if (field.key === "fuelL") {
			const kg = raw * constants.stations.fuel.densityKgPerL;
			inputTotalKg += kg;
			inputMap[field.label] = `${format(raw, literDecimals)} liters (${format(kg, 1)} kg)`;
		} else if (field.key === "oilL") {
			const kg = raw * constants.stations.oil.densityKgPerL;
			inputTotalKg += kg;
			inputMap[field.label] = `${format(raw, literDecimals)} liters (${format(kg, 1)} kg)`;
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
}) {
	const today = new Date().toLocaleDateString("pl-PL");
	const { inputMap, inputTotalKg } = buildInputColumnForPdf(inputFields, inputs, format);
	let chartDataUrl = "";
	if (chartElement) {
		const chartCanvas = await html2canvas(chartElement, {
			backgroundColor: "#ffffff",
			scale: 1.5,
		});
		chartDataUrl = chartCanvas.toDataURL("image/png");
	}

	const html = buildBalanceReportHtml({
		date: today,
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

	const pageCanvas = await html2canvas(renderRoot, {
		backgroundColor: "#ffffff",
		scale: 2,
		useCORS: true,
	});
	document.body.removeChild(renderRoot);

	const pageImage = pageCanvas.toDataURL("image/jpeg", 0.95);
	const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	doc.addImage(pageImage, "JPEG", 0, 0, pageWidth, pageHeight);

	doc.save(`master-balance-${today.replaceAll(".", "-")}.pdf`);
}
