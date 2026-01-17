export function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-200">{value || "—"}</span>
    </div>
  );
}
