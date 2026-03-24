const PDF_FIELD_PLACEHOLDER = ".......................";

export function buildBalanceReportHtml({
	aircraftModel,
	registration,
	rows,
	inputMap,
	inputTotal,
	totals,
	chartDataUrl,
	format,
}) {
	const rowHtml = rows
		.map((row) => {
			const arm = row.armM === null ? "-" : format(row.armM, 3);
			return `
        <tr>
          <td>${escapeHtml(String(row.label))}</td>
          <td>${escapeHtml(inputMap[row.label] || "-")}</td>
          <td class="num">${escapeHtml(format(row.massKg, 1))}</td>
          <td class="num">${escapeHtml(arm)}</td>
          <td class="num">${escapeHtml(format(row.momentKgm, 3))}</td>
        </tr>
      `;
		})
		.join("");

	return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        width: 794px;
        height: 1123px;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        color: #111827;
        background: #fff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page { padding: 28px 32px; }
      .doc-header {
        text-align: center;
        padding-bottom: 18px;
        margin-bottom: 18px;
        border-bottom: 2px solid #e5e7eb;
      }
      .title {
        margin: 0;
        font-size: 22px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        line-height: 1.3;
      }
      .model-line {
        margin: 10px 0 0 0;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: #1f2937;
      }
      .meta {
        margin-top: 12px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px 42px;
        font-size: 13px;
        line-height: 1.5;
        color: #374151;
      }
      .meta strong {
        font-weight: 600;
        color: #111827;
      }
      .table-wrap {
        border: 1px solid #d1d5db;
        margin-top: 0;
        overflow: hidden;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        line-height: 1.45;
      }
      th, td {
        border-bottom: 1px solid #e5e7eb;
        padding: 9px 12px;
        text-align: left;
        vertical-align: middle;
      }
      thead th {
        background: #f3f4f6;
        border-bottom: 2px solid #9ca3af;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #374151;
      }
      tbody tr:nth-child(even) td {
        background: #fafafa;
      }
      tbody tr:last-of-type td {
        background: #fff;
      }
      td.num, th.num {
        text-align: right;
        font-variant-numeric: tabular-nums;
        font-feature-settings: "tnum" 1;
      }
      tr.total td {
        font-weight: 700;
        font-size: 13px;
        border-top: 2px solid #6b7280;
        border-bottom: none;
        padding-top: 11px;
        padding-bottom: 11px;
        background: #f9fafb !important;
      }
      .bottom {
        margin-top: 14px;
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 12px;
      }
      .box {
        border: 1px solid #9ca3af;
        background: #fff;
      }
      .box h3 {
        margin: 0;
        font-size: 12px;
        letter-spacing: 0.4px;
        font-weight: 700;
        padding: 8px;
        border-bottom: 1px solid #e5e7eb;
        background: #f9fafb;
      }
      .chart {
        height: 390px;
        padding: 8px;
      }
      .chart img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .right-col {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        gap: 12px;
      }
      .box-content {
        padding: 12px 14px;
        font-size: 14px;
        line-height: 1.6;
      }
      /* Linia pod tekstem — tabela daje stabilne baseline + dolną kreskę jak w formularzu */
      .field-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
        line-height: 1.45;
        margin: 0 0 10px 0;
      }
      .field-table:last-of-type {
        margin-bottom: 0;
      }
      .field-table td {
        border: none;
        padding: 0 0 2px 0;
        vertical-align: baseline;
      }
      .field-table td.label {
        white-space: nowrap;
        font-weight: 600;
        color: #111827;
        padding-right: 0.4em;
        width: 1%;
      }
      .field-table td.line {
        width: auto;
        border-bottom: 1px solid #1f2937;
        /* Minimalna „wysokość” komórki = linia tuż pod baseline etykiety */
        height: 1.35em;
      }
      .sig-note {
        font-size: 12px;
        color: #4b5563;
        margin-top: 10px;
        line-height: 1.45;
      }
      .footer {
        margin-top: 14px;
        padding-top: 10px;
        border-top: 1px solid #e5e7eb;
        font-size: 10px;
        color: #9ca3af;
        text-align: center;
        letter-spacing: 0.02em;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <header class="doc-header">
        <h1 class="title">Weight &amp; balance report</h1>
        <p class="model-line">Model: ${escapeHtml(aircraftModel)}</p>
        <div class="meta">
          <span><strong>Date:</strong> ${escapeHtml(PDF_FIELD_PLACEHOLDER)}</span>
          <span><strong>Registration:</strong> ${escapeHtml(registration?.trim() ? registration : PDF_FIELD_PLACEHOLDER)}</span>
        </div>
      </header>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ITEM</th>
              <th>INPUT</th>
              <th class="num">MASS (kg)</th>
              <th class="num">ARM (m)</th>
              <th class="num">MOMENT (kgm)</th>
            </tr>
          </thead>
          <tbody>
            ${rowHtml}
            <tr class="total">
              <td>TOTAL</td>
              <td>${escapeHtml(format(inputTotal, 1))} kg</td>
              <td class="num">${escapeHtml(format(totals.massKg, 1))}</td>
              <td class="num">${escapeHtml(totals.massKg > 0 ? format(totals.cgM, 3) : "-")}</td>
              <td class="num">${escapeHtml(format(totals.momentKgm, 3))}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bottom">
        <div class="box">
          <h3>WEIGHT &amp; BALANCE ENVELOPE</h3>
          <div class="chart">
            ${chartDataUrl ? `<img src="${chartDataUrl}" alt="chart" />` : ""}
          </div>
        </div>
        <div class="right-col">
          <div class="box">
            <h3>CENTER OF GRAVITY</h3>
            <div class="box-content">
              <div>CG: ${escapeHtml(format(totals.cgIn, 2))} in / ${escapeHtml(format(totals.cgM, 3))} m</div>
              <div>Mass: ${escapeHtml(format(totals.massLbs, 1))} lbs / ${escapeHtml(format(totals.massKg, 1))} kg</div>
              <div>Moment: ${escapeHtml(format(totals.momentKgm, 2))} kgm</div>
            </div>
          </div>
          <div class="box">
            <h3>OPERATION NOTES</h3>
            <div class="box-content">
              <table class="field-table" role="presentation">
                <tr><td class="label">Field:</td><td class="line"></td></tr>
              </table>
              <table class="field-table" role="presentation">
                <tr><td class="label">Runway:</td><td class="line"></td></tr>
              </table>
              <table class="field-table" role="presentation">
                <tr><td class="label">Notes:</td><td class="line"></td></tr>
              </table>
            </div>
          </div>
          <div class="box">
            <h3>SIGNATURE</h3>
            <div class="box-content">
              <table class="field-table" role="presentation">
                <tr><td class="label">Pilot:</td><td class="line"></td></tr>
              </table>
              <table class="field-table" role="presentation">
                <tr><td class="label">Date:</td><td class="line"></td></tr>
              </table>
              <p class="sig-note">PIC confirms data above.</p>
            </div>
          </div>
        </div>
      </div>

      <footer class="footer">Generated automatically — verify against aircraft POH / W&amp;B record.</footer>
    </div>
  </body>
</html>
`;
}

function escapeHtml(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}
