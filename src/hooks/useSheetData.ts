import { useCallback, useEffect, useState } from "react";
import {
  fetchSheetData,
  type EmploymentRecord,
  type SheetKey,
} from "../services/googleSheet";

type SheetState = {
  records: EmploymentRecord[];
  loading: boolean;
  error: string;
  refresh: () => void;
};

export function useSheetData(sheet: SheetKey): SheetState {
  const [records, setRecords] = useState<EmploymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await fetchSheetData(sheet);
      setRecords(result.records);
    } catch {
      setError("Unable to load records. Please try again.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [sheet]);

  useEffect(() => {
    void load();
  }, [load]);

  return { records, loading, error, refresh: load };
}
