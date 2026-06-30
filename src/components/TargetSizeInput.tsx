"use client";

import { useState } from "react";

interface TargetSizeInputProps {
  onCompress: (targetKB: number) => void;
  disabled?: boolean;
  isCompressing?: boolean;
}

const PRESETS = [
  { label: "50 KB", value: 50 },
  { label: "100 KB", value: 100 },
  { label: "200 KB", value: 200 },
  { label: "500 KB", value: 500 },
  { label: "1 MB", value: 1024 },
];

export function TargetSizeInput({
  onCompress,
  disabled,
  isCompressing,
}: TargetSizeInputProps) {
  const [customValue, setCustomValue] = useState("");
  const [unit, setUnit] = useState<"KB" | "MB">("KB");

  const handlePreset = (kb: number) => {
    onCompress(kb);
  };

  const handleCustomSubmit = () => {
    const num = parseFloat(customValue);
    if (isNaN(num) || num <= 0) return;
    const targetKB = unit === "MB" ? num * 1024 : num;
    onCompress(targetKB);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-zinc-900 mb-4">
        🎯 Compress to Exact Size
      </h3>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePreset(preset.value)}
            disabled={disabled || isCompressing}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium
              text-zinc-700 hover:border-indigo-400 hover:text-indigo-600
              active:bg-indigo-50 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
          placeholder="Custom size"
          disabled={disabled || isCompressing}
          min={1}
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm
            placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none
            focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as "KB" | "MB")}
          disabled={disabled || isCompressing}
          className="rounded-lg border border-zinc-300 px-2 py-2 text-sm
            focus:border-indigo-500 focus:outline-none disabled:opacity-50"
        >
          <option value="KB">KB</option>
          <option value="MB">MB</option>
        </select>
        <button
          onClick={handleCustomSubmit}
          disabled={disabled || isCompressing || !customValue}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white
            hover:bg-indigo-600 active:scale-[0.98] transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompressing ? "..." : "Go"}
        </button>
      </div>
    </div>
  );
}
