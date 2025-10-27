import { useState, useEffect } from "react";
import { ArrayDisplay } from "./ArrayDisplay";
import { BucketDisplay } from "./BucketDisplay";
import { ControlPanel } from "./ControlPanel";
import { InsightPanel } from "./InsightPanel";

interface Step {
  array: number[];
  states: ('default' | 'comparing' | 'sorted' | 'active')[];
  description: string;
  buckets?: number[][];
  highlightBucket?: number;
  computation?: string;
  formula?: string;
}

export const BucketSort = () => {
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
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 1);
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
    const range = maxVal - minVal;
    const n = array.length;
    const bucketCount = 5;

    setInsights({
      general: [
        "Bucket sort distributes elements into buckets based on their value range",
        "Each bucket is sorted individually (often using insertion sort)",
        "Works best when input is uniformly distributed across the range",
        "Linked list implementation allows dynamic bucket sizing"
      ],
      specific: [
        `Array size: ${n} elements`,
        `Value range: ${minVal} to ${maxVal} (span = ${range})`,
        `Number of buckets: ${bucketCount}`,
        `Bucket size: ~${Math.ceil(range / bucketCount)} per bucket`,
        range / n < 10 
          ? "Good distribution! Values well-spread across buckets" 
          : "Sparse distribution: Some buckets may be underutilized"
      ],
      complexity: {
        time: "O(n + k)",
        space: `O(n + k) where k=${bucketCount}`
      },
      performance: "Good"
    });
  };

  const generateSteps = (arr: number[]) => {
    const newSteps: Step[] = [];
    const n = arr.length;
    const bucketCount = 5;

    newSteps.push({
      array: [...arr],
      states: arr.map(() => 'default'),
      description: 'Initial array to be sorted',
    });

    const maxVal = Math.max(...arr);
    const minVal = Math.min(...arr);
    const range = maxVal - minVal;
    const bucketSize = Math.ceil(range / bucketCount) || 1;

    // Create buckets
    const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

    newSteps.push({
      array: [...arr],
      states: arr.map(() => 'default'),
      description: `Creating ${bucketCount} empty buckets (linked lists)`,
      buckets: buckets.map(b => [...b]),
    });

    // Distribute elements into buckets
    arr.forEach((num, idx) => {
      const bucketIndex = Math.min(
        Math.floor((num - minVal) / bucketSize),
        bucketCount - 1
      );
      buckets[bucketIndex].push(num);

      const states: ('default' | 'comparing' | 'sorted' | 'active')[] = arr.map((_, i) =>
        i === idx ? 'comparing' : 'default'
      );
      newSteps.push({
        array: [...arr],
        states,
        description: `Inserting ${num} into bucket ${bucketIndex} (linked list node)`,
        buckets: buckets.map(b => [...b]),
        highlightBucket: bucketIndex,
        formula: `bucketIndex = ⌊(num - min) / bucketSize⌋`,
        computation: `bucketIndex = ⌊(${num} - ${minVal}) / ${bucketSize}⌋ = ${bucketIndex}`,
      });
    });

    // Show all buckets filled
    newSteps.push({
      array: [...arr],
      states: arr.map(() => 'default'),
      description: 'All elements distributed into buckets - now sorting each bucket',
      buckets: buckets.map(b => [...b]),
    });

    // Sort each bucket and merge
    const sorted: number[] = [];
    buckets.forEach((bucket, bucketIdx) => {
      if (bucket.length > 0) {
        bucket.sort((a, b) => a - b);
        
        const sortStates: ('default' | 'comparing' | 'sorted' | 'active')[] = [
          ...sorted.map(() => 'sorted' as 'sorted'),
          ...Array(arr.length - sorted.length).fill('default')
        ];
        newSteps.push({
          array: [...sorted, ...Array(arr.length - sorted.length).fill(0)],
          states: sortStates,
          description: `Sorting bucket ${bucketIdx} internally`,
          buckets: buckets.map(b => [...b]),
          highlightBucket: bucketIdx,
        });

        bucket.forEach((num) => {
          sorted.push(num);
          const states: ('default' | 'comparing' | 'sorted' | 'active')[] = [
            ...sorted.map(() => 'sorted' as 'sorted'),
            ...Array(arr.length - sorted.length).fill('default')
          ];
          newSteps.push({
            array: [...sorted, ...Array(arr.length - sorted.length).fill(0)],
            states,
            description: `Merging ${num} from bucket ${bucketIdx} into final array`,
            buckets: buckets.map(b => [...b]),
            highlightBucket: bucketIdx,
          });
        });
      }
    });

    newSteps.push({
      array: sorted,
      states: sorted.map(() => 'sorted'),
      description: 'Array sorted successfully!',
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
        <h3 className="text-lg font-semibold text-foreground mb-2">Bucket Sort</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Distributes elements into buckets (linked lists), sorts individual buckets, then concatenates.
          Time Complexity: O(n + k) on average, where k is the number of buckets.
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
        <ArrayDisplay 
          array={currentData.array}
          states={currentData.states}
          label="Current Array"
        />

        {(currentData.formula || currentData.computation) && (
          <div className="flex flex-col items-center gap-2 py-3">
            {currentData.formula && (
              <div className="bg-primary/10 border border-primary rounded-lg px-4 py-2">
                <p className="text-sm font-mono text-primary font-semibold">
                  📝 Formula: {currentData.formula}
                </p>
              </div>
            )}
            {currentData.computation && (
              <div className="bg-warning/10 border border-warning rounded-lg px-4 py-2">
                <p className="text-sm font-mono text-warning">
                  📐 Computation: {currentData.computation}
                </p>
              </div>
            )}
          </div>
        )}

        {currentData.buckets && (
          <BucketDisplay 
            buckets={currentData.buckets}
            highlightBucket={currentData.highlightBucket}
          />
        )}
      </div>

      {showInsights && insights && (
        <InsightPanel title="Bucket Sort" insights={insights} />
      )}
    </div>
  );
};
