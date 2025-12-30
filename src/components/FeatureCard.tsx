// components/FeatureCard.tsx
export default function FeatureCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-black cursor-pointer rounded-lg shadow p-6 text-left hover:shadow-md transition w-full"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </button>
  );
}
