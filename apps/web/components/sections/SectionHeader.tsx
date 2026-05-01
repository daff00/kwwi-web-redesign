import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  badge: string;
  title: string;
  description?: string | React.ReactNode;
  extraDescription?: React.ReactNode;
  rightContent?: React.ReactNode; 
}

export default function SectionHeader({ badge, title, description, extraDescription, rightContent }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col ${rightContent ? "md:flex-row gap-16 items-start" : ""}`}>
      {/* Left side — always present */}
      <div className="flex-1">
        <Badge className="rounded-[15px] bg-white/10 text-[#866544] border-[#866544] backdrop-blur px-8 py-4 text-sm mb-8">
          {badge}
        </Badge>
        <h2 className="text-[#866544] text-4xl font-extrabold mb-2">{title}</h2>
        <div className="bg-[#866544] h-1.25 w-15 mb-8" />
        {description && (
          <p className="text-[#866544] leading-relaxed text-lg mb-6">{description}</p>
        )}
        {extraDescription}
      </div>

      {/* Right side — only renders if provided */}
      {rightContent && (
        <div className="flex-1">{rightContent}</div>
      )}
    </div>
  );
}