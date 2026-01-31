import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export default function Card({
  children,
  className,
  glass = true,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-3xl border border-white/5 bg-bg-card transition-all duration-300",
        glass && "glass",
        className,
      )}
    >
      {children}
    </div>
  );
}
