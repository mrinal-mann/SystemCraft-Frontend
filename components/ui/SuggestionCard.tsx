"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import {
  CheckCircle,
  EyeOff,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SuggestionStatus } from "@/services/projectService";

interface SuggestionCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: SuggestionStatus;
  isUpdating?: boolean;
  onStatusChange: (id: number, status: SuggestionStatus) => void;
}

export function SuggestionCard({
  id,
  title,
  description,
  category,
  severity,
  status,
  isUpdating = false,
  onStatusChange,
}: SuggestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Parse description sections if available
  const parseDescription = (desc: string) => {
    const sections: {
      whyItMatters?: string;
      interviewAngle?: string;
      productionAngle?: string;
      general?: string;
    } = {};

    // Try to find labeled sections
    const whyMatch = desc.match(
      /(?:why it matters|importance)[:：]?\s*(.+?)(?=(?:interview|production|$))/i,
    );
    const interviewMatch = desc.match(
      /(?:interview|interview angle)[:：]?\s*(.+?)(?=(?:production|$))/i,
    );
    const productionMatch = desc.match(
      /(?:production|production angle)[:：]?\s*(.+?)$/i,
    );

    if (whyMatch || interviewMatch || productionMatch) {
      sections.whyItMatters = whyMatch?.[1]?.trim();
      sections.interviewAngle = interviewMatch?.[1]?.trim();
      sections.productionAngle = productionMatch?.[1]?.trim();
    } else {
      sections.general = desc;
    }

    return sections;
  };

  const sections = parseDescription(description);

  const getBorderClass = () => {
    if (status === "ADDRESSED") return "border-l-[3px] border-l-[#10B981]";
    if (status === "IGNORED") return "border-l-[3px] border-l-[#9CA3AF]";
    if (severity === "CRITICAL") return "border-l-[3px] border-l-[#EF4444]";
    if (severity === "WARNING") return "border-l-[3px] border-l-[#F59E0B]";
    return "border-l-[3px] border-l-[#3B82F6]";
  };

  const getStatusBadge = () => {
    if (status === "ADDRESSED")
      return <Badge variant="addressed">Addressed</Badge>;
    if (status === "IGNORED") return <Badge variant="ignored">Ignored</Badge>;
    if (severity === "CRITICAL")
      return <Badge variant="critical">Critical</Badge>;
    if (severity === "WARNING") return <Badge variant="warning">Warning</Badge>;
    return <Badge variant="info">Info</Badge>;
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-[#E5E7EB] overflow-hidden",
        getBorderClass(),
        status === "ADDRESSED" && "opacity-60",
        status === "IGNORED" && "opacity-40",
      )}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                {category}
              </span>
            </div>
            <h3
              className={cn(
                "text-sm font-semibold text-[#111827]",
                status === "ADDRESSED" && "line-through",
              )}
            >
              {title}
            </h3>
          </div>
          {getStatusBadge()}
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-3">
            {sections.general && (
              <p className="text-sm text-[#6B7280] leading-relaxed whitespace-pre-wrap">
                {sections.general}
              </p>
            )}

            {sections.whyItMatters && (
              <div>
                <p className="text-xs font-medium text-[#111827] mb-1">
                  Why it matters
                </p>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {sections.whyItMatters}
                </p>
              </div>
            )}

            {sections.interviewAngle && (
              <div>
                <p className="text-xs font-medium text-[#111827] mb-1">
                  Interview angle
                </p>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {sections.interviewAngle}
                </p>
              </div>
            )}

            {sections.productionAngle && (
              <div>
                <p className="text-xs font-medium text-[#111827] mb-1">
                  Production angle
                </p>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {sections.productionAngle}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          {status === "OPEN" && (
            <>
              <Button
                variant="primary"
                size="sm"
                isLoading={isUpdating}
                onClick={() => onStatusChange(id, "ADDRESSED")}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Done
              </Button>
              <Button
                variant="secondary"
                size="sm"
                isLoading={isUpdating}
                onClick={() => onStatusChange(id, "IGNORED")}
              >
                <EyeOff className="w-3.5 h-3.5" />
                Ignore
              </Button>
            </>
          )}
          {status !== "OPEN" && (
            <Button
              variant="secondary"
              size="sm"
              isLoading={isUpdating}
              onClick={() => onStatusChange(id, "OPEN")}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reopen
            </Button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                More
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
