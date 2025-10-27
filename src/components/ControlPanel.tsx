import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Shuffle, Plus, Replace, Minus } from "lucide-react";
import { useState } from "react";

interface ControlPanelProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onGenerate: () => void;
  onCustomInput?: (values: number[]) => void;
  onAddToArray?: (values: number[]) => void;
  onRemoveFromArray?: (values: number[]) => void;
  speed: number;
  onSpeedChange: (value: number[]) => void;
  currentStep: number;
  totalSteps: number;
}

export const ControlPanel = ({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onGenerate,
  onCustomInput,
  onAddToArray,
  onRemoveFromArray,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps,
}: ControlPanelProps) => {
  const [customInput, setCustomInput] = useState("");
  const [removeInput, setRemoveInput] = useState("");

  const handleCustomInput = () => {
    const values = customInput
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v));
    if (values.length > 0 && onCustomInput) {
      onCustomInput(values);
      setCustomInput("");
    }
  };

  const handleAddToArray = () => {
    const values = customInput
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v));
    if (values.length > 0 && onAddToArray) {
      onAddToArray(values);
      setCustomInput("");
    }
  };

  const handleRemoveFromArray = () => {
    const values = removeInput
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v));
    if (values.length > 0 && onRemoveFromArray) {
      onRemoveFromArray(values);
      setRemoveInput("");
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg border border-border space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button
            onClick={isPlaying ? onPause : onPlay}
            variant="default"
            size="lg"
            className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start
              </>
            )}
          </Button>
          <Button onClick={onReset} variant="secondary" size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={onGenerate} variant="outline" size="lg">
            <Shuffle className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </div>

        <div className="flex flex-col gap-2 min-w-[200px]">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Speed</span>
            <span className="text-foreground font-medium">{speed}x</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={onSpeedChange}
            min={0.5}
            max={3}
            step={0.5}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
          <span className="text-sm text-muted-foreground">Step:</span>
          <span className="text-lg font-bold text-foreground">
            {currentStep} / {totalSteps}
          </span>
        </div>
      </div>

      {(onCustomInput || onAddToArray || onRemoveFromArray) && (
        <div className="bg-card rounded-lg p-4 border border-border space-y-3">
          {(onCustomInput || onAddToArray) && (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter numbers (e.g., 5, 12, 3, 8)"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && onCustomInput) {
                    handleCustomInput();
                  }
                }}
                className="flex-1"
              />
              {onCustomInput && (
                <Button 
                  onClick={handleCustomInput} 
                  variant="secondary"
                  className="whitespace-nowrap"
                >
                  <Replace className="w-4 h-4 mr-2" />
                  Replace
                </Button>
              )}
              {onAddToArray && (
                <Button 
                  onClick={handleAddToArray} 
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              )}
            </div>
          )}
          {onRemoveFromArray && (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter numbers to remove (e.g., 5, 12)"
                value={removeInput}
                onChange={(e) => setRemoveInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleRemoveFromArray();
                  }
                }}
                className="flex-1"
              />
              <Button 
                onClick={handleRemoveFromArray} 
                variant="destructive"
                className="whitespace-nowrap"
              >
                <Minus className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Enter comma-separated numbers to modify the array
          </p>
        </div>
      )}
    </div>
  );
};
