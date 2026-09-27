import React from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles, Sliders } from "lucide-react";
import { Button } from "../ui/Button";
import { ProductSpecification } from "../../types";

interface SpecificationEditorProps {
  specifications: ProductSpecification[];
  onChange: (specs: ProductSpecification[]) => void;
  error?: string;
}

// Common engineering parameter presets for power conditioning equipment
const COMMON_SPEC_PRESETS = [
  "Capacity Range",
  "Topology",
  "Input Voltage",
  "Output Voltage",
  "Frequency",
  "Operating Duty",
  "Isolation",
  "Cooling Type",
  "Correction Speed",
  "Waveform",
];

export const SpecificationEditor: React.FC<SpecificationEditorProps> = ({
  specifications,
  onChange,
  error,
}) => {
  const addRow = (presetLabel = "") => {
    onChange([...specifications, { label: presetLabel, value: "" }]);
  };

  const updateRow = (index: number, field: "label" | "value", val: string) => {
    const updated = specifications.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: val };
      }
      return item;
    });
    onChange(updated);
  };

  const removeRow = (index: number) => {
    onChange(specifications.filter((_, idx) => idx !== index));
  };

  const moveRow = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === specifications.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...specifications];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-600" />
            Structured Specifications Editor
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key-value engineering ratings shown in public product specification tables.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addRow()}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Parameter Row
        </Button>
      </div>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

      {/* Quick Preset Buttons */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-600" />
          Quick Add Parameter Presets:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SPEC_PRESETS.map((preset) => {
            const alreadyAdded = specifications.some(
              (s) => s.label.toLowerCase() === preset.toLowerCase()
            );
            return (
              <button
                key={preset}
                type="button"
                onClick={() => addRow(preset)}
                disabled={alreadyAdded}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border ${
                  alreadyAdded
                    ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                    : "bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:text-amber-800 hover:bg-amber-50/50 cursor-pointer"
                }`}
              >
                + {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* Specifications Table Rows */}
      {specifications.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
          <Sliders className="w-6 h-6 text-slate-400 mx-auto" />
          <p className="text-xs text-slate-500">
            No specifications added yet. Click &quot;Add Parameter Row&quot; or choose a preset above.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {specifications.map((spec, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors"
            >
              {/* Order Controls */}
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => moveRow(index, "up")}
                  disabled={index === 0}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400"
                  title="Move row up"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveRow(index, "down")}
                  disabled={index === specifications.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400"
                  title="Move row down"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>

              {/* Parameter Label */}
              <div className="w-1/3">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(e) => updateRow(index, "label", e.target.value)}
                  placeholder="Parameter Label (e.g. Capacity)"
                  className="w-full px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Engineering Value */}
              <div className="flex-1">
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateRow(index, "value", e.target.value)}
                  placeholder="Engineering Rating (e.g. 500 kVA or 'Not provided')"
                  className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Remove Action */}
              <button
                type="button"
                onClick={() => removeRow(index)}
                title="Remove parameter"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecificationEditor;
