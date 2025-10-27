import { useState, useEffect } from "react";
import { ArrayDisplay } from "./ArrayDisplay";
import { ControlPanel } from "./ControlPanel";
import { InsightPanel } from "./InsightPanel";

interface Step {
  array: number[];
  states: ('default' | 'comparing' | 'sorted' | 'active')[];
  description: string;
  countArray?: { value: number; index: number }[];
  cumulativeArray?: { value: number; index: number }[];
  rangeInfo?: { min: number; max: number; range: number };
  computation?: string;
  highlightCumulativeIndex?: number;
}

export const CountingSort = () => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showInsights, setShowInsights] = useState(false);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    generateArray();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          if (!showInsights) {
            generateInsights();
            setShowInsights(true);
          }
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, steps.length]);

  const generateArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 20) + 1);
    setArray(newArray);
    generateSteps(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
    setShowInsights(false);
  };

  const handleCustomInput = (values: number[]) => {
    setArray(values);
    generateSteps(values);
    setCurrentStep(0);
    setIsPlaying(false);
    setShowInsights(false);
  };

  const handleAddToArray = (values: number[]) => {
    const newArray = [...array, ...values];
    setArray(newArray);
    generateSteps(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
    setShowInsights(false);
  };

  const handleRemoveFromArray = (values: number[]) => {
    let newArray = [...array];
    values.forEach(val => {
      const index = newArray.indexOf(val);
      if (index > -1) {
        newArray.splice(index, 1);
      }
    });
    if (newArray.length === 0) {
      generateArray();
      return;
    }
    setArray(newArray);
    generateSteps(newArray);
    setCurrentStep(0);
    setIsPlaying(false);
    setShowInsights(false);
  };

  const generateInsights = () => {
    const minVal = Math.min(...array);
    const maxVal = Math.max(...array);
    const range = maxVal - minVal + 1;
    const n = array.length;

    setInsights({
      general: [
        "Counting sort is efficient when the range of input values is small relative to the number of elements",
        "It's a non-comparison based sorting algorithm that counts occurrences of each value",
        "The algorithm uses cumulative sums to determine final positions of elements",
        "Stable sorting: maintains relative order of equal elements"
      ],
      specific: [
        `Array size: ${n} elements`,
        `Value range: ${minVal} to ${maxVal} (range = ${range})`,
        `Count array size: ${range} (based on range)`,
        `Total operations: ~${n + range + n} (count + cumulative + place)`,
        range <= n * 2 
          ? "Excellent efficiency! Range is small compared to array size" 
          : "Less efficient: Large range relative to array size may waste space"
      ],
      complexity: {
        time: "O(n + k)",
        space: `O(k) where k=${range}`
      },
      performance: range <= n ? "Optimal" : "Moderate"
    });
  };

  const generateSteps = (arr: number[]) => {
    const newSteps: Step[] = [];
    const maxVal = Math.max(...arr);
    const range = maxVal;
    const count = new Array(range + 1).fill(0);

    // Initial state with range info
    newSteps.push({
      array: [...arr],
      states: arr.map(() => 'default'),
      description: 'Initial array to be sorted. Count array size = max value',
      rangeInfo: { min: 0, max: maxVal, range },
    });

    // Count occurrences
    arr.forEach((num, idx) => {
      count[num]++;
      const states: ('default' | 'comparing' | 'sorted' | 'active')[] = arr.map((_, i) => 
        i === idx ? 'comparing' : 'default'
      );
      newSteps.push({
        array: [...arr],
        states,
        description: `Counting ${num}: count[${num}] = ${count[num]}`,
        countArray: count.map((val, idx) => ({ value: val, index: idx })),
        rangeInfo: { min: 0, max: maxVal, range },
        computation: `count[${num}]++`,
      });
    });

    // Build cumulative array by animating updates to count array
    const cumulative = [...count];
    for (let i = 1; i <= range; i++) {
      const prevCumulative = [...cumulative];
      cumulative[i] += cumulative[i - 1];
      newSteps.push({
        array: [...arr],
        states: arr.map(() => 'default'),
        description: `Building prefix sum: cumulative[${i}] = ${prevCumulative[i]} + ${cumulative[i - 1]} = ${cumulative[i]}`,
        countArray: count.map((val, idx) => ({ value: val, index: idx })),
        cumulativeArray: cumulative.map((val, idx) => ({ value: val, index: idx })),
        rangeInfo: { min: 0, max: maxVal, range },
        computation: `cumulative[${i}] = cumulative[${i - 1}] + count[${i}]`,
        highlightCumulativeIndex: i,
      });
    }

    // Build sorted array using cumulative array
    const sorted: number[] = new Array(arr.length);
    for (let i = arr.length - 1; i >= 0; i--) {
      const num = arr[i];
      const position = cumulative[num] - 1;
      sorted[position] = num;
      cumulative[num]--;

      const states: ('default' | 'comparing' | 'sorted' | 'active')[] = sorted.map((val) =>
        val !== undefined ? 'sorted' : 'default'
      );

      newSteps.push({
        array: sorted.map((val) => val ?? 0),
        states,
        description: `Placing ${num} at position ${position}`,
        cumulativeArray: cumulative.map((val, idx) => ({ value: val, index: idx })),
        rangeInfo: { min: 0, max: maxVal, range },
        computation: `position = cumulative[${num}] - 1 = ${position + 1} - 1 = ${position}`,
      });
    }

    // Final sorted state
    newSteps.push({
      array: sorted,
      states: sorted.map(() => 'sorted'),
      description: 'Array sorted successfully!',
      rangeInfo: { min: 0, max: maxVal, range },
    });

    setSteps(newSteps);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setShowInsights(false);
  };

  const currentData = steps[currentStep] || {
    array,
    states: array.map(() => 'default'),
    description: 'Ready to sort',
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Counting Sort</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Counts the number of objects with distinct key values, then calculates positions using cumulative sums.
          Time Complexity: O(n + k) where k is the range of input.
        </p>
        <div className="bg-secondary/50 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-accent">{currentData.description}</p>
          {currentData.computation && (
            <p className="text-xs font-mono text-warning mt-2 bg-background/50 p-2 rounded">
              💡 {currentData.computation}
            </p>
          )}
        </div>

        {currentData.rangeInfo && (
          <div className="flex gap-4 text-sm">
            <div className="bg-primary/10 px-3 py-2 rounded border border-primary/30">
              <span className="text-muted-foreground">Min: </span>
              <span className="font-bold text-primary">{currentData.rangeInfo.min}</span>
            </div>
            <div className="bg-primary/10 px-3 py-2 rounded border border-primary/30">
              <span className="text-muted-foreground">Max: </span>
              <span className="font-bold text-primary">{currentData.rangeInfo.max}</span>
            </div>
            <div className="bg-accent/10 px-3 py-2 rounded border border-accent/30">
              <span className="text-muted-foreground">Range: </span>
              <span className="font-bold text-accent">{currentData.rangeInfo.range}</span>
            </div>
          </div>
        )}
      </div>

      <ControlPanel
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={handleReset}
        onGenerate={generateArray}
        onCustomInput={handleCustomInput}
        onAddToArray={handleAddToArray}
        onRemoveFromArray={handleRemoveFromArray}
        speed={speed}
        onSpeedChange={(value) => setSpeed(value[0])}
        currentStep={currentStep}
        totalSteps={steps.length}
      />

      <div className="bg-card rounded-xl p-6 border border-border space-y-6">
        <ArrayDisplay 
          array={currentData.array}
          states={currentData.states}
          label="Current Array"
        />

        {currentData.countArray && currentData.countArray.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Count Array (Size = {currentData.rangeInfo?.range || 0})
            </div>
            <div className="flex flex-wrap gap-1 p-4 bg-secondary/30 rounded-lg border border-border">
              {currentData.countArray.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`px-2 py-1 ${item.value > 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} rounded-md font-mono text-sm`}>
                    {item.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    [{item.index}]
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentData.cumulativeArray && currentData.cumulativeArray.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-accent">Cumulative Index Array (Prefix Sums)</div>
            <div className="flex flex-wrap gap-1 p-4 bg-accent/10 rounded-lg border-2 border-accent/30">
              {currentData.cumulativeArray.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col items-center transition-all ${
                    idx === currentData.highlightCumulativeIndex
                      ? 'scale-125 -translate-y-2'
                      : ''
                  }`}
                >
                  <div className={`px-2 py-1 rounded-md font-mono text-sm ${
                    idx === currentData.highlightCumulativeIndex
                      ? 'bg-warning text-warning-foreground shadow-lg ring-2 ring-warning'
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    {item.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    [{item.index}]
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground italic">
              Each value shows where elements with that index will be placed in the final array
            </p>
          </div>
        )}
      </div>

      {showInsights && insights && (
        <InsightPanel title="Counting Sort" insights={insights} />
      )}
    </div>
  );
};
