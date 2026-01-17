export default function SkeletonTable({
  type,
  rows = 16,
}: {
  type: "Ticket" | "Callback" | "Bonus";
  rows?: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full">
        <thead className="bg-white/5">
          {type === "Ticket" && (
            <tr>
              {[
                "REQUEST ID",
                "USER",
                "SUBJECT",
                "SITUATION",
                "CHANNEL",
                "APPENDICES",
                "HISTORY",
                "TRANSACTIONS",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs text-gray-400 font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          )}
          {type === "Callback" && (
            <tr>
              {[
                "USER",
                "PHONE",
                "REASON",
                "AUDIO",
                "STATUS",
                "HISTORY",
                "TRANSACTIONS",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs text-gray-400 font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          )}
          {type === "Bonus" && (
            <tr>
              {["USER", "BONUS TYPE", "STATUS", "HISTORY", "TRANSACTIONS"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs text-gray-400 font-medium"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          )}
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-t border-white/5">
              {Array.from({ length: 8 }).map((_, j) => (
                <td key={j} className="px-4 py-4">
                  <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
