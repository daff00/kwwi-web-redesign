import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  badge: string;
  title: string;
  description?: string | React.ReactNode;
  extraDescription?: React.ReactNode;
}

export default function SectionHeader({ badge, title, description, extraDescription }: SectionHeaderProps) {
  return (
    <div className="max-w-10xl">
      <Badge className="rounded-[15px] bg-white/10 text-[#866544] border-[#866544] backdrop-blur px-8 py-4 text-sm mb-8">
        {badge}
      </Badge>
      <h2 className="text-[#866544] text-4xl font-extrabold mb-2">{title}</h2>
      <div className="bg-[#866544] h-1.25 w-15 mb-8" />
      {description && (
        <p className="text-[#866544] leading-relaxed text-lg mb-6 w-full">{description}</p>
      )}
      {extraDescription}
    </div>
  );
}