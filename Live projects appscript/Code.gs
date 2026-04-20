function doGet(e) {
  const sheetName = e.parameter.sheet || "Live Products";
  const format = (e.parameter.format || "json").toLowerCase();
  const requestedRow = Number(e.parameter.row || 0);

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  const availableSheets = spreadsheet.getSheets().map((item) => item.getName());

  if (!sheet) {
    return jsonResponse({
      success: false,
      error: `Sheet "${sheetName}" not found`,
      requestedSheet: sheetName,
      availableSheets
    });
  }

  const values = sheet.getDataRange().getDisplayValues();
  if (!values.length) {
    return jsonResponse({
      success: true,
      sheet: sheetName,
      requestedSheet: sheetName,
      availableSheets,
      totalRowsInSheet: 0,
      headers: [],
      rows: []
    });
  }

  const headers = values[0].map((header) => normalizeKey(header));
  const dataRows = values
    .slice(1)
    .filter((row) => row.some((cell) => String(cell).trim() !== ""))
    .map((row, index) => buildRowRecord(headers, row, index + 1));

  if (format === "csv") {
    return ContentService
      .createTextOutput(buildCsv(values))
      .setMimeType(ContentService.MimeType.CSV);
  }

  if (requestedRow > 0) {
    const rowRecord = dataRows.find((item) => item.row_index === requestedRow);

    if (!rowRecord) {
      return jsonResponse({
        success: false,
        error: `Row "${requestedRow}" not found`,
        requestedSheet: sheetName,
        availableSheets
      });
    }

    return jsonResponse({
      success: true,
      mode: "row",
      sheet: sheetName,
      requestedSheet: sheetName,
      availableSheets,
      row: sanitizeProtectedRowForUnlock(rowRecord)
    });
  }

  return jsonResponse({
    success: true,
    mode: "list",
    sheet: sheetName,
    requestedSheet: sheetName,
    availableSheets,
    totalRowsInSheet: values.length,
    headers: values[0],
    count: dataRows.length,
    rows: dataRows.map((row) => sanitizeRowForList(row))
  });
}

function buildRowRecord(headers, row, rowIndex) {
  const item = {
    row_index: rowIndex
  };

  headers.forEach((header, index) => {
    item[header] = row[index] || "";
  });

  return item;
}

function sanitizeRowForList(row) {
  return row;
}

function sanitizeProtectedRowForUnlock(row) {
  const clone = Object.assign({}, row);
  delete clone.password;
  return clone;
}

function normalizeBoolean(value) {
  return String(value || "").trim().toLowerCase() === "true";
}

function normalizeKey(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_");
}

function buildCsv(rows) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const text = String(cell ?? "");
          return `"${text.replace(/"/g, '""')}"`;
        })
        .join(",")
    )
    .join("\n");
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
