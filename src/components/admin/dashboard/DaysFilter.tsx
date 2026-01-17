export default function DaysFilter({
  days,
  onChange,
}: {
  days: number;
  onChange: (d: number) => void;
}) {
  return (
    <div className="flex gap-2">
      {[7, 14, 30].map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={`px-3 py-1 rounded-md border ${
            days === d ? "bg-white text-black" : "border-white/20"
          }`}
        >
          {d} days
        </button>
      ))}
    </div>
  );
}
