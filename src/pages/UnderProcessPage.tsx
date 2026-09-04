import { EmploymentList } from "../components/EmploymentList";
import { useSheetData } from "../hooks/useSheetData";

export function UnderProcessPage() {
  const { records, loading, error, refresh } = useSheetData("underProcess");

  return (
    <EmploymentList
      title="PAPs Employment Applications Under Process"
      subtitle=""
      records={records}
      loading={loading}
      error={error}
      onRefresh={refresh}
    />
  );
}
