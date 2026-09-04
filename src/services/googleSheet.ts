export const SHEETS = {
  approved:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVrBRZbcB7J3Q_RtDL1nxUUsLwpkhAk4xpAG9nDaURw5ss88yY7UpVfDqEfkRoZyJMczTqu8POTrqL/pub?gid=0&single=true&output=csv",
  underProcess:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVrBRZbcB7J3Q_RtDL1nxUUsLwpkhAk4xpAG9nDaURw5ss88yY7UpVfDqEfkRoZyJMczTqu8POTrqL/pub?gid=1093940852&single=true&output=csv",
} as const;

export type SheetKey = keyof typeof SHEETS;

export type EmploymentRecord = {
  candidateName: string;
  fatherName: string;
  projectName: string;
  status: string;
  updatedOn: string;
};

export type SheetResult = {
  headers: string[];
  records: EmploymentRecord[];
};

export async function fetchSheetData(sheet: SheetKey): Promise<SheetResult> {
  const response = await fetch(SHEETS[sheet]);

  if (!response.ok) {
    throw new Error("Failed to fetch Google Sheet");
  }

  const csv = await response.text();
  const rows = parseCSV(csv);

  if (rows.length === 0) {
    return { headers: [], records: [] };
  }

  const headers = rows[0].map((h) => h.trim());
  const records = rows
    .slice(1)
    .filter((row) => row.some((cell) => cell.trim() !== ""))
    .map((row) => ({
      candidateName: cell(row, 0),
      fatherName: cell(row, 1),
      projectName: cell(row, 2),
      status: cell(row, 3),
      updatedOn: cell(row, 4),
    }));

  return { headers, records };
}

function cell(row: string[], index: number): string {
  return (row[index] ?? "").trim();
}

/** Handles quoted fields and commas inside quotes. */
function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const text = csv.replace(/^\uFEFF/, "");

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || (char === "\r" && next === "\n")) {
      row.push(field);
      field = "";
      if (row.some((c) => c.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      if (char === "\r") i++;
    } else if (char !== "\r") {
      field += char;
    }
  }

  row.push(field);
  if (row.some((c) => c.trim() !== "")) {
    rows.push(row);
  }

  return rows;
}
