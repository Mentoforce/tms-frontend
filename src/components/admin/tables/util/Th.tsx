export default function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-xs font-medium text-gray-400 text-center">
      {children}
    </th>
  );
}
