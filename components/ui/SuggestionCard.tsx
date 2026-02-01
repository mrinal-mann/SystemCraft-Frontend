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

  // Helper function to render text with **bold** formatting and bullet points
  // Helper function to render text with **bold** formatting and bullet points
  const formatText = (text: string) => {
    if (!text) return null;

    // Split by newlines to create bullet points if explicitly structured
    const lines = text.split("\n").filter((line) => line.trim());

    // Function to parse **bold** text within a string
    const parseBoldText = (str: string) => {
      const parts = str.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-semibold text-[#111827]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
    };

    // If multiple lines, render as bullet points
    if (lines.length > 1) {
      return (
        <ul className="list-disc list-inside space-y-1.5 ml-1">
          {lines.map((line, index) => {
            const cleanLine = line.replace(/^[-•]\s*/, "").trim();
            return (
              <li
                key={index}
                className="text-sm text-[#6B7280] leading-relaxed"
              >
                {parseBoldText(cleanLine)}
              </li>
            );
          })}
        </ul>
      );
    }

    return <span>{parseBoldText(text)}</span>;
  };

  // Improved parser for descriptions with embedded marked sections
  const parseDescription = (desc: string) => {
    const sections: {
      general?: string;
      whyItMatters?: string;
      interviewAngle?: string;
      productionAngle?: string;
    } = {};

    if (!desc) return sections;

    // specific markers we look for (flexible with ** markers and case)
    const markers = [
      {
        key: "whyItMatters",
        regex:
          /(?:\*\*|__)?(?:Why It Matters|Importance)(?:\*\*|__)?[:：]?\s*/i,
      },
      {
        key: "interviewAngle",
        regex:
          /(?:\*\*|__)?(?:Interview|Interview Angle|Interview Perspective)(?:\*\*|__)?[:：]?\s*/i,
      },
      {
        key: "productionAngle",
        regex:
          /(?:\*\*|__)?(?:Production|Production Angle|Production Reality)(?:\*\*|__)?[:：]?\s*/i,
      },
    ];

    // Find the starting positions of all markers
    const positions = markers
      .map((m) => {
        const match = desc.match(m.regex);
        return {
          key: m.key,
          index: match ? match.index : -1,
          length: match ? match[0].length : 0,
        };
      })
      .filter((p) => p.index !== -1 && p.index !== undefined)
      .sort((a, b) => (a.index as number) - (b.index as number));

    if (positions.length === 0) {
      sections.general = desc;
      return sections;
    }

    // Extract General section (text before the first marker)
    if ((positions[0].index as number) > 0) {
      sections.general = desc.substring(0, positions[0].index).trim();
    }

    // Extract other sections
    positions.forEach((pos, i) => {
      const start = (pos.index as number) + pos.length;
      const end =
        i < positions.length - 1
          ? (positions[i + 1].index as number)
          : desc.length;
      const content = desc.substring(start, end).trim();

      if (pos.key === "whyItMatters") sections.whyItMatters = content;
      if (pos.key === "interviewAngle") sections.interviewAngle = content;
      if (pos.key === "productionAngle") sections.productionAngle = content;
    });

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
          <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-4">
            {sections.general && (
              <div className="text-sm text-[#6B7280] leading-relaxed">
                {formatText(sections.general)}
              </div>
            )}

            {sections.whyItMatters && (
              <div className="bg-blue-50/50 p-3 rounded-md border border-blue-100">
                <p className="text-xs font-semibold text-blue-900 mb-1 uppercase tracking-wider">
                  Why It Matters
                </p>
                <div className="text-sm text-blue-800/90 leading-relaxed">
                  {formatText(sections.whyItMatters)}
                </div>
              </div>
            )}

            {sections.interviewAngle && (
              <div className="bg-purple-50/50 p-3 rounded-md border border-purple-100">
                <p className="text-xs font-semibold text-purple-900 mb-1 uppercase tracking-wider">
                  Interview Perspective
                </p>
                <div className="text-sm text-purple-800/90 leading-relaxed">
                  {formatText(sections.interviewAngle)}
                </div>
              </div>
            )}

            {sections.productionAngle && (
              <div className="bg-amber-50/50 p-3 rounded-md border border-amber-100">
                <p className="text-xs font-semibold text-amber-900 mb-1 uppercase tracking-wider">
                  Production Reality
                </p>
                <div className="text-sm text-amber-800/90 leading-relaxed">
                  {formatText(sections.productionAngle)}
                </div>
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
