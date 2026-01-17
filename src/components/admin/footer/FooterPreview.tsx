"use client";

export default function FooterPreview({
  html,
  socials,
}: {
  html: string;
  socials: any[];
}) {
  return (
    <div className="border rounded-xl p-6 bg-black text-white">
      <div dangerouslySetInnerHTML={{ __html: html }} className="space-y-4" />

      {socials?.length > 0 && (
        <div className="flex justify-center gap-4 mt-4">
          {socials.map((s, i) => (
            <a key={i} href={s.url} target="_blank">
              {s.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
