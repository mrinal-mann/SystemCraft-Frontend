import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className, size = 32, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Connections */}
        <g stroke="#6366F1" strokeWidth="3" strokeLinecap="round">
          <line x1="18" y1="18" x2="36" y2="36" />
          <line x1="54" y1="18" x2="36" y2="36" />
          <line x1="18" y1="54" x2="36" y2="36" />
          <line x1="54" y1="54" x2="36" y2="36" />
        </g>

        {/* Outer nodes */}
        <circle
          cx="18"
          cy="18"
          r="6"
          fill="#111827"
          stroke="#6366F1"
          strokeWidth="2"
        />
        <circle
          cx="54"
          cy="18"
          r="6"
          fill="#111827"
          stroke="#6366F1"
          strokeWidth="2"
        />
        <circle
          cx="18"
          cy="54"
          r="6"
          fill="#111827"
          stroke="#6366F1"
          strokeWidth="2"
        />
        <circle
          cx="54"
          cy="54"
          r="6"
          fill="#111827"
          stroke="#6366F1"
          strokeWidth="2"
        />

        {/* Center intelligence node */}
        <circle
          cx="36"
          cy="36"
          r="10"
          fill="#6366F1"
          className="animate-pulse"
        />
      </svg>
      {showText && (
        <span
          className="font-bold text-gray-100 tracking-tight leading-none"
          style={{ fontSize: `${size * 0.7}px` }}
        >
          System<span className="text-indigo-400">Craft</span>
        </span>
      )}
    </div>
  );
}
