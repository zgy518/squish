"use client";

interface QualitySliderProps {
  quality: number;
  onChange: (quality: number) => void;
  disabled?: boolean;
}

export function QualitySlider({ quality, onChange, disabled }: QualitySliderProps) {
  const percentage = Math.round(quality * 100);

  const getLabel = (pct: number) => {
    if (pct >= 90) return "Best";
    if (pct >= 70) return "High";
    if (pct >= 40) return "Medium";
    return "Small";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-zinc-700">
          Quality
        </label>
        <span className="text-sm text-zinc-500 tabular-nums">
          {percentage}% &mdash; <span className="font-medium text-zinc-700">{getLabel(percentage)}</span>
        </span>
      </div>
      <input
        type="range"
        min={5}
        max={100}
        step={1}
        value={percentage}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        disabled={disabled}
        className="w-full h-2 rounded-full appearance-none cursor-pointer
          bg-zinc-200
          accent-indigo-500
          disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="flex justify-between mt-1 text-xs text-zinc-400">
        <span>Maximum compression</span>
        <span>Best quality</span>
      </div>
    </div>
  );
}
