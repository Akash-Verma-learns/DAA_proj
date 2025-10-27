import { Lightbulb, TrendingUp, Clock, BarChart } from "lucide-react";

interface InsightPanelProps {
  title: string;
  insights: {
    general: string[];
    specific: string[];
    complexity: {
      time: string;
      space: string;
    };
    performance: string;
  };
}

export const InsightPanel = ({ title, insights }: InsightPanelProps) => {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border-2 border-primary/20 space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary rounded-lg">
          <Lightbulb className="h-6 w-6 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{title} - Insights & Analysis</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* General Insights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <TrendingUp className="h-4 w-4" />
            General Insights
          </div>
          <ul className="space-y-2">
            {insights.general.map((insight, idx) => (
              <li key={idx} className="text-sm text-foreground bg-card/50 p-3 rounded-lg border border-border">
                • {insight}
              </li>
            ))}
          </ul>
        </div>

        {/* Case-Specific Insights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-accent">
            <BarChart className="h-4 w-4" />
            This Case Analysis
          </div>
          <ul className="space-y-2">
            {insights.specific.map((insight, idx) => (
              <li key={idx} className="text-sm text-foreground bg-card/50 p-3 rounded-lg border border-border">
                • {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Complexity & Performance */}
      <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-3 bg-card/50 p-3 rounded-lg">
          <Clock className="h-5 w-5 text-warning" />
          <div>
            <div className="text-xs text-muted-foreground">Time Complexity</div>
            <div className="font-mono font-bold text-foreground">{insights.complexity.time}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-card/50 p-3 rounded-lg">
          <BarChart className="h-5 w-5 text-accent" />
          <div>
            <div className="text-xs text-muted-foreground">Space Complexity</div>
            <div className="font-mono font-bold text-foreground">{insights.complexity.space}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-card/50 p-3 rounded-lg">
          <TrendingUp className="h-5 w-5 text-success" />
          <div>
            <div className="text-xs text-muted-foreground">Performance</div>
            <div className="font-semibold text-foreground text-sm">{insights.performance}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
