type StatCardProps = {
  title: string;
  value: number;
  subtitle?: string;
};

export default function StatsCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-5">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}
