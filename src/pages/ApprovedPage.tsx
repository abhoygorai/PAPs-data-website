import { EmploymentList } from "../components/EmploymentList";
import { useSheetData } from "../hooks/useSheetData";

export function ApprovedPage() {
  const { records, loading, error, refresh } = useSheetData("approved");

  return (
    <EmploymentList
      title="PAPs Employments Approved"
      subtitle=""
      records={records}
      loading={loading}
      error={error}
      onRefresh={refresh}
    />
  );
}
