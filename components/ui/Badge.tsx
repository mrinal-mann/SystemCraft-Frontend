import { cn } from "@/lib/utils";

type BadgeVariant =
  | "open"
  | "addressed"
  | "ignored"
  | "info"
  | "critical"
  | "warning"
  | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  const variants = {
    open: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]", // Amber
    addressed: "bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]", // Green
    ignored: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]", // Gray
    info: "bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]", // Blue
    critical: "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]", // Red
    warning: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]", // Amber
    default: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]", // Gray
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
