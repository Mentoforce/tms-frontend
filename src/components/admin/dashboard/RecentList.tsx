export default function RecentList({
  title,
  items,
  render,
}: {
  title: string;
  items: any[];
  render: (item: any) => React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <h3 className="mb-3 text-sm font-medium">{title}</h3>
      <ul className="space-y-2">{items.map(render)}</ul>
    </div>
  );
}
