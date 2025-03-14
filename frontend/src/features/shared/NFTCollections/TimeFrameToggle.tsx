"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface TimeFrameToggleProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function TimeFrameToggle({
  value,
  onValueChange,
}: TimeFrameToggleProps) {
  const timeframes = [
    { value: "10m", label: "10m" },
    { value: "1h", label: "1h" },
    { value: "6h", label: "6h" },
    { value: "1d", label: "1d" },
    { value: "7d", label: "7d" },
    { value: "30d", label: "30d" },
  ];

  return (
    <div className="flex items-center space-x-1">
      {timeframes.map((timeframe) => (
        <Button
          key={timeframe.value}
          variant={value === timeframe.value ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onValueChange(timeframe.value)}
          className="px-3 h-8"
        >
          {timeframe.label}
        </Button>
      ))}
    </div>
  );
}
