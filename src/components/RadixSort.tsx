import { useState, useEffect } from "react";
import { ArrayDisplay } from "./ArrayDisplay";
import { ControlPanel } from "./ControlPanel";
import { InsightPanel } from "./InsightPanel";
import { HighlightedNumber } from "./HighlightedNumber";

interface Step {
  array: number[];
  states: ('default' | 'comparing' | 'sorted' | 'active')[];
  description: string;
  digitBuckets?: number[][];
  currentDigitPosition?: number;
  computation?: string;
}

export const RadixSort = () => {
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
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 999) + 1);
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
    const max = Math.max(...array);
    const digits = max.toString().length;
    const n = array.length;

    setInsights({
      general: [
        "Radix sort processes numbers digit by digit from least to most significant",
        "Uses stable counting sort as a subroutine for each digit position",
        "Non-comparison based algorithm that leverages digit properties",
        "Works efficiently for integers and fixed-length strings"
      ],
      specific: [
        `Array size: ${n} elements`,
        `Maximum value: ${max} (${digits} digits)`,
        `Number of passes: ${digits} (one per digit position)`,
        `Total operations: ~${digits * (n + 10)} (${digits} passes × (n + 10 buckets))`,
        digits <= 4 
          ? "Efficient! Few digit positions to process" 
          : "More passes needed due to larger numbers"
      ],
      complexity: {
        time: `O(d × (n + k))`,
        space: `O(n + k) where d=${digits}, k=10`
      },
      performance: digits <= 4 ? "Excellent" : "Good"
    });
  };

  const getMax = (arr: number[]) => Math.max(...arr);

  const getDigitPosition = (exp: number): number => {
    if (exp === 1) return 0;
    if (exp === 10) return 1;
    if (exp === 100) return 2;
    return Math.log10(exp);
  };

  const countingSortByDigit = (
    arr: number[],
    exp: number,
    steps: Step[]
  ): number[] => {
    const n = arr.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
    const digitBuckets: number[][] = Array.from({ length: 10 }, () => []);
    const digitPos = getDigitPosition(exp);

    // Initialize empty buckets
    steps.push({
      array: [...arr],
      states: arr.map(() => 'default'),
      description: `Initializing 10 digit buckets for position ${exp}`,
      digitBuckets: Array.from({ length: 10 }, () => []),
      currentDigitPosition: digitPos,
    });

    // Distribute into buckets
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      digitBuckets[digit].push(arr[i]);
      
      const states: ('default' | 'comparing' | 'sorted' | 'active')[] = arr.map((_, idx) =>
        idx === i ? 'comparing' : 'default'
      );
      steps.push({
        array: [...arr],
        states,
        description: `Examining ${arr[i]}: extracting digit ${digit} at position ${exp}`,
        digitBuckets: digitBuckets.map(b => [...b]),
        currentDigitPosition: digitPos,
        computation: `digit = floor(${arr[i]} / ${exp}) % 10 = ${digit}`,
      });
    }

    // Show all elements grouped by digit
    steps.push({
      array: [...arr],
      states: arr.map(() => 'active'),
      description: `All elements grouped by digit at position ${exp}`,
      digitBuckets: digitBuckets.map(b => [...b]),
      currentDigitPosition: digitPos,
    });

    // Calculate cumulative counts
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build output array
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      const position = count[digit] - 1;
      output[position] = arr[i];
      count[digit]--;

      const currentOutput = [...output];
      const states: ('default' | 'comparing' | 'sorted' | 'active')[] = currentOutput.map((val) =>
        val !== undefined ? 'sorted' : 'default'
      );
      
      steps.push({
        array: currentOutput.map((val) => val ?? 0),
        states,
        description: `Placing ${arr[i]} at position ${position} based on digit ${digit}`,
        digitBuckets: digitBuckets.map(b => [...b]),
        currentDigitPosition: digitPos,
        computation: `position = cumulative_count[${digit}] - 1 = ${position}`,
      });
    }

    return output;
  };

  const generateSteps = (arr: number[]) => {
    const newSteps: Step[] = [];
    let workingArray = [...arr];

    newSteps.push({
      array: [...workingArray],
      states: workingArray.map(() => 'default'),
      description: 'Initial array to be sorted',
    });

    const max = getMax(workingArray);
    const maxDigits = max.toString().length;

    // Do counting sort for every digit
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      const digitPosition = exp === 1 ? 'ones' : exp === 10 ? 'tens' : exp === 100 ? 'hundreds' : exp.toString();
      const digitPos = getDigitPosition(exp);
      
      newSteps.push({
        array: [...workingArray],
        states: workingArray.map(() => 'active'),
        description: `Starting sort by ${digitPosition} place (position ${exp})`,
        currentDigitPosition: digitPos,
      });

      workingArray = countingSortByDigit(workingArray, exp, newSteps);

      newSteps.push({
        array: [...workingArray],
        states: workingArray.map(() => 'sorted'),
        description: `Completed sorting by ${digitPosition} place - array stable for this digit`,
        currentDigitPosition: digitPos,
      });
    }

    newSteps.push({
      array: workingArray,
      states: workingArray.map(() => 'sorted'),
      description: `Array sorted successfully after ${maxDigits} passes!`,
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
        <h3 className="text-lg font-semibold text-foreground mb-2">Radix Sort</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Sorts numbers digit by digit starting from least significant digit using stable counting sort.
          Time Complexity: O(d × (n + k)) where d is number of digits, k is range of digit values.
        </p>
        <div className="bg-secondary/50 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-accent">{currentData.description}</p>
          {currentData.computation && (
            <p className="text-xs font-mono text-warning mt-2 bg-background/50 p-2 rounded">
              💡 {currentData.computation}
            </p>
          )}
        </div>
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
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Current Array {currentData.currentDigitPosition !== undefined && (
              <span className="text-accent ml-2">
                (Highlighting digit at position 10^{currentData.currentDigitPosition})
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 p-4 bg-card/50 rounded-lg border border-border">
            {currentData.array.map((value, index) => (
              <div
                key={`${index}-${value}`}
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  currentData.states[index] === 'comparing'
                    ? 'bg-comparing text-background'
                    : currentData.states[index] === 'sorted'
                    ? 'bg-sorted text-background'
                    : currentData.states[index] === 'active'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-foreground'
                }`}
              >
                <HighlightedNumber 
                  value={value}
                  digitPosition={currentData.currentDigitPosition}
                />
              </div>
            ))}
          </div>
        </div>

        {currentData.digitBuckets && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Digit Buckets (0-9) - Array Representation
            </div>
            <div className="space-y-2">
              {currentData.digitBuckets.map((bucket, digit) => (
                <div key={digit} className="flex items-center gap-3">
                  <div className="font-mono font-bold text-primary min-w-[60px] text-center bg-primary/10 px-3 py-2 rounded border border-primary/30">
                    [{digit}]:
                  </div>
                  <div className="flex-1 flex flex-wrap gap-2 p-3 bg-secondary/30 rounded-lg border border-border min-h-[48px] items-center">
                    {bucket.length === 0 ? (
                      <span className="text-muted-foreground italic text-sm">empty</span>
                    ) : (
                      bucket.map((val, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1 bg-primary/20 text-foreground rounded font-mono font-semibold border border-primary/40"
                        >
                          <HighlightedNumber 
                            value={val}
                            digitPosition={currentData.currentDigitPosition}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showInsights && insights && (
        <InsightPanel title="Radix Sort" insights={insights} />
      )}
    </div>
  );
};
