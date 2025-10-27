import { ArrowRight } from "lucide-react";

interface BucketDisplayProps {
  buckets: number[][];
  highlightBucket?: number;
}

export const BucketDisplay = ({ buckets, highlightBucket }: BucketDisplayProps) => {
  return (
    <div className="space-y-4 p-6 bg-card/50 rounded-lg border border-border">
      <div className="text-sm font-medium text-muted-foreground mb-4">
        Buckets (Linked Lists)
      </div>
      <div className="space-y-6">
        {buckets.map((bucket, bucketIndex) => (
          <div
            key={bucketIndex}
            className={`flex items-center gap-2 p-4 rounded-lg border transition-all duration-300 ${
              highlightBucket === bucketIndex
                ? 'border-accent bg-accent/10'
                : 'border-border/50 bg-background/50'
            }`}
          >
            <div className="font-mono font-bold text-primary min-w-[80px]">
              Bucket {bucketIndex}:
            </div>
            
            {bucket.length === 0 ? (
              <div className="text-muted-foreground italic text-sm">null</div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {bucket.map((value, nodeIndex) => (
                  <div key={nodeIndex} className="flex items-center gap-2">
                    <div className="relative">
                      {/* Node box */}
                      <div className="flex items-center gap-2 bg-primary/10 border-2 border-primary rounded-lg p-2">
                        <div className="font-mono font-bold text-lg text-primary min-w-[40px] text-center">
                          {value}
                        </div>
                        <div className="text-xs text-muted-foreground">→</div>
                      </div>
                    </div>
                    
                    {/* Arrow to next node */}
                    {nodeIndex < bucket.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-primary" />
                    )}
                    
                    {/* Null pointer at end */}
                    {nodeIndex === bucket.length - 1 && (
                      <div className="text-muted-foreground italic text-sm">null</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
