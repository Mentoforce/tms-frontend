export default function ActivePill({ status }: { status: boolean }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        status ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
      }`}
    >
      {status ? "Active" : "Inactive"}
    </span>
  );
}
